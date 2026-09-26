import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MediaCard } from '../components/MediaCard';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickSearchTags = ['Action', 'Sci-Fi', 'Crime', 'Originals', 'Dystopian', 'Cyberpunk', '4K'];

  useEffect(() => {
    const handleSearch = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/media/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setResults(res.data.results);
        }
      } catch (err) {}
      setIsLoading(false);
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-24 px-4 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Search Bar Input */}
      <div className="relative max-w-3xl mx-auto">
        <span className="material-symbols-outlined absolute left-4 top-4 text-[#A3A3A3] text-[24px]">search</span>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, genre, actor, director, or keyword..."
          className="w-full h-14 bg-[#201f1f] text-white text-base pl-12 pr-12 rounded-2xl border border-white/15 focus:border-[#E50914] focus:outline-none transition-colors shadow-2xl"
          autoFocus
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-4 text-[#A3A3A3] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Instant Tag Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        <span className="text-xs text-[#737373] font-semibold mr-2">Top Searches:</span>
        {quickSearchTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setQuery(tag)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              query.toLowerCase() === tag.toLowerCase() 
                ? 'bg-[#E50914] text-white font-bold' 
                : 'bg-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:bg-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">
          {query ? `Search Results for "${query}"` : 'Recommended Catalog'}
        </h2>
        <span className="text-xs text-[#A3A3A3]">{results.length} titles found</span>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((media) => (
            <MediaCard key={media.id || media._id} media={media} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 text-[#A3A3A3]">
          <span className="material-symbols-outlined text-[64px]">search_off</span>
          <h3 className="font-bebas text-2xl text-white">No exact matches found</h3>
          <p className="text-xs">Try searching for "Shadow Protocol", "Stranger Dimensions", or "Sci-Fi"</p>
        </div>
      )}
    </div>
  );
};
