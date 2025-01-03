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

  constructor(
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoModalData,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const sliderContainer =
      this.elementRef.nativeElement.querySelector('.keen-slider');
    this.slider = new KeenSlider(sliderContainer, {
      loop: true,
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

  ngOnDestroy(): void {
    if (this.slider) {
      this.slider.destroy();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
