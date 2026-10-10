import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminPage = () => {
  const { showToast } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Delete confirmation modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Form State
  const initialForm = {
    title: '',
    type: 'movie',
    year: 2026,
    rating: 'TV-MA',
    duration: '2h 15m',
    category: 'Action',
    matchScore: '98% Match',
    badge: 'NEW',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: '',
    cast: '',
    tags: 'Action, Sci-Fi, Thriller',
    isOriginal: false,
    isTrending: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchMediaCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setCatalog(data.media);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
      showToast('Error loading media catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaCatalog();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      type: item.type || 'movie',
      year: item.year || 2026,
      rating: item.rating || 'TV-MA',
      duration: item.duration || '2h 00m',
      category: item.category || 'Action',
      matchScore: item.matchScore || '98% Match',
      badge: item.badge || 'NEW',
      description: item.description || '',
      bannerUrl: item.bannerUrl || '',
      posterUrl: item.posterUrl || '',
      videoUrl: item.videoUrl || '',
      director: item.director || '',
      cast: Array.isArray(item.cast) ? item.cast.join(', ') : (item.cast || ''),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      isOriginal: Boolean(item.isOriginal),
      isTrending: Boolean(item.isTrending)
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    try {
      const targetId = editingItem ? (editingItem.id || editingItem._id) : null;
      const url = targetId ? `/api/media/${targetId}` : '/api/media';
      const method = targetId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingItem ? 'Title updated successfully!' : 'New title added to catalog!');
        closeModal();
        fetchMediaCatalog();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server communication error', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Media title deleted from catalog');
        setDeleteConfirmId(null);
        fetchMediaCatalog();
      } else {
        showToast(data.message || 'Failed to delete title', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting item', 'error');
    }
  };

  // Filtered Media
  const filteredCatalog = catalog.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalTitles = catalog.length;
  const moviesCount = catalog.filter(m => m.type === 'movie').length;
  const seriesCount = catalog.filter(m => m.type === 'series').length;
  const trendingCount = catalog.filter(m => m.isTrending).length;

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-16 px-4 md:px-12 text-[#e5e2e1]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#E50914] text-3xl">admin_panel_settings</span>
              <h1 className="text-3xl font-black text-white tracking-wider uppercase">Content Management Studio</h1>
            </div>
            <p className="text-sm text-[#A3A3A3] mt-1">
              Add, update, or remove movies and TV series from the StreamFlix global catalog.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b81d24] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#E50914]/25 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add New Media Title
          </button>
        </div>

        {/* Catalog Metrics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1f1f1f]/80 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#E50914]">
              <span className="material-symbols-outlined">movie_filter</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">Total Titles</p>
              <p className="text-2xl font-bold text-white">{totalTitles}</p>
            </div>
          </div>

          <div className="bg-[#1f1f1f]/80 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">local_movies</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">Movies</p>
              <p className="text-2xl font-bold text-white">{moviesCount}</p>
            </div>
          </div>

          <div className="bg-[#1f1f1f]/80 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined">tv</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">TV Series</p>
              <p className="text-2xl font-bold text-white">{seriesCount}</p>
            </div>
          </div>

          <div className="bg-[#1f1f1f]/80 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">Trending Now</p>
              <p className="text-2xl font-bold text-white">{trendingCount}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1f1f1f] p-4 rounded-xl border border-white/5">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#A3A3A3] text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search title, category, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#131313] border border-white/10 rounded-lg text-sm text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#E50914] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#A3A3A3] font-semibold uppercase tracking-wider hidden sm:inline">Type:</span>
            {['all', 'movie', 'series'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterType === t
                    ? 'bg-[#E50914] text-white'
                    : 'bg-[#131313] text-[#A3A3A3] hover:text-white border border-white/10'
                }`}
              >
                {t === 'all' ? 'All Content' : t === 'movie' ? 'Movies' : 'TV Series'}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Content Table */}
        <div className="bg-[#1f1f1f] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-[#A3A3A3] flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
              <p>Loading media catalog...</p>
            </div>
          ) : filteredCatalog.length === 0 ? (
            <div className="p-12 text-center text-[#A3A3A3] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#A3A3A3]">movie_off</span>
              <p className="font-semibold text-white">No titles found in catalog</p>
              <p className="text-sm">Try clearing search filters or add a new media entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#e5e2e1]">
                <thead className="bg-[#131313] text-xs uppercase tracking-wider text-[#A3A3A3] border-b border-white/5">
                  <tr>
                    <th className="py-4 px-6">Media Poster</th>
                    <th className="py-4 px-6">Title & Info</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Rating & Match</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCatalog.map((item) => (
                    <tr key={item.id || item._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <img
                          src={item.posterUrl || item.bannerUrl}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded-md border border-white/10 shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </td>

                      <td className="py-3 px-6">
                        <div className="space-y-1">
                          <p className="font-bold text-white text-base flex items-center gap-2">
                            {item.title}
                            {item.isTrending && (
                              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                TRENDING
                              </span>
                            )}
                            {item.isOriginal && (
                              <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#E50914]/30">
                                ORIGINAL
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#A3A3A3] line-clamp-1 max-w-md">
                            {item.description || 'No description provided'}
                          </p>
                          <p className="text-[11px] text-[#A3A3A3]">
                            Release: <span className="text-white">{item.year}</span> • Duration: <span className="text-white">{item.duration}</span>
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                          item.type === 'movie'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {item.type === 'movie' ? 'movie' : 'tv'}
                          </span>
                          {item.type}
                        </span>
                      </td>

                      <td className="py-3 px-6">
                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-xs font-medium text-white">
                          {item.category || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3 px-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="border border-white/20 px-1.5 py-0.5 text-[11px] font-bold rounded text-white bg-black/40">
                            {item.rating || 'TV-MA'}
                          </span>
                          <span className="text-emerald-400 text-xs font-bold">
                            {item.matchScore || '98% Match'}
                          </span>
                        </div>
                        {item.badge && (
                          <p className="text-[11px] text-[#A3A3A3]">Badge: <span className="text-white font-semibold">{item.badge}</span></p>
                        )}
                      </td>

                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-white hover:text-[#E50914] hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit Media"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id || item._id)}
                            className="p-2 text-[#ffb4ab] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Media"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1f1f1f] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E50914]">
                  {editingItem ? 'edit_note' : 'movie_create'}
                </span>
                {editingItem ? 'Edit Media Entry' : 'Add New Media Title'}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#A3A3A3] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. INCEPTION PROTOCOL"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Media Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Category / Genre</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. Sci-Fi, Action, Thriller"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Age Rating</label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. TV-MA, PG-13, R"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Duration / Seasons</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. 2h 15m or 3 Seasons"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Match Score</label>
                  <input
                    type="text"
                    value={formData.matchScore}
                    onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. 98% Match"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. TOP 10, NEW, 4K ULTRA HD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Video Stream URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Director</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. Christopher Nolan"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Cast (comma separated)</label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                    placeholder="e.g. Actor 1, Actor 2, Actor 3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="e.g. Sci-Fi, Cyberpunk, High-Octane"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold mb-1">Synopsis / Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#131313] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  placeholder="Enter detailed plot synopsis..."
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 accent-[#E50914]"
                  />
                  <span>Feature in Trending Now</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isOriginal}
                    onChange={(e) => setFormData({ ...formData, isOriginal: e.target.checked })}
                    className="w-4 h-4 accent-[#E50914]"
                  />
                  <span>Mark as StreamFlix Original</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E50914] hover:bg-[#b81d24] text-white font-bold transition-all shadow-lg shadow-[#E50914]/20"
                >
                  {editingItem ? 'Save Changes' : 'Publish Title'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f1f1f] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-lg font-bold text-white">Delete Media Title</h3>
            </div>
            <p className="text-sm text-[#A3A3A3]">
              Are you sure you want to permanently delete this media title from the catalog? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/25"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
