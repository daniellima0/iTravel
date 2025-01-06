import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { UploadPhotoButtonComponent } from './upload-photo-button/upload-photo-button.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'homepage',
  imports: [NavbarComponent, MapComponent, UploadPhotoButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        console.log('Authenticated:', response);
      },
      error: (err) => {
        console.log('Not authenticated');
        this.router.navigate(['login']);
      },
    });
  }
}
