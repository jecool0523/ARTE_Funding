import React from 'react';
import { BookOpen, Megaphone, MessageCircle } from 'lucide-react';
import { NavTab } from '../types';

interface TabNavProps {
  activeTab: string;
  setActiveTab: (id: 'story' | 'news' | 'talk') => void;
}

const TABS: NavTab[] = [
  { id: 'story', label: 'Story', icon: <BookOpen size={18} /> },
  { id: 'news', label: 'News', icon: <Megaphone size={18} /> },
  { id: 'talk', label: 'Talk', icon: <MessageCircle size={18} /> },
];

const TabNav: React.FC<TabNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex p-1.5 bg-white dark:bg-brand-surface rounded-2xl mb-10 backdrop-blur-sm border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none transition-colors duration-300">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              isActive
                ? 'bg-slate-100 dark:bg-white text-slate-900 dark:text-brand-dark shadow-sm'
                : 'text-slate-400 dark:text-gray-400 hover:text-slate-600 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNav;