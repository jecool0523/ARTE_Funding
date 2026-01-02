import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface StickyFooterProps {
  onFundClick?: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ onFundClick }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-6 py-4 pb-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-colors duration-300">
      <div className="flex items-center gap-4 max-w-md mx-auto w-full">
        <button className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-brand-surface text-brand-pink hover:text-white hover:bg-brand-pink transition-all shrink-0 border border-slate-200 dark:border-white/10">
          <Heart className="fill-current" size={24} />
        </button>
        <button 
          onClick={onFundClick}
          className="flex-1 h-14 bg-gradient-to-r from-brand-pink to-brand-darkPink hover:brightness-110 text-white font-bold text-lg rounded-full shadow-lg shadow-brand-pink/30 flex items-center justify-center transition-transform active:scale-95"
        >
          <Sparkles className="mr-2" size={20} />
          Fund This Project
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;