import React, { useEffect, useState } from 'react';
import { MessageSquare, PenLine } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ScrollReveal from './ScrollReveal';
import WriteCheerModal from './WriteCheerModal';
import { COMMENTS } from '../constants';
import { Cheer } from '../types';

const getTimeAgo = (dateString: string) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const CheeringSection = () => {
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Initial Data
    const fetchCheers = async () => {
      try {
        const { data, error } = await supabase
            .from('cheers')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            // Log as warning instead of error to avoid cluttering console in demo mode
            console.warn('Supabase Table Missing (Demo Mode):', error.message);
            
            // Fallback to static comments
            const fallbackData: Cheer[] = COMMENTS.map((c, index) => ({
                id: -(index + 1),
                created_at: new Date(Date.now() - (index * 7200000)).toISOString(),
                author: c.author,
                message: c.text,
                initials: c.initials,
                color_from: c.colorFrom,
                color_to: c.colorTo
            }));
            setCheers(fallbackData);
        } else {
            setCheers(data || []);
        }
      } catch (err) {
        console.warn('Network or Config Error (Using Demo Data):', err);
         const fallbackData: Cheer[] = COMMENTS.map((c, index) => ({
            id: -(index + 1),
            created_at: new Date(Date.now() - (index * 7200000)).toISOString(),
            author: c.author,
            message: c.text,
            initials: c.initials,
            color_from: c.colorFrom,
            color_to: c.colorTo
        }));
        setCheers(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchCheers();

    // 2. Realtime Subscription
    // Wrapped in try/catch to prevent crashes if Realtime isn't enabled
    try {
        const channel = supabase
        .channel('public:cheers')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'cheers' },
            (payload) => {
            const newCheer = payload.new as Cheer;
            setCheers((prev) => [newCheer, ...prev]);
            }
        )
        .subscribe();

        return () => {
             supabase.removeChannel(channel);
        };
    } catch (e) {
        console.warn('Realtime subscription skipped');
    }
  }, []);

  // Callback to handle local updates if DB write fails (Demo Mode)
  const handleLocalAdd = (newCheer: Cheer) => {
      setCheers((prev) => [newCheer, ...prev]);
  };

  return (
    <div className="mb-4">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-500">
              <MessageSquare size={18} />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cheering</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-pink px-3 py-1.5 rounded-full shadow-lg shadow-brand-pink/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <PenLine size={12} />
            Write
          </button>
        </div>
      </ScrollReveal>
      
      {/* Empty State / Loading */}
      {!loading && cheers.length === 0 && (
          <div className="text-center py-8 opacity-50">
              <p className="text-sm text-slate-500 dark:text-gray-400">No cheers yet. Be the first!</p>
          </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {cheers.map((cheer, idx) => {
           // Alternate alignment based on ID or index
           const isRight = idx % 2 !== 0; 
           
           return (
             <ScrollReveal key={cheer.id} delay={0}>
                <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
                    <div className={`bg-white dark:bg-brand-surface p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm relative max-w-[85%] transition-colors duration-300 ${
                        isRight ? 'rounded-tr-sm mr-4' : 'rounded-tl-sm ml-4'
                    }`}>
                        {/* Speech Bubble Nipple */}
                        <div className={`absolute top-0 w-0 h-0 border-t-[10px] border-t-white dark:border-t-brand-surface border-l-[10px] border-r-[10px] border-b-0 border-l-transparent border-r-transparent transition-colors duration-300 ${
                            isRight ? '-right-2 border-r-[0px] border-l-[10px]' : '-left-2 border-l-[0px] border-r-[10px]'
                        }`}></div>

                        <div className={`flex items-center gap-3 mb-2 ${isRight ? 'flex-row-reverse text-right' : ''}`}>
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cheer.color_from || 'from-gray-400'} ${cheer.color_to || 'to-gray-600'} flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0`}>
                                {cheer.initials}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-0.5">{cheer.author}</p>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500">{getTimeAgo(cheer.created_at)}</span>
                            </div>
                        </div>
                        <p className={`text-sm text-slate-600 dark:text-gray-300 ${isRight ? 'text-right' : ''} break-words leading-relaxed`}>{cheer.message}</p>
                    </div>
                </div>
             </ScrollReveal>
           );
        })}
      </div>

      <WriteCheerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCheerSuccess={handleLocalAdd}
      />
    </div>
  );
};

export default CheeringSection;