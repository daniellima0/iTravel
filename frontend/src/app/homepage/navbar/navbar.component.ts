import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private http: HttpClient, private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.style.display = this.menuOpen ? 'block' : 'none';
  }

  logout() {
    this.http
      .post('http://localhost:3000/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: (response) => {
          // On successful logout
          console.log('Logged out successfully', response);

          // Redirect to the login page after successful logout
          this.router.navigate(['login']);
        },
        error: (err) => {
          // Handle error in logout process
          console.error('Error logging out:', err);
          // Optionally, show an error message to the user
          alert('Error logging out. Please try again.');
        },
      });
  }
}
