import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:3000/users', payload).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        // Save the JWT in local storage
        localStorage.setItem('authToken', response.token);
        alert('Account created successfully!');
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
  }
}
