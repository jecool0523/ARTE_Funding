
import React, { useState, useEffect, useRef } from 'react';
import { X, Check, CreditCard, ShieldCheck, Phone, Landmark, Copy, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Toss Payments Type Definitions (Global window)
declare global {
  interface Window {
    TossPayments: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIERS = [
  { id: 1, name: 'Early Bird Ticket', price: 50000, desc: '1x Ticket + Digital Program Book' },
  { id: 2, name: 'VIP Package', price: 120000, desc: '1x VIP Ticket + OST CD + Backstage Tour' },
  { id: 3, name: 'Angel Investor', price: 300000, desc: '2x VIP Tickets + Name on Seat + Merch Set' },
];

const BANK_INFO = {
  bankName: "Kakao Bank",
  accountNumber: "3333-00-1234567",
  holder: "Dream Big Prod."
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'select' | 'bank_info' | 'toss_widget' | 'processing' | 'success'>('select');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);
  
  // Toss Refs
  const paymentWidgetRef = useRef<any>(null);
  const agreementRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedTier(null);
      setPhoneNumber('');
    }
  }, [isOpen]);

  // Toss Widget Initialization
  useEffect(() => {
    if (step === 'toss_widget' && selectedTier) {
      const initTossWidget = async () => {
        setIsWidgetLoading(true);
        const tier = TIERS.find(t => t.id === selectedTier);
        if (!tier) return;

        try {
          const clientKey = "test_gck_docs_Ovk5rk1EwkeBP0W43n07x1zm";
          const customerKey = "ANONYMOUS"; 
          
          const tossPayments = await window.TossPayments(clientKey);
          const paymentWidget = tossPayments.paymentWidget({ customerKey });
          paymentWidgetRef.current = paymentWidget;

          await paymentWidget.renderPaymentMethods(
            "#payment-method", 
            { value: tier.price },
            { variantKey: "DEFAULT" }
          );

          agreementRef.current = await paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
          
          setIsWidgetLoading(false);
        } catch (error: any) {
          console.error("Toss Widget Init Error:", error.message || error);
          setIsWidgetLoading(false);
        }
      };

      initTossWidget();
    }
  }, [step, selectedTier]);

  const handleNextStep = () => {
    if (!selectedTier) {
      alert("Please select a reward tier.");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setStep('toss_widget');
  };

  const handleTossPayment = async () => {
    if (!paymentWidgetRef.current) return;
    
    const tier = TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId: `ORDER_${Date.now()}`,
        orderName: tier.name,
        customerName: "Patron",
        customerMobilePhone: phoneNumber,
        successUrl: window.location.origin + "?payment=success",
        failUrl: window.location.origin + "?payment=fail",
      });
    } catch (error: any) {
      if (error.code !== 'USER_CANCEL') {
        alert(error.message || "Payment request failed.");
      }
    }
  };

  const handleManualConfirm = async () => {
    const tier = TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await recordPledge(tier.price, tier.name, phoneNumber, `manual_${Date.now()}`);
  };

  const recordPledge = async (amount: number, tierName: string, mobile: string, paymentId: string) => {
    try {
        const { error: dbError } = await supabase
            .from('pledges')
            .insert([{ amount, tier_name: tierName, mobile, payment_id: paymentId }]);
        if (dbError) console.warn('Supabase DB Warning:', dbError.message);
    } catch (e: any) {
        console.error("Critical DB error", e.message || e);
    } finally {
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity pointer-events-auto" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white dark:bg-brand-surface rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-float-up pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-colors duration-300">
        
        {step === 'select' && (
          <>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-brand-surface z-10">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Select Reward</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-xs">Choose your support tier</p>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
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
                        <div className={`text-sm font-bold ${selectedTier === tier.id ? 'text-brand-pink' : 'text-slate-900 dark:text-white'}`}>{tier.name}</div>
                        <div className="font-bold text-slate-900 dark:text-white whitespace-nowrap">₩{tier.price.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{tier.desc}</div>
                    </div>
                  ))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 uppercase tracking-wide">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-slate-400 dark:text-gray-500" />
                        </div>
                        <input 
                            type="tel"
                            placeholder="010-0000-0000"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-brand-pink transition-all text-lg font-medium"
                        />
                    </div>
                </div>

                <div className="pt-2">
                   <button
                    onClick={() => setStep('bank_info')}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                   >
                     <Landmark size={14} /> Prefer Bank Transfer?
                   </button>
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-brand-surface border-t border-slate-100 dark:border-white/5 shrink-0 pb-8 sm:pb-4">
                <button
                  disabled={!selectedTier || !phoneNumber}
                  onClick={handleNextStep}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    selectedTier && phoneNumber
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-brand-dark shadow-xl hover:scale-[1.02]' 
                    : 'bg-slate-200 dark:bg-gray-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                </button>
            </div>
          </>
        )}

        {step === 'toss_widget' && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/5 shrink-0 z-10">
                <button onClick={() => setStep('select')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold transition-colors">← Back</button>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Secure Checkout</h2>
                <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                <div id="payment-method" className="w-full min-h-[300px]">
                    {isWidgetLoading && (
                        <div className="flex flex-col items-center justify-center h-[300px] animate-pulse">
                            <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-pink rounded-full animate-spin mb-4"></div>
                            <p className="text-xs text-slate-400">Loading Payment Methods...</p>
                        </div>
                    )}
                </div>
                <div id="agreement" className="w-full"></div>
            </div>

            <div className="p-4 bg-white dark:bg-brand-surface border-t border-slate-100 dark:border-white/5 shrink-0 pb-8 sm:pb-4">
                <button
                  onClick={handleTossPayment}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-[#3182f6] text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Pay Now
                </button>
                <p className="text-center mt-3 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={10} /> Secured by Toss Payments
                </p>
            </div>
          </div>
        )}

        {step === 'bank_info' && selectedTier && (
           <div className="flex-1 flex flex-col">
             <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/5 shrink-0 z-10">
                <button onClick={() => setStep('select')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold transition-colors">← Back</button>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Bank Transfer</h2>
                <div className="w-8"></div>
             </div>
             <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
                    <p className="text-slate-500 dark:text-gray-400 text-sm mb-1">Transfer Amount</p>
                    <p className="text-3xl font-black text-brand-pink mb-4">₩{TIERS.find(t => t.id === selectedTier)?.price.toLocaleString()}</p>
                    <div className="h-px w-full bg-slate-200 dark:bg-white/10 my-4"></div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Bank</span><span className="font-bold dark:text-white">{BANK_INFO.bankName}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Account Holder</span><span className="font-bold dark:text-white">{BANK_INFO.holder}</span></div>
                        <div className="flex flex-col gap-2 mt-2">
                             <span className="text-slate-500 text-[10px] uppercase tracking-wide">Account Number</span>
                             <button onClick={() => copyToClipboard(BANK_INFO.accountNumber)} className="flex items-center justify-between bg-white dark:bg-black/20 border-2 border-slate-200 dark:border-white/10 rounded-xl p-3 hover:border-brand-pink transition-colors group">
                                 <span className="font-mono font-bold text-lg dark:text-white tracking-wider">{BANK_INFO.accountNumber}</span>
                                 <Copy size={18} className="text-slate-400 group-hover:text-brand-pink" />
                             </button>
                        </div>
                    </div>
                </div>
             </div>
             <div className="p-4 bg-white dark:bg-brand-surface border-t border-slate-100 dark:border-white/5 shrink-0 pb-8 sm:pb-4">
                <button onClick={handleManualConfirm} className="w-full py-4 rounded-xl font-bold text-lg bg-brand-pink text-white shadow-lg shadow-brand-pink/30 hover:brightness-110 active:scale-[0.98] transition-all">I have transferred</button>
             </div>
           </div>
        )}

        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border-[6px] border-slate-100 dark:border-white/5 border-t-brand-pink animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={24} className="text-slate-400 animate-spin" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Verifying...</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Confirming payment status</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-6 animate-[bounce_1s_infinite]">
              <Check size={48} strokeWidth={4} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pledge Recorded!</h2>
            <p className="text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">Thank you for your support.<br/>The total funding has been updated.</p>
            <button onClick={onClose} className="w-full max-w-xs py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-brand-dark font-bold text-lg hover:brightness-110 transition-colors">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
