import React from 'react';
import ScrollReveal from './ScrollReveal';
import SynopsisCard from './SynopsisCard';
import { PROJECT_DATA } from '../constants';
import ShareButton from './ShareButton';

const SynopsisSection = () => {
  return (
    <div className="mb-12 space-y-6">
        <ScrollReveal>
            <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple">
                        <span className="text-lg">🎬</span>
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Synopsis</h2>
                </div>
                {/* Share Button for Synopsis */}
                <ShareButton variant="text" label="Share Story" iconSize={14} />
            </div>
        </ScrollReveal>
        {PROJECT_DATA.synopsis.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 150}>
                <SynopsisCard item={item} index={idx} />
            </ScrollReveal>
        ))}
    </div>
  );
};

export default SynopsisSection;