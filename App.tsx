import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FundingGauge from './components/FundingGauge';
import TabNav from './components/TabNav';
import StickyFooter from './components/StickyFooter';
import SynopsisSection from './components/SynopsisSection';
import CastCarousel from './components/CastCarousel';
import ScrollReveal from './components/ScrollReveal';
import PaymentModal from './components/PaymentModal';
import CheeringSection from './components/CheeringSection';
import { MapPin, ExternalLink } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { PROJECT_DATA } from './constants';

const App = () => {
  const [activeTab, setActiveTab] = useState<'story' | 'news' | 'talk'>('story');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Funding Data State
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Theme based on System Preference
  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch Supabase Data & Realtime Subscription
  useEffect(() => {
    const fetchAndSubscribe = async () => {
        setIsLoading(true);
        
        // 1. 초기 데이터 로드 (모든 후원금 합산)
        const { data, error } = await supabase
            .from('pledges')
            .select('amount');
        
        if (error) {
            console.error('Error fetching pledges:', error);
            setCurrentAmount(0); 
        } else if (data) {
            const total = data.reduce((sum, row) => sum + (row.amount || 0), 0);
            setCurrentAmount(total);
        }

        setIsLoading(false);

        // 2. 실시간 구독 (새로운 후원이 들어오면 즉시 업데이트)
        const channel = supabase
            .channel('public:pledges')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'pledges' },
                (payload) => {
                    const newPledgeAmount = payload.new.amount;
                    console.log('New pledge received!', newPledgeAmount);
                    setCurrentAmount(prev => prev + newPledgeAmount);
                }
            )
            .subscribe();

        // Cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    };

    fetchAndSubscribe();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-brand-dark pb-32 max-w-md mx-auto shadow-2xl overflow-hidden transition-colors duration-300">
      
      <Hero isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content Card (Overlapping Hero) */}
      <div className="relative z-10 -mt-12 bg-slate-50 dark:bg-brand-dark rounded-t-[3rem] px-6 pt-8 pb-4 w-full shadow-[0_-10px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_50px_rgba(0,0,0,0.5)] border-t border-white/50 dark:border-white/5 transition-colors duration-300">
        
        {/* Handle Bar */}
        <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6 opacity-40"></div>

        {/* Title Section */}
        <ScrollReveal>
            <div className="text-center mb-8">
                <div className="inline-flex gap-2 mb-3">
                    {PROJECT_DATA.meta.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-brand-pink/10 text-brand-pink text-xs font-bold rounded-full border border-brand-pink/20">
                            {tag}
                        </span>
                    ))}
                </div>
                {/* Handle line breaks in title */}
                <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight mb-3 transition-colors whitespace-pre-wrap">
                    {PROJECT_DATA.meta.title}
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-white/20">
                        <img src={PROJECT_DATA.meta.logoUrl} alt="Studio Logo" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{PROJECT_DATA.meta.company}</p>
                </div>
            </div>
        </ScrollReveal>

        {/* Funding Widget */}
        <ScrollReveal delay={100}>
            <div className="bg-white dark:bg-brand-surface p-6 rounded-[2.5rem] shadow-xl dark:shadow-none mb-8 border border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300 min-h-[300px] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 font-bold animate-pulse">Syncing with Live Server...</p>
                    </div>
                ) : (
                    <FundingGauge currentAmount={currentAmount} goalAmount={PROJECT_DATA.funding.goalAmount} />
                )}
            </div>
        </ScrollReveal>

        {/* Navigation */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content based on Tab */}
        <div>
            
            {/* Synopsis Section */}
            <SynopsisSection />

            {/* Cast Section */}
            <ScrollReveal>
                <CastCarousel />
            </ScrollReveal>

            {/* Venue Section */}
            <ScrollReveal>
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500">
                            <MapPin size={18} />
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Venue Info</h2>
                    </div>
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg group border border-slate-200 dark:border-white/10">
                        <img 
                            src={PROJECT_DATA.venue.mapImageUrl}
                            alt="Map" 
                            className="w-full h-full object-cover opacity-80 dark:opacity-60 transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-brand-dark/90 to-transparent flex flex-col justify-end p-5">
                            <div className="flex items-center gap-3 text-white">
                                <div className="bg-brand-pink w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg animate-bounce">
                                    <ExternalLink size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg leading-none mb-1">{PROJECT_DATA.venue.name}</p>
                                    <p className="text-xs opacity-60 font-medium">{PROJECT_DATA.venue.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Cheering Section (Real-time) */}
            <CheeringSection />
        
        </div>
      </div>
      
      <StickyFooter onFundClick={() => setIsPaymentOpen(true)} />

      {/* Payment Modal */}
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
    </div>
  );
};

export default App;