import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule],
})
export class NavbarComponent {
  menuOpen = false;
  userName: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Make an API call to get the user's data when the component loads
    this.http
      .get<any>('http://localhost:3000/auth/status', { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.user) {
            this.userName = response.user.username;
          }
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        },
      });
  }

  ngAfterViewInit(): void {
    // Add a click event listener to close the menu when clicking outside of the navbar
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.closeMenu(); // Close menu if click is outside of the navbar
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.style.display = this.menuOpen ? 'block' : 'none';
  }

  closeMenu() {
    this.menuOpen = false;
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.style.display = 'none';
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
