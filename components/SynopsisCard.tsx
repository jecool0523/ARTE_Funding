import React from 'react';
import { SynopsisItem } from '../types';

const SynopsisCard: React.FC<{ item: SynopsisItem; index: number }> = ({ item, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`group relative p-6 rounded-[2rem] border overflow-hidden mb-4 transition-all duration-300 hover:scale-[1.02] ${
        isEven 
        ? 'bg-white dark:bg-white text-slate-800 dark:text-brand-dark border-transparent shadow-xl dark:shadow-none' 
        : 'bg-slate-800 dark:bg-brand-surface text-white border-white/5'
    }`}>
      {/* Decorative Icon Background */}
      <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-500">
        <span className="text-9xl transform rotate-12 block">{item.icon}</span>
      </div>

      <div className="relative z-10 flex gap-4 items-start">
        <span className="text-4xl bg-gray-100/50 p-2 rounded-2xl backdrop-blur-sm">{item.icon}</span>
        <div>
          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
          <p className={`leading-relaxed text-sm ${isEven ? 'text-slate-600 dark:text-gray-600' : 'text-gray-300'}`}>
            {item.description.split(item.highlight || '').map((part, i, arr) => (
                <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                        <span className={`font-bold ${isEven ? 'text-brand-pink' : 'text-brand-purple'}`}>
                            {item.highlight}
                        </span>
                    )}
                </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SynopsisCard;