
import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Wand, ChevronLeft, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { generateSpeech } from '../services/geminiService';
import Confetti from '../components/Confetti';

const SPELLS = [
  { id: 'spell1', name: 'Grammar Strike', xp: 20, type: 'attack' },
  { id: 'spell2', name: 'Vocab Shield', xp: 50, type: 'defend' },
  { id: 'spell3', name: 'Fluency Fire', xp: 100, type: 'ultimate' },
];

const CHALLENGES = [
  { question: "What is the opposite of 'Brave'?", answer: "cowardly" },
  { question: "Spell the word for a place where you borrow books.", answer: "library" },
  { question: "Change 'Child' to plural.", answer: "children" },
  { question: "What is the past tense of 'Drink'?", answer: "drank" },
  { question: "Name a synonym for 'Huge'.", answer: "giant" },
];

const BossBattle: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [gameState, setGameState] = useState<'intro' | 'battle' | 'victory' | 'lost'>('intro');
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(["A giant Dragon appears!"]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === CHALLENGES[currentChallenge].answer.toLowerCase()) {
      // Attack Success
      setIsAnimating('player-attack');
      setBossHealth(h => Math.max(0, h - 25));
      setLog(prev => ["Critical hit! Spell cast successfully!", ...prev]);
      generateSpeech("Critical hit! Correct answer.");
      
      setTimeout(() => {
        setIsAnimating(null);
        if (bossHealth <= 25) {
          setGameState('victory');
          awardPoints(300, "Dragon Slayer Reward");
        } else {
          setCurrentChallenge(c => (c + 1) % CHALLENGES.length);
          setUserInput("");
        }
      }, 1000);
    } else {
      // Player Missed / Boss Attacks
      setIsAnimating('boss-attack');
      setPlayerHealth(h => Math.max(0, h - 20));
      setLog(prev => ["Incorrect! The Dragon breathes fire!", ...prev]);
      generateSpeech("Oh no! The dragon attacked.");
      
      setTimeout(() => {
        setIsAnimating(null);
        if (playerHealth <= 20) {
          setGameState('lost');
        } else {
          setUserInput("");
        }
      }, 1000);
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="h-[80vh] bg-gradient-to-b from-red-900 to-black rounded-[3rem] flex flex-col items-center justify-center text-white p-10 text-center space-y-8 overflow-hidden">
        <div className="text-9xl animate-float">🐲</div>
        <h2 className="text-6xl font-black text-red-500 uppercase tracking-tighter shadow-red-500/20 shadow-xl">THE ENGLISH DUNGEON</h2>
        <p className="text-xl font-bold text-slate-400 max-w-md">The Great Dragon is blocking your path! Use your English spells to defeat him and claim the legendary treasure.</p>
        <button 
          onClick={() => setGameState('battle')}
          className="px-12 py-6 bg-red-600 rounded-[2rem] font-black text-3xl hover:bg-red-500 transition-colors shadow-2xl border-b-8 border-red-800 active:border-b-0 active:translate-y-2"
        >
          ENTER DUNGEON
        </button>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="h-[80vh] bg-green-900 rounded-[3rem] flex flex-col items-center justify-center text-white p-10 text-center space-y-8 overflow-hidden">
        <Confetti />
        <div className="text-9xl animate-bounce">🏆</div>
        <h2 className="text-7xl font-black text-fun-yellow">DRAGON SLAYER!</h2>
        <p className="text-2xl font-bold">You've mastered the ancient English tongue!</p>
        <button 
          onClick={() => navigate('/')}
          className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl"
        >
          RETURN TO TOWN
        </button>
      </div>
    );
  }

  return (
    <div className="h-[85vh] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      
      {/* HUD Header */}
      <div className="p-6 flex justify-between items-center z-10">
        <button onClick={() => navigate('/')} className="text-white bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors"><ChevronLeft /></button>
        <div className="flex items-center gap-10">
           <div className="flex flex-col items-end">
              <span className="text-xs font-black text-slate-400 uppercase">Boss Health</span>
              <div className="w-64 h-6 bg-slate-800 rounded-full border-2 border-white/10 overflow-hidden shadow-inner">
                <div className="h-full bg-red-600 transition-all duration-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${bossHealth}%` }} />
              </div>
           </div>
        </div>
      </div>

      {/* Battle Scene */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-around p-10 relative z-10">
        {/* Player Sprite */}
        <div className={`flex flex-col items-center transition-all duration-500 ${isAnimating === 'player-attack' ? 'translate-x-40 scale-125' : ''}`}>
           <div className="text-9xl">🧙‍♂️</div>
           <div className="mt-4 flex flex-col items-center">
              <span className="text-xs font-black text-fun-blue uppercase mb-1">Your Mana</span>
              <div className="w-40 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-fun-blue" style={{ width: `${playerHealth}%` }} />
              </div>
           </div>
        </div>

        {/* VS Indicator */}
        <div className="hidden md:flex flex-col items-center justify-center opacity-20">
           <Zap size={64} className="text-fun-yellow animate-pulse" />
           <span className="font-black text-6xl text-white">VS</span>
        </div>

        {/* Boss Sprite */}
        <div className={`flex flex-col items-center transition-all duration-500 ${isAnimating === 'boss-attack' ? '-translate-x-40 scale-125' : ''}`}>
           <div className={`text-9xl transition-transform ${isAnimating === 'boss-attack' ? 'animate-wiggle' : 'animate-float'}`}>🐲</div>
           <div className="mt-4 bg-red-600/20 px-4 py-1 rounded-full border border-red-500/40">
              <span className="font-black text-red-500 uppercase text-xs">Inferno Dragon</span>
           </div>
        </div>
      </div>

      {/* Interaction Panel */}
      <div className="bg-slate-800 p-8 border-t-8 border-slate-700 z-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-slate-900 rounded-[2rem] p-6 border-4 border-slate-700 shadow-inner relative overflow-hidden">
           <div className="absolute top-4 right-4 text-white/10"><MessageSquare size={80} /></div>
           <h4 className="text-fun-yellow font-black uppercase text-xs mb-4 tracking-widest flex items-center gap-2">
             <Sparkles size={16} /> Boss Riddle
           </h4>
           <p className="text-3xl font-black text-white mb-8 leading-tight">
             "{CHALLENGES[currentChallenge].question}"
           </p>
           
           <form onSubmit={handleAction} className="relative">
              <input 
                autoFocus
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-slate-800 border-4 border-slate-700 rounded-2xl p-4 text-xl font-bold text-white outline-none focus:border-red-500 transition-all placeholder:text-slate-600"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-xl hover:bg-red-500 transition-colors shadow-lg">
                <Sword size={24} />
              </button>
           </form>
        </div>

        <div className="w-full md:w-80 space-y-4">
           <h4 className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Combat Log</h4>
           <div className="bg-black/40 h-48 rounded-2xl p-4 overflow-y-auto space-y-2 border border-white/5 scrollbar-hide">
              {log.map((entry, i) => (
                <div key={i} className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
                  {entry}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BossBattle;
