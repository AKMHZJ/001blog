import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isDark = true; // Use your theme logic here
  currentUser: any = null;
  feedPosts: any[] = [];
  subscribedCount = 0;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    // 1. Retrieve the saved user
    const token = localStorage.getItem('token');
    if (!token) {
      // If no user, kick them back to login
      this.router.navigate(['/login']);
      return;
    }

    // Get user from AuthService or localStorage
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;

    // 2. Load the Feed Data
    this.loadFeed();
  }

  loadFeed() {
    const token = localStorage.getItem('token');

    // We must send the Token to the backend to prove who we are
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // <--- IMPORTANT
    });

    // Replace with your real backend endpoint later
    // For now, we simulate empty or dummy data
    this.feedPosts = [];
    this.subscribedCount = 0;
  }

  onDiscoverClick() {
    // Navigate to a discover page (we can build this later)
    console.log('Go to Discover');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
