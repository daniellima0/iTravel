import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Get the token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
