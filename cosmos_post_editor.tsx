// Modified PostEditor.tsx to match cosmos style exactly
import { useState, useEffect } from 'react';
import { Post } from '../types';
import { X } from 'lucide-react';
import { MediaUploader } from './MediaUploader';

interface PostEditorProps {
  post?: Post;
  onSave: (post: Omit<Post, 'id' | 'date' | 'authorId'>) => void;
  onCancel: () => void;
}

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || 'Lifestyle');
  const [image, setImage] = useState(post?.image || '');
  const [content, setContent] = useState(post?.content.join('\n\n') || '');
  const [mediaUrls, setMediaUrls] = useState<string[]>(post?.mediaUrls || []);
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      excerpt,
      category,
      image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080',
      content: content.split('\n\n').filter(p => p.trim()),
      likes: post?.likes || [],
      comments: post?.comments || [],
      mediaUrls
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 transition-colors duration-700">
      <div 
        className="rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto fade-in"
        style={{ 
          backgroundColor: isDark ? '#000000' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000'
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap');
          
          .font-serif {
            font-family: 'Crimson Pro', serif;
          }
          
          .font-sans {
            font-family: 'Inter', sans-serif;
          }
          
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          input::placeholder, textarea::placeholder {
            opacity: 0.4;
          }
          
          .theme-toggle {
            cursor: pointer;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }
          
          .theme-toggle:hover {
            transform: scale(1.1);
            opacity: 1 !important;
          }
        `}</style>

        {/* Theme Toggle - Top Right in Modal */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle absolute top-8 right-8 text-sm z-10 font-sans"
          style={{ opacity: 0.6 }}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>

        <div className="sticky top-0 border-b px-8 py-6 flex items-center justify-between z-20" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}` , backgroundColor: isDark ? '#000000' : '#ffffff' }}>
          <h2 
            className="font-serif text-3xl font-light tracking-tight"
          >
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onCancel}
            className="transition-opacity hover:opacity-100"
            style={{ opacity: 0.6 }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label 
              htmlFor="title"
              className="block text-xs uppercase tracking-wider mb-2 font-sans"
              style={{ opacity: 0.5 }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Enter your post title"
            />
          </div>

          <div>
            <label 
              htmlFor="excerpt"
              className="block text-xs uppercase tracking-wider mb-2 font-sans"
              style={{ opacity: 0.5 }}
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={2}
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans resize-none"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Brief description of your post"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="category"
                className="block text-xs uppercase tracking-wider mb-2 font-sans"
                style={{ opacity: 0.5 }}
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
                style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                  color: isDark ? '#ffffff' : '#000000'
                }}
              >
                <option>Lifestyle</option>
                <option>Design</option>
                <option>Technology</option>
                <option>Productivity</option>
                <option>Architecture</option>
              </select>
            </div>

            <div>
              <label 
                htmlFor="image"
                className="block text-xs uppercase tracking-wider mb-2 font-sans"
                style={{ opacity: 0.5 }}
              >
                Image URL
              </label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
                style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="content"
              className="block text-xs uppercase tracking-wider mb-2 font-sans"
              style={{ opacity: 0.5 }}
            >
              Content (separate paragraphs with blank lines)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans resize-none"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label 
              className="block text-xs uppercase tracking-wider mb-2 font-sans"
              style={{ opacity: 0.5 }}
            >
              Additional Media (Optional)
            </label>
            <MediaUploader
              mediaUrls={mediaUrls}
              setMediaUrls={setMediaUrls}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 rounded-full text-base font-medium transition-all font-sans"
              style={{ 
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff'
              }}
            >
              {post ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 rounded-full text-base font-medium transition-all font-sans"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? '#ffffff' : '#000000'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}