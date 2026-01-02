import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, ShieldCheck, Phone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIERS = [
  { id: 1, name: 'Early Bird Ticket', price: 50000, desc: '1x Ticket + Digital Program Book' },
  { id: 2, name: 'VIP Package', price: 120000, desc: '1x VIP Ticket + OST CD + Backstage Tour' },
  { id: 3, name: 'Angel Investor', price: 300000, desc: '2x VIP Tickets + Name on Seat + Merch Set' },
];

const PG_METHODS = [
  { id: 'card', name: 'Credit Card', icon: <CreditCard size={20} /> },
  { id: 'kakao', name: 'KakaoPay', icon: <span className="font-bold text-black bg-yellow-400 px-1 rounded text-[10px]">K</span> },
  { id: 'toss', name: 'Toss Pay', icon: <span className="font-bold text-white bg-blue-500 px-1 rounded text-[10px]">T</span> },
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedTier(null);
      setPhoneNumber('');
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!selectedTier) {
        alert("Please select a reward tier.");
        return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
        alert("Please enter a valid mobile number.");
        return;
    }

    setStep('processing');
    
    try {
        const tier = TIERS.find(t => t.id === selectedTier);
        if (!tier) throw new Error("Invalid tier");

        // 1. Simulate PG Call (As before)
        // Note: We keep this to show the loading UI, but in a real app,
        // the Supabase insert would likely happen via a Webhook from the PG provider.
        // For this demo, we insert directly after the simulated 'success'.
        
        /* 
        // PG Code omitted for brevity, assuming success
        const response = await fetch('https://api.ciderpay.com/...'); 
        */
        
        // Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Insert into Supabase (Optimistic UI update)
        const { error: dbError } = await supabase
            .from('pledges')
            .insert([
                { 
                    amount: tier.price, 
                    tier_name: tier.name, 
                    mobile: phoneNumber 
                }
            ]);

        if (dbError) {
            console.error('Supabase Insert Error:', dbError);
            throw new Error('Failed to record pledge.');
        }

        setStep('success');

    } catch (error) {
        console.error("Payment Error:", error);
        alert(`Payment Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setStep('select');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity pointer-events-auto"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-brand-surface rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-float-up pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-colors duration-300">
        
        {/* --- STEP 1: SELECTION --- */}
        {step === 'select' && (
          <>
            {/* Header (Fixed) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-brand-surface z-10 transition-colors">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Select Reward</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-xs">Choose your funding tier</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Tiers */}
                <div className="space-y-3">
                  {TIERS.map((tier) => (
                    <div 
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        selectedTier === tier.id 
                        ? 'bg-brand-pink/10 border-brand-pink relative overflow-hidden' 
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {selectedTier === tier.id && (
                          <div className="absolute top-0 right-0 p-2">
                              <div className="bg-brand-pink text-white rounded-full p-0.5"><Check size={12} strokeWidth={3} /></div>
                          </div>
                      )}
                      <div className="flex justify-between items-start pr-6">
                        <div className={`text-sm font-bold ${selectedTier === tier.id ? 'text-brand-pink' : 'text-slate-900 dark:text-white'}`}>
                          {tier.name}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white whitespace-nowrap">₩{tier.price.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{tier.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Mobile Number Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 uppercase tracking-wide">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-slate-400 dark:text-gray-500" />
                        </div>
                        <input 
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="010-0000-0000"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all text-lg font-medium"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-2 ml-1 flex items-center gap-1">
                        <ShieldCheck size={10} /> Required for digital receipt
                    </p>
                </div>

                {/* Payment Method */}
                <div>
                   <h3 className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-3 uppercase tracking-wide">Payment Method</h3>
                   <div className="flex gap-2">
                     {PG_METHODS.map((method) => (
                       <button
                         key={method.id}
                         onClick={() => setSelectedMethod(method.id)}
                         className={`flex-1 py-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all h-20 ${
                           selectedMethod === method.id
                           ? 'bg-white text-brand-dark border-slate-200 shadow-lg'
                           : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
                         }`}
                       >
                         {method.icon}
                         {method.name}
                       </button>
                     ))}
                   </div>
                </div>
            </div>

            {/* Footer (Fixed) */}
            <div className="p-4 bg-white dark:bg-brand-surface border-t border-slate-100 dark:border-white/5 shrink-0 pb-8 sm:pb-4 transition-colors">
                <button
                  disabled={!selectedTier || !phoneNumber}
                  onClick={handlePayment}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    selectedTier && phoneNumber
                    ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30 hover:brightness-110 active:scale-[0.98]' 
                    : 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedTier ? (
                      <>
                        <span>Pay</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded text-sm">₩{TIERS.find(t => t.id === selectedTier)?.price.toLocaleString()}</span>
                      </>
                  ) : 'Select Reward & Info'}
                </button>
                <div className="text-center mt-3 text-[10px] text-slate-400 dark:text-gray-500">
                    Data synced via Supabase Realtime
                </div>
            </div>
          </>
        )}

        {/* --- STEP 2: PROCESSING (Centered) --- */}
        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border-[6px] border-white dark:border-brand-surface border-t-brand-pink animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-slate-400 dark:text-gray-500" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Processing</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">Recording your pledge securely...</p>
            
            <div className="w-full max-w-[240px] space-y-2">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-pink w-2/3 animate-pulse rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-wider">
                    <span>Syncing Database</span>
                    <span>Updating Gauge</span>
                </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: SUCCESS (Centered) --- */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-6 animate-[bounce_1s_infinite]">
              <Check size={48} strokeWidth={4} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pledge Recorded!</h2>
            <p className="text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                Thank you for your support.<br/>The total funding has been updated.
            </p>
            <button 
              onClick={onClose}
              className="w-full max-w-xs py-4 rounded-xl bg-slate-100 dark:bg-white text-brand-dark font-bold text-lg hover:bg-slate-200 dark:hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;