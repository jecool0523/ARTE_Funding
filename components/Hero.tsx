import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, ArrowLeft, Sun, Moon } from 'lucide-react';
import { PROJECT_DATA } from '../constants';
import ShareButton from './ShareButton';

interface HeroProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Hero: React.FC<HeroProps> = ({ isDark, toggleTheme }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync mute state with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video playback error:", e.currentTarget.error, "Source:", e.currentTarget.src);
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-black">
      {/* Video Player */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={PROJECT_DATA.hero.videoUrl}
          poster={PROJECT_DATA.hero.mediaUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted} // React prop for initial render
          playsInline // Essential for iOS inline playback
          onError={handleVideoError}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-50 dark:to-brand-dark transition-colors duration-300"></div>
      </div>

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-8 flex justify-between items-center z-20">
        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex gap-3">
            <button 
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all"
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <ShareButton variant="circle" />
        </div>
      </div>

      {/* Badges & Info */}
      <div className="absolute top-24 left-6 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white text-xs font-bold tracking-wide uppercase">{PROJECT_DATA.hero.badge}</span>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-16 left-0 right-0 px-6 z-20 flex flex-col gap-3">
        <div className="flex justify-between items-end text-white/90">
            <span className="text-xs font-medium tracking-wider text-slate-700 dark:text-white/90 transition-colors drop-shadow-md">HIGHLIGHT REEL</span>
            <div className="flex gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
                  <Maximize2 size={24} />
                </button>
            </div>
        </div>
        
        {/* Progress Bar (Visual only for highlight reel) */}
        <div className="h-1.5 w-full bg-slate-200/30 dark:bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-brand-pink w-[35%] rounded-full relative animate-pulse">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-100"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;