
import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Users, Zap, Timer, Flag, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../services/supabaseClient';
import { db } from '../services/db';

interface Player {
  userId: string;
  name: string;
  avatar: string;
  progress: number;
  finished: boolean;
  finishTime?: number;
  presence_ref?: string;
}

interface Question {
  q: string;
  a: string;
}

const WORDS_POOL = [
  { q: "Apple", a: "Elma" },
  { q: "Book", a: "Kitap" },
  { q: "School", a: "Okul" },
  { q: "Friend", a: "Arkadaş" },
  { q: "Water", a: "Su" },
  { q: "Bread", a: "Ekmek" },
  { q: "House", a: "Ev" },
  { q: "Car", a: "Araba" },
  { q: "Sun", a: "Güneş" },
  { q: "Moon", a: "Ay" },
  { q: "Star", a: "Yıldız" },
  { q: "Tree", a: "Ağaç" },
  { q: "Flower", a: "Çiçek" },
  { q: "Bird", a: "Kuş" },
  { q: "Dog", a: "Köpek" },
  { q: "Cat", a: "Kedi" },
  { q: "Fish", a: "Balık" },
  { q: "Milk", a: "Süt" },
  { q: "Cheese", a: "Peynir" },
  { q: "Egg", a: "Yumurta" }
];

const RaceMode: React.FC = () => {
  const { userId, stats, mode, awardPoints } = useGamification();
  const isKids = mode === 'kids';
  const [roomPlayers, setRoomPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [gameState, setGameState] = useState<'setup' | 'lobby' | 'racing' | 'finished'>('setup');
  const [winner, setWinner] = useState<Player | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const channelRef = useRef<any>(null);

  const joinRoom = async (id: string) => {
    const finalRoomId = id || "global_race";
    setRoomId(finalRoomId);
    setIsJoining(true);

    // 1. Create room in DB if it doesn't exist (for metadata)
    const existingRooms = await db.getRaceRooms();
    const roomExists = existingRooms.find(r => r.id === finalRoomId);
    
    if (!roomExists) {
      const randomQuestions = [...WORDS_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
      await db.createRaceRoom(finalRoomId, randomQuestions);
      setQuestions(randomQuestions);
    } else {
      setQuestions(roomExists.questions || []);
      if (roomExists.status === 'racing') {
        setGameState('racing');
      }
    }

    // 2. Setup Realtime Channel
    const channel = supabase.channel(`race:${finalRoomId}`, {
      config: {
        presence: {
          key: userId || 'anonymous',
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players: Player[] = Object.values(state).flat() as any;
        setRoomPlayers(players);
      })
      .on('broadcast', { event: 'race_start' }, (payload) => {
        setQuestions(payload.questions);
        setGameState('racing');
        setCurrentIndex(0);
        setAnswer('');
      })
      .on('broadcast', { event: 'progress_update' }, (payload) => {
        setRoomPlayers(prev => prev.map(p => 
          p.userId === payload.userId ? { ...p, progress: payload.progress, finished: payload.finished, finishTime: payload.finishTime } : p
        ));
      })
      .on('broadcast', { event: 'winner_announced' }, (payload) => {
        setWinner(payload.winner);
        setGameState('finished');
        if (payload.winner.userId === userId) {
          awardPoints(500, "Race Winner!");
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
            name: userId || 'Guest',
            avatar: stats.avatar || '👤',
            progress: 0,
            finished: false,
          });
          setGameState('lobby');
          setIsJoining(false);
        }
      });
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questions[currentIndex]) return;

    const isCorrect = answer.trim().toLowerCase() === questions[currentIndex].a.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        const nextIndex = currentIndex + 1;
        const isFinished = nextIndex >= questions.length;
        
        setCurrentIndex(nextIndex);
        setAnswer('');

        // Update Presence & Broadcast
        channelRef.current?.send({
          type: 'broadcast',
          event: 'progress_update',
          payload: { userId, progress: nextIndex, finished: isFinished, finishTime: isFinished ? Date.now() : undefined }
        });

        if (isFinished) {
          // Check if we are the first winner
          const otherFinished = roomPlayers.some(p => p.finished && p.userId !== userId);
          if (!otherFinished) {
            const winnerData = { userId, name: userId || 'Guest', avatar: stats.avatar || '👤' };
            channelRef.current?.send({
              type: 'broadcast',
              event: 'winner_announced',
              payload: { winner: winnerData }
            });
            db.updateRaceRoomStatus(roomId, 'finished');
          }
        }
      }, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const startRaceNow = async () => {
    const randomQuestions = [...WORDS_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(randomQuestions);
    setGameState('racing');
    
    channelRef.current?.send({
      type: 'broadcast',
      event: 'race_start',
      payload: { questions: randomQuestions }
    });

    await db.updateRaceRoomStatus(roomId, 'racing');
  };

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-fun-yellow rounded-full shadow-lg">
            <Flag size={48} className="text-slate-800" />
          </div>
          <h2 className={`text-5xl font-black ${isKids ? 'rainbow-text' : 'text-slate-900'}`}>
            LIVE WORD RACE
          </h2>
          <p className="text-xl font-bold text-slate-500">Compete with others in real-time via Supabase!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Global Race</h3>
            <p className="text-slate-500">Join the public lobby and wait for opponents.</p>
            <Button 
              variant="primary" 
              fullWidth 
              className="py-6 text-xl rounded-3xl"
              onClick={() => joinRoom('global_race')}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Global Lobby'}
            </Button>
          </div>

          <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Private Room</h3>
            <p className="text-slate-500">Create or join a private room with a code.</p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter Room Code..." 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 font-black text-center text-xl focus:border-fun-blue outline-none"
              />
              <Button 
                variant="secondary" 
                fullWidth 
                className="py-6 text-xl rounded-3xl"
                onClick={() => joinRoom(roomId)}
                disabled={!roomId || isJoining}
              >
                {isJoining ? 'Joining...' : 'Join / Create Room'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-fun-yellow rounded-full shadow-lg animate-bounce-slow">
            <Users size={48} className="text-slate-800" />
          </div>
          <h2 className={`text-5xl font-black ${isKids ? 'rainbow-text' : 'text-slate-900'}`}>
            {roomId === 'global_race' ? 'GLOBAL LOBBY' : `ROOM: ${roomId}`}
          </h2>
          <p className="text-xl font-bold text-slate-500">Waiting for opponents to join the race...</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Users className="text-fun-blue" /> Players ({roomPlayers.length})
            </h3>
            <div className="flex items-center gap-2 text-fun-green font-bold">
              <div className="w-3 h-3 bg-fun-green rounded-full animate-pulse" />
              Supabase Realtime
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {roomPlayers.map((player) => (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={player.userId} 
                className="flex flex-col items-center p-4 bg-slate-50 rounded-3xl border-2 border-slate-100 relative"
              >
                <div className="text-5xl mb-2">{player.avatar}</div>
                <span className="font-black text-slate-700 truncate w-full text-center">{player.name}</span>
                {player.userId === userId && (
                  <span className="absolute -top-2 -right-2 bg-fun-blue text-white text-[10px] px-2 py-1 rounded-full font-black">YOU</span>
                )}
              </motion.div>
            ))}
            {Array.from({ length: Math.max(0, 4 - roomPlayers.length) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 opacity-50">
                <div className="text-5xl mb-2 grayscale">👤</div>
                <span className="font-bold text-slate-300">Searching...</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            {roomPlayers.length === 1 ? (
              <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100 text-center w-full">
                <p className="text-blue-600 font-bold">Invite a friend with code: <span className="text-2xl font-black underline">{roomId}</span></p>
              </div>
            ) : (
              <p className="text-slate-500 font-bold">Ready to start the race!</p>
            )}
            
            {roomPlayers.length >= 1 && (
              <Button 
                variant="primary" 
                className="px-12 py-4 rounded-2xl"
                onClick={startRaceNow}
              >
                Start Race Now
              </Button>
            )}
            
            <button 
              onClick={() => window.location.reload()}
              className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'racing') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        <div className="bg-white rounded-[2rem] p-6 border-4 border-slate-100 shadow-lg space-y-4">
          {roomPlayers.map((player) => (
            <div key={player.userId} className="space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">{player.avatar} {player.name}</span>
                <span>{player.progress || 0} / {questions.length}</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((player.progress || 0) / questions.length) * 100}%` }}
                  className={`h-full transition-all duration-300 ${player.userId === userId ? 'bg-fun-blue' : 'bg-slate-400'}`}
                />
              </div>
            </div>
          ))}
        </div>

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
