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
  styleUrls: ['./login.component.scss']
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
    password: this.password.trim()
  };

  console.log('Sending to backend:', credentials);

  // Navigate to home page
  // 3. Call the Backend
  if (isPlatformBrowser(this.platformId)) {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        // 1. Save the token/user to LocalStorage so the app remembers the user
    // localStorage.setItem('token', response.token);
    // localStorage.setItem('currentUser', JSON.stringify(response));

        // Save user data/token if your backend returns it
        this.authService.saveUser(response);

        // Navigate only if login is successful
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        // Show the 401 error message you got in Postman
        this.error = 'Invalid username or password';
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
