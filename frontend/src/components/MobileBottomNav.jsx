import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Movies', path: '/movies', icon: 'movie' },
    { label: 'Series', path: '/series', icon: 'tv' },
    { label: 'My List', path: '/mylist', icon: 'bookmark' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#131313]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex justify-around items-center">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
              active ? 'text-[#e50914]' : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${active ? 'fill-1' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
