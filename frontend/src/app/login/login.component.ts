import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // <-- Add this import
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule, CommonModule],
})
export class LoginComponent {
  // Define the form controls (for simplicity, no form validation here)
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000/auth/status', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log('Not authenticated');
        },
      });
  }

  onSubmit(): void {
    // Login logic
    const loginData = { username: this.username, password: this.password };

    this.http
      .post('http://localhost:3000/auth/login', loginData, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // Redirect to homepage after successful login
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          // Set an error message to display on the UI
          this.errorMessage = 'Invalid username or password. Please try again.';
        },
      });
  }
}
