import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MediaCard } from '../components/MediaCard';

export const HomePage = () => {
  const navigate = useNavigate();
  const { setSelectedMediaModal, toggleWatchlist, watchlistIds } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get('/api/media');
        if (res.data.success) {
          setMediaList(res.data.media);
          const shadowProtocol = res.data.media.find(m => m.id === 'm1') || res.data.media[0];
          setFeatured(shadowProtocol);
        }
      } catch (err) {
        // Fallback static items
      }
    };
    fetchMedia();
  }, []);

  const categories = ['All', 'Action', 'Sci-Fi', 'Crime', 'Series', 'Movies'];

  const filteredList = selectedCategory === 'All'
    ? mediaList
    : mediaList.filter(m => 
        m.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        m.type?.toLowerCase() === selectedCategory.toLowerCase() ||
        m.tags?.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
      );

  const isSaved = featured && watchlistIds.includes(featured.id || featured._id);

  return (
    <div className="min-h-screen bg-[#131313] pb-24 text-white">
      {/* Hero Billboard Section */}
      {featured && (
        <div className="relative w-full h-[75vh] sm:h-[85vh] bg-black overflow-hidden select-none">
          <img 
            src={featured.bannerUrl} 
            alt={featured.title} 
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Ambient Gradients & Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent w-full md:w-2/3"></div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-12 sm:bottom-20 left-4 sm:left-12 right-4 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {featured.badge || 'STREAMFLIX ORIGINAL'}
              </span>
              <span className="text-xs text-[#A3A3A3] font-semibold">{featured.rating}</span>
            </div>

            <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-wider text-white drop-shadow-2xl">
              {featured.title}
            </h1>

            <p className="text-sm sm:text-base text-[#e5e2e1] line-clamp-3 leading-relaxed drop-shadow">
              {featured.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={() => navigate(`/player/${featured.id || featured._id}`)}
                className="bg-white hover:bg-white/80 text-black px-6 sm:px-8 py-3 rounded-lg font-bold flex items-center gap-2 text-base shadow-xl transition-all active:scale-95"
              >
                <span className="material-symbols-outlined fill-1 text-[24px]">play_arrow</span>
                Play
              </button>

              <button 
                onClick={() => toggleWatchlist(featured.id || featured._id)}
                className="bg-[#454747]/70 hover:bg-[#454747] text-white px-5 sm:px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-base backdrop-blur transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isSaved ? 'check' : 'add'}
                </span>
                {isSaved ? 'Saved' : 'My List'}
              </button>

              <button 
                onClick={() => setSelectedMediaModal(featured)}
                className="w-12 h-12 rounded-full bg-[#454747]/70 hover:bg-[#454747] text-white flex items-center justify-center backdrop-blur transition-all"
                title="More Info"
              >
                <span className="material-symbols-outlined text-[24px]">info</span>
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center backdrop-blur transition-all ml-auto hidden sm:flex"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto space-y-10 pt-4">
        
        {/* Category Filter Chips */}
        <div className="sticky top-16 z-30 bg-[#131313]/95 backdrop-blur-md py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow'
                  : 'bg-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending Rail */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">Trending Now</h2>
            <span className="text-xs text-[#E50914] font-bold hover:underline cursor-pointer">See All</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
            {filteredList.map((media) => (
              <MediaCard key={media.id || media._id} media={media} />
            ))}
          </div>
        </section>

        {/* Top 10 Movies & Shows Today */}
        <section className="space-y-4">
          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2">
            Top 10 Today
            <span className="text-xs text-[#E50914] font-bold bg-[#E50914]/10 px-2 py-0.5 rounded border border-[#E50914]/30">GLOBAL</span>
          </h2>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
            {mediaList.slice(0, 5).map((media, idx) => (
              <div key={media.id || media._id} className="relative flex-none flex items-center">
                <span className="font-bebas text-7xl sm:text-9xl font-black text-stroke text-[#201f1f] drop-shadow-lg -mr-6 sm:-mr-8 z-10 select-none">
                  {idx + 1}
                </span>
                <MediaCard media={media} />
              </div>
            ))}
          </div>
        </section>

        {/* Sci-Fi & Action Category Row */}
        <section className="space-y-4">
          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">Sci-Fi & Action Blockbusters</h2>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
            {mediaList.filter(m => m.category === 'Sci-Fi' || m.category === 'Action').map((media) => (
              <MediaCard key={media.id || media._id} media={media} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
