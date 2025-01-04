import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    if (this.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:3000/auth/register', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: (response: any) => {
          console.log('User created successfully:', response);

          // Navigate to the homepage after successful account creation
          this.router.navigate(['']);

          alert('Account created successfully!');
        },
        error: (err) => {
          console.error('Error creating user:', err);
        },
      });
  }
}
