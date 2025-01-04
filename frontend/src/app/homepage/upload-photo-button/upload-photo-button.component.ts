import { Component, Inject } from '@angular/core';
import * as ExifReader from 'exifreader';
import { PhotoService, PhotoMetadata } from '../../services/photo.service';
import { v4 as uuidv4 } from 'uuid';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'upload-photo-button',
  templateUrl: './upload-photo-button.component.html',
  styleUrls: ['./upload-photo-button.component.css'],
  imports: [MatButtonModule, MatIconModule],
})
export class UploadPhotoButton {
  constructor(
    private photoService: PhotoService,
    private storage: Storage // Inject the storage service
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
      console.log(creationDate);
      const convertedDate = creationDate
        ?.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
        .replace(' ', 'T');
      console.log(convertedDate);
      const createdAt = convertedDate ? new Date(convertedDate) : new Date();

      const fileName = this.generateUniqueId();
      const storageRef = ref(this.storage, `photos/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded a blob or file!', snapshot);

      const photoUrl = await getDownloadURL(storageRef);
      console.log('Photo URL:', photoUrl);

      const photoMetadata: PhotoMetadata = {
        id: this.generateUniqueId(),
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

      this.photoService.addPhoto(photoMetadata);
    } catch (error) {
      console.error('Error processing file:', file.name, error);
    }
  }

  /**
   * Generate a unique ID for the photo.
   * @returns A string representing a unique identifier
   */
  private generateUniqueId(): string {
    return uuidv4(); // Use UUID for generating a unique ID
  }
}
