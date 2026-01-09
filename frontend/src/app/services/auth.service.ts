import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenPresent());
  loggedIn$ = this.loggedIn.asObservable();

  private currentUser = new BehaviorSubject<any>(this.getCurrentUser());
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private isTokenPresent(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((response: any) => {
        this.saveUser(response);
        this.loggedIn.next(true);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.saveUser(response);
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
    }
    this.loggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  saveUser(data: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', data.token);

      const user = {
        id: data.id || data.userId || '1',
        username: data.username,
        displayName: data.displayName || data.username,
        bio: data.bio || '',
        avatar: data.avatar || '',
        email: data.email || '',
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('username', data.username);
      this.loggedIn.next(true);
      this.currentUser.next(user);
    }
  }

  getCurrentUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }
}
