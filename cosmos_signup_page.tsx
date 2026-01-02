import { useState } from 'react';

interface SignUpPageProps {
  onSignUp: (user: any) => void;
}

export function SignUpPage({ onSignUp }: SignUpPageProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = () => {
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!displayName.trim()) {
      setError('Please enter your display name');
      return;
    }

    // Create user object
    const user = {
      id: Date.now().toString(),
      username: username.trim(),
      displayName: displayName.trim(),
      email: email.trim(),
      bio: '',
      avatar: ''
    };
    
    onSignUp(user);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 py-12 transition-colors duration-700"
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

        label {
          font-family: 'Inter', sans-serif;
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

      {/* Sign Up Container */}
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
            Create account
          </h1>
          <p className="font-sans" style={{ opacity: 0.6 }}>
            Already have an account?{' '}
            <a 
              href="#" 
              className="underline underline-offset-4 transition-opacity hover:opacity-100"
              style={{ opacity: 0.6 }}
            >
              Log in
            </a>
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              type="email"
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              Display Name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-0 py-3 bg-transparent text-base outline-none transition-colors font-sans"
              style={{
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)',
                color: isDark ? '#ffffff' : '#000000'
              }}
              placeholder="Your Name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              Password
            </label>
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
            Create Account
          </button>
        </div>

        {/* Terms Notice */}
        <p className="text-center text-xs mt-8 leading-relaxed font-sans" style={{ opacity: 0.4 }}>
          By creating an account, you agree to our{' '}
          <a href="#" className="underline underline-offset-2">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
        </p>

        {/* Demo Notice */}
        <div 
          className="mt-8 p-4 rounded-lg text-center"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
          }}
        >
          <p className="text-sm leading-relaxed font-sans" style={{ opacity: 0.6 }}>
            This is a demo application. Your data will only be stored locally in your browser.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-12">
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

export default SignUpPage;