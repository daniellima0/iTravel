import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo.model';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.css'],
  standalone: true,
  imports: [DatePipe, CommonModule],
})
export class MyPhotosComponent implements OnInit {
  photos: Photo[] = []; // Array to store photos

  constructor(
    private photoService: PhotoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        console.log('Authenticated:', response);
      },
      error: (err) => {
        console.log('Not authenticated');
        this.router.navigate(['login']);
      },
    });

    this.loadPhotos();
  }

  // Fetch photos from the photo service
  private loadPhotos(): void {
    this.photoService.getUserPhotos().subscribe((photos: Photo[]) => {
      // Sort photos by createdAt date (newest first)
      this.photos = photos.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
    });
  }
}
