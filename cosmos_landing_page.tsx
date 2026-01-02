import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  ShieldCheck, 
  PenTool, 
  MessageSquare, 
  Users, 
  Lock, 
  Smartphone, 
  Server, 
  Monitor 
} from 'lucide-react';

interface LandingPageProps {
  onContinue: () => void;
}

export function LandingPage({ onContinue }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['writers', 'thinkers', 'creators', 'students', 'learners'];

  // Handle Scroll Position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Word Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  // Handle "Reveal on Scroll" Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
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
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Crimson Pro', serif;
        }
        
        .fade-in {
          animation: fadeIn 1.2s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        .word-transition {
          animation: wordChange 2.5s ease-in-out infinite;
        }
        
        @keyframes wordChange {
          0%, 40% {
            opacity: 1;
            transform: translateY(0);
          }
          50%, 90% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .reveal-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .reveal-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .theme-toggle {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .theme-toggle:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'backdrop-blur-md' : ''}`}
        style={{ 
          background: scrollY > 50 
            ? isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'
            : 'transparent',
          borderBottom: scrollY > 50 ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-semibold text-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                B
              </div>
              <span className="font-serif text-lg tracking-wide">Blog Network</span>
            </div>

            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="theme-toggle text-sm opacity-60 hover:opacity-100 transition-opacity"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={onContinue}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isDark 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="fade-in text-sm uppercase tracking-widest mb-8 opacity-60" style={{ animationDelay: '0.2s' }}>
            Welcome
          </p>
          
          <h1 className="fade-in font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight" style={{ animationDelay: '0.4s' }}>
            A discovery engine for{' '}
            <span className="inline-block min-w-[200px] text-left">
              <span key={currentWord} className="word-transition inline-block">
                {words[currentWord]}
              </span>
            </span>
          </h1>

          <p className="fade-in text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-12 leading-relaxed" style={{ animationDelay: '0.6s', fontFamily: 'Inter, sans-serif' }}>
            Discover thoughtful writing from designers, technologists, and creatives. 
            Press continue to sign in and explore posts.
          </p>

          <div className="fade-in flex flex-col sm:flex-row gap-4 items-center justify-center" style={{ animationDelay: '0.8s' }}>
            <button
              onClick={onContinue}
              className={`px-8 py-4 rounded-full text-base font-medium transition-all ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Continue
            </button>
          </div>

          <div className="mt-24 fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Scroll to explore</p>
            <div className="w-px h-12 mx-auto opacity-20" style={{ background: isDark ? 'white' : 'black' }}></div>
          </div>
        </div>
      </section>

      {/* About Section - Built for Growth */}
      <section id="about" className="py-24 px-6" style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-up space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                Built for <span style={{ color: '#06b6d4' }}>Growth</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                01Blog provides a collaborative space where users can publish posts, interact with content, follow other learners, and engage in meaningful discussions.
              </p>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                It's more than a blogging platform — it's a space for students to document progress, exchange knowledge, and grow together through shared learning experiences.
              </p>
            </div>

            <div className="reveal-up rounded-2xl p-8 relative overflow-hidden group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ 
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <Layout className="w-6 h-6" style={{ color: '#06b6d4' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Modern Architecture</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                      Built as a full-stack web application combining a Java Spring Boot backend with a modern Angular frontend.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ 
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <ShieldCheck className="w-6 h-6" style={{ color: '#a855f7' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure & Scalable</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                      Demonstrates real-world concepts such as RESTful APIs, secure user authentication, and robust data persistence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6" style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-up">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Key Features</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>Everything you need to document your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="reveal-up rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6" style={{ color: '#06b6d4' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create & Share</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                Create, edit, and share rich blog posts about your technical discoveries.
              </p>
            </div>

            <div className="reveal-up rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" style={{ color: '#a855f7' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Discussions</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                Comment and interact with other users' content to foster deep learning.
              </p>
            </div>

            <div className="reveal-up rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Network</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                Follow other learners, build connections, and grow your professional circle.
              </p>
            </div>

            <div className="reveal-up rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" style={{ color: '#f97316' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Auth</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                Secure authentication and user management to keep your data safe.
              </p>
            </div>

            <div className="reveal-up rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 group" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" style={{ color: '#3b82f6' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fully Responsive</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>
                A seamless, user-friendly interface that works perfectly on mobile and desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="mb-16 reveal-up text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Under the Hood</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', opacity: 0.6 }}>Powered by industry-standard technologies.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal-up rounded-2xl p-8 border-l-4" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              borderLeftColor: '#f97316',
              borderLeftWidth: '4px'
            }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl font-semibold">Backend</h3>
                <Server style={{ color: '#f97316' }} />
              </div>
              <ul className="space-y-4">
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#f97316' }}></span>
                  Java
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#f97316' }}></span>
                  Spring Boot
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#f97316' }}></span>
                  REST APIs
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#f97316' }}></span>
                  MySQL / PostgreSQL
                </li>
              </ul>
            </div>

            <div className="reveal-up rounded-2xl p-8 border-l-4" style={{ 
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              borderLeftColor: '#ef4444',
              borderLeftWidth: '4px'
            }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl font-semibold">Frontend</h3>
                <Monitor style={{ color: '#ef4444' }} />
              </div>
              <ul className="space-y-4">
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#ef4444' }}></span>
                  Angular
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#3b82f6' }}></span>
                  TypeScript
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#eab308' }}></span>
                  HTML5 / CSS3
                </li>
                <li className="flex items-center" style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#ec4899' }}></span>
                  Responsive Design
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal-up space-y-8">
            <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight">
              Zero noise, notifications, or distractions
            </h2>
            <p className="text-xl opacity-70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              No likes, comments, or ego. Just pure, harmonious expression.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="reveal-up space-y-8">
            <h2 className="font-serif text-3xl md:text-5xl font-light">
              We welcome you to join us
            </h2>
            <p className="text-lg opacity-70" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start your journey
            </p>
            <button
              onClick={onContinue}
              className={`px-10 py-4 rounded-full text-lg font-medium transition-all ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-serif font-semibold text-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                B
              </div>
              <span className="font-serif tracking-wide">Blog Network</span>
            </div>

            <div className="flex gap-8">
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Manifesto
              </a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Terms
              </a>
            </div>

            <div className="text-sm opacity-40" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2024 Blog Network
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;