import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule, UserPlus, UserMinus } from 'lucide-angular';
import { UserService, UserSummary } from '../services/user.service';

@Component({
  selector: 'app-discover-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './discover_component_html.html',
  styleUrls: ['./discover_component_css.scss']
})
export class DiscoverPageComponent implements OnInit {
  // Icons
  readonly icons = { UserPlus, UserMinus };

  users: UserSummary[] = [];
  subscriptions: string[] = [];
  currentUserId: string = '';

  constructor(private router: Router, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Refresh users when navigation occurs to this route (ensures consistent behavior
    // whether navigation is via header routerLink or programmatic navigate)
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        console.log('[Discover] NavigationEnd ->', ev.urlAfterRedirects);
        // handle cases like query params or trailing slashes
        if (ev.urlAfterRedirects && ev.urlAfterRedirects.indexOf('/discover') !== -1) {
          this.loadUsers();
          // Load subscriptions from server (if authenticated) or fallback to localStorage
          this.userService.getMyFollowing().subscribe(ids => {
            this.subscriptions = ids || [];
          }, () => {
            try {
              const subs = localStorage.getItem('subscriptions');
              this.subscriptions = subs ? JSON.parse(subs) : [];
            } catch (e) { this.subscriptions = []; }
          });
        }
      }
    });

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        this.currentUserId = u.id || '';
      } catch (e) {
        this.currentUserId = '';
      }
    }

    // Ensure we attempt at least one load when component initializes
    setTimeout(() => {
      this.loadUsers();
      // Attempt to load subscriptions from server
      this.userService.getMyFollowing().subscribe(ids => {
        this.subscriptions = ids || [];
      }, () => {
        try { const subs = localStorage.getItem('subscriptions'); this.subscriptions = subs ? JSON.parse(subs) : []; } catch (e) { this.subscriptions = []; }
      });
    }, 0);
  }

  loadUsers() {
    console.log('[Discover] loadUsers() - requesting users');
    this.userService.getUsers().subscribe(users => {
      console.log('[Discover] users received', users && users.length);
      this.users = users;
      // Ensure view updates if change detection missed the assignment
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    }, err => {
      // Fallback to empty list on error
      console.error('[Discover] Failed to load users', err);
      this.users = [];
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });

    // TODO: Load subscriptions from API/storage
    this.subscriptions = [];
  }

  getUserPostCount(userId: string): number {
    const u = this.users.find(x => x.id === userId);
    return u && u.postCount ? u.postCount : 0;
  }

  isSubscribed(userId: string): boolean {
    return this.subscriptions.includes(userId);
  }

  handleToggleSubscribe(userId: string, event: Event) {
    event.stopPropagation();
    // Call server to toggle follow
    this.userService.follow(userId).subscribe(res => {
      const following = res && res.following === true;
      if (following) {
        this.subscriptions = Array.from(new Set([...this.subscriptions, userId]));
      } else {
        this.subscriptions = this.subscriptions.filter(id => id !== userId);
      }
      // keep local fallback copy
      try { localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions)); } catch (e) { /* ignore */ }
    }, err => {
      console.error('[Discover] follow toggle failed', err);
    });
  }

  onUserClick(user: UserSummary) {
    this.router.navigate(['/profile', user.username]);
  }
}
