
import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Star, ShieldAlert, Crosshair, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Confetti from '../components/Confetti';

interface Asteroid {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCorrect: boolean;
}

const QUESTIONS = [
  { sentence: "She ___ to the store yesterday.", options: ["went", "go", "goes"], answer: "went" },
  { sentence: "They are ___ for their test.", options: ["study", "studying", "studies"], answer: "studying" },
  { sentence: "How ___ eggs do we need?", options: ["many", "much", "more"], answer: "many" },
  { sentence: "I have ___ this movie before.", options: ["see", "saw", "seen"], answer: "seen" },
  { sentence: "That car is ___ than mine.", options: ["fastest", "faster", "fast"], answer: "faster" },
];

const GrammarGalaxy: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'victory'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [feedback, setFeedback] = useState<string | null>(null);

  const spawnAsteroids = useCallback(() => {
    const q = QUESTIONS[currentQuestionIndex];
    const newAsteroids = q.options.map((opt, i) => ({
      id: Date.now() + i,
      word: opt,
      x: 20 + i * 30, // Percentage
      y: -10, // Start off-screen
      speed: 0.2 + Math.random() * 0.3,
      isCorrect: opt === q.answer
    }));
    setAsteroids(newAsteroids);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setAsteroids(prev => {
        const updated = prev.map(a => ({ ...a, y: a.y + a.speed }));
        // Check if any reached the bottom
        if (updated.some(a => a.y > 100)) {
          setHealth(h => Math.max(0, h - 1));
          spawnAsteroids();
          return [];
        }
        return updated;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, spawnAsteroids]);

  useEffect(() => {
    if (gameState === 'playing' && asteroids.length === 0) {
      spawnAsteroids();
    }
  }, [gameState, asteroids.length, spawnAsteroids]);

  useEffect(() => {
    if (health <= 0) setGameState('gameover');
  }, [health]);

  const handleShoot = (asteroid: Asteroid) => {
    if (asteroid.isCorrect) {
      setScore(s => s + 50);
      setFeedback("NICE SHOT!");
      setTimeout(() => setFeedback(null), 1000);
      
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setAsteroids([]); // Clear to trigger spawn
      } else {
        setGameState('victory');
        awardPoints(score + 250, "Grammar Galaxy Ace");
      }
    } else {
      setHealth(h => Math.max(0, h - 1));
      setFeedback("MISSED!");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 bg-slate-900 rounded-[3rem] text-white p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <Rocket size={120} className="text-fun-pink animate-float" />
        <h2 className="text-6xl font-black italic tracking-tighter">GRAMMAR GALAXY</h2>
        <p className="text-xl font-bold text-slate-400 max-w-md">Blast the asteroid that has the correct word to finish the sentence. Don't let them hit your ship!</p>
        <button 
          onClick={() => setGameState('playing')}
          className="px-12 py-6 bg-fun-pink text-white rounded-[2rem] font-black text-3xl shadow-[0_0_30px_rgba(240,98,146,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          LAUNCH MISSION
        </button>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 bg-slate-900 rounded-[3rem] text-white p-10 text-center relative">
        <Confetti />
        <h2 className="text-7xl font-black text-fun-yellow animate-bounce">MISSION COMPLETE!</h2>
        <div className="text-4xl font-bold">XP EARNED: {score + 250}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl hover:bg-fun-yellow transition-colors"
        >
          RETURN TO BASE
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 bg-slate-900 rounded-[3rem] text-white p-10 text-center">
        <ShieldAlert size={120} className="text-red-500 animate-wiggle" />
        <h2 className="text-6xl font-black">MISSION FAILED</h2>
        <p className="text-xl">Your ship took too much damage!</p>
        <button 
          onClick={() => {
            setGameState('start');
            setHealth(3);
            setScore(0);
            setCurrentQuestionIndex(0);
          }}
          className="px-12 py-5 bg-red-600 rounded-[2rem] font-black text-xl"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="h-[80vh] bg-slate-950 rounded-[3rem] text-white p-8 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* HUD */}
      <div className="relative z-10 flex justify-between items-start mb-10">
        <div className="flex flex-col gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"><ChevronLeft /> Exit</button>
            <div className="text-sm font-black text-slate-500 uppercase">Shield Integrity</div>
            <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-4 w-12 rounded-full border-2 border-white/20 ${i < health ? 'bg-fun-pink shadow-[0_0_10px_rgba(240,98,146,0.5)]' : 'bg-transparent'}`} />
                ))}
            </div>
        </div>
        <div className="text-right">
            <div className="text-4xl font-black text-fun-yellow">SCORE: {score}</div>
            <div className="text-xs font-bold text-slate-500">LEVEL {currentQuestionIndex + 1}/5</div>
        </div>
      </div>

      {/* Game Field */}
      <div className="flex-1 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
          <h3 className="text-4xl font-black text-white/90 px-10">
            {QUESTIONS[currentQuestionIndex].sentence.replace("___", "______")}
          </h3>
          {feedback && <div className="mt-4 text-fun-yellow font-black text-5xl animate-pop">{feedback}</div>}
        </div>

        {asteroids.map(a => (
          <button
            key={a.id}
            onClick={() => handleShoot(a)}
            className="absolute p-4 flex flex-col items-center group transform -translate-x-1/2 transition-transform hover:scale-110"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-700 shadow-xl flex items-center justify-center relative">
               <div className="absolute -top-2 -left-2"><Star size={20} className="text-slate-600" /></div>
               <span className="font-black text-xl group-hover:text-fun-blue transition-colors">{a.word}</span>
            </div>
            <div className="w-1 h-10 bg-gradient-to-t from-transparent to-fun-pink/20 mt-2 animate-pulse" />
          </button>
        ))}
      </div>

      {/* Cockpit / Ship */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-48 h-32 bg-slate-900 border-x-8 border-t-8 border-slate-800 rounded-t-[3rem] relative flex items-center justify-center">
            <Rocket size={64} className="text-fun-blue animate-bounce-slow" />
            <div className="absolute inset-0 bg-blue-400/5 animate-pulse rounded-t-[2.5rem]" />
        </div>
      </div>
    </div>
  );
};

export default GrammarGalaxy;
