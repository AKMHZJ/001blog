import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post, Comment } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    {
      id: '1',
      title: 'My First Blog Post',
      excerpt: 'This is the excerpt for my first blog post. It is very exciting!',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080',
      content: [
        'This is the first paragraph of my first blog post.',
        'This is the second paragraph. I am writing about technology.'
      ],
      author: { id: '1', name: 'John Doe' },
      date: new Date().toISOString(),
      likes: [],
      comments: [
        {
          id: '1',
          author: { id: '2', name: 'Jane Smith' },
          text: 'Great post!',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: '2',
      title: 'Another Post',
      excerpt: 'This is another post, this time about lifestyle.',
      category: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080',
      content: [
        'This post is all about lifestyle.',
        'I hope you enjoy it.'
      ],
      author: { id: '1', name: 'John Doe' },
      date: new Date().toISOString(),
      likes: ['2'],
      comments: []
    }
  ];

  private posts$ = new BehaviorSubject<Post[]>(this.posts);

  constructor() { }

  getPosts() {
    return this.posts$.asObservable();
  }

  getPost(id: string) {
    const post = this.posts.find(p => p.id === id);
    return of(post);
  }

  addPost(postData: Omit<Post, 'id' | 'author' | 'date' | 'likes' | 'comments'>) {
    const newPost: Post = {
      id: (this.posts.length + 1).toString(),
      ...postData,
      author: { id: '1', name: 'Current User' }, // Mock current user
      date: new Date().toISOString(),
      likes: [],
      comments: []
    };
    this.posts = [...this.posts, newPost];
    this.posts$.next(this.posts);
  }

  updatePost(updatedPost: Post) {
    const index = this.posts.findIndex(p => p.id === updatedPost.id);
    if (index > -1) {
      this.posts[index] = updatedPost;
      this.posts$.next(this.posts);
    }
  }

  deletePost(id: string) {
    this.posts = this.posts.filter(p => p.id !== id);
    this.posts$.next(this.posts);
  }

  toggleLike(postId: string, userId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
      }
      this.posts$.next(this.posts);
    }
  }

  addComment(postId: string, commentText: string, author: any) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        author,
        timestamp: new Date().toISOString()
      };
      post.comments.push(newComment);
      this.posts$.next(this.posts);
    }
  }

  deleteComment(postId: string, commentId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments = post.comments.filter(c => c.id !== commentId);
      this.posts$.next(this.posts);
    }
  }

  getPostsByUser(userId: string) {
    return this.posts$.asObservable().pipe(
      map(posts => posts.filter(p => p.author.id === userId))
    );
  }
}
