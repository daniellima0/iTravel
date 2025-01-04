import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../../services/photo.service';
import { Subscription } from 'rxjs';

export interface PhotoModalData {
  photos: {
    id: string;
    createdAt: string;
    url: string;
    description?: string;
  }[];
  countryName: string;
}

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PhotoModalComponent implements OnInit, OnDestroy, AfterViewInit {
  photos: {
    id: string;
    createdAt: string;
    url: string;
    description?: string;
  }[] = [];
  private photosSubscription: Subscription | null = null;

  constructor(
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoModalData,
    private elementRef: ElementRef,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.photosSubscription = this.photoService.photos$.subscribe((photos) => {
      this.photos = photos.map((photo) => ({
        id: photo.id,
        createdAt: photo.createdAt.toString(),
        url: photo.image.toString(),
      }));
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
