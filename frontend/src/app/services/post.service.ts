import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, Comment } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  private authHeaders(): { headers: HttpHeaders } {
    const token = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return { headers };
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl, this.authHeaders());
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, this.authHeaders());
  }

  getPostsByUser(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`, this.authHeaders());
  }

  createPost(request: { title: string; excerpt: string; category: string; image: string; content: string[] }) {
    return this.http.post<Post>(this.apiUrl, request, this.authHeaders());
  }

  toggleLike(postId: string, userId?: string) {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/like`, {}, this.authHeaders());
  }

  addComment(postId: string, text: string, author?: any) {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comments`, { text }, this.authHeaders());
  }

  deletePost(postId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`, this.authHeaders());
  }

  deleteComment(postId: string, commentId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/comments/${commentId}`, this.authHeaders());
  }

  // Compatibility wrappers for older component method names
  addPost(postData: any) {
    // Expected shape: { title, excerpt, category, image, content }
    return this.createPost(postData);
  }

  updatePost(updatedPost: any) {
    // Attempt to call PUT /api/posts/{id} if backend supports it
    const id = updatedPost.id;
    if (!id) {
      return this.createPost(updatedPost);
    }
    return this.http.put<Post>(`${this.apiUrl}/${id}`, updatedPost, this.authHeaders());
  }

  // Keep old toggleLike signature (postId, userId)
  toggleLikeCompat(postId: string, userId?: string) {
    return this.toggleLike(postId);
  }

  // Keep old addComment signature (postId, text, author)
  addCommentCompat(postId: string, text: string, author?: any) {
    return this.addComment(postId, text);
  }
}
