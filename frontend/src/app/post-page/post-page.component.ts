import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { Post, Comment } from '../models/post';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-page.component.html'
})
export class PostPageComponent implements OnInit {
  post: Post | undefined;
  currentUser: any = null;
  commentText: string = '';
  isLiked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.checkInteractionStates();
    });

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPost(postId).subscribe(post => {
        this.post = post;
        this.checkInteractionStates();
      });
    }
  }

  checkInteractionStates(): void {
    if (this.currentUser && this.post) {
      this.isLiked = this.post.likes?.includes(this.currentUser.id) || false;
    }
  }

  handleLike(): void {
    if (!this.currentUser || !this.post) return;
    this.postService.toggleLike(this.post.id, this.currentUser.id);
    this.isLiked = !this.isLiked;
  }

  handleCommentSubmit(): void {
    if (!this.currentUser || !this.commentText.trim() || !this.post) return;

    this.postService.addComment(this.post.id, this.commentText, this.currentUser);
    this.commentText = '';
  }

  handleDeleteComment(commentId: string): void {
    if (!this.currentUser || !this.post) return;

    if (confirm('Delete this comment?')) {
      this.postService.deleteComment(this.post.id, commentId);
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  isVideo(url: string): boolean {
    return !!url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  }


  goBack(): void {
    this.router.navigate(['/feed']);
  }
}
