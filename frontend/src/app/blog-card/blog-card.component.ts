import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-card.component.html'
})
export class BlogCardComponent {
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() image: string = '';
  @Input() category: string = '';
  @Input() likeCount: number = 0;
  @Input() commentCount: number = 0;
  @Output() cardClick = new EventEmitter<void>();
}
