import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isDark = true;

  constructor(
    private router: Router,
    private authService: AuthService,
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
    // const user = {
    //   id: '1',
    //   username: this.username.trim(),
    //   displayName: this.username.trim(),
    //   bio: '',
    //   avatar: ''
    // };
    // 2. Prepare the login data (matches your LoginRequest.java)
    const credentials = {
      username: this.username.trim(),
      password: this.password.trim(),
    };

    console.log('Sending to backend:', credentials);

    // Navigate to home page
    // 3. Call the Backend
    if (isPlatformBrowser(this.platformId)) {
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful!', response);

          // Make sure the response has the expected structure
          if (response && response.token) {
            // Save user data - the service should handle the structure
            this.authService.saveUser(response);

            // Small delay to ensure localStorage is updated
            setTimeout(() => {
              this.router.navigate(['/feed']);
            }, 100);
          } else {
            this.error = 'Invalid response from server';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          // Show the 401 error message you got in Postman
          this.error = err.status === 401 ? 'Invalid username or password' : 'Login failed';
        },
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
