
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Gift, X, Trophy } from 'lucide-react';
import Confetti from './Confetti';
import Button from './Button';
import { Badge } from '../types';

interface MysteryBoxProps {
  onClose: () => void;
  onRewardClaimed: (reward: { type: 'xp' | 'badge', value: any }) => void;
  availableBadges: Badge[];
}

const MysteryBox: React.FC<MysteryBoxProps> = ({ onClose, onRewardClaimed, availableBadges }) => {
  const [step, setStep] = useState<'closed' | 'shaking' | 'opening' | 'revealed'>('closed');
  const [reward, setReward] = useState<{ type: 'xp' | 'badge', value: any } | null>(null);

  const handleOpen = () => {
    if (step !== 'closed') return;
    setStep('shaking');
    
    // Sequence of animations
    setTimeout(() => {
      setStep('opening');
      
      // Determine reward
      const isBadge = Math.random() > 0.5; // 50% chance for badge
      if (isBadge && availableBadges.length > 0) {
        const randomBadge = availableBadges[Math.floor(Math.random() * availableBadges.length)];
        setReward({ type: 'badge', value: randomBadge });
      } else {
        const xpAmounts = [50, 100, 150, 200, 250, 500];
        const amount = xpAmounts[Math.floor(Math.random() * xpAmounts.length)];
        setReward({ type: 'xp', value: amount });
      }

      setTimeout(() => {
        setStep('revealed');
      }, 1000);
    }, 1500);
  };

  const handleClaim = () => {
    if (reward) {
      onRewardClaimed(reward);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <AnimatePresence>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-slate-100 overflow-hidden"
        >
          {step === 'revealed' && <Confetti />}
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2 z-10"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center space-y-8 py-10">
            {step === 'closed' || step === 'shaking' ? (
              <>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                  MYSTERY BOX
                </h2>
                <p className="text-slate-500 font-bold">Tap the box to see what's inside!</p>
                
                <motion.div
                  onClick={handleOpen}
                  animate={step === 'shaking' ? {
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1.1, 1.2],
                  } : {
                    y: [0, -10, 0],
                  }}
                  transition={step === 'shaking' ? {
                    duration: 0.5,
                    repeat: 3,
                  } : {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-9xl cursor-pointer filter drop-shadow-2xl"
                >
                  🎁
                </motion.div>
                
                <Button 
                  onClick={handleOpen}
                  variant="primary"
                  className="px-12 py-4 text-xl rounded-2xl shadow-xl"
                >
                  OPEN NOW!
                </Button>
              </>
            ) : step === 'opening' ? (
              <div className="flex flex-col items-center gap-6 py-20">
                <motion.div
                  animate={{ 
                    scale: [1, 2, 5],
                    opacity: [1, 1, 0],
                    rotate: [0, 90, 180]
                  }}
                  transition={{ duration: 1 }}
                  className="text-9xl"
                >
                  ✨
                </motion.div>
                <h3 className="text-3xl font-black text-fun-blue animate-pulse uppercase tracking-widest">
                  Revealing...
                </h3>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="space-y-8 w-full"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-fun-yellow/20 rounded-full scale-150 blur-xl"
                  />
                  {reward?.type === 'xp' ? (
                    <div className="w-40 h-40 bg-fun-yellow rounded-full flex items-center justify-center text-white shadow-2xl border-8 border-white relative z-10">
                      <Star size={80} className="fill-current" />
                    </div>
                  ) : (
                    <div className={`w-40 h-40 ${reward?.value.color} rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl border-8 border-white relative z-10`}>
                       <span className="text-7xl">{reward?.value.icon}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {reward?.type === 'badge' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-fun-pink text-white text-[10px] font-black px-3 py-1 rounded-full inline-block mb-2 animate-bounce"
                    >
                      RARE REWARD!
                    </motion.div>
                  )}
                  <h3 className="text-5xl font-black text-slate-800 uppercase tracking-tighter">
                    {reward?.type === 'xp' ? 'XP BOOST!' : 'NEW BADGE!'}
                  </h3>
                  <p className="text-2xl font-bold text-slate-500">
                    {reward?.type === 'xp' ? `+${reward.value} XP` : reward?.value.name}
                  </p>
                </div>

                {reward?.type === 'badge' && (
                  <p className="text-slate-400 font-medium italic px-10">
                    "{reward.value.description}"
                  </p>
                )}

                <div className="pt-4">
                  <Button 
                    onClick={handleClaim}
                    variant="success"
                    className="w-full py-5 text-2xl rounded-2xl shadow-xl"
                    icon={<Sparkles />}
                  >
                    AWESOME!
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MysteryBox;
