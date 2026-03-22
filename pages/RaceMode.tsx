
import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Users, Zap, Timer, Flag, CheckCircle2, XCircle, Home, Flame, Award, RefreshCw, Info, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'motion/react';
import { generateRaceQuestions } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

interface Opponent {
  name: string;
  avatar: string;
  progress: number;
  speed: number; // questions per second approx
}

interface Question {
  id: string;
  type: 'meaning' | 'fill' | 'correction' | 'synonym';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Mistake {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}

const OPPONENTS: Opponent[] = [
  { name: "Speedy Sam", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", progress: 0, speed: 0.15 },
  { name: "Quick Quinn", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn", progress: 0, speed: 0.18 },
  { name: "Turbo Tom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", progress: 0, speed: 0.22 },
  { name: "Flash Fiona", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona", progress: 0, speed: 0.25 },
];

const RaceMode: React.FC = () => {
  const { userId, stats, cefrLevel, awardPoints } = useGamification();
  
  // Game State
  const [gameState, setGameState] = useState<'idle' | 'matching' | 'playing' | 'results'>('idle');
  const [isRealOpponent, setIsRealOpponent] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPenalty, setIsPenalty] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  
  // Opponent State
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [opponentProgress, setOpponentProgress] = useState(0);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const opponentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const matchingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lobbyChannelRef = useRef<any>(null);
  const gameChannelRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (opponentTimerRef.current) clearInterval(opponentTimerRef.current);
      if (matchingTimeoutRef.current) clearTimeout(matchingTimeoutRef.current);
      if (lobbyChannelRef.current) lobbyChannelRef.current.unsubscribe();
      if (gameChannelRef.current) gameChannelRef.current.unsubscribe();
    };
  }, []);

  // --- Matching Logic ---

  const startMatching = () => {
    setGameState('matching');
    setIsRealOpponent(false);
    
    const lobbyId = `race_lobby:${cefrLevel || 'A1'}`;
    const channel = supabase.channel(lobbyId, {
      config: { presence: { key: userId || 'anonymous' } }
    });

    lobbyChannelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players = Object.keys(state).filter(id => id !== userId);
        
        if (players.length > 0) {
          const opponentId = players[0];
          const isHost = (userId || '') < opponentId;
          const matchRoomId = isHost ? `match_${userId}_${opponentId}` : `match_${opponentId}_${userId}`;
          
          if (isHost) {
            channel.send({
              type: 'broadcast',
              event: 'match_found',
              payload: { hostId: userId, opponentId, roomId: matchRoomId }
            });
          }
        }
      })
      .on('broadcast', { event: 'match_found' }, (payload: any) => {
        if (payload.opponentId === userId || payload.hostId === userId) {
          if (matchingTimeoutRef.current) clearTimeout(matchingTimeoutRef.current);
          channel.unsubscribe();
          startRealMatch(payload.roomId, payload.hostId === userId ? 'host' : 'guest');
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ userId, joinedAt: Date.now() });
        }
      });

    // Fallback to bot after 10 seconds
    matchingTimeoutRef.current = setTimeout(() => {
      if (lobbyChannelRef.current) lobbyChannelRef.current.unsubscribe();
      startBotMatch();
    }, 10000);
  };

  const startBotMatch = () => {
    const randomOpponent = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
    setOpponent({ ...randomOpponent, progress: 0 });
    setIsRealOpponent(false);
    loadQuestions();
  };

  const startRealMatch = async (roomId: string, role: 'host' | 'guest') => {
    setIsRealOpponent(true);
    const channel = supabase.channel(`race_game:${roomId}`);
    gameChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'start_game' }, (payload: any) => {
        if (role === 'guest') {
          setQuestions(payload.questions);
          setOpponent({
            name: payload.hostName,
            avatar: payload.hostAvatar,
            progress: 0,
            speed: 0
          });
          setGameState('playing');
          startTimers();
        }
      })
      .on('broadcast', { event: 'progress_update' }, (payload: any) => {
        if (payload.userId !== userId) {
          setOpponentProgress(payload.progress);
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED' && role === 'host') {
          const q = await generateRaceQuestions(cefrLevel);
          setQuestions(q);
          setOpponent({
            name: "Opponent", // Will be updated by presence if needed, but broadcast is simpler
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent",
            progress: 0,
            speed: 0
          });
          
          // Host sends questions to guest
          channel.send({
            type: 'broadcast',
            event: 'start_game',
            payload: { 
              questions: q, 
              hostName: userId, 
              hostAvatar: stats.avatar 
            }
          });
          
          setGameState('playing');
          startTimers();
        }
      });
  };

  const loadQuestions = async () => {
    const q = await generateRaceQuestions(cefrLevel);
    setQuestions(q);
    setGameState('playing');
    startTimers();
  };

  const startTimers = () => {
    setTimeLeft(45);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setOpponentProgress(0);
    setMistakes([]);

    // Main Game Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Opponent Progress Simulation (Only for bots)
    if (!isRealOpponent) {
      opponentTimerRef.current = setInterval(() => {
        setOpponentProgress((prev) => {
          if (prev >= 100) return 100;
          // Random progress based on opponent speed
          const increment = Math.random() * 5 * (opponent?.speed || 0.2) * 10;
          return Math.min(100, prev + increment);
        });
      }, 1500);
    }
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentTimerRef.current) clearInterval(opponentTimerRef.current);
    if (gameChannelRef.current) gameChannelRef.current.unsubscribe();
    setGameState('results');
    
    // Award points if won or played well
    const playerProgress = (currentIndex / questions.length) * 100;
    if (playerProgress > opponentProgress) {
      awardPoints(200 + score, 'Race Victory!', 'vocabulary');
    } else {
      awardPoints(50 + Math.floor(score / 2), 'Race Participation', 'vocabulary');
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (isPenalty || gameState !== 'playing') return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect) {
      setFeedback('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Score calculation: speed bonus + combo multiplier
      const speedBonus = Math.floor(timeLeft / 2);
      const comboMultiplier = Math.min(3, 1 + Math.floor(newCombo / 3) * 0.5);
      setScore(prev => prev + Math.floor((10 + speedBonus) * comboMultiplier));

      setTimeout(() => {
        setFeedback(null);
        const nextIndex = currentIndex + 1;
        const isFinished = nextIndex >= questions.length;
        
        // Broadcast progress if real opponent
        if (isRealOpponent && gameChannelRef.current) {
          gameChannelRef.current.send({
            type: 'broadcast',
            event: 'progress_update',
            payload: { 
              userId, 
              progress: (nextIndex / questions.length) * 100 
            }
          });
        }

        if (isFinished) {
          endGame();
        } else {
          setCurrentIndex(nextIndex);
        }
      }, 300);
    } else {
      setFeedback('wrong');
      setCombo(0);
      setIsPenalty(true);
      
      // Record mistake
      setMistakes(prev => [
        ...prev,
        {
          question: currentQ.question,
          yourAnswer: selectedOption,
          correctAnswer: currentQ.answer,
          explanation: currentQ.explanation
        }
      ].slice(0, 3)); // Keep last 3 mistakes

      // 1-second freeze penalty
      setTimeout(() => {
        setIsPenalty(false);
        setFeedback(null);
        // Don't skip the question, let them try again or just move on?
        // User said "penalty for wrong answers: small time loss or 1-second freeze"
        // Let's move to next question after penalty to keep it fast
        if (currentIndex + 1 >= questions.length) {
          endGame();
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1000);
    }
  };

  // --- UI Components ---

  const renderIdle = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-block p-6 bg-fun-yellow rounded-full shadow-2xl mb-4"
      >
        <Flag size={64} className="text-white" />
      </motion.div>
      <div className="space-y-2">
        <h1 className="text-6xl font-black text-slate-900 tracking-tight">LIVE WORD RACE</h1>
        <p className="text-xl text-slate-500 font-bold">The fastest English 1v1 on the planet!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-3">
          <Zap className="text-fun-yellow" />
          <div>
            <div className="font-black text-xs uppercase">Combos</div>
            <div className="text-sm text-slate-500">3 in a row = Boost</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-3">
          <Timer className="text-fun-blue" />
          <div>
            <div className="font-black text-xs uppercase">Fast Pace</div>
            <div className="text-sm text-slate-500">45s to win</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-3">
          <Award className="text-fun-green" />
          <div>
            <div className="font-black text-xs uppercase">Rewards</div>
            <div className="text-sm text-slate-500">Win big XP</div>
          </div>
        </div>
      </div>

      <Button 
        variant="primary" 
        fullWidth 
        className="py-8 text-2xl rounded-[2.5rem] shadow-xl hover:scale-105 transition-transform"
        onClick={startMatching}
      >
        FIND A MATCH
      </Button>
    </div>
  );

  const renderMatching = () => (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-20">
      <div className="relative inline-block">
        <div className="w-40 h-40 rounded-full border-8 border-slate-100 border-t-fun-blue animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Users size={48} className="text-fun-blue animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900">SEARCHING FOR OPPONENT...</h2>
        <p className="text-slate-400 font-bold animate-pulse">Matching you with a player at {cefrLevel} level</p>
      </div>
      
      <div className="flex justify-center gap-8 opacity-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden">
            <img src={stats.avatar} alt="You" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xs uppercase">YOU</span>
        </div>
        <div className="flex items-center text-4xl font-black text-slate-200">VS</div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-300" />
          </div>
          <span className="font-black text-xs uppercase text-slate-300">???</span>
        </div>
      </div>
    </div>
  );

  const renderPlaying = () => {
    const currentQ = questions[currentIndex];
    const playerProgress = (currentIndex / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header: Progress Comparison */}
        <div className="bg-white rounded-[2rem] p-6 border-4 border-slate-100 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-fun-blue/10 flex items-center justify-center">
                <Timer className={timeLeft < 10 ? 'text-fun-pink animate-pulse' : 'text-fun-blue'} />
              </div>
              <div className="text-3xl font-black text-slate-800">{timeLeft}s</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-black text-slate-400 uppercase">Score</div>
                <div className="text-2xl font-black text-fun-yellow">{score}</div>
              </div>
              {combo >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-fun-orange rounded-full text-white font-black text-sm animate-bounce">
                  <Flame size={16} /> {combo} COMBO!
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Player Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>YOU</span>
                <span>{Math.round(playerProgress)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-fun-blue shadow-[0_0_10px_rgba(0,122,255,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${playerProgress}%` }}
                />
              </div>
            </div>
            
            {/* Opponent Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>{opponent?.name}</span>
                <span>{Math.round(opponentProgress)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-fun-pink shadow-[0_0_10px_rgba(255,45,85,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${opponentProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`bg-white rounded-[3rem] p-12 border-b-[12px] border-slate-100 shadow-2xl text-center space-y-8 min-h-[400px] flex flex-col justify-center ${isPenalty ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="space-y-2">
                <span className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {currentQ?.type.replace('-', ' ')}
                </span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                  {currentQ?.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ?.options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={isPenalty}
                    onClick={() => handleAnswer(option)}
                    className={`p-6 rounded-3xl text-xl font-black transition-all border-4 ${
                      feedback === 'correct' && option === currentQ.answer ? 'bg-fun-green border-fun-green text-white scale-105' :
                      feedback === 'wrong' && option !== currentQ.answer ? 'bg-slate-50 border-slate-100 text-slate-300' :
                      feedback === 'wrong' && option === currentQ.answer ? 'bg-fun-green/20 border-fun-green/30 text-fun-green' :
                      'bg-white border-slate-100 text-slate-700 hover:border-fun-blue hover:bg-blue-50 hover:scale-[1.02]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Penalty Overlay */}
          {isPenalty && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-fun-pink text-white px-8 py-4 rounded-2xl font-black text-2xl animate-bounce shadow-2xl flex items-center gap-3">
                <XCircle size={32} /> FROZEN! (1s)
              </div>
            </div>
          )}
          
          {/* Correct Feedback */}
          {feedback === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                className="text-fun-green"
              >
                <CheckCircle2 size={120} />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const playerProgress = (currentIndex / questions.length) * 100;
    const isWinner = playerProgress > opponentProgress;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`inline-block p-8 rounded-full shadow-2xl ${isWinner ? 'bg-fun-yellow' : 'bg-slate-200'}`}
          >
            {isWinner ? <Trophy size={80} className="text-white" /> : <Flag size={80} className="text-slate-400" />}
          </motion.div>
          <h1 className={`text-7xl font-black tracking-tighter ${isWinner ? 'text-fun-yellow' : 'text-slate-400'}`}>
            {isWinner ? "VICTORY!" : "DEFEAT!"}
          </h1>
          <p className="text-xl font-bold text-slate-500">
            {isWinner ? "You outpaced your opponent!" : "So close! Try again to win."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 border-4 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Match Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-500">Final Score</span>
                <span className="text-2xl font-black text-slate-800">{score}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-500">Accuracy</span>
                <span className="text-2xl font-black text-slate-800">
                  {Math.round((currentIndex / (currentIndex + mistakes.length)) * 100) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-fun-green/10 rounded-2xl border-2 border-fun-green/20">
                <span className="font-bold text-fun-green">XP Earned</span>
                <span className="text-2xl font-black text-fun-green">+{isWinner ? 200 + score : 50 + Math.floor(score/2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border-4 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Info className="text-fun-blue" /> Review Mistakes
            </h3>
            {mistakes.length > 0 ? (
              <div className="space-y-4">
                {mistakes.map((m, i) => (
                  <div key={i} className="p-4 bg-red-50 rounded-2xl border-2 border-red-100 space-y-2">
                    <div className="font-black text-slate-800 text-sm">{m.question}</div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-fun-pink line-through font-bold">{m.yourAnswer}</span>
                      <span className="text-fun-green font-black">{m.correctAnswer}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">{m.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
                <CheckCircle2 size={48} className="mb-2" />
                <p className="font-bold">Perfect Run!</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            variant="primary" 
            fullWidth 
            className="py-6 text-xl rounded-3xl flex items-center justify-center gap-2"
            onClick={startMatching}
          >
            <RefreshCw size={24} /> REMATCH
          </Button>
          <Button 
            variant="secondary" 
            fullWidth 
            className="py-6 text-xl rounded-3xl flex items-center justify-center gap-2"
            onClick={() => setGameState('idle')}
          >
            <Home size={24} /> BACK HOME
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {gameState === 'idle' && renderIdle()}
        {gameState === 'matching' && renderMatching()}
        {gameState === 'playing' && renderPlaying()}
        {gameState === 'results' && renderResults()}
      </AnimatePresence>
    </div>
  );
};

export default RaceMode;
