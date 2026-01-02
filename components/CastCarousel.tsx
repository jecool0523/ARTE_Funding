import React from 'react';
import { PROJECT_DATA } from '../constants';

const CastCarousel = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-pink/20 text-brand-pink">
            <span className="text-lg">🎭</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Starring Cats</h2>
        </div>
        <button className="text-xs font-bold text-slate-400 dark:text-gray-400 hover:text-brand-pink transition-colors">See All</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
        {PROJECT_DATA.cast.map((member) => (
          <div 
            key={member.id} 
            className="snap-center relative shrink-0 w-32 bg-white dark:bg-brand-surface p-3 pt-8 pb-4 rounded-3xl border border-slate-100 dark:border-white/5 mt-6 flex flex-col items-center hover:bg-slate-50 dark:hover:bg-brand-surface/80 transition-colors shadow-sm dark:shadow-none"
          >
            <div className="absolute -top-6 w-16 h-16 rounded-full p-1 bg-white dark:bg-brand-surface shadow-sm transition-colors">
              <img 
                src={member.imageUrl} 
                alt={member.name} 
                className="w-full h-full rounded-full object-cover border-2 border-brand-pink/30"
              />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-2 transition-colors">{member.name}</p>
            <p className="text-[10px] uppercase font-bold text-brand-pink mb-2">{member.role}</p>
            <div className="w-full h-px bg-slate-100 dark:bg-white/10 mb-2 transition-colors"></div>
            <p className="text-xs text-slate-500 dark:text-gray-400 transition-colors">{member.actorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastCarousel;