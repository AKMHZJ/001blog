import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
import { FeaturedPostComponent } from '../featured-post/featured-post.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  feedLoaded = false;
  subscribedCount = 0;
  showEmptyRequested = false;

  constructor(private router: Router, private postService: PostService, private userService: UserService, private authService: AuthService, private route: ActivatedRoute) {}

  onPostClick(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  ngOnInit() {
    this.checkLogin();
    // Read query param immediately and also subscribe for changes
    this.showEmptyRequested = this.route.snapshot.queryParamMap.has('showEmpty');
    this.route.queryParamMap.subscribe(q => {
      this.showEmptyRequested = q.has('showEmpty');
    });

    this.loadFeed();

    // Reload feed when navigation returns to /feed
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd && ev.urlAfterRedirects && ev.urlAfterRedirects.indexOf('/feed') !== -1) {
        console.log('[Home] NavigationEnd ->', ev.urlAfterRedirects);
        this.loadFeed();
      }
    });

    // Reload feed when login status changes to true (e.g., right after login)
    try {
      const authService = (window as any).ng && (window as any).ng.probe ? null : null;
    } catch (e) {
      // noop
    }
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
    // If user is logged in, try to load subscriptions from server; otherwise fallback to localStorage
    if (this.authService.isLoggedIn()) {
      this.userService.getMyFollowing().subscribe(ids => {
        const subs = ids || [];
        this.loadPostsForSubscriptionsOrGlobal(subs);
      }, err => {
        console.error('[Home] failed to load following list', err);
        // fallback to localStorage
        let subs: string[] = [];
        try { const s = localStorage.getItem('subscriptions'); subs = s ? JSON.parse(s) : []; } catch (e) { subs = []; }
        this.loadPostsForSubscriptionsOrGlobal(subs);
      });
    } else {
      // Not logged in - fallback to localStorage
      let subs: string[] = [];
      try { const s = localStorage.getItem('subscriptions'); subs = s ? JSON.parse(s) : []; } catch (e) { subs = []; }
      if (subs && subs.length > 0) {
        this.loadPostsForSubscriptionsOrGlobal(subs);
      } else {
        this.postService.getPosts().subscribe(posts => {
          this.feedPosts = posts;
          this.feedLoaded = true;
          if (!posts || posts.length === 0) {
            this.router.navigate(['/discover']);
          }
        }, err => { console.error('[Home] failed to load global posts', err); this.feedLoaded = true; });
      }
    }
    // loadPostsForSubscriptionsOrGlobal handles the rest
    this.subscribedCount = 0; // Mock data
  }

  private loadPostsForSubscriptionsOrGlobal(subs: string[]) {
    if (this.authService.isLoggedIn() && (!subs || subs.length === 0)) {
      // User is logged in but follows no one: only show the user's own posts
      const current = this.authService.getCurrentUser();
      const myId = current && current.id ? String(current.id) : null;
      if (myId) {
        this.postService.getPostsByUser(myId).subscribe(posts => {
          this.feedPosts = posts;
          this.feedLoaded = true;
          if (!posts || posts.length === 0) {
            // No posts from user
            this.feedLoaded = true;
            if (this.showEmptyRequested) {
              // Show empty main instead of redirect
              return;
            }
            this.router.navigate(['/discover']);
          }
        }, err => {
          console.error('[Home] failed to load my posts', err);
          this.feedLoaded = true;
        });
      } else {
        // Fallback: treat as no posts
        this.feedPosts = [];
        this.feedLoaded = true;
        this.router.navigate(['/discover']);
      }
      return;
    }

    if (subs && subs.length > 0) {
      const requests = subs.map(id => this.postService.getPostsByUser(id).pipe(catchError(err => {
        console.error('[Home] failed to load posts for user', id, err);
        return of([] as Post[]);
      })));

      forkJoin(requests).subscribe(results => {
        // Flatten results and sort by date desc
        const flattened: Post[] = ([] as Post[]).concat(...results);
        flattened.sort((a, b) => {
          const da = new Date(a.date).valueOf();
          const db = new Date(b.date).valueOf();
          return db - da;
        });
        this.feedPosts = flattened;
        this.feedLoaded = true;

        if (!this.feedPosts || this.feedPosts.length === 0) {
          // If still empty, fallback to global feed
          this.postService.getPosts().subscribe(posts => {
            this.feedPosts = posts;
            this.feedLoaded = true;
            if (!posts || posts.length === 0) {
              this.feedLoaded = true;
              if (this.showEmptyRequested) {
                return;
              }
              this.router.navigate(['/discover']);
            }
          });
        }
      });
    } else {
      this.postService.getPosts().subscribe(posts => {
        this.feedPosts = posts;
        this.feedLoaded = true;
        // If there are no posts in the feed, navigate to Discover to show users
        if (!posts || posts.length === 0) {
          this.feedLoaded = true;
          if (this.showEmptyRequested) {
            return;
          }
          this.router.navigate(['/discover']);
        }
      }, err => {
        console.error('[Home] failed to load global posts', err);
        this.feedLoaded = true;
      });
    }
  }

  goToDiscover(event: Event) {
    // Prevent default anchor behavior and navigate programmatically
    event.preventDefault();
    this.router.navigateByUrl('/discover');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
