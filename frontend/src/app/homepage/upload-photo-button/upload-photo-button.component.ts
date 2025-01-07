import { Component } from '@angular/core';
import * as ExifReader from 'exifreader';
import { MatDialog } from '@angular/material/dialog';
import { PhotoService } from '../../services/photo.service';
import { v4 as uuidv4 } from 'uuid';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Photo } from '../../models/photo.model';
import { AddLocationModalComponent } from '../add-location-modal/add-location-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'upload-photo-button',
  templateUrl: './upload-photo-button.component.html',
  styleUrls: ['./upload-photo-button.component.css'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class UploadPhotoButtonComponent {
  loading: boolean = false; // Flag to control the loading state

  constructor(
    private photoService: PhotoService,
    private storage: Storage,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      console.log('No file selected.');
      return;
    }

    const filesArray = Array.from(files);
    this.processFiles(filesArray);
  }

  /**
   * Process a single file to extract metadata and store it.
   * @param files - The files to process
   */
  private async processFiles(files: File[]): Promise<void> {
    const photosWithoutLocation: {
      file: File;
      preview: string;
      photo: Photo;
    }[] = [];
    const photosWithLocation: { file: File; photo: Photo }[] = [];

    for (const file of files) {
      const metadata = await this.extractMetadata(file);

      if (metadata) {
        const { photo, hasLocation } = metadata;

        if (hasLocation) {
          photosWithLocation.push({ file, photo }); // Attach `file` to the photo object
        } else {
          const previewUrl = await this.getPreviewUrl(file);
          photosWithoutLocation.push({ file, preview: previewUrl, photo }); // Attach `file` and `preview`
        }
      }
    }

    if (photosWithoutLocation.length > 0) {
      const updatedPhotos = await this.openAddLocationModal(
        photosWithoutLocation
      );

      // If modal was canceled or closed, discard the photos without location
      if (updatedPhotos) {
        // Map updated photos back to their original structure
        const allPhotos = [
          ...photosWithLocation.map((p) => p.photo),
          ...updatedPhotos.map((p) => ({
            ...p['photo'],
            location: p['photo'].location, // Ensure `location` is present
          })),
        ];
        this.savePhotos(allPhotos, files);
      } else {
        console.log('Modal was canceled, discarding photos without location.');
      }
    } else {
      this.savePhotos(
        photosWithLocation.map((p) => p.photo),
        files
      );
    }
  }

  /**
   * Extract metadata from a single file.
   * @param file - The file to process
   * @returns Metadata and whether the photo has location data
   */
  private async extractMetadata(
    file: File
  ): Promise<{ photo: Photo; hasLocation: boolean } | null> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);

      // Extract latitude and longitude if available
      let gpsLongitude = tags.GPSLongitude?.description;
      let gpsLatitude = tags.GPSLatitude?.description;

      var gpsLongitudeNumber = Number(gpsLongitude);
      var gpsLatitudeNumber = Number(gpsLatitude);

      if (tags.GPSLongitudeRef?.description === 'West longitude') {
        gpsLongitudeNumber = -Number(gpsLongitude);
      }

      if (tags.GPSLatitudeRef?.description === 'South latitude') {
        gpsLatitudeNumber = -Number(gpsLatitude);
      }

      const creationDate = tags.DateTimeOriginal?.description;
      const convertedDate = creationDate
        ?.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
        .replace(' ', 'T');
      const createdAt = convertedDate ? new Date(convertedDate) : new Date();

      return {
        photo: {
          image: '',
          location:
            gpsLongitude && gpsLatitude
              ? {
                  longitude: gpsLongitudeNumber,
                  latitude: gpsLatitudeNumber,
                }
              : null,
          createdAt: createdAt,
        },
        hasLocation: !!(gpsLongitude && gpsLatitude),
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  }

  /**
   * Get a preview URL for a file.
   * @param file - The file to preview
   * @returns A URL string for the file preview
   */
  private getPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Open a modal to add location data for photos.
   * @param photos - Photos without location data
   * @returns A promise that resolves to the updated photos or null if canceled
   */
  private openAddLocationModal(
    photos: { file: File; preview: string; photo: Photo }[]
  ): Promise<Photo[] | null> {
    const dialogRef = this.dialog.open(AddLocationModalComponent, {
      data: photos,
      width: '600px',
    });

    return dialogRef.afterClosed().toPromise();
  }

  /**
   * Save photos by uploading files and sending metadata.
   * @param photos - The photos to save
   */
  private async savePhotos(photos: Photo[], files: File[]): Promise<void> {
    this.loading = true; // Show loading spinner when uploading starts

    for (let i = 0; i < photos.length; i++) {
      try {
        const photo = photos[i];
        const file = files[i];

        const fileName = this.generateUniqueId();
        const storageRef = ref(this.storage, `photos/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const photoUrl = await getDownloadURL(storageRef);

        // Update the photo object with the URL
        photo.image = photoUrl;

        // Save metadata to backend
        this.http
          .post('http://localhost:3000/photos', photo, {
            withCredentials: true,
          })
          .subscribe({
            next: (response: any) => {
              console.log('Photo metadata saved successfully:', response);
              photo._id = response.photo._id;
              console.log(photo._id);
              this.photoService.addPhoto(photo);
            },
            error: (err) => console.error('Error saving photo metadata:', err),
          });
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    }

    this.loading = false; // Hide loading spinner when upload completes
  }

  /**
   * Generate a unique ID for the photo.
   * @returns A string representing a unique identifier
   */
  private generateUniqueId(): string {
    return uuidv4();
  }
}
