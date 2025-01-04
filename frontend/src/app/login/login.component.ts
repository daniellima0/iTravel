import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    // Logic for handling login submission
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
