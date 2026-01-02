import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email = '';
  username = '';
  password = '';
  displayName = '';
  error = '';
  isDark = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  handleSubmit() {
    this.error = '';

    if (!this.email.trim()) {
      this.error = 'Please enter your email';
      return;
    }
    if (!this.username.trim()) {
      this.error = 'Please enter a username';
      return;
    }
    if (!this.password.trim() || this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }
    if (!this.displayName.trim()) {
      this.error = 'Please enter your display name';
      return;
    }

    const user = {
      id: Date.now().toString(),
      username: this.username.trim(),
      displayName: this.displayName.trim(),
      email: this.email.trim(),
      bio: '',
      avatar: ''
    };

    // Navigate to login after successful signup
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
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
