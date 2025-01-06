import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Photo } from '../models/photo.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-account',
  standalone: true,
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  imports: [FormsModule],
})
export class CreateAccountComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  photos: Photo[] = [];

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

    const user: User = {
      username: this.username,
      email: this.email,
      password: this.password,
      photos: this.photos,
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
  }
}
