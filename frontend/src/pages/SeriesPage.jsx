import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MediaCard } from '../components/MediaCard';

export const SeriesPage = () => {
  const navigate = useNavigate();
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axios.get('/api/media');
        if (res.data.success) {
          const onlySeries = res.data.media.filter(m => m.type === 'series');
          setSeriesList(onlySeries);
          if (onlySeries.length > 0) setSelectedSeries(onlySeries[0]);
        }
      } catch (err) {}
    };
    fetchSeries();
  }, []);

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-24 px-4 md:px-12 max-w-7xl mx-auto space-y-10">
      {/* Featured TV Show Hero Banner */}
      {selectedSeries && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[16/9] sm:aspect-[21/9] border border-white/10 shadow-2xl">
          <img 
            src={selectedSeries.bannerUrl} 
            alt={selectedSeries.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <span className="bg-[#E50914] text-white text-xs font-bold px-2.5 py-1 rounded">STREAMFLIX ORIGINAL SERIES</span>
            <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider">{selectedSeries.title}</h1>
            <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-xl line-clamp-2">{selectedSeries.description}</p>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => navigate(`/player/${selectedSeries.id || selectedSeries._id}`)}
                className="bg-white hover:bg-white/80 text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow-md"
              >
                <span className="material-symbols-outlined fill-1 text-[20px]">play_arrow</span>
                Watch S1:E1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Episodes List Section */}
      {selectedSeries && selectedSeries.episodes && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">Episodes</h2>
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-[#201f1f] text-white text-sm font-semibold px-4 py-1.5 rounded-lg border border-white/15 focus:outline-none"
            >
              <option value={1}>Season 1 ({selectedSeries.episodes.length} Episodes)</option>
              <option value={2}>Season 2 (Coming Soon)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSeries.episodes.map((ep) => (
              <div 
                key={ep.id}
                onClick={() => navigate(`/player/${selectedSeries.id || selectedSeries._id}`)}
                className="bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-xl overflow-hidden cursor-pointer transition-all border border-white/5 hover:border-white/20 group"
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white fill-1 text-[36px]">play_arrow</span>
                  </div>
                  {/* Progress bar */}
                  {ep.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                      <div className="h-full bg-[#E50914]" style={{ width: `${ep.progress}%` }}></div>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <h4 className="font-bold text-white">{ep.title}</h4>
                    <span className="text-xs text-[#A3A3A3]">{ep.duration}</span>
                  </div>
                  <p className="text-xs text-[#A3A3A3] line-clamp-2">{ep.synopsis}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Binge-Worthy Series */}
      <section className="space-y-4">
        <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">All TV Shows</h2>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
          {seriesList.map((series) => (
            <MediaCard key={series.id || series._id} media={series} />
          ))}
        </div>
      </section>
    </div>
  );
};
