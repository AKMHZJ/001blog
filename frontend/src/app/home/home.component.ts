import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { FeaturedPostComponent } from '../featured-post/featured-post.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedPostComponent, BlogCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isDark = true; // Use your theme logic here
  currentUser: any = null;
  feedPosts: Post[] = [];
  subscribedCount = 0;

  constructor(private router: Router, private postService: PostService) {}

  onPostClick(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  ngOnInit() {
    this.checkLogin();
    this.loadFeed();
  }

  checkLogin() {
    // In a real app, you would use AuthService to get user
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    } else {
        // For mock purposes, let's create a dummy user
        this.currentUser = {id: '1', name: 'demo-user'};
    }
  }

  loadFeed() {
    this.postService.getPosts().subscribe(posts => {
      this.feedPosts = posts;
    });
    this.subscribedCount = 0; // Mock data
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
