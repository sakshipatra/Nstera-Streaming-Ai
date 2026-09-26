import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MediaCard } from '../components/MediaCard';

export const MyListPage = () => {
  const { watchlistIds } = useAuth();
  const [savedMedia, setSavedMedia] = useState([]);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get('/api/media');
        if (res.data.success) {
          const filtered = res.data.media.filter(m => watchlistIds.includes(m.id || m._id));
          setSavedMedia(filtered);
        }
      } catch (err) {}
    };
    fetchWatchlist();
  }, [watchlistIds]);

  const displayedMedia = filterType === 'All'
    ? savedMedia
    : savedMedia.filter(m => m.type.toLowerCase() === filterType.toLowerCase() || m.category.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-24 px-4 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider">My Saved Watchlist</h1>
          <p className="text-sm text-[#A3A3A3]">Your personalized queue of movies, series, and upcoming releases.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['All', 'Movies', 'Series'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterType === type ? 'bg-[#E50914] text-white font-bold' : 'bg-[#2A2A2A] text-[#A3A3A3] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty state */}
      {displayedMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedMedia.map((media) => (
            <MediaCard key={media.id || media._id} media={media} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <span className="material-symbols-outlined text-[64px] text-[#A3A3A3]">bookmark_border</span>
          <h3 className="font-bebas text-3xl text-white">Your List is Currently Empty</h3>
          <p className="text-sm text-[#A3A3A3] max-w-md mx-auto">
            Browse our movies and series catalog, hover over any poster and click the + button to save titles for later.
          </p>
        </div>
      )}
    </div>
  );
};
