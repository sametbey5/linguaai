
import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown, Shield, Rocket, Sparkles, Smartphone, RotateCcw, Play } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import Confetti from '../components/Confetti';
import { IAP, PurchasesPackage } from '../services/iap';

const Premium: React.FC = () => {
  const { mode, isPremium, unlockPremium, restorePurchases } = useGamification();
  const isKids = mode === 'kids';
  const [showConfetti, setShowConfetti] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     // Fetch products (Simulated from Google Play)
     IAP.getPackages().then(setPackages);
  }, []);

  const handleSubscribe = async () => {
      setIsLoading(true);
      await unlockPremium();
      setIsLoading(false);
  };

  useEffect(() => {
      if (isPremium) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
      }
  }, [isPremium]);

  const priceString = packages.length > 0 ? packages[0].product.priceString : "$9.99";

  const benefits = [
    "Unlimited AI Conversations",
    "Unlock All Hero Characters (Elsa, Spiderman...)",
    "Exclusive Game Modes (Boss Battles)",
    "Advanced Grammar Analysis",
    "No Ads & Faster Loading"
  ];

  if (!isKids) {
    // Professional / Adult View
    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-12 relative">
        {showConfetti && <Confetti />}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Upgrade Your Learning Journey</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Get unlimited access to advanced AI tutors, detailed performance analytics, and specialized business scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-4">
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">Basic</span>
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-2">Free</h3>
            <p className="text-slate-500 mb-8">Essential tools for casual learners.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
               <li className="flex items-center gap-3 text-slate-700"><Check size={20} className="text-slate-400"/> 5 AI Chat turns per day</li>
               <li className="flex items-center gap-3 text-slate-700"><Check size={20} className="text-slate-400"/> Basic Vocabulary Sets</li>
               <li className="flex items-center gap-3 text-slate-700"><Check size={20} className="text-slate-400"/> Standard Support</li>
            </ul>

            <Button variant="pro-outline" className="w-full justify-center" disabled>Current Plan</Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Crown size={120} />
            </div>
            <div className="mb-4 relative z-10">
               <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">Recommended</span>
            </div>
            <h3 className="text-4xl font-bold mb-2 relative z-10">{priceString}<span className="text-lg text-slate-400 font-normal">/mo</span></h3>
            <p className="text-slate-400 mb-8 relative z-10">Full access for serious progress.</p>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
               {benefits.map((benefit, i) => (
                 <li key={i} className="flex items-center gap-3 text-slate-200">
                    <div className="bg-blue-600/20 p-1 rounded-full"><Check size={14} className="text-blue-400"/></div> 
                    {benefit}
                 </li>
               ))}
            </ul>

            {isPremium ? (
                 <Button variant="pro-primary" className="w-full justify-center py-3 bg-green-600 hover:bg-green-700" disabled>
                    <Check size={18} className="mr-2" /> Plan Active
                 </Button>
            ) : (
                <div className="space-y-4">
                    <Button 
                        variant="pro-primary" 
                        className="w-full justify-center py-3 bg-white text-slate-900 hover:bg-slate-100 border-none" 
                        onClick={handleSubscribe}
                        isLoading={isLoading}
                    >
                         <Play size={18} className="mr-2 fill-current" /> Pay with Google Play
                    </Button>
                    <button onClick={restorePurchases} className="w-full text-xs text-slate-400 hover:text-white underline">
                        Restore Google Play Purchases
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Kids / Fun View
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20 relative">
      {showConfetti && <Confetti />}
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-black text-slate-800 rainbow-text tracking-tight">SUPER HERO PASS!</h2>
        <p className="text-xl font-bold text-slate-500">Unlock everything and become a Legend!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         
         {/* Free Card */}
         <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-100 text-center opacity-80 hover:opacity-100 transition-opacity">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-3xl font-black text-slate-700 mb-2">ROOKIE</h3>
            <p className="font-bold text-slate-400 mb-6">Good for starting out.</p>
            <div className="text-4xl font-black text-slate-800 mb-8">FREE</div>
            <Button variant="secondary" className="w-full text-xl py-4 rounded-2xl" disabled>YOUR PLAN</Button>
         </div>

         {/* Premium Card */}
         <div className={`bg-fun-blue p-8 rounded-[3rem] border-b-[12px] border-sky-700 shadow-2xl relative transform transition-transform text-white overflow-hidden ${isPremium ? 'opacity-90' : 'hover:scale-105'}`}>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
            
            {!isPremium && (
                <div className="absolute -top-6 -right-6 bg-fun-yellow text-slate-900 p-4 rounded-full font-black rotate-12 shadow-lg border-4 border-white animate-pulse">
                   BEST VALUE!
                </div>
            )}

            <div className="relative z-10 text-center">
               <div className="text-8xl mb-4 animate-bounce-slow inline-block">🚀</div>
               <h3 className="text-5xl font-black mb-2 text-white drop-shadow-md">LEGEND</h3>
               <p className="font-bold text-sky-100 text-lg mb-8">Unlock Elsa, Spiderman & More!</p>
               
               <div className="bg-white/10 rounded-3xl p-6 mb-8 text-left space-y-4 backdrop-blur-sm">
                  {benefits.map((b, i) => (
                     <div key={i} className="flex items-center gap-4 font-bold text-lg">
                        <div className="bg-fun-green p-1 rounded-full shadow-sm"><Check size={16} strokeWidth={4} /></div>
                        {b}
                     </div>
                  ))}
               </div>

               {isPremium ? (
                  <div className="bg-white text-fun-green py-6 rounded-3xl font-black text-3xl shadow-xl flex items-center justify-center gap-3">
                      <Check size={40} /> YOU ARE A LEGEND!
                  </div>
               ) : (
                  <div>
                      <div className="text-5xl font-black mb-6 text-white drop-shadow-sm">{priceString}<span className="text-xl opacity-80">/mo</span></div>
                      
                      <Button 
                        variant="secondary" 
                        className="w-full text-2xl py-5 rounded-2xl border-4 border-white text-slate-800 mb-4 hover:scale-105 flex items-center justify-center gap-2"
                        onClick={handleSubscribe}
                        isLoading={isLoading}
                      >
                         <Play size={28} className="fill-current text-green-500" /> Pay with Google Play
                      </Button>
                      
                      <button 
                         onClick={restorePurchases} 
                         className="flex items-center justify-center gap-2 text-sky-200 font-bold hover:text-white transition-colors mx-auto text-sm"
                      >
                         <RotateCcw size={14} /> Restore Purchases
                      </button>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Premium;
