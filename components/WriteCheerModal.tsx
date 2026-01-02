import React, { useState } from 'react';
import { X, Send, User, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Cheer } from '../types';

interface WriteCheerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheerSuccess?: (cheer: Cheer) => void;
}

// Random gradients for avatars
const AVATAR_GRADIENTS = [
  { from: 'from-pink-400', to: 'to-rose-500' },
  { from: 'from-purple-400', to: 'to-indigo-500' },
  { from: 'from-blue-400', to: 'to-cyan-500' },
  { from: 'from-green-400', to: 'to-emerald-500' },
  { from: 'from-yellow-400', to: 'to-orange-500' },
  { from: 'from-teal-400', to: 'to-blue-500' },
];

const WriteCheerModal: React.FC<WriteCheerModalProps> = ({ isOpen, onClose, onCheerSuccess }) => {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // Pick random color
    const randomColor = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
    // Generate initials (first 2 chars)
    const initials = author.substring(0, 2).toUpperCase();

    try {
      const { data, error } = await supabase
        .from('cheers')
        .insert([
          {
            author: author.trim(),
            message: message.trim(),
            initials: initials,
            color_from: randomColor.from,
            color_to: randomColor.to
          }
        ])
        .select();

      if (error) throw error;

      // Reset & Close
      setAuthor('');
      setMessage('');
      onClose();

    } catch (error: any) {
      console.warn('Supabase insert failed (likely missing table). Using local fallback.', error.message);
      
      // FALLBACK for Demo Mode:
      // If DB fails, create the object locally and update parent
      if (onCheerSuccess) {
          const mockCheer: Cheer = {
              id: Date.now(), // Temporary ID
              created_at: new Date().toISOString(),
              author: author.trim(),
              message: message.trim(),
              initials: initials,
              color_from: randomColor.from,
              color_to: randomColor.to
          };
          onCheerSuccess(mockCheer);
      }
      
      setAuthor('');
      setMessage('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-brand-surface rounded-3xl shadow-2xl overflow-hidden animate-float-up pointer-events-auto border border-white/20">
        
        {/* Header */}
        <div className="bg-brand-pink/10 p-6 pb-4 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">📣</span> Leave a Cheer
             </h2>
             <p className="text-slate-500 dark:text-gray-400 text-xs font-medium pl-1">Support the cast & crew!</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/50 dark:bg-black/20 rounded-full hover:bg-white dark:hover:bg-black/40 transition-colors">
            <X size={20} className="text-slate-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Your Name</label>
            <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400">
                    <User size={18} />
                </div>
                <input 
                    type="text" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={10}
                    className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white font-bold placeholder:font-normal focus:outline-none focus:border-brand-pink transition-colors"
                    required
                />
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Message</label>
            <div className="relative">
                <div className="absolute top-4 left-3 text-slate-400">
                    <MessageSquare size={18} />
                </div>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a warm cheering message..."
                    maxLength={100}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white font-medium placeholder:font-normal resize-none focus:outline-none focus:border-brand-pink transition-colors"
                    required
                />
            </div>
            <div className="text-right text-[10px] text-slate-400 font-medium">
                {message.length}/100
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || !author || !message}
            className="w-full py-4 bg-gradient-to-r from-brand-pink to-brand-darkPink text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-pink/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    <span>Send Cheer</span>
                    <Send size={18} />
                </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default WriteCheerModal;