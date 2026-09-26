import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MediaCard } from '../components/MediaCard';

export const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('/api/media');
        if (res.data.success) {
          const onlyMovies = res.data.media.filter(m => m.type === 'movie');
          setMovies(onlyMovies);
        }
      } catch (err) {}
    };
    fetchMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Crime', 'Thriller', 'Drama'];

  const filteredMovies = selectedGenre === 'All'
    ? movies
    : movies.filter(m => m.category?.toLowerCase() === selectedGenre.toLowerCase() || m.tags?.some(t => t.toLowerCase() === selectedGenre.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-24 px-4 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider">Movies Catalog</h1>
          <p className="text-sm text-[#A3A3A3]">Explore prestige blockbuster cinema, award-winning dramas, and action thrillers.</p>
        </div>

        {/* Genre Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g ? 'bg-[#E50914] text-white font-bold' : 'bg-[#2A2A2A] text-[#A3A3A3] hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Movies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMovies.map((movie) => (
          <MediaCard key={movie.id || movie._id} media={movie} />
        ))}
      </div>
    </div>
  );
};
