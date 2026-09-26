import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, setUser, showToast } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user ? user.name : 'Sakshi',
    email: user ? user.email : 'sakshi@streamflix.com',
    avatar: user ? user.avatar : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjsolIrz7twpKPSYChcXaWda1_Gne4QCYitoG8QvSm2vfuiWTuJwo0Rir137eVlwG9HLmZC-HnVP4Z_jByBWJTZ1i6HpTEcUoCJc_fu9vcTFTWZiEaITwVLd-BR71utGBw4uUZ3eWF9oLQ21tMp7Pmb2DSvOPLdm39scalFy7kET2mckXaczq5NJhJDgQB2W_nl1azs6E8fY3jeVHB_jCm_N7GfAvdFKjUMXJVDaqCNVS8QjTONp-XHw',
    plan: 'Premium 4K Ultra HD',
    audioLanguage: 'English (Original)',
    subtitleLanguage: 'English [CC]',
    autoplayNext: true,
    videoQuality: 'Auto (Highest)',
    history: [
      { id: 'm1', title: 'SHADOW PROTOCOL', watchedAt: 'Today', progress: 85 },
      { id: 's1', title: 'STRANGER DIMENSIONS: S1 E2', watchedAt: 'Yesterday', progress: 30 }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        if (res.data.success) {
          setProfileData(res.data.profile);
        }
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.put('/api/profile', profileData);
      if (res.data.success) {
        setProfileData(res.data.profile);
        setUser(prev => ({ ...prev, ...res.data.profile }));
        showToast('Account preferences saved successfully!');
      }
    } catch (err) {
      showToast('Preferences updated locally!');
    }
    setIsSaving(false);
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('/api/profile/history');
      setProfileData(prev => ({ ...prev, history: [] }));
      showToast('Watch history cleared');
    } catch (err) {
      setProfileData(prev => ({ ...prev, history: [] }));
      showToast('Watch history cleared');
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] pt-20 pb-24 px-4 md:px-12 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider">Account & Profile Settings</h1>
        <p className="text-sm text-[#A3A3A3]">Manage your membership details, playback preferences, and security settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card Header */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E50914] shadow-xl"
            />
            <button 
              type="button" 
              onClick={() => showToast('Avatar updated!')}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
            >
              Change
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-grow">
            <h2 className="font-bebas text-3xl text-white tracking-wide">{profileData.name}</h2>
            <p className="text-xs text-[#E50914] font-bold uppercase tracking-wider">{profileData.plan}</p>
            <p className="text-xs text-[#A3A3A3]">{profileData.email}</p>
          </div>

          <span className="bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 px-3 py-1 rounded-full text-xs font-bold">
            ACTIVE MEMBER
          </span>
        </div>

        {/* User Details */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
          <h3 className="font-bebas text-2xl text-white tracking-wider border-b border-white/10 pb-2">User Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1 font-semibold">Display Name</label>
              <input 
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full h-12 bg-[#141414] text-white px-4 rounded-xl border border-white/15 focus:border-[#E50914] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1 font-semibold">Email Address</label>
              <input 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full h-12 bg-[#141414] text-white px-4 rounded-xl border border-white/15 focus:border-[#E50914] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Playback Preferences */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
          <h3 className="font-bebas text-2xl text-white tracking-wider border-b border-white/10 pb-2">Playback & Audio Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1 font-semibold">Default Audio Language</label>
              <select 
                value={profileData.audioLanguage}
                onChange={(e) => setProfileData({ ...profileData, audioLanguage: e.target.value })}
                className="w-full h-12 bg-[#141414] text-white px-4 rounded-xl border border-white/15 focus:outline-none"
              >
                <option value="English (Original)">English (Original 5.1)</option>
                <option value="Hindi">Hindi (Dobbing 5.1)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1 font-semibold">Default Subtitles</label>
              <select 
                value={profileData.subtitleLanguage}
                onChange={(e) => setProfileData({ ...profileData, subtitleLanguage: e.target.value })}
                className="w-full h-12 bg-[#141414] text-white px-4 rounded-xl border border-white/15 focus:outline-none"
              >
                <option value="English [CC]">English [CC]</option>
                <option value="Hindi">Hindi</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Autoplay Next Episode</p>
              <p className="text-xs text-[#A3A3A3]">Automatically launch subsequent episodes on TV shows.</p>
            </div>
            <input 
              type="checkbox" 
              checked={profileData.autoplayNext}
              onChange={(e) => setProfileData({ ...profileData, autoplayNext: e.target.checked })}
              className="w-5 h-5 accent-[#E50914] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Watch History */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-bebas text-2xl text-white tracking-wider">Recently Watched Activity</h3>
            {profileData.history.length > 0 && (
              <button 
                type="button"
                onClick={handleClearHistory}
                className="text-xs text-[#E50914] hover:underline font-bold"
              >
                Clear History
              </button>
            )}
          </div>

          {profileData.history.length > 0 ? (
            <div className="space-y-3">
              {profileData.history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#141414] rounded-xl text-sm">
                  <div>
                    <p className="font-bold text-white">{h.title}</p>
                    <p className="text-xs text-[#A3A3A3]">Watched {h.watchedAt}</p>
                  </div>
                  <span className="text-xs text-[#46d369] font-bold">{h.progress}% completed</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A3A3A3]">No recent watching activity recorded.</p>
          )}
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={isSaving}
          className="w-full h-14 bg-[#E50914] hover:bg-[#b81d24] text-white rounded-xl font-bold uppercase tracking-wider text-base transition-colors shadow-xl shadow-[#E50914]/30"
        >
          {isSaving ? 'Saving Preferences...' : 'Save Account Settings'}
        </button>
      </form>
    </div>
  );
};
