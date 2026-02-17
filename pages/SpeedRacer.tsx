
import React, { useState, useEffect, useRef } from 'react';
import { Car, Flag, Timer, Trophy, RotateCcw, ChevronLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import Confetti from '../components/Confetti';

const WORDS = [
  "quickly", "jumping", "friend", "school", "banana", "galaxy", "rocket", "purple",
  "monkey", "dragon", "castle", "winter", "summer", "family", "doctor", "police",
  "planet", "circle", "square", "yellow", "orange", "window", "garden", "flower"
];

const SpeedRacer: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
      pickNewWord();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const pickNewWord = () => {
    const random = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(random);
    setUserInput('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (val.toLowerCase().trim() === currentWord.toLowerCase()) {
      // Word Complete
      const newProgress = progress + 10;
      setWordsCompleted(prev => prev + 1);
      
      if (newProgress >= 100) {
        setGameState('won');
        awardPoints(200, "Speed Racer Victory");
        setProgress(100);
      } else {
        setProgress(newProgress);
        pickNewWord();
      }
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-[80vh] bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <Car size={120} className="text-fun-orange animate-bounce-slow" />
        <h2 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fun-orange to-red-500 mt-6">SPEED RACER</h2>
        <p className="text-xl font-bold text-slate-400 mt-4 max-w-md text-center">Type the words as fast as you can to cross the finish line before time runs out!</p>
        <div className="mt-8">
           <Button onClick={() => { setGameState('playing'); setTimeLeft(30); setProgress(0); setWordsCompleted(0); }} className="px-12 py-6 text-2xl" variant="primary">
              START ENGINE
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-100 rounded-[3rem] p-8 flex flex-col relative overflow-hidden border-8 border-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 z-10">
        <button onClick={() => navigate('/')} className="bg-white p-3 rounded-xl text-slate-500 hover:bg-slate-50 border-2 border-slate-200 font-bold flex items-center gap-2">
            <ChevronLeft /> Exit Race
        </button>
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xl border-4 ${timeLeft < 10 ? 'bg-red-100 text-red-500 border-red-200 animate-pulse' : 'bg-white text-slate-700 border-slate-200'}`}>
                <Timer /> {timeLeft}s
            </div>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-40 bg-slate-800 rounded-3xl border-4 border-slate-900 mb-12 flex items-center px-4 overflow-hidden">
        {/* Finish Line */}
        <div className="absolute right-10 top-0 bottom-0 w-8 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross.png')] opacity-50 z-0" />
        <Flag className="absolute right-8 top-4 text-white z-10" />
        
        {/* Car */}
        <div 
            className="absolute transition-all duration-300 ease-out z-20"
            style={{ left: `calc(${progress}% - 3rem)` }}
        >
            <Car size={64} className="text-fun-orange fill-fun-orange transform -scale-x-100 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-8 bg-orange-500/30 blur-xl rounded-full" />
        </div>

        {/* Lane Markers */}
        <div className="absolute inset-x-0 top-1/2 h-0 border-t-4 border-dashed border-slate-600" />
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
         {gameState === 'playing' ? (
             <div className="w-full max-w-md text-center space-y-8">
                 <div className="bg-white p-8 rounded-[2rem] shadow-xl border-b-8 border-slate-200">
                     <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">TYPE THIS:</p>
                     <h3 className="text-5xl font-black text-slate-800 tracking-wide">{currentWord}</h3>
                 </div>
                 
                 <input 
                    ref={inputRef}
                    autoFocus
                    value={userInput}
                    onChange={handleInput}
                    className="w-full text-center text-4xl font-bold p-6 rounded-2xl border-4 border-fun-blue focus:ring-4 focus:ring-blue-200 outline-none uppercase placeholder:text-slate-300"
                    placeholder="TYPE HERE..."
                 />
             </div>
         ) : gameState === 'won' ? (
             <div className="text-center animate-pop">
                 <Confetti />
                 <Trophy size={120} className="text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
                 <h2 className="text-6xl font-black text-slate-800 mb-4">1ST PLACE!</h2>
                 <p className="text-2xl font-bold text-slate-500 mb-8">You typed {wordsCompleted} words correctly!</p>
                 <Button onClick={() => { setGameState('start'); }} icon={<RotateCcw />} variant="primary" className="text-xl px-8 py-4">RACE AGAIN</Button>
             </div>
         ) : (
            <div className="text-center animate-wiggle">
                <div className="text-8xl mb-6">💥</div>
                <h2 className="text-6xl font-black text-slate-800 mb-4">OUT OF GAS!</h2>
                <p className="text-2xl font-bold text-slate-500 mb-8">Time ran out. You were so close!</p>
                <Button onClick={() => { setGameState('start'); }} icon={<RotateCcw />} variant="danger" className="text-xl px-8 py-4">TRY AGAIN</Button>
            </div>
         )}
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fun-orange/10 rounded-full blur-3xl" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-fun-blue/10 rounded-full blur-3xl" />
    </div>
  );
};

export default SpeedRacer;
