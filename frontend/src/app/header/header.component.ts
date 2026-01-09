import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  showLogoutModal = false;
  isDark = true; // You can connect this to a theme service later

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Check if we are in the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.checkUser();

      // Optional: Listen for storage changes in case login happens in another tab
      window.addEventListener('storage', () => this.checkUser());
    }
  }

  checkUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    } else {
      this.currentUser = null;
    }
  }

  // Toggle the modal
  initiateLogout() {
    this.showLogoutModal = true;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/welcome']);
  }
}
