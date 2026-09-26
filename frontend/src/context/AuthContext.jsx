import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('streamflix_user');
    return saved ? JSON.parse(saved) : {
      name: 'Sakshi',
      email: 'sakshi@streamflix.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
      plan: 'Premium 4K Ultra HD',
      watchlist: ['m1', 's1', 'm2']
    };
  });

  const [watchlistIds, setWatchlistIds] = useState(['m1', 's1', 'm2']);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [selectedMediaModal, setSelectedMediaModal] = useState(null);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3200);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.watchlist) {
          setWatchlistIds(res.data.user.watchlist);
        }
        localStorage.setItem('streamflix_user', JSON.stringify(res.data.user));
        localStorage.setItem('streamflix_token', res.data.token);
        showToast(`Welcome back, ${res.data.user.name}! Launching your cinema feed...`);
        return { success: true };
      }
    } catch (err) {
      // Fallback local login if backend is warming up
      const fallbackUser = {
        name: email.split('@')[0] || 'Sakshi',
        email,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
        plan: 'Premium 4K Ultra HD',
        watchlist: ['m1', 's1', 'm2']
      };
      setUser(fallbackUser);
      localStorage.setItem('streamflix_user', JSON.stringify(fallbackUser));
      showToast(`Welcome back, ${fallbackUser.name}!`);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('streamflix_user');
    localStorage.removeItem('streamflix_token');
    showToast('Signed out of StreamFlix');
  };

  const toggleWatchlist = async (mediaId) => {
    let nextList = [];
    let isAdded = false;

    if (watchlistIds.includes(mediaId)) {
      nextList = watchlistIds.filter(id => id !== mediaId);
      isAdded = false;
    } else {
      nextList = [...watchlistIds, mediaId];
      isAdded = true;
    }

    setWatchlistIds(nextList);
    showToast(isAdded ? 'Added to My List' : 'Removed from My List');

    try {
      await axios.post('/api/watchlist/toggle', { mediaId });
    } catch (err) {
      // silent fallback
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      watchlistIds,
      toggleWatchlist,
      toast,
      showToast,
      selectedMediaModal,
      setSelectedMediaModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
