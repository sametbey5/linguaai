
import React, { useState, useEffect } from 'react';
import { generateVocab, generateQuiz } from '../services/geminiService';
import { VocabWord, QuizQuestion } from '../types';
import Button from '../components/Button';
import { Zap, Star, Trophy, Clock, Flame, Sparkles, BookOpen, CheckCircle, XCircle, Brain, ArrowRight } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import Confetti from '../components/Confetti';

const VocabBuilder: React.FC = () => {
  const { mode, awardPoints } = useGamification();
  const isKids = mode === 'kids';
  
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

  // Quiz Mode State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizState, setQuizState] = useState<'loading' | 'active' | 'summary'>('loading');
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null); // 'correct' | 'wrong'
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const availableTopics = ["Animals", "Space", "Technology"];
  const [topic, setTopic] = useState(availableTopics[0]);

  // --- Word Rush Logic ---
  const startGame = async () => {
    setGameState('lobby');
    const newWords = await generateVocab(topic, mode);
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
        awardPoints(score, 'Word Rush Victory');
      }
    }, 600);
  };

  // --- Quiz Mode Logic ---
  const startQuiz = async () => {
    setShowQuiz(true);
    setQuizState('loading');
    const qs = await generateQuiz(topic);
    setQuizQuestions(qs);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizState('active');
    setQuizFeedback(null);
    setSelectedQuizOption(null);
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizFeedback) return; // Prevent double clicks
    
    setSelectedQuizOption(answer);
    const currentQ = quizQuestions[quizIndex];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setQuizFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setQuizScore(s => s + 1);

    setTimeout(() => {
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex(i => i + 1);
            setQuizFeedback(null);
            setSelectedQuizOption(null);
        } else {
            setQuizState('summary');
            awardPoints(quizScore * 50, 'Quiz Completed');
        }
    }, 1500);
  };

  const closeQuiz = () => {
      setShowQuiz(false);
      setQuizState('loading');
  };

  // --- Render Methods ---

  if (gameState === 'lobby') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-10 relative">
        {/* Quiz Modal Overlay */}
        {showQuiz && (
            <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`w-full max-w-2xl ${isKids ? 'bg-white rounded-[3rem] border-8 border-slate-100' : 'bg-slate-800 rounded-xl border border-slate-700'} shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]`}>
                    
                    {/* Header */}
                    <div className={`p-6 ${isKids ? 'bg-slate-100 border-b-4 border-slate-200' : 'bg-slate-900 border-b border-slate-700'} flex justify-between items-center`}>
                        <h3 className={`${isKids ? 'text-3xl font-black text-slate-700' : 'text-xl font-bold text-white'} flex items-center gap-2`}>
                            <Brain className={isKids ? "text-fun-purple" : "text-blue-500"} />
                            {quizState === 'summary' ? 'Quiz Results' : 'Review Quiz'}
                        </h3>
                        <button onClick={closeQuiz} className="bg-slate-200 p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
                            <XCircle size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto">
                        {quizState === 'loading' && (
                            <div className="text-center py-20">
                                <div className="animate-spin text-fun-blue text-6xl mb-4">⏳</div>
                                <p className="font-bold text-slate-400">Generating Questions...</p>
                            </div>
                        )}

                        {quizState === 'active' && quizQuestions.length > 0 && (
                            <div className="space-y-6">
                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${isKids ? 'bg-fun-purple' : 'bg-blue-600'}`} 
                                        style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-right text-xs font-bold text-slate-400">Question {quizIndex + 1} of {quizQuestions.length}</div>

                                {/* Question */}
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 ${isKids ? 'bg-slate-100 text-slate-500' : 'bg-slate-700 text-slate-300'}`}>
                                        {quizQuestions[quizIndex].type === 'fill-blank' ? 'Fill in the Blank' : 'Multiple Choice'}
                                    </span>
                                    <h4 className={`${isKids ? 'text-2xl font-black text-slate-800' : 'text-xl font-semibold text-white'} leading-relaxed`}>
                                        {quizQuestions[quizIndex].question}
                                    </h4>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 gap-3">
                                    {quizQuestions[quizIndex].options.map((option, idx) => {
                                        let statusClass = '';
                                        if (quizFeedback) {
                                            if (option === quizQuestions[quizIndex].correctAnswer) statusClass = isKids ? 'bg-green-100 border-green-400 text-green-700' : 'bg-green-900/30 border-green-500 text-green-200';
                                            else if (option === selectedQuizOption) statusClass = isKids ? 'bg-red-100 border-red-400 text-red-700' : 'bg-red-900/30 border-red-500 text-red-200 opacity-60';
                                            else statusClass = 'opacity-40';
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={!!quizFeedback}
                                                onClick={() => handleQuizAnswer(option)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all font-bold ${
                                                    statusClass ? statusClass : 
                                                    isKids 
                                                        ? 'bg-white border-slate-200 hover:border-fun-purple hover:bg-purple-50 text-slate-700' 
                                                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Feedback Message */}
                                {quizFeedback && (
                                    <div className={`mt-4 text-center font-black animate-fade-in ${quizFeedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                        {quizFeedback === 'correct' ? '🎉 Correct!' : `❌ Correct answer: ${quizQuestions[quizIndex].correctAnswer}`}
                                        <p className="text-slate-400 text-xs mt-1 font-normal">{quizQuestions[quizIndex].explanation}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {quizState === 'summary' && (
                            <div className="text-center space-y-6">
                                {quizScore === quizQuestions.length && <Confetti />}
                                <div className="inline-block relative">
                                    <Trophy size={80} className={`mx-auto ${quizScore > quizQuestions.length / 2 ? 'text-yellow-400' : 'text-slate-300'}`} />
                                </div>
                                
                                <div>
                                    <h2 className={`${isKids ? 'text-4xl font-black text-slate-800' : 'text-2xl font-bold text-white'}`}>Quiz Complete!</h2>
                                    <p className="text-slate-500 mt-2">You scored</p>
                                    <div className={`text-6xl font-black my-4 ${isKids ? 'text-fun-purple' : 'text-blue-500'}`}>
                                        {quizScore}/{quizQuestions.length}
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button onClick={closeQuiz} variant="secondary">Close</Button>
                                    <Button onClick={startQuiz} variant={isKids ? "primary" : "pro-primary"} icon={<ArrowRight size={18}/>}>Retry Quiz</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- Main Lobby Content --- */}
        <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-fun-yellow rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white ring-8 ring-yellow-100 animate-bounce">
            <Zap size={64} className="text-white fill-current" />
            </div>
            <h2 className="text-6xl font-black text-slate-800 uppercase tracking-tighter rainbow-text">WORD RUSH</h2>
            <p className="text-xl font-bold text-slate-500 italic">Match words to meanings. Get combos for DOUBLE XP!</p>
            
            <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-xl space-y-6">
            <div className="text-left">
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block px-2">Choose Your Battleground</label>
                <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-5 rounded-3xl border-4 border-slate-50 font-black text-2xl text-center bg-slate-50 focus:border-fun-blue outline-none transition-all">
                {availableTopics.map(t => <option key={t}>{t}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={startGame} className="w-full py-6 text-2xl transform hover:scale-105 active:scale-95 shadow-xl" variant="success" icon={<Zap/>}>
                    START RUSH
                </Button>
                <Button onClick={startQuiz} className="w-full py-6 text-2xl transform hover:scale-105 active:scale-95 shadow-xl" variant="secondary" icon={<BookOpen/>}>
                    TAKE QUIZ
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
                  {combo}X COMBO! {isFever && "🔥 FEVER 🔥"}
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
             {isFever ? 'FEVER MODE ACTIVE' : 'WORD BATTLE'}
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
      <h2 className="text-7xl font-black text-slate-800 tracking-tighter rainbow-text">UNSTOPPABLE!</h2>
      <div className="bg-white p-12 rounded-[4rem] border-4 border-slate-100 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fun-pink via-fun-yellow to-fun-blue animate-pulse" />
         <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs mb-4">Loot Earned</p>
         <div className="text-9xl font-black text-fun-blue mb-6 tracking-tighter">{score} <span className="text-4xl text-slate-300">XP</span></div>
         <div className="flex justify-center gap-4 mb-10">
            <div className="bg-slate-50 px-6 py-2 rounded-2xl border-2 border-slate-100">
               <span className="text-xs font-black text-slate-400 block uppercase">Max Combo</span>
               <span className="text-2xl font-black text-slate-800">{combo}X</span>
            </div>
            <div className="bg-slate-50 px-6 py-2 rounded-2xl border-2 border-slate-100">
               <span className="text-xs font-black text-slate-400 block uppercase">Fever State</span>
               <span className="text-2xl font-black text-slate-800">{isFever ? 'YES' : 'NO'}</span>
            </div>
         </div>
         <Button onClick={() => setGameState('lobby')} className="w-full py-5 text-2xl" variant="primary">REPLAY ARCADE</Button>
      </div>
    </div>
  );
};

export default VocabBuilder;
