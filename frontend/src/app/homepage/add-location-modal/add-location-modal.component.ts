import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-location-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-location-modal.component.html',
  styleUrl: './add-location-modal.component.css',
})
export class AddLocationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddLocationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave(): void {
    // Update `photo.location` with `latitude` and `longitude`
    this.data.forEach((photo: any) => {
      if (photo.latitude && photo.longitude) {
        photo.photo.location = {
          latitude: parseFloat(photo.latitude),
          longitude: parseFloat(photo.longitude),
        };
      }
    });

    // Validate all photos have location data
    const isValid = this.data.every(
      (photo: any) =>
        photo.photo.location &&
        !isNaN(photo.photo.location.latitude) &&
        !isNaN(photo.photo.location.longitude)
    );

    if (isValid) {
      this.dialogRef.close(this.data); // Pass the updated data back
    } else {
      console.error('Invalid location data:', this.data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
