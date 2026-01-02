import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { PartyPopper } from 'lucide-react';
import ShareButton from './ShareButton';

interface FundingGaugeProps {
  currentAmount: number;
  goalAmount: number;
}

const FundingGauge: React.FC<FundingGaugeProps> = ({ currentAmount, goalAmount }) => {
  // Calculate percentage
  const percentage = Math.round((currentAmount / goalAmount) * 100);
  
  // Logic for the visual chart: max out at 100% so the ring doesn't break
  const visualProgress = Math.min(percentage, 100);
  const data = [
    { name: 'Progress', value: visualProgress },
    { name: 'Remaining', value: 100 - visualProgress },
  ];

  // Format numbers (e.g., 12500000 -> 12.5M)
  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return `₩ ${(num / 1000000).toFixed(1)}M`;
    }
    return `₩ ${num.toLocaleString()}`;
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4">
      {/* Background Glows */}
      <div className="absolute top-0 left-10 w-32 h-32 bg-brand-purple/20 rounded-full blur-[60px]"></div>
      <div className="absolute bottom-0 right-10 w-32 h-32 bg-brand-pink/20 rounded-full blur-[60px]"></div>

      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Chart Container - Fixed size 224px (w-56) to prevent Recharts measurement errors */}
        <PieChart width={224} height={224}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80} // Increased thickness for better visibility
            outerRadius={95}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            cornerRadius={visualProgress < 100 ? 10 : 0} // Round corners only if not full
          >
            {data.map((entry, index) => (
              <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#FF6B9C' : 'currentColor'} 
                  className={index === 1 ? 'text-slate-100 dark:text-[#333]' : ''}
              />
            ))}
          </Pie>
        </PieChart>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {percentage >= 100 && (
                <PartyPopper className="text-brand-pink mb-2 animate-float" size={28} />
            )}
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors drop-shadow-sm">
                {percentage.toLocaleString()}%
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wide mt-1 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                Goal Reached
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mt-8 px-2">
        <div className="bg-slate-50 dark:bg-brand-surface/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm transition-colors shadow-sm">
            <div className="text-slate-400 dark:text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Total Pledged</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">{formatCurrency(currentAmount)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-brand-surface/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm transition-colors shadow-sm">
            <div className="text-slate-400 dark:text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Time Left</div>
            <div className="text-xl font-black text-brand-pink">5 Days</div>
        </div>
      </div>

      {/* Share Button below stats */}
      <div className="mt-6">
          <ShareButton variant="pill" label="Share this stats" iconSize={16} />
      </div>
    </div>
  );
};

export default FundingGauge;