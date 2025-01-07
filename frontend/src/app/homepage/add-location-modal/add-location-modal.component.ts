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

  onSave(locationData: any): void {
    this.dialogRef.close(locationData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
