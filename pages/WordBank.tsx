
import React, { useState, useMemo } from 'react';
import { useGamification } from '../context/GamificationContext';
import { BookOpen, CheckCircle, XCircle, RefreshCw, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../components/Button';

const WordBank: React.FC = () => {
  const { wordBank, updateWordBankEntry, awardPoints } = useGamification();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const dueWords = useMemo(() => {
    return wordBank.filter(entry => {
      const nextReview = entry.nextReviewAt.split('T')[0];
      return nextReview <= today;
    });
  }, [wordBank, today]);

  const currentWord = dueWords[currentIndex];

  const handleNext = (isCorrect: boolean) => {
    if (!currentWord) return;

    updateWordBankEntry(currentWord.word, isCorrect);
    
    if (isCorrect) {
      awardPoints(10, 'SRS Review Correct', 'vocabulary');
    }

    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  if (dueWords.length === 0) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border-b-[12px] border-fun-blue">
          <div className="w-24 h-24 bg-fun-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-fun-blue" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">All Caught Up!</h1>
          <p className="text-slate-500 text-xl font-bold mb-8">You've reviewed all your words for today. Great job!</p>
          <div className="flex flex-wrap justify-center gap-4">
             <div className="bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-1">Total Words</p>
                <p className="text-2xl font-black text-slate-800">{wordBank.length}</p>
             </div>
             <div className="bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-1">Mastery</p>
                <p className="text-2xl font-black text-fun-green">
                  {wordBank.filter(w => w.timesCorrect > 5).length}
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border-b-[12px] border-fun-green">
          <div className="w-24 h-24 bg-fun-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={48} className="text-fun-green" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">Review Complete!</h1>
          <p className="text-slate-500 text-xl font-bold mb-8">You've finished your daily review session.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-fun-green text-white px-10 py-4 text-xl"
          >
            DONE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
            <Brain className="text-fun-pink" /> Word Bank
          </h1>
          <p className="text-slate-500 font-bold">Spaced Repetition Review</p>
        </div>
        <div className="bg-fun-pink/10 text-fun-pink px-4 py-2 rounded-xl font-black text-sm">
          {currentIndex + 1} / {dueWords.length}
        </div>
      </div>

      <div className="relative h-[400px] w-full perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.word}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full h-full"
          >
            <div 
              className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-xl border-b-[12px] border-fun-blue border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Word</p>
                <h2 className="text-5xl md:text-7xl font-black text-slate-800 mb-6">{currentWord.word}</h2>
                {currentWord.pronunciation && (
                  <p className="text-xl text-slate-400 font-mono mb-8">{currentWord.pronunciation}</p>
                )}
                <p className="text-slate-400 font-bold animate-pulse flex items-center gap-2">
                  Tap to reveal <RefreshCw size={16} />
                </p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl border-b-[12px] border-fun-pink border-2 border-slate-800">
                <p className="text-xs font-black text-white/30 uppercase mb-4 tracking-widest">Definition</p>
                <p className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                  {currentWord.definition}
                </p>
                <div className="w-full h-px bg-white/10 mb-8" />
                <p className="text-xs font-black text-white/30 uppercase mb-4 tracking-widest">Example</p>
                <p className="text-lg italic text-slate-300">
                  "{currentWord.exampleSentence}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex justify-center gap-6">
        <button
          onClick={() => handleNext(false)}
          className="flex-1 max-w-[200px] bg-white border-2 border-red-100 hover:border-red-200 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all group"
        >
          <XCircle className="group-hover:scale-110 transition-transform" /> MISSED IT
        </button>
        <button
          onClick={() => handleNext(true)}
          className="flex-1 max-w-[200px] bg-fun-green text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all border-b-8 border-green-800 active:border-b-0 active:translate-y-2 group"
        >
          <CheckCircle className="group-hover:scale-110 transition-transform" /> GOT IT
        </button>
      </div>

      <div className="mt-12 bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <BookOpen className="text-fun-blue" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase">Source</p>
          <p className="font-bold text-slate-700">{currentWord.source}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-slate-400 font-bold text-sm">
          <Brain size={16} /> {currentWord.timesCorrect} correct reviews
        </div>
      </div>
    </div>
  );
};

export default WordBank;
