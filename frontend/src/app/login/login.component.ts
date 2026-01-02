import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isDark = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  handleSubmit() {
    this.error = '';

    if (!this.username.trim()) {
      this.error = 'Please enter your username';
      return;
    }

    if (!this.password.trim()) {
      this.error = 'Please enter your password';
      return;
    }

    // Mock user object for demo
    const user = {
      id: '1',
      username: this.username.trim(),
      displayName: this.username.trim(),
      bio: '',
      avatar: ''
    };

    // Navigate to home page
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/']);
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
  }
}
