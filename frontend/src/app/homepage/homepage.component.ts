import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar.component';
import { Map } from './map/map.component';
import { UploadPhotoButton } from './upload-photo-button/upload-photo-button.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'homepage',
  imports: [Navbar, Map, UploadPhotoButton],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class Homepage {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000/auth/status', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log('Not authenticated');
          this.router.navigate(['login']);
        },
      });
  }
}
