import React from 'react';
import { Share2 } from 'lucide-react';
import { PROJECT_DATA } from '../constants';

interface ShareButtonProps {
  className?: string;
  iconSize?: number;
  label?: string; // If present, shows text next to icon
  variant?: 'circle' | 'pill' | 'text';
  shareData?: {
    title?: string;
    text?: string;
    url?: string;
  };
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  className = "", 
  iconSize = 18, 
  label,
  variant = 'circle',
  shareData: customShareData
}) => {
  
  const handleShare = async () => {
    const shareData = {
      title: customShareData?.title || PROJECT_DATA.share.title,
      text: customShareData?.text || PROJECT_DATA.share.text,
      url: customShareData?.url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  if (variant === 'circle') {
    return (
      <button 
        onClick={handleShare}
        className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all ${className}`}
        aria-label="Share this project"
      >
        <Share2 size={iconSize} />
      </button>
    );
  }

  if (variant === 'pill') {
    return (
        <button 
        onClick={handleShare}
        className={`flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all font-bold text-xs ${className}`}
      >
        <Share2 size={iconSize} />
        {label || 'Share'}
      </button>
    );
  }

  // Text variant
  return (
    <button 
        onClick={handleShare}
        className={`flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-gray-400 hover:text-brand-pink transition-colors ${className}`}
    >
        <Share2 size={iconSize} />
        {label || 'Share'}
    </button>
  );
};

export default ShareButton;