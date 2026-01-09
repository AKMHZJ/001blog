import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHeader$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    const hiddenRoutes = ['/login', '/signup', '/'];

    const routeEvents$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
      startWith(this.router.url)
    );

    this.showHeader$ = combineLatest([
      this.authService.loggedIn$,
      routeEvents$
    ]).pipe(
      map(([isLoggedIn, url]) => isLoggedIn && !hiddenRoutes.includes(url))
    );
  }
}
