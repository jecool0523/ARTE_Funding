import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, ShieldCheck, Phone, Landmark, Copy, ExternalLink, Loader2 } from 'lucide-react';
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

const PAYMENT_METHODS = [
  { 
    id: 'ciderpay', 
    name: 'CiderPay', 
    description: 'Credit Card / Mobile',
    icon: <CreditCard size={20} className="text-blue-500" /> 
  },
  { 
    id: 'manual', 
    name: 'Bank Transfer', 
    description: 'Direct Deposit',
    icon: <Landmark size={20} className="text-slate-500" /> 
  },
];

const BANK_INFO = {
  bankName: "Kakao Bank",
  accountNumber: "3333-00-1234567",
  holder: "Dream Big Prod."
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'select' | 'bank_info' | 'cider_process' | 'processing' | 'success'>('select');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('ciderpay');
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

    const tier = TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    // --- Logic Switch ---
    if (selectedMethodId === 'manual') {
        setStep('bank_info');
    } else {
        // Start CiderPay Flow
        startCiderPay(tier);
    }
  };

  const startCiderPay = async (tier: typeof TIERS[0]) => {
    // 1. Switch UI to processing state immediately
    setStep('cider_process');
    
    // 2. Simulate Payment Gateway Interaction
    // In a real production environment, you would perform one of the following here:
    // a) Redirect the user: window.location.href = 'YOUR_CIDERPAY_PAYMENT_LINK';
    // b) Open a popup: window.open('YOUR_CIDERPAY_PAYMENT_LINK', 'payment', 'width=600,height=800');
    
    console.log("Initializing CiderPay for:", tier.name, tier.price);

    // SIMULATION: Wait for "payment completion"
    setTimeout(async () => {
        // 3. Assume payment success and record the pledge
        await recordPledge(tier.price, tier.name, phoneNumber, `cider_${Date.now()}`);
    }, 2500);
  };

  const handleManualConfirm = async () => {
    const tier = TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    setStep('processing');
    
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Record as manual payment
    await recordPledge(tier.price, tier.name, phoneNumber, `manual_${Date.now()}`);
  };

  const recordPledge = async (amount: number, tierName: string, mobile: string, paymentId: string) => {
    try {
        // Attempt to save to Supabase
        const { error: dbError } = await supabase
            .from('pledges')
            .insert([
                { 
                    amount: amount, 
                    tier_name: tierName, 
                    mobile: mobile,
                    payment_id: paymentId
                }
            ]);

        if (dbError) {
            console.warn('Supabase Insert Warning:', dbError);
            console.warn('Proceeding to success state despite DB error (Demo Mode)');
        }
    } catch (e) {
        console.error("Critical DB connection error", e);
    } finally {
        // Always show success screen to user in this demo
        setStep('success');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Account number copied!");
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

                {/* Payment Method Selection */}
                <div>
                   <h3 className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-3 uppercase tracking-wide">Payment Method</h3>
                   <div className="grid grid-cols-2 gap-3">
                     {PAYMENT_METHODS.map((method) => (
                       <button
                         key={method.id}
                         onClick={() => setSelectedMethodId(method.id)}
                         className={`p-4 rounded-xl border text-left transition-all ${
                           selectedMethodId === method.id
                           ? 'bg-white text-brand-dark border-brand-pink ring-1 ring-brand-pink shadow-md'
                           : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
                         }`}
                       >
                         <div className="flex items-center gap-3 mb-1">
                            {method.icon}
                            <span className={`text-sm font-bold ${selectedMethodId === method.id ? 'text-slate-900 dark:text-white' : ''}`}>{method.name}</span>
                         </div>
                         <div className="text-[10px] opacity-70 pl-8">{method.description}</div>
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
                        <span>{selectedMethodId === 'manual' ? 'Next' : 'Pay Now'}</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded text-sm">₩{TIERS.find(t => t.id === selectedTier)?.price.toLocaleString()}</span>
                      </>
                  ) : 'Select Reward & Info'}
                </button>
                <div className="text-center mt-3 text-[10px] text-slate-400 dark:text-gray-500 flex items-center justify-center gap-1">
                    <ShieldCheck size={10} /> Secured by {selectedMethodId === 'ciderpay' ? 'CiderPay' : 'Direct Transfer'}
                </div>
            </div>
          </>
        )}

        {/* --- STEP 1.5: BANK INFO (Manual Transfer) --- */}
        {step === 'bank_info' && selectedTier && (
           <div className="flex-1 flex flex-col">
             <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/5 shrink-0 z-10">
                <button 
                  onClick={() => setStep('select')}
                  className="p-2 -ml-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors font-bold text-sm"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bank Transfer</h2>
                <div className="w-8"></div>
             </div>

             <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">Transfer Amount</p>
                    <p className="text-3xl font-black text-brand-pink mb-4">₩{TIERS.find(t => t.id === selectedTier)?.price.toLocaleString()}</p>
                    <div className="h-px w-full bg-slate-200 dark:bg-white/10 my-4"></div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-gray-400 text-sm">Bank</span>
                            <span className="font-bold text-slate-900 dark:text-white">{BANK_INFO.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 dark:text-gray-400 text-sm">Account Holder</span>
                            <span className="font-bold text-slate-900 dark:text-white">{BANK_INFO.holder}</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                             <span className="text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wide">Account Number</span>
                             <button 
                                onClick={() => copyToClipboard(BANK_INFO.accountNumber)}
                                className="flex items-center justify-between bg-white dark:bg-black/20 border-2 border-slate-200 dark:border-white/10 rounded-xl p-3 hover:border-brand-pink transition-colors group"
                             >
                                 <span className="font-mono font-bold text-lg text-slate-900 dark:text-white tracking-wider">{BANK_INFO.accountNumber}</span>
                                 <span className="text-slate-400 group-hover:text-brand-pink"><Copy size={18} /></span>
                             </button>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl flex gap-3 items-start">
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                        <ShieldCheck size={18} />
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-100 leading-relaxed">
                        <p className="font-bold mb-1">Important</p>
                        Please transfer the exact amount. Your pledge will be confirmed automatically once we verify the transaction (usually within 1 hour).
                    </div>
                </div>
             </div>

             <div className="p-4 bg-white dark:bg-brand-surface border-t border-slate-100 dark:border-white/5 shrink-0 pb-8 sm:pb-4 transition-colors">
                <button
                  onClick={handleManualConfirm}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-brand-pink text-white shadow-lg shadow-brand-pink/30 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  I have transferred
                </button>
             </div>
           </div>
        )}

        {/* --- STEP: CIDERPAY PROCESSING (Enhanced UI) --- */}
        {step === 'cider_process' && (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
             <div className="w-20 h-20 mb-6 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <CreditCard size={32} className="text-blue-500" />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Connecting to CiderPay</h3>
             <p className="text-slate-500 dark:text-gray-400 text-sm mb-8 leading-relaxed max-w-[200px] mx-auto">
                Securely directing you to the payment gateway...
             </p>
             <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-full">
                <ShieldCheck size={12} className="text-green-500" />
                TLS Encrypted Connection
             </div>
           </div>
        )}

        {/* --- STEP 2: GENERIC PROCESSING (Used for manual) --- */}
        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border-[6px] border-white dark:border-brand-surface border-t-brand-pink animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={24} className="text-slate-400 dark:text-gray-500 animate-spin" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verifying...</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">Confirming payment status</p>
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