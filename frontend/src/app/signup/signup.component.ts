import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService,
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
      username: this.username.trim(),
      displayName: this.displayName.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      bio: '',
      avatar: ''
    };

    // Navigate to login after successful signup
    // if (isPlatformBrowser(this.platformId)) {
    //   this.router.navigate(['/login']);
    // }
    if (isPlatformBrowser(this.platformId)) {
      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('Signup Successful:', response);
          this.router.navigate(['/login']); // Go to login page on success
        },
        error: (err) => {
          console.error('Signup Failed:', err);
          // Display the error message from Spring Boot (e.g., "Username already taken")
          this.error = typeof err.error === 'string' ? err.error : 'Signup failed. Please try again.';
        }
      });
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
