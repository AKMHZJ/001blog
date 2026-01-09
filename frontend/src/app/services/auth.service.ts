import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // This must match your Spring Boot port (usually 8080)
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Helper to save data to local storage
  saveUser(data: any) {
    localStorage.setItem('token', data.token);

    // Create and save user object
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
  }

  // Add a method to get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Add a method to check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
