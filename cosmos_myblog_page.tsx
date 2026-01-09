import { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { storage } from '../utils/storage';
import { BlogCard } from './BlogCard';
import { PostEditor } from './PostEditor';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface MyBlogPageProps {
  user: User;
  onPostClick: (post: Post) => void;
}

export function MyBlogPage({ user, onPostClick }: MyBlogPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  const loadPosts = () => {
    setPosts(storage.getUserPosts(user.id));
  };

  useEffect(() => {
    loadPosts();
  }, [user.id]);

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setShowEditor(true);
  };

  const handleEditPost = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      storage.deletePost(postId);
      loadPosts();
    }
  };

  const handleSavePost = (postData: Omit<Post, 'id' | 'date' | 'authorId'>) => {
    if (editingPost) {
      storage.updatePost(editingPost.id, postData);
    } else {
      storage.createPost({
        ...postData,
        authorId: user.id
      });
    }
    setShowEditor(false);
    setEditingPost(undefined);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-start gap-8 mb-16 pb-12 border-b border-white/10">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 
              style={{ fontFamily: 'Crimson Pro, serif' }}
              className="text-5xl font-light mb-2"
            >
              {user.name}
            </h1>
            <p 
              className="opacity-60 mb-4 text-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              @{user.username}
            </p>
            <p 
              className="opacity-70 mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {user.bio}
            </p>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Plus size={20} />
              Create New Post
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 
            style={{ fontFamily: 'Crimson Pro, serif' }}
            className="text-3xl font-light mb-2"
          >
            My Posts ({posts.length})
          </h2>
          <p 
            className="opacity-70"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Manage your published content
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 border border-white/10 rounded-lg bg-white/5">
            <p 
              className="opacity-70 mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              You haven't published any posts yet.
            </p>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2 font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Plus size={20} />
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <div key={post.id} className="relative group">
                <BlogCard
                  title={post.title}
                  date={post.date}
                  image={post.image}
                  category={post.category}
                  onClick={() => onPostClick(post)}
                  likeCount={post.likes?.length || 0}
                  commentCount={post.comments?.length || 0}
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => handleEditPost(post, e)}
                    className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeletePost(post.id, e)}
                    className="flex-1 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showEditor && (
        <PostEditor
          post={editingPost}
          onSave={handleSavePost}
          onCancel={() => {
            setShowEditor(false);
            setEditingPost(undefined);
          }}
        />
      )}
    </div>
  );
}