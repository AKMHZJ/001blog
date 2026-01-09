import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-editor.component.html',
  // styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent {
  @Input() post: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  isDark = true;
  title = '';
  excerpt = '';
  category = 'Lifestyle';
  image = '';
  content = '';

  ngOnInit() {
    if (this.post) {
      this.title = this.post.title;
      this.excerpt = this.post.excerpt;
      this.category = this.post.category;
      this.image = this.post.image;
      this.content = this.post.content.join('\n\n');
    }
  }

  handleSubmit() {
    this.save.emit({
      title: this.title,
      excerpt: this.excerpt,
      category: this.category,
      image: this.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080',
      content: this.content.split('\n\n').filter(p => p.trim()),
    });
  }
}
