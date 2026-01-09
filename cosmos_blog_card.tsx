import { Heart, MessageCircle } from 'lucide-react';

interface BlogCardProps {
  title: string;
  date: string;
  image: string;
  category: string;
  onClick: () => void;
  likeCount?: number;
  commentCount?: number;
}

export function BlogCard({ title, date, image, category, onClick, likeCount = 0, commentCount = 0 }: BlogCardProps) {
  return (
    <article onClick={onClick} className="cursor-pointer group">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
      
      <div className="relative overflow-hidden aspect-[4/3] mb-6 rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <span 
          className="inline-block px-3 py-1 text-white rounded-full text-xs"
          style={{ 
            backgroundColor: '#06b6d4',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {category}
        </span>
        <span 
          className="text-gray-500 text-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {date}
        </span>
      </div>
      
      <h2 
        style={{ fontFamily: 'Crimson Pro, serif' }}
        className="text-2xl font-light mb-3 group-hover:opacity-70 transition-opacity leading-tight"
      >
        {title}
      </h2>
      
      {(likeCount > 0 || commentCount > 0) && (
        <div className="flex items-center gap-4 mt-3 opacity-60">
          {likeCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
                {likeCount}
              </span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
                {commentCount}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}