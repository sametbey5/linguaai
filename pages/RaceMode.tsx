
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Users, Zap, Timer, Flag, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'motion/react';

interface Player {
  socketId: string;
  userId: string;
  name: string;
  avatar: string;
  progress: number;
  finished: boolean;
}

interface Question {
  q: string;
  a: string;
}

const RaceMode: React.FC = () => {
  const { userId, stats, mode, awardPoints } = useGamification();
  const isKids = mode === 'kids';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<{ players: Player[], status: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [gameState, setGameState] = useState<'lobby' | 'racing' | 'finished'>('lobby');
  const [winner, setWinner] = useState<Player | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_race', { 
        userId, 
        name: userId || 'Guest', 
        avatar: stats.avatar || '👤' 
      });
    });

    newSocket.on('room_update', (data) => {
      setRoom(data);
      if (data.status === 'waiting') {
        setGameState('lobby');
        setWinner(null);
        setCurrentIndex(0);
        setQuestions([]);
      }
    });

    newSocket.on('race_start', (data) => {
      setQuestions(data.questions);
      setGameState('racing');
      setCurrentIndex(0);
      setAnswer('');
    });

    newSocket.on('winner_announced', (player) => {
      setWinner(player);
      setGameState('finished');
      if (player.userId === userId) {
        awardPoints(500, "Race Winner!");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, stats.avatar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questions[currentIndex]) return;

    const isCorrect = answer.trim().toLowerCase() === questions[currentIndex].a.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setAnswer('');
        socket?.emit('update_progress', { progress: nextIndex });
      }, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (gameState === 'lobby') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-fun-yellow rounded-full shadow-lg animate-bounce-slow">
            <Users size={48} className="text-slate-800" />
          </div>
          <h2 className={`text-5xl font-black ${isKids ? 'rainbow-text' : 'text-slate-900'}`}>
            WORD RACE LOBBY
          </h2>
          <p className="text-xl font-bold text-slate-500">Waiting for opponents to join the race...</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Users className="text-fun-blue" /> Players ({room?.players.length || 0})
            </h3>
            <div className="flex items-center gap-2 text-fun-green font-bold">
              <div className="w-3 h-3 bg-fun-green rounded-full animate-pulse" />
              Live Server
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {room?.players.map((player) => (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={player.socketId} 
                className="flex flex-col items-center p-4 bg-slate-50 rounded-3xl border-2 border-slate-100 relative"
              >
                <div className="text-5xl mb-2">{player.avatar}</div>
                <span className="font-black text-slate-700 truncate w-full text-center">{player.name}</span>
                {player.userId === userId && (
                  <span className="absolute -top-2 -right-2 bg-fun-blue text-white text-[10px] px-2 py-1 rounded-full font-black">YOU</span>
                )}
              </motion.div>
            ))}
            {Array.from({ length: Math.max(0, 4 - (room?.players.length || 0)) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 opacity-50">
                <div className="text-5xl mb-2 grayscale">👤</div>
                <span className="font-bold text-slate-300">Searching...</span>
              </div>
            ))}
          </div>

          {room?.players.length === 1 && (
            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border-2 border-blue-100 text-center">
              <p className="text-blue-600 font-bold">Invite a friend to this URL to race together!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'racing') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        {/* Progress Bars */}
        <div className="bg-white rounded-[2rem] p-6 border-4 border-slate-100 shadow-lg space-y-4">
          {room?.players.map((player) => (
            <div key={player.socketId} className="space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">{player.avatar} {player.name}</span>
                <span>{player.progress} / {questions.length}</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(player.progress / questions.length) * 100}%` }}
                  className={`h-full transition-all duration-300 ${player.userId === userId ? 'bg-fun-blue' : 'bg-slate-400'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Question Area */}
        <div className="bg-white rounded-[3rem] p-12 border-b-[12px] border-slate-100 shadow-2xl text-center space-y-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-sm font-black text-fun-blue uppercase tracking-widest">Translate to Turkish</div>
              <h3 className="text-7xl font-black text-slate-800">{questions[currentIndex]?.q}</h3>
              
              <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
                <input
                  autoFocus
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type answer..."
                  className={`w-full text-3xl font-black p-6 rounded-3xl border-4 text-center transition-all outline-none ${
                    feedback === 'correct' ? 'border-fun-green bg-green-50 text-fun-green' :
                    feedback === 'wrong' ? 'border-fun-pink bg-red-50 text-fun-pink animate-shake' :
                    'border-slate-200 focus:border-fun-blue'
                  }`}
                />
                <button type="submit" className="hidden">Submit</button>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {feedback === 'correct' && <CheckCircle2 className="text-fun-green" size={32} />}
                  {feedback === 'wrong' && <XCircle className="text-fun-pink" size={32} />}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const isWinner = winner?.userId === userId;
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-8 animate-fade-in">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block p-8 bg-fun-yellow rounded-full shadow-2xl"
        >
          <Trophy size={120} className="text-white drop-shadow-lg" />
        </motion.div>

        <h2 className="text-6xl font-black text-slate-800">
          {isWinner ? "YOU WON!" : "RACE FINISHED!"}
        </h2>
        
        <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-100 shadow-xl max-w-md mx-auto">
          <div className="text-2xl font-black text-slate-500 mb-4 uppercase tracking-widest">Winner</div>
          <div className="text-8xl mb-4">{winner?.avatar}</div>
          <div className="text-3xl font-black text-slate-800">{winner?.name}</div>
          {isWinner && (
            <div className="mt-6 p-4 bg-fun-green/10 rounded-2xl text-fun-green font-black flex items-center justify-center gap-2">
              <Zap size={20} /> +500 XP AWARDED!
            </div>
          )}
        </div>

        <Button 
          variant="primary" 
          className="text-2xl px-12 py-6 rounded-[2rem]"
          onClick={() => window.location.reload()}
        >
          BACK TO LOBBY
        </Button>
      </div>
    );
  }

  return null;
};

export default RaceMode;
