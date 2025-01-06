import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PhotoMetadata } from '../services/photo.service';

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
  photos: Array<PhotoMetadata> = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: () => this.router.navigate(['']),
      error: () => console.log('Not authenticated'),
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
      photos: this.photos,
    };

    this.authService
      .register(this.username, this.email, this.password, this.photos)
      .subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.router.navigate(['']);
          alert('Account created successfully!');
        },
        error: (err) => {
          console.error('Error creating user:', err);
        },
      });
  }
}
