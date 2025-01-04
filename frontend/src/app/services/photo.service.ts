import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PhotoMetadata {
  id: string; // Unique identifier for the photo
  image: string | File; // Store as a base64 string or File object
  location: {
    longitude: number;
    latitude: number;
  } | null; // Optional location data
  createdAt: Date; // Timestamp when the photo was added
  description?: string; // Optional description of the photo
  [key: string]: any; // Additional fields for extensibility
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photosSource = new BehaviorSubject<PhotoMetadata[]>([]); // Store multiple photos
  photos$ = this.photosSource.asObservable(); // Observable for tracking updates

  constructor() {}

  /**
   * Add a new photo with metadata.
   * @param photoMetadata - Metadata for the uploaded photo
   */
  addPhoto(photoMetadata: PhotoMetadata) {
    const currentPhotos = this.photosSource.value;
    this.photosSource.next([...currentPhotos, photoMetadata]);
  }

  /**
   * Update an existing photo by its ID.
   * @param id - The ID of the photo to update
   * @param updatedData - Updated fields for the photo
   */
  updatePhoto(id: string, updatedData: Partial<PhotoMetadata>) {
    const currentPhotos = this.photosSource.value;
    const updatedPhotos = currentPhotos.map((photo) =>
      photo.id === id ? { ...photo, ...updatedData } : photo
    );
    this.photosSource.next(updatedPhotos);
  }

  /**
   * Remove a photo by its ID.
   * @param id - The ID of the photo to remove
   */
  removePhoto(id: string) {
    const currentPhotos = this.photosSource.value;
    const filteredPhotos = currentPhotos.filter((photo) => photo.id !== id);
    this.photosSource.next(filteredPhotos);
  }
}
