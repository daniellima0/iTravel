import { Component } from '@angular/core';
import * as ExifReader from 'exifreader';

@Component({
  standalone: true,
  selector: 'upload-photo-button',
  templateUrl: './upload-photo-button.component.html',
  styleUrls: ['./upload-photo-button.component.css'],
})
export class UploadPhotoButton {
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No file selected.');
      return;
    }

    const readExifData = async () => {
      try {
        // Read the file as an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Extract EXIF data using ExifReader
        const tags = ExifReader.load(arrayBuffer);

        // Log the extracted EXIF data to the console
        console.log('Extracted EXIF data:', tags);

        // Extract latitude and longitude if available
        const gpsLatitude = tags.GPSLatitude?.description;
        const gpsLongitude = tags.GPSLongitude?.description;

        if (gpsLatitude && gpsLongitude) {
          console.log(`Latitude: ${gpsLatitude}`);
          console.log(`Longitude: ${gpsLongitude}`);
        } else {
          console.log('GPS data not available in the image.');
        }
      } catch (error) {
        console.error('Error reading EXIF data:', error);
      }
    };

    readExifData();
  }
}
