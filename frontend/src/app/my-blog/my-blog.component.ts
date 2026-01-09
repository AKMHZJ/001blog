import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardComponent } from '../../app/blog-card/blog-card.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { PostEditorComponent } from '../post-editor/post-editor.component';

@Component({
  selector: 'app-my-blog',
  standalone: true,
  imports: [CommonModule, BlogCardComponent, PostEditorComponent],
  templateUrl: './my-blog.component.html'
})
export class MyBlogComponent implements OnInit {
  user: any = null;
  myPosts: Post[] = [];
  showPostEditor = false;
  editingPost: Post | null = null;

  constructor(private authService: AuthService, private postService: PostService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadUserPosts(user.id);
      } else {
        // for mock, if no user, assume user 1
        this.loadUserPosts('1');
      }
    });
  }

  loadUserPosts(userId: string) {
    this.postService.getPostsByUser(userId).subscribe(posts => {
      this.myPosts = posts;
    });
  }

  openEditor(post: Post | null = null) {
    this.editingPost = post;
    this.showPostEditor = true;
  }

  handleCancel() {
    this.showPostEditor = false;
    this.editingPost = null;
  }

  handleSave(post: any) {
    if (this.editingPost) {
      // Update existing post
      this.postService.updatePost({ ...this.editingPost, ...post });
    } else {
      // Create new post
      this.postService.addPost(post);
    }
    this.handleCancel();
  }


  handleEdit(post: any, event: Event) {
    event.stopPropagation();
    this.openEditor(post);
  }

  handleDelete(postId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId);
    }
  }
}
