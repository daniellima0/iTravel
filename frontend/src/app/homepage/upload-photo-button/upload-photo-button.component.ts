import { Component } from '@angular/core';
import * as ExifReader from 'exifreader';
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

@Component({
  standalone: true,
  selector: 'upload-photo-button',
  templateUrl: './upload-photo-button.component.html',
  styleUrls: ['./upload-photo-button.component.css'],
  imports: [MatButtonModule, MatIconModule],
})
export class UploadPhotoButtonComponent {
  constructor(
    private photoService: PhotoService,
    private storage: Storage,
    private http: HttpClient
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      console.log('No file selected.');
      return;
    }

    Array.from(files).forEach((file) => {
      this.processFile(file);
    });
  }

  /**
   * Process a single file to extract metadata and store it.
   * @param file - The file to process
   */
  private async processFile(file: File): Promise<void> {
    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Extract EXIF data using ExifReader
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

      // Extract the creation date from EXIF data (if available)
      const creationDate = tags.DateTimeOriginal?.description;
      const convertedDate = creationDate
        ?.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
        .replace(' ', 'T');
      const createdAt = convertedDate ? new Date(convertedDate) : new Date();

      const fileName = this.generateUniqueId();
      const storageRef = ref(this.storage, `photos/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded a blob or file!', snapshot);

      const photoUrl = await getDownloadURL(storageRef);
      console.log('Photo URL:', photoUrl);

      const Photo: Photo = {
        image: photoUrl,
        location:
          gpsLongitude && gpsLatitude
            ? {
                longitude: gpsLongitudeNumber,
                latitude: gpsLatitudeNumber,
              }
            : null,
        createdAt: createdAt,
      };

      // Send the metadata to the backend
      this.savePhoto(Photo);

      this.photoService.addPhoto(Photo);
    } catch (error) {
      console.error('Error processing file:', file.name, error);
    }
  }

  /**
   * Send photo metadata to the backend for storage in the database.
   * @param metadata - The metadata object to send
   */
  private savePhoto(metadata: Photo): void {
    this.http
      .post('http://localhost:3000/photos', metadata, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Photo metadata saved successfully:', response);
        },
        error: (err) => {
          console.error('Error saving photo metadata:', err);
        },
      });
  }

  /**
   * Generate a unique ID for the photo.
   * @returns A string representing a unique identifier
   */
  private generateUniqueId(): string {
    return uuidv4(); // Use UUID for generating a unique ID
  }
}
