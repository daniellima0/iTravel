import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  standalone: true,
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  imports: [FormsModule],
})
export class CreateAccountComponent {
  // Define the form controls for account creation
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit(): void {
    // Logic for handling account creation submission
    if (this.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
