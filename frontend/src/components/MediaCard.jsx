import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MediaCard = ({ media }) => {
  const navigate = useNavigate();
  const { watchlistIds, toggleWatchlist, setSelectedMediaModal } = useAuth();

  const isSaved = watchlistIds.includes(media.id || media._id);

  return (
    <div className="group relative flex-none w-44 sm:w-56 md:w-64 rounded-lg overflow-hidden bg-[#1F1F1F] transition-all duration-300 transform hover:scale-105 hover:z-30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.85)] border border-white/5 hover:border-white/20">
      {/* Media Image */}
      <div className="relative aspect-[16/9] sm:aspect-[2/3] w-full overflow-hidden bg-[#141414]">
        <img 
          src={media.posterUrl || media.bannerUrl} 
          alt={media.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />

        {/* Badge Tag */}
        {media.badge && (
          <span className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
            {media.badge}
          </span>
        )}

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
          <h4 className="font-bebas text-lg sm:text-xl text-white tracking-wider line-clamp-1">{media.title}</h4>
          
          <div className="flex items-center gap-2 my-1 text-[11px] text-[#A3A3A3]">
            <span className="text-[#46d369] font-bold">{media.matchScore || '98% Match'}</span>
            <span className="border border-white/30 px-1 rounded text-[10px] text-white">{media.rating}</span>
            <span>{media.duration}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/player/${media.id || media._id}`); }}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/80 transition-colors shadow-md"
              title="Play Now"
            >
              <span className="material-symbols-outlined text-[20px] fill-1">play_arrow</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); toggleWatchlist(media.id || media._id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                isSaved ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-[#2A2A2A]/80 border-white/30 text-white hover:bg-white/20'
              }`}
              title={isSaved ? 'Remove from My List' : 'Add to My List'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSaved ? 'check' : 'add'}
              </span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedMediaModal(media); }}
              className="w-8 h-8 rounded-full bg-[#2A2A2A]/80 border border-white/30 text-white flex items-center justify-center hover:bg-white/20 transition-colors ml-auto"
              title="More Details"
            >
              <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
          </div>
        </div>
      </div>

      {/* Static Footer Title below card on small screens */}
      <div className="p-2 sm:p-3 bg-[#1F1F1F]">
        <p className="font-bebas text-sm sm:text-base text-white tracking-wide truncate">{media.title}</p>
        <div className="flex items-center justify-between text-[11px] text-[#A3A3A3] mt-0.5">
          <span>{media.year}</span>
          <span className="text-[#46d369] font-medium">{media.matchScore}</span>
        </div>
      </div>
    </div>
  );
};
