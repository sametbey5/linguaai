
import React, { useState, useEffect, useCallback } from 'react';
import { Hammer, RotateCcw, ChevronLeft, AlertCircle, CheckCircle2, Bomb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import Confetti from '../components/Confetti';

const CATEGORIES = [
  { id: 'noun', label: 'NOUNS', color: 'text-blue-500', words: ['Cat', 'Table', 'School', 'Doctor', 'Apple', 'Car'] },
  { id: 'verb', label: 'VERBS', color: 'text-red-500', words: ['Run', 'Jump', 'Sleep', 'Eat', 'Play', 'Read'] },
  { id: 'adj', label: 'ADJECTIVES', color: 'text-green-500', words: ['Happy', 'Big', 'Red', 'Fast', 'Funny', 'Cold'] }
];

interface Mole {
  id: number;
  word: string;
  category: string;
  isUp: boolean;
}

const WordWhack: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [targetCategory, setTargetCategory] = useState(CATEGORIES[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [moles, setMoles] = useState<Mole[]>(Array(9).fill({ id: 0, word: '', category: '', isUp: false }).map((_, i) => ({ id: i, word: '', category: '', isUp: false })));
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('end');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const moleTimer = setInterval(() => {
        popUpRandomMole();
      }, 800);

      return () => {
        clearInterval(gameTimer);
        clearInterval(moleTimer);
      };
    }
  }, [gameState]);

  const popUpRandomMole = () => {
    setMoles(currentMoles => {
      const newMoles = [...currentMoles];
      // Hide some moles randomly
      newMoles.forEach((m, i) => {
        if (m.isUp && Math.random() > 0.6) newMoles[i] = { ...m, isUp: false };
      });

      // Pick a random hole to pop up
      const idx = Math.floor(Math.random() * 9);
      if (!newMoles[idx].isUp) {
        const isTarget = Math.random() > 0.4; // 60% chance to be target category
        let wordObj;
        if (isTarget) {
            const w = targetCategory.words[Math.floor(Math.random() * targetCategory.words.length)];
            wordObj = { word: w, category: targetCategory.id };
        } else {
            // Pick distractor
            const distractorCat = CATEGORIES.filter(c => c.id !== targetCategory.id)[Math.floor(Math.random() * (CATEGORIES.length - 1))];
            const w = distractorCat.words[Math.floor(Math.random() * distractorCat.words.length)];
            wordObj = { word: w, category: distractorCat.id };
        }
        
        newMoles[idx] = { ...newMoles[idx], word: wordObj.word, category: wordObj.category, isUp: true };
      }
      return newMoles;
    });
  };

  const handleWhack = (index: number) => {
    const mole = moles[index];
    if (!mole.isUp) return;

    if (mole.category === targetCategory.id) {
      // Correct Hit
      setScore(s => s + 10);
      setFeedback("SMASH!");
      setTimeout(() => setFeedback(null), 500);
      
      // Hide mole immediately
      const newMoles = [...moles];
      newMoles[index] = { ...mole, isUp: false };
      setMoles(newMoles);
    } else {
      // Wrong Hit
      setScore(s => Math.max(0, s - 5));
      setFeedback("OOPS!");
      setTimeout(() => setFeedback(null), 500);
      // Mole stays up briefly to mock player
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setTargetCategory(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    setGameState('playing');
    setMoles(moles.map(m => ({ ...m, isUp: false })));
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-[80vh] bg-green-800 rounded-[3rem] flex flex-col items-center justify-center text-white p-10 relative overflow-hidden border-8 border-green-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_2px,transparent_2px)] bg-[size:30px_30px]" />
        <Hammer size={120} className="text-yellow-400 animate-wiggle" />
        <h2 className="text-6xl font-black tracking-tighter mt-6 text-yellow-400 drop-shadow-md">WORD WHACK</h2>
        <p className="text-xl font-bold text-green-200 mt-4 max-w-md text-center">Smash the words that match the category! Avoid the wrong ones!</p>
        <div className="mt-8">
           <Button onClick={startGame} className="px-12 py-6 text-2xl shadow-xl" variant="success">
              PLAY NOW
           </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="min-h-[80vh] bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        {score > 100 && <Confetti />}
        <h2 className="text-6xl font-black text-white mb-6">GAME OVER!</h2>
        <div className="bg-white/10 p-8 rounded-3xl border-4 border-white/20 mb-8 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Final Score</p>
            <p className="text-8xl font-black text-yellow-400">{score}</p>
        </div>
        <div className="flex gap-4">
             <Button onClick={() => navigate('/')} variant="secondary">EXIT</Button>
             <Button onClick={() => { awardPoints(score, 'Word Whack Score'); startGame(); }} variant="primary" icon={<RotateCcw/>}>PLAY AGAIN</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-amber-100 rounded-[3rem] p-8 flex flex-col relative overflow-hidden border-8 border-amber-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <button onClick={() => navigate('/')} className="bg-white p-2 rounded-xl text-amber-800 hover:bg-amber-50 font-bold flex items-center gap-2">
            <ChevronLeft /> Quit
         </button>
         <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border-2 border-amber-200">
             <div className="text-amber-800 font-black text-xl">SCORE: {score}</div>
             <div className="w-px h-6 bg-amber-200" />
             <div className={`font-black text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>{timeLeft}s</div>
         </div>
      </div>

      {/* Instruction */}
      <div className="text-center mb-10">
         <div className="inline-block bg-white px-8 py-4 rounded-3xl shadow-lg border-b-8 border-slate-200 transform hover:scale-105 transition-transform">
            <span className="text-slate-400 font-black text-xs uppercase tracking-widest block mb-1">YOUR MISSION</span>
            <span className="text-2xl font-black text-slate-800 flex items-center gap-2">
                WHACK ONLY <span className={`${targetCategory.color} underline decoration-4 underline-offset-4`}>{targetCategory.label}</span>!
            </span>
         </div>
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center relative">
         {feedback && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-6xl font-black text-yellow-500 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-pop pointer-events-none">
                 {feedback}
             </div>
         )}
         
         <div className="grid grid-cols-3 gap-6 max-w-2xl w-full">
            {moles.map((mole, i) => (
               <div key={i} className="aspect-square bg-amber-900/20 rounded-full relative">
                  <div className="absolute inset-0 bg-amber-900/30 rounded-full scale-90 translate-y-2" /> {/* Hole Shadow */}
                  
                  {/* The Mole */}
                  <div 
                    onClick={() => handleWhack(i)}
                    className={`absolute inset-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center shadow-inner border-4 border-black/10
                        ${mole.isUp ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
                        ${mole.category === targetCategory.id ? 'bg-amber-500' : 'bg-slate-600'}
                    `}
                  >
                     {/* Mole Face */}
                     <div className="text-center">
                        <div className="font-black text-white text-lg md:text-2xl drop-shadow-md">{mole.word}</div>
                        {mole.category !== targetCategory.id && <div className="text-3xl mt-1">💣</div>}
                        {mole.category === targetCategory.id && <div className="text-3xl mt-1">🐹</div>}
                     </div>
                     
                     {/* Shine */}
                     <div className="absolute top-2 right-4 w-4 h-4 bg-white/30 rounded-full" />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default WordWhack;
