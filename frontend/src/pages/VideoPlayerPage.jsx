import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const VideoPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [media, setMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(138 * 60); // 2h 18m default in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [quality, setQuality] = useState('4K Ultra HD');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitles, setSelectedSubtitles] = useState('English [CC]');
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const res = await axios.get(`/api/media/${id}`);
        if (res.data.success) {
          setMedia(res.data.media);
        }
      } catch (err) {}
    };
    fetchMediaDetails();
  }, [id]);

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipSeconds = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (playerContainerRef.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const title = media ? media.title : 'SHADOW PROTOCOL';
  const videoSrc = media?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  const posterSrc = media?.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAUtBVURf3OiPqWnc0igR3hqnlSeYLEmavAL48oRf9aV2U5HrMREStnCnKHaQC-_T5-2EoROC1egCTVGWM5fBMGJfrwUOJyClRvukKK1yC9r5ZRA0Hcd73Oq5gt_1Ln0iL1IgfQ9_FBbY1BzBU8LdldvkjdoDeKgvdlmmbG_rPamhCbP_lWfiEEg81E4oE6D85CTtZaDSV6Fcr117RSdRqs6j9QWDPNHUlA4auqdjUDQu6l_yU4EfukQ';

  return (
    <div 
      ref={playerContainerRef}
      className="relative w-screen h-screen bg-[#131313] overflow-hidden select-none flex items-center justify-center"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Control Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-between p-6 pointer-events-none transition-opacity duration-300 ${
        controlsVisible ? 'opacity-100' : 'opacity-0'
      }`}>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 rounded-xl">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            title="Back to Catalog"
          >
            <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          </button>

          <div className="text-center">
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider">{title}</h2>
            <span className="text-xs text-[#E50914] font-bold uppercase tracking-widest">{quality}</span>
          </div>

          <button 
            onClick={() => showToast('Picture in Picture activated')}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            title="Picture in Picture"
          >
            <span className="material-symbols-outlined text-[24px]">picture_in_picture_alt</span>
          </button>
        </div>

        {/* Center Big Play Pause */}
        <div className="flex items-center justify-center gap-8 pointer-events-auto">
          <button 
            onClick={() => skipSeconds(-10)}
            className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-transform active:scale-95"
            title="Rewind 10 Seconds"
          >
            <span className="material-symbols-outlined text-[32px]">replay_10</span>
          </button>

          <button 
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-[48px] fill-1">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button 
            onClick={() => skipSeconds(10)}
            className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-transform active:scale-95"
            title="Forward 10 Seconds"
          >
            <span className="material-symbols-outlined text-[32px]">forward_10</span>
          </button>
        </div>

        {/* Bottom Control Bar */}
        <div className="pointer-events-auto bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 rounded-2xl space-y-3">
          
          {/* Progress Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#A3A3A3] w-14 text-right">
              {formatTime(currentTime)}
            </span>

            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
            />

            <span className="text-xs font-semibold text-[#A3A3A3] w-14">
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between text-white pt-1">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-[#E50914] transition-colors">
                <span className="material-symbols-outlined text-[28px] fill-1">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <div className="flex items-center gap-2 group">
                <button onClick={() => setIsMuted(!isMuted)}>
                  <span className="material-symbols-outlined text-[24px]">
                    {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1.5 bg-white/30 rounded appearance-none cursor-pointer accent-[#E50914]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Subtitles toggle */}
              <button 
                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                className="hover:text-[#E50914] transition-colors"
                title="Subtitles & Audio"
              >
                <span className="material-symbols-outlined text-[24px]">subtitles</span>
              </button>

              {showSubtitleMenu && (
                <div className="absolute bottom-12 right-24 bg-[#201f1f] border border-white/10 rounded-xl p-3 shadow-2xl space-y-2 text-xs w-48">
                  <p className="font-bold text-white border-b border-white/10 pb-1">Subtitles</p>
                  {['English [CC]', 'Hindi', 'Off'].map(sub => (
                    <button 
                      key={sub}
                      onClick={() => { setSelectedSubtitles(sub); setShowSubtitleMenu(false); showToast(`Subtitles: ${sub}`); }}
                      className={`w-full text-left py-1 px-2 rounded hover:bg-white/10 ${selectedSubtitles === sub ? 'text-[#E50914] font-bold' : 'text-[#A3A3A3]'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Speed selector */}
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded hover:bg-white/20 transition-colors"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-12 right-12 bg-[#201f1f] border border-white/10 rounded-xl p-3 shadow-2xl space-y-1 text-xs w-32">
                  <p className="font-bold text-white border-b border-white/10 pb-1">Speed</p>
                  {[0.5, 1.0, 1.25, 1.5, 2.0].map(s => (
                    <button 
                      key={s}
                      onClick={() => {
                        setPlaybackSpeed(s);
                        if (videoRef.current) videoRef.current.playbackRate = s;
                        setShowSpeedMenu(false);
                      }}
                      className={`w-full text-left py-1 px-2 rounded hover:bg-white/10 ${playbackSpeed === s ? 'text-[#E50914] font-bold' : 'text-[#A3A3A3]'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}

              {/* Fullscreen */}
              <button onClick={toggleFullScreen} className="hover:text-[#E50914] transition-colors">
                <span className="material-symbols-outlined text-[24px]">fullscreen</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
