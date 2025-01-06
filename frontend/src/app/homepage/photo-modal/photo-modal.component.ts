import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PhotoModalData } from '../../models/photo-modal-data.model';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PhotoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoModalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
