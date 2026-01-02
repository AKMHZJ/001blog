import { useState } from 'react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = () => {
    setError('');
    
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Mock user object for demo
    const user = {
      id: '1',
      username: username.trim(),
      displayName: username.trim(),
      bio: '',
      avatar: ''
    };
    
    onLogin(user);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 transition-colors duration-700"
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
        
        input::placeholder {
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

      {/* Theme Toggle - Top Right */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className="theme-toggle fixed top-8 right-8 text-sm z-10 font-sans"
        style={{ opacity: 0.6 }}
      >
        {isDark ? 'Light' : 'Dark'}
      </button>

      {/* Login Container */}
      <div className="max-w-md w-full fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-semibold text-xl"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff'
              }}
            >
              B
            </div>
            <span className="font-serif text-xl tracking-wide">Blog Network</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 tracking-tight">
            Log in
          </h1>
          <p className="font-sans" style={{ opacity: 0.6 }}>
            or{' '}
            <a 
              href="#" 
              className="underline underline-offset-4 transition-opacity hover:opacity-100"
              style={{ opacity: 0.6 }}
            >
              create an account
            </a>
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Email or username"
              autoComplete="username"
            />
          </div>

          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              type="password"
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm font-sans" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-full text-base font-medium transition-all mt-8"
            style={{
              backgroundColor: isDark ? '#ffffff' : '#000000',
              color: isDark ? '#000000' : '#ffffff'
            }}
          >
            Enter
          </button>

          <div className="text-center pt-4">
            <a 
              href="#" 
              className="text-sm underline underline-offset-4 transition-opacity font-sans"
              style={{ opacity: 0.6 }}
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Demo Notice */}
        <p className="text-center text-sm mt-12 leading-relaxed font-sans" style={{ opacity: 0.4 }}>
          This is a demo — use any username and password to continue.
        </p>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-16">
          <a href="#" className="text-xs transition-opacity font-sans" style={{ opacity: 0.4 }}>
            Terms of Service
          </a>
          <a href="#" className="text-xs transition-opacity font-sans" style={{ opacity: 0.4 }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;