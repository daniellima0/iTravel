import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../../services/photo.service';
import { Subscription } from 'rxjs';

export interface PhotoModalData {
  photos: { id: string; createdAt: string; url: string }[];
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
  slider: KeenSliderInstance | null = null;
  photos: { id: string; createdAt: string; url: string }[] = [];
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
      this.initSlider();
    });
  }

  ngAfterViewInit(): void {
    this.initSlider();
  }

  private initSlider(): void {
    const sliderContainer =
      this.elementRef.nativeElement.querySelector('.keen-slider');
    if (sliderContainer) {
      this.slider = new KeenSlider(sliderContainer, {
        loop: false,
        slides: { perView: 1 },
        breakpoints: {
          '(min-width: 768px)': {
            slides: { perView: 2 },
          },
          '(min-width: 1200px)': {
            slides: { perView: 3 },
          },
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.slider) {
      this.slider.destroy();
    }
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
