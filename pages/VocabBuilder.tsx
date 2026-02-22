
import React, { useState, useEffect } from 'react';
import { VocabWord } from '../types';
import Button from '../components/Button';
import { generateVocab } from '../services/geminiService';
import { Zap, Trophy, Clock, Flame, Sparkles, Star, Globe } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import Confetti from '../components/Confetti';
import { UI_TRANSLATIONS } from '../translations';

const VocabBuilder: React.FC = () => {
  const { mode, awardPoints, usageContext, preferredLanguage } = useGamification();
  const isKids = mode === 'kids';
  
  const t = (key: string) => UI_TRANSLATIONS[preferredLanguage]?.[key] || UI_TRANSLATIONS['Turkish']?.[key] || key;

  // Game States
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  
  // Word Rush State
  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFever, setIsFever] = useState(false);

  const availableTopics = ["Animals", "Space", "Technology"];
  const [topic, setTopic] = useState(availableTopics[0]);

  // --- Word Rush Logic ---
  const startGame = async () => {
    setGameState('lobby');
    const newWords = await generateVocab(topic, mode, usageContext);
    if (newWords.length > 0) {
      setWords(newWords);
      setGameState('playing');
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setIsFever(false);
      setupTurn(newWords, 0);
    }
  };

  const setupTurn = (wordList: VocabWord[], index: number) => {
    const current = wordList[index];
    const others = [
      "A mechanical device that processes information", 
      "A type of large underwater mammal", 
      "A rare gemstone from the deep ocean", 
      "A hidden secret chamber in a castle", 
      "A professional sports player", 
      "A futuristic vehicle for space travel"
    ];
    const shuffled = [current.definition, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setTimer(isFever ? 7 : 10);
    setFeedback(null);
  };

  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && timer > 0 && !feedback) {
      interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    } else if (timer === 0 && gameState === 'playing' && !feedback) {
      handleAnswer('');
    }
    return () => clearInterval(interval);
  }, [gameState, timer, feedback]);

  const handleAnswer = (selected: string) => {
    const isCorrect = selected === words[currentIndex].definition;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = (timer * 10) * (isFever ? 2 : 1) * (1 + Math.floor(newCombo / 3));
      setScore(s => s + points);
      if (newCombo >= 3) setIsFever(true);
    } else {
      setCombo(0);
      setIsFever(false);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        setupTurn(words, next);
      } else {
        setGameState('results');
        awardPoints(score, 'Word Rush Victory', 'vocabulary');
      }
    }, 600);
  };

  // --- Render Methods ---

  if (gameState === 'lobby') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-10 relative">
        {/* --- Main Lobby Content --- */}
        <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-fun-yellow rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white ring-8 ring-yellow-100 animate-bounce">
            <Zap size={64} className="text-white fill-current" />
            </div>
            <h2 className="text-6xl font-black text-slate-800 uppercase tracking-tighter rainbow-text">{t('word_rush')}</h2>
            <p className="text-xl font-bold text-slate-500 italic">{t('match_words')}</p>
            
            <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-xl space-y-6">
            <div className="text-left">
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block px-2">{t('choose_battleground')}</label>
                <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-5 rounded-3xl border-4 border-slate-50 font-black text-2xl text-center bg-slate-50 focus:border-fun-blue outline-none transition-all">
                {availableTopics.map(t => <option key={t}>{t}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <Button onClick={startGame} className="w-full py-6 text-2xl transform hover:scale-105 active:scale-95 shadow-xl" variant="success" icon={<Zap/>}>
                    {t('start_rush')}
                </Button>
            </div>
            </div>
        </div>
      </div>
    );
  }

  // --- Word Rush Active Game UI ---
  if (gameState === 'playing') {
    return (
      <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in transition-colors duration-500 ${isFever ? 'bg-orange-50/50 p-6 rounded-[4rem]' : ''}`}>
        <div className={`flex justify-between items-center ${isFever ? 'bg-orange-600 animate-pulse' : 'bg-slate-900'} text-white p-6 rounded-[2.5rem] shadow-2xl border-4 ${isFever ? 'border-orange-400' : 'border-slate-700'} transition-colors`}>
           <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-xl">
               <Clock className={timer < 4 ? "text-red-500 animate-wiggle" : "text-fun-blue"} size={32} />
             </div>
             <span className={`text-4xl font-black ${timer < 4 ? 'text-red-500' : 'text-white'}`}>{timer}s</span>
           </div>
           
           <div className="flex flex-col items-center">
              {combo > 1 && (
                <div className="absolute -top-12 animate-bounce bg-fun-yellow text-slate-900 px-4 py-1 rounded-full font-black text-sm border-2 border-white shadow-lg">
                  {combo}X COMBO! {isFever && t('fever_mode')}
                </div>
              )}
              <div className="text-3xl font-black text-fun-yellow tracking-widest flex items-center gap-2">
                <Flame size={24} className={isFever ? "text-orange-400 fill-current animate-pulse" : "hidden"} />
                XP: {score}
              </div>
           </div>
           
           <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-black opacity-60 uppercase">{currentIndex + 1} / {words.length}</div>
        </div>

        <div className={`p-12 bg-white rounded-[4rem] shadow-2xl border-b-[20px] transition-all text-center ${
          feedback === 'correct' ? 'border-fun-green scale-[1.05] animate-pop' : 
          feedback === 'wrong' ? 'border-fun-pink animate-wiggle' : 
          isFever ? 'border-orange-500 ring-8 ring-orange-100' : 'border-slate-100'
        }`}>
           <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 block ${isFever ? 'text-orange-500 animate-pulse' : 'text-slate-300'}`}>
             {isFever ? t('fever_mode') : 'WORD BATTLE'}
           </span>
           <h3 className={`text-8xl font-black mb-12 tracking-tight transition-colors ${isFever ? 'text-orange-600' : 'text-slate-800'}`}>
             {words[currentIndex].word}
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(opt)}
                  className={`p-6 text-xl font-black rounded-[2rem] border-4 transition-all text-left flex items-center gap-4 ${
                    feedback && opt === words[currentIndex].definition ? 'bg-fun-green border-green-600 text-white shadow-lg' :
                    feedback === 'wrong' && opt !== words[currentIndex].definition ? 'bg-slate-50 border-slate-100 opacity-40' :
                    'bg-white border-slate-50 hover:bg-slate-50 hover:border-fun-blue hover:translate-y-[-4px] text-slate-600 active:scale-95'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${feedback && opt === words[currentIndex].definition ? 'bg-white text-fun-green' : 'bg-slate-100 text-slate-400'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- Word Rush Results UI ---
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in py-20">
      <Confetti />
      <div className="relative inline-block">
        <Trophy size={160} className="mx-auto text-fun-yellow animate-bounce" />
        <Star className="absolute top-0 right-0 text-yellow-300 animate-pulse" size={40} />
        <Sparkles className="absolute bottom-0 left-0 text-cyan-400 animate-pulse" size={40} />
      </div>
      <h2 className="text-7xl font-black text-slate-800 tracking-tighter rainbow-text">{t('unstoppable')}</h2>
      <div className="bg-white p-12 rounded-[4rem] border-4 border-slate-100 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fun-pink via-fun-yellow to-fun-blue animate-pulse" />
         <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs mb-4">{t('loot_earned')}</p>
         <div className="text-9xl font-black text-fun-blue mb-6 tracking-tighter">{score} <span className="text-4xl text-slate-300">XP</span></div>
         <div className="flex justify-center gap-4 mb-10">
            <div className="bg-slate-50 px-6 py-2 rounded-2xl border-2 border-slate-100">
               <span className="text-xs font-black text-slate-400 block uppercase">{t('max_combo')}</span>
               <span className="text-2xl font-black text-slate-800">{combo}X</span>
            </div>
            <div className="bg-slate-50 px-6 py-2 rounded-2xl border-2 border-slate-100">
               <span className="text-xs font-black text-slate-400 block uppercase">{t('fever_state')}</span>
               <span className="text-2xl font-black text-slate-800">{isFever ? 'YES' : 'NO'}</span>
            </div>
         </div>
         <Button onClick={() => setGameState('lobby')} className="w-full py-5 text-2xl" variant="primary">{t('replay_arcade')}</Button>
      </div>
    </div>
  );
};

export default VocabBuilder;
