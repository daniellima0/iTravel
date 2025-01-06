import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photosSource = new BehaviorSubject<Photo[]>([]); // Store multiple photos
  photos$ = this.photosSource.asObservable(); // Observable for tracking updates

  constructor() {}

  /**
   * Add a new photo with metadata.
   * @param Photo - Metadata for the uploaded photo
   */
  addPhoto(Photo: Photo) {
    const currentPhotos = this.photosSource.value;
    this.photosSource.next([...currentPhotos, Photo]);
  }
}
