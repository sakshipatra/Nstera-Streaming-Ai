import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 shadow-xl' : 'bg-gradient-to-b from-[#131313]/95 to-transparent'
    }`}>
      <div className="h-16 px-4 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            {/* SVG Brand Logo matching streamflix_brand_logo */}
            <svg className="h-8 w-auto drop-shadow-[0_2px_12px_rgba(229,9,20,0.5)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 44" fill="none">
              <path d="M12 4L12 40L20 40L20 20L34 40L42 40L42 4L34 4L34 24L20 4L12 4Z" fill="#E50914"/>
              <text x="48" y="32" fill="#E50914" fontFamily="'Bebas Neue', Arial, sans-serif" fontWeight="900" fontSize="28" letterSpacing="4">STREAMFLIX</text>
            </svg>
          </Link>

          {/* Nav Links for Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`transition-colors hover:text-white ${isActive('/') ? 'text-white font-bold text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-[#A3A3A3]'}`}>
              Home
            </Link>
            <Link to="/movies" className={`transition-colors hover:text-white ${isActive('/movies') ? 'text-white font-bold text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-[#A3A3A3]'}`}>
              Movies
            </Link>
            <Link to="/series" className={`transition-colors hover:text-white ${isActive('/series') ? 'text-white font-bold text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-[#A3A3A3]'}`}>
              TV Series
            </Link>
            <Link to="/mylist" className={`transition-colors hover:text-white ${isActive('/mylist') ? 'text-white font-bold text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-[#A3A3A3]'}`}>
              My List
            </Link>
            <Link to="/admin" className={`transition-colors hover:text-white flex items-center gap-1 ${isActive('/admin') ? 'text-white font-bold text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-[#A3A3A3]'}`}>
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Admin
            </Link>
          </nav>
        </div>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => showToast('Casting to living room device...')}
            aria-label="Cast to screen" 
            className="w-10 h-10 flex items-center justify-center text-[#e5e2e1] hover:text-[#e50914] transition-colors rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[22px]">cast</span>
          </button>

          <Link 
            to="/search" 
            aria-label="Search catalog" 
            className={`w-10 h-10 flex items-center justify-center transition-colors rounded-full hover:bg-white/5 ${
              isActive('/search') ? 'text-[#e50914]' : 'text-[#e5e2e1] hover:text-[#e50914]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#e50914] transition-all"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
              </button>

              {menuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#201f1f] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-sm"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#A3A3A3] truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-[#e50914]/20 hover:text-[#e50914] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    Admin Studio
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-[#e50914]/20 hover:text-[#e50914] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    Account & Profile
                  </Link>
                  <button 
                    onClick={() => { setMenuOpen(false); logout(); navigate('/login'); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-[#ffb4ab] hover:bg-red-500/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-[#e50914] hover:bg-[#b81d24] text-white px-4 py-1.5 rounded-lg text-sm font-semibold tracking-wider transition-colors shadow-md shadow-[#e50914]/30"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
