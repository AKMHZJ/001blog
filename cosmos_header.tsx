import { User } from '../types';
import { LogOut } from 'lucide-react';

export function Header({ 
  user,
  currentPage,
  onNavigate,
  onLogout
}: { 
  user: User | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}) {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('feed')}
          className="hover:opacity-70 transition-opacity flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold text-lg" style={{ fontFamily: 'Crimson Pro, serif' }}>
            B
          </div>
          <h1 style={{ fontFamily: 'Crimson Pro, serif', color: 'white' }} className="text-lg tracking-wide">
            Blog Network
          </h1>
        </button>
        
        {user && (
          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              <button 
                onClick={() => onNavigate('feed')}
                className={`transition-all text-sm ${
                  currentPage === 'feed' 
                    ? 'text-white opacity-100' 
                    : 'text-white/60 hover:text-white/100'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Feed
              </button>
              <button 
                onClick={() => onNavigate('myblog')}
                className={`transition-all text-sm ${
                  currentPage === 'myblog' 
                    ? 'text-white opacity-100' 
                    : 'text-white/60 hover:text-white/100'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                My Blog
              </button>
              <button 
                onClick={() => onNavigate('discover')}
                className={`transition-all text-sm ${
                  currentPage === 'discover' 
                    ? 'text-white opacity-100' 
                    : 'text-white/60 hover:text-white/100'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Discover
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className={`transition-all text-sm ${
                  currentPage === 'about' 
                    ? 'text-white opacity-100' 
                    : 'text-white/60 hover:text-white/100'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                About
              </button>
            </nav>
            
            <div className="flex items-center gap-3 pl-8 border-l border-white/10">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <button
                onClick={onLogout}
                className="text-white/60 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}