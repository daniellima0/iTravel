import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PhotoModalData } from '../../models/photo-modal-data.model';
import { PhotoService } from '../../services/photo.service';
import { FormsModule } from '@angular/forms';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PhotoModalComponent {
  // Array to track which photo is being edited
  isEditing: boolean[] = [];

  constructor(
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoModalData,
    private photoService: PhotoService
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // Handle click on description to enable editing
  editDescription(index: number): void {
    this.isEditing[index] = true;
  }

  // Save the description
  saveDescription(photo: Photo): void {
    console.log('Saving description for photo:', photo);
    if (photo._id) {
      const description = photo.description ?? ''; // If description is undefined, default to empty string
      this.photoService
        .updatePhotoDescription(photo._id, description)
        .subscribe({
          next: () => {
            console.log('Description updated successfully');
          },
          error: (err) => {
            console.error('Error updating description:', err);
          },
        });
    } else {
      console.error('Photo ID is undefined. Cannot save description.');
    }

    // Stop editing after saving
    const photoIndex = this.data.photos.indexOf(photo);
    this.isEditing[photoIndex] = false;
  }
}
