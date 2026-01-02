import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Layout, ShieldCheck, PenTool, MessageSquare, Users, Lock, Smartphone, Server, Monitor } from 'lucide-angular';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {
  scrollY = 0;
  isDark = true;
  currentWordIndex = 0;
  words = ['writers', 'thinkers', 'creators', 'students', 'learners'];

  readonly icons = {
    Layout,
    ShieldCheck,
    PenTool,
    MessageSquare,
    Users,
    Lock,
    Smartphone,
    Server,
    Monitor
  };

  private wordInterval: any;
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.wordInterval = setInterval(() => {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      }, 2500);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.wordInterval) {
      clearInterval(this.wordInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollY = window.scrollY;
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
  }

  onContinue() {
    console.log('Navigate to Login/App...');
    // Add your navigation logic here
    // Example: this.router.navigate(['/login']);
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach((el) => this.observer?.observe(el));
  }
}
