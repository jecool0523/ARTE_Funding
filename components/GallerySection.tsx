import React from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PROJECT_DATA } from '../constants';

const GallerySection = () => {
  return (
    <div className="mb-12">
      <ScrollReveal>
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-500">
            <ImageIcon size={18} />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Project Gallery</h2>
        </div>
      </ScrollReveal>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {PROJECT_DATA.gallery.map((item, index) => {
          // Dynamic classes for visual interest (Masonry-lite feel)
          const isLarge = item.size === 'large';
          const isTall = item.size === 'tall';
          
          return (
            <ScrollReveal key={item.id} delay={index * 100} className={`relative group rounded-2xl overflow-hidden shadow-sm dark:shadow-none bg-slate-200 dark:bg-white/5 ${isLarge ? 'col-span-2 aspect-[16/9]' : isTall ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}>
              <img 
                src={item.imageUrl} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay with Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                 <p className="text-white font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                   {item.caption}
                 </p>
              </div>

              {/* Zoom Icon Hint */}
              <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <ZoomIn size={14} />
              </div>
            </ScrollReveal>
          );
        })}
      </div>
      
      {/* Decorative caption below grid */}
      <div className="mt-3 text-center">
        <p className="text-[10px] text-slate-400 dark:text-gray-500 font-medium uppercase tracking-widest">
            Behind The Scenes
        </p>
      </div>
    </div>
  );
};

export default GallerySection;