
import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { Mic, MicOff, Play, RotateCcw, CheckCircle2, AlertCircle, Trophy, Star, ArrowRight, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from '../components/Confetti';

interface Phrase {
  text: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

const PHRASES: Phrase[] = [
  { text: "Hello, how are you today?", difficulty: 'Beginner', category: 'Greetings' },
  { text: "I would like to order a cup of coffee.", difficulty: 'Beginner', category: 'Food & Drink' },
  { text: "The weather is very nice this afternoon.", difficulty: 'Beginner', category: 'Weather' },
  { text: "Could you please tell me where the nearest station is?", difficulty: 'Intermediate', category: 'Travel' },
  { text: "I have been studying English for three months.", difficulty: 'Intermediate', category: 'Education' },
  { text: "It is important to practice speaking every day.", difficulty: 'Intermediate', category: 'General' },
  { text: "The phenomenon was particularly fascinating to the researchers.", difficulty: 'Advanced', category: 'Science' },
  { text: "She sells seashells by the seashore.", difficulty: 'Advanced', category: 'Tongue Twister' },
  { text: "The entrepreneurial spirit is essential for innovation.", difficulty: 'Advanced', category: 'Business' },
  { text: "Peter Piper picked a peck of pickled peppers.", difficulty: 'Advanced', category: 'Tongue Twister' },
];

const PronunciationPractice: React.FC = () => {
  const { awardPoints, mode } = useGamification();
  const isKids = mode === 'kids';

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const currentPhrase = PHRASES[currentPhraseIndex];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setTranscript(result);
        evaluatePronunciation(result, confidence);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError("Your browser does not support speech recognition. Please try Chrome or Edge.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript('');
    setScore(null);
    setFeedback(null);
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const evaluatePronunciation = (result: string, confidence: number) => {
    const target = currentPhrase.text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const actual = result.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

    // Simple word match score
    const targetWords = target.split(' ');
    const actualWords = actual.split(' ');
    
    let matches = 0;
    targetWords.forEach(word => {
      if (actualWords.includes(word)) matches++;
    });

    const accuracy = (matches / targetWords.length) * 100;
    // Combine accuracy with API confidence
    const finalScore = Math.round((accuracy * 0.7) + (confidence * 100 * 0.3));
    
    setScore(finalScore);

    if (finalScore >= 90) {
      setFeedback("Perfect! You sound like a native speaker!");
      setShowConfetti(true);
      awardPoints(50, 'Perfect Pronunciation', 'speaking');
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (finalScore >= 70) {
      setFeedback("Great job! Just a few small improvements needed.");
      awardPoints(30, 'Good Pronunciation', 'speaking');
    } else if (finalScore >= 40) {
      setFeedback("Not bad! Try to speak more clearly and focus on each word.");
      awardPoints(10, 'Pronunciation Practice', 'speaking');
    } else {
      setFeedback("Keep practicing! Try listening to the phrase again.");
    }
  };

  const speakPhrase = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase.text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const nextPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    setTranscript('');
    setScore(null);
    setFeedback(null);
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      {showConfetti && <Confetti />}
      
      <div className="text-center space-y-4 px-4">
        <div className="inline-block bg-fun-green/10 p-4 rounded-full mb-2">
            <Mic size={48} className="text-fun-green" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
           PRONUNCIATION LAB
        </h2>
        <p className="text-lg sm:text-xl font-bold text-slate-500 max-w-2xl mx-auto">
           Listen, speak, and master your English accent! 🎤
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[3rem] border-4 border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 sm:p-6">
            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                currentPhrase.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                currentPhrase.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
            }`}>
                {currentPhrase.difficulty}
            </span>
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={currentPhraseIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center space-y-8"
            >
                <div className="space-y-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{currentPhrase.category}</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                        "{currentPhrase.text}"
                    </h3>
                </div>

                <div className="flex gap-3 sm:gap-4">
                    <button 
                        onClick={speakPhrase}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        title="Listen to phrase"
                    >
                        <Volume2 size={24} className="sm:w-8 sm:h-8" />
                    </button>
                    
                    <button 
                        onClick={isListening ? stopListening : startListening}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
                            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-fun-blue text-white'
                        }`}
                    >
                        {isListening ? <MicOff size={32} className="sm:w-10 sm:h-10" /> : <Mic size={32} className="sm:w-10 sm:h-10" />}
                    </button>

                    <button 
                        onClick={nextPhrase}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        title="Next phrase"
                    >
                        <ArrowRight size={24} className="sm:w-8 sm:h-8" />
                    </button>
                </div>

                {isListening && (
                    <div className="flex items-center gap-2 text-fun-blue font-black animate-pulse">
                        <div className="w-2 h-2 bg-fun-blue rounded-full" />
                        <div className="w-2 h-2 bg-fun-blue rounded-full" />
                        <div className="w-2 h-2 bg-fun-blue rounded-full" />
                        <span>Listening...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 font-bold">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {transcript && !isListening && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 w-full"
                    >
                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">You said:</span>
                            <p className="text-2xl font-bold text-slate-700 italic">"{transcript}"</p>
                        </div>

                        {score !== null && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white p-6 rounded-3xl border-4 border-slate-50 shadow-sm flex flex-col items-center justify-center"
                                >
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Accuracy Score</span>
                                    <div className={`text-5xl font-black ${
                                        score >= 80 ? 'text-fun-green' : score >= 50 ? 'text-fun-yellow' : 'text-fun-orange'
                                    }`}>
                                        {score}%
                                    </div>
                                    <div className="flex gap-1 mt-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                size={20} 
                                                className={`${score >= star * 20 ? 'text-fun-yellow fill-current' : 'text-slate-200'}`} 
                                            />
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white p-6 rounded-3xl border-4 border-slate-50 shadow-sm flex flex-col items-center justify-center"
                                >
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Feedback</span>
                                    <p className="text-lg font-bold text-slate-700">{feedback}</p>
                                    {score >= 70 ? (
                                        <CheckCircle2 size={32} className="text-fun-green mt-3" />
                                    ) : (
                                        <RotateCcw 
                                            size={32} 
                                            className="text-fun-blue mt-3 cursor-pointer hover:rotate-180 transition-transform" 
                                            onClick={startListening}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-fun-blue/10 rounded-xl flex items-center justify-center text-fun-blue">
                  <Trophy size={24} />
              </div>
              <div>
                  <h4 className="font-black text-slate-800">Daily Goal</h4>
                  <p className="text-xs font-bold text-slate-400">3/5 Phrases</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-fun-pink/10 rounded-xl flex items-center justify-center text-fun-pink">
                  <Star size={24} />
              </div>
              <div>
                  <h4 className="font-black text-slate-800">Best Score</h4>
                  <p className="text-xs font-bold text-slate-400">98% Accuracy</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-fun-purple/10 rounded-xl flex items-center justify-center text-fun-purple">
                  <RotateCcw size={24} />
              </div>
              <div>
                  <h4 className="font-black text-slate-800">Total Practice</h4>
                  <p className="text-xs font-bold text-slate-400">124 Phrases</p>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export default PronunciationPractice;
