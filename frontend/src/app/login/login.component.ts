import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  // Define the form controls (for simplicity, no form validation here)
  username: string = '';
  password: string = '';

  onSubmit(): void {
    // Logic for handling login submission
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
