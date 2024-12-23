import { Component } from '@angular/core';
import * as ExifReader from 'exifreader';
import { PhotoService, PhotoMetadata } from '../../services/photo.service';

@Component({
  standalone: true,
  selector: 'upload-photo-button',
  templateUrl: './upload-photo-button.component.html',
  styleUrls: ['./upload-photo-button.component.css'],
})
export class UploadPhotoButton {
  constructor(private photoService: PhotoService) {}

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

      console.log('EXIF data:', tags);

      // Extract latitude and longitude if available
      let gpsLatitude = tags.GPSLatitude?.description;
      let gpsLongitude = tags.GPSLongitude?.description;

      var gpsLatitudeNumber = Number(gpsLatitude);
      var gpsLongitudeNumber = Number(gpsLongitude);

      if (tags.GPSLatitudeRef?.description === 'South latitude') {
        gpsLatitudeNumber = -Number(gpsLatitude);
      }

      if (tags.GPSLongitudeRef?.description === 'West longitude') {
        gpsLongitudeNumber = -Number(gpsLongitude);
      }

      console.log('gpsLatitudeNumber', gpsLatitudeNumber);
      console.log('gpsLongitudeNumber', gpsLongitudeNumber);

      // Create metadata object
      const photoMetadata: PhotoMetadata = {
        id: this.generateUniqueId(),
        image: file, // Store the file object; you can convert it to base64 if needed
        location:
          gpsLatitude && gpsLongitude
            ? {
                latitude: gpsLatitudeNumber,
                longitude: gpsLongitudeNumber,
              }
            : null,
        createdAt: new Date(), // Current timestamp
      };

      // Add the photo to the PhotoService
      this.photoService.addPhoto(photoMetadata);

      console.log('Photo added to PhotoService:', photoMetadata);
    } catch (error) {
      console.error('Error processing file:', file.name, error);
    }
  }

  /**
   * Generate a unique ID for the photo.
   * @returns A string representing a unique identifier
   */
  private generateUniqueId(): string {
    return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
