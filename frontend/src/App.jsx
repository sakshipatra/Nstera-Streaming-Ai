import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';
import { MovieDetailsModal } from './components/MovieDetailsModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { MyListPage } from './pages/MyListPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';

const AppLayout = () => {
  const location = useLocation();
  const hideNavs = location.pathname.startsWith('/player') || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      {!hideNavs && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/mylist" element={<MyListPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/player/:id" element={<VideoPlayerPage />} />
      </Routes>

      {!hideNavs && <MobileBottomNav />}
      <Toast />
      <MovieDetailsModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
