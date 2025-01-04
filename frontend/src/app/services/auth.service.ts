import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  checkAuthStatus(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/status`, { withCredentials: true })
      .pipe(
        map((response) => {
          this.isAuthenticatedSubject.next(true);
          return response;
        }),
        catchError((err) => {
          this.isAuthenticatedSubject.next(false);
          throw err;
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const payload = { username, email, password };
    return this.http
      .post(`${this.apiUrl}/register`, payload, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => {
          throw err;
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http
      .post(`${this.apiUrl}/login`, loginData, { withCredentials: true })
      .pipe(
        map((response) => {
          this.isAuthenticatedSubject.next(true);
          return response;
        }),
        catchError((err) => {
          this.isAuthenticatedSubject.next(false);
          throw err;
        })
      );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['login']);
      });
  }
}
