import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Photo } from '../models/photo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photosSource = new BehaviorSubject<Photo[]>([]); // Store multiple photos
  photos$ = this.photosSource.asObservable(); // Observable for tracking updates

  constructor(private http: HttpClient) {}

  /**
   * Add a new photo with metadata.
   * @param Photo - Metadata for the uploaded photo
   */
  addPhoto(Photo: Photo) {
    const currentPhotos = this.photosSource.value;
    this.photosSource.next([...currentPhotos, Photo]);
  }

  // Fetch photos from the backend
  getUserPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>('http://localhost:3000/photos', {
      withCredentials: true,
    }); // Adjust the URL if needed
  }
}
