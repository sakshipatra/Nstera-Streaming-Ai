import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MovieDetailsModal = () => {
  const { selectedMediaModal, setSelectedMediaModal, watchlistIds, toggleWatchlist } = useAuth();
  const navigate = useNavigate();

  if (!selectedMediaModal) return null;

  const media = selectedMediaModal;
  const isSaved = watchlistIds.includes(media.id || media._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#141414] rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={() => setSelectedMediaModal(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Hero Preview Banner */}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <img 
            src={media.bannerUrl || media.posterUrl} 
            alt={media.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30"></div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wider">{media.title}</h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#A3A3A3] mt-1">
                <span className="text-[#46d369] font-bold">{media.matchScore}</span>
                <span>{media.year}</span>
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-white">{media.rating}</span>
                <span>{media.duration}</span>
                <span className="bg-[#E50914] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">4K Ultra HD</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setSelectedMediaModal(null); navigate(`/player/${media.id || media._id}`); }}
                className="bg-white hover:bg-white/80 text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg transition-colors"
              >
                <span className="material-symbols-outlined fill-1 text-[20px]">play_arrow</span>
                Play
              </button>

              <button 
                onClick={() => toggleWatchlist(media.id || media._id)}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                  isSaved ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-[#2A2A2A] border-white/30 text-white hover:bg-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isSaved ? 'check' : 'add'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Synopsis & Metadata Body */}
        <div className="p-6 space-y-6 text-[#e5e2e1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm sm:text-base leading-relaxed text-[#e5e2e1]">
                {media.description || 'An intense prestige cinematic journey through suspense, action, and unyielding drama.'}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {media.tags && media.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#2A2A2A] text-[#A3A3A3] text-xs px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#A3A3A3] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[#737373] block">Cast:</span>
                <span className="text-white font-medium">{media.cast ? media.cast.join(', ') : 'Elena Rostova, Marcus Vance'}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Director:</span>
                <span className="text-white font-medium">{media.director || 'Denis Villeneuve'}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Audio Specs:</span>
                <span className="text-white font-medium">Dolby Atmos 5.1, Spatial Audio</span>
              </div>
            </div>
          </div>

          {/* Episodes section if TV Series */}
          {media.episodes && media.episodes.length > 0 && (
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bebas text-2xl text-white tracking-wider">Episodes</h3>
                <span className="text-xs text-[#A3A3A3]">Season 1</span>
              </div>

              <div className="space-y-3">
                {media.episodes.map((ep) => (
                  <div 
                    key={ep.id || ep.number}
                    onClick={() => { setSelectedMediaModal(null); navigate(`/player/${media.id || media._id}`); }}
                    className="flex items-center gap-4 p-3 bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden flex-none bg-black">
                      <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white fill-1 text-[24px]">play_arrow</span>
                      </div>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between text-sm">
                        <h4 className="font-bold text-white truncate">{ep.title}</h4>
                        <span className="text-xs text-[#A3A3A3] flex-none ml-2">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-[#A3A3A3] line-clamp-2 mt-1">{ep.synopsis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
