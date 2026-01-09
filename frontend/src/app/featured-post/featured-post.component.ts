import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-post.component.html'
})
export class FeaturedPostComponent {
  @Input() title: string = '';
  @Input() excerpt: string = '';
  @Input() date: string = '';
  @Input() image: string = '';
  @Input() category: string = '';
  @Output() postClick = new EventEmitter<void>();
}
