import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { BookOpen, MessageCircle, Mic, ArrowRight, CheckCircle, XCircle, Sparkles, PlayCircle } from 'lucide-react';

interface StoryNode {
  id: string;
  text: string;
  speaker: string;
  options: {
    text: string;
    nextId: string;
    isCorrect?: boolean; // For learning moments
    feedback?: string;
  }[];
  background?: string;
}

const MOCK_STORY: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    text: "You arrive at the coffee shop. The barista smiles at you.",
    speaker: "Narrator",
    options: [
      { text: "Say 'Hello, I want coffee.'", nextId: 'rude', isCorrect: false, feedback: "A bit too direct! Try to be more polite." },
      { text: "Say 'Hi! Could I have a coffee, please?'", nextId: 'polite', isCorrect: true, feedback: "Perfect! 'Could I have' is very polite." }
    ]
  },
  'rude': {
    id: 'rude',
    text: "The barista looks a bit surprised but nods. 'Sure. What size?'",
    speaker: "Barista",
    options: [
      { text: "Big one.", nextId: 'end_neutral', isCorrect: false, feedback: "Try 'Large, please'." },
      { text: "A large, please.", nextId: 'end_good', isCorrect: true, feedback: "Much better!" }
    ]
  },
  'polite': {
    id: 'polite',
    text: "The barista beams. 'Of course! What can I get for you today?'",
    speaker: "Barista",
    options: [
      { text: "I'll have a latte.", nextId: 'end_great', isCorrect: true, feedback: "Great usage of 'I'll have'." },
      { text: "Give me a latte.", nextId: 'end_neutral', isCorrect: false, feedback: "A bit demanding." }
    ]
  },
  'end_neutral': {
    id: 'end_neutral',
    text: "Here is your coffee. That will be $5.",
    speaker: "Barista",
    options: [
      { text: "Finish Story", nextId: 'finish' }
    ]
  },
  'end_good': {
    id: 'end_good',
    text: "Here you go! Enjoy your day.",
    speaker: "Barista",
    options: [
      { text: "Finish Story", nextId: 'finish' }
    ]
  },
  'end_great': {
    id: 'end_great',
    text: "Coming right up! That's $5. Have a wonderful morning!",
    speaker: "Barista",
    options: [
      { text: "Finish Story", nextId: 'finish' }
    ]
  }
};

const StoryMode: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentNode = MOCK_STORY[currentNodeId];

  const handleOption = (option: any) => {
    if (option.feedback) {
      setFeedback(option.feedback);
      // Delay moving to next node to show feedback
      setTimeout(() => {
        setFeedback(null);
        if (option.nextId === 'finish') {
          finishStory();
        } else {
          setCurrentNodeId(option.nextId);
        }
      }, 2000);
    } else {
      if (option.nextId === 'finish') {
        finishStory();
      } else {
        setCurrentNodeId(option.nextId);
      }
    }
  };

  const finishStory = () => {
    setIsCompleted(true);
    awardPoints(150, 'Story Completed', 'realLife');
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-8 animate-fade-in">
        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <CheckCircle size={64} className="text-white" />
        </div>
        <h2 className="text-4xl font-black text-slate-800">Story Complete!</h2>
        <p className="text-xl text-slate-500">You practiced real-life communication.</p>
        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Rewards Earned</h3>
          <div className="flex justify-center gap-4">
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">+150 XP</div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">+1 Real Life Level</div>
          </div>
        </div>
        <Button onClick={() => navigate('/')} variant="primary" className="w-full py-4 text-xl">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-fun-blue p-3 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-800">Coffee Shop Run</h2>
            <p className="text-slate-400 font-bold text-sm">Real Life • Level 1</p>
          </div>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-500">
          Progress: {history.length / 5 * 100}%
        </div>
      </div>

      {/* Story Stage */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border-4 border-slate-100 overflow-hidden relative flex flex-col">
        {/* Visual / Context Area */}
        <div className="h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
           <div className="text-9xl animate-float">☕</div>
        </div>

        {/* Dialogue Area */}
        <div className="flex-1 p-8 flex flex-col justify-between relative">
           {feedback && (
             <div className="absolute top-0 left-0 w-full bg-slate-900/90 backdrop-blur-sm text-white p-4 text-center font-bold z-10 animate-fade-in flex items-center justify-center gap-2">
               <Sparkles className="text-yellow-400" /> {feedback}
             </div>
           )}

           <div className="space-y-6">
             <div className="flex gap-4 items-start">
               <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-2xl border-2 border-slate-300">
                 {currentNode.speaker === 'Narrator' ? '📖' : '👩‍🍳'}
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border-2 border-slate-100 shadow-sm max-w-[80%]">
                 <p className="font-bold text-slate-400 text-xs uppercase mb-2">{currentNode.speaker}</p>
                 <p className="text-xl font-medium text-slate-800 leading-relaxed">{currentNode.text}</p>
               </div>
             </div>
           </div>

           {/* Options */}
           <div className="grid grid-cols-1 gap-4 mt-8">
             {currentNode.options.map((opt, idx) => (
               <button
                 key={idx}
                 onClick={() => handleOption(opt)}
                 className="p-5 rounded-2xl border-4 border-slate-100 bg-white hover:border-fun-blue hover:bg-blue-50 text-left transition-all group shadow-sm hover:shadow-md active:scale-98"
               >
                 <div className="flex items-center justify-between">
                   <span className="font-bold text-lg text-slate-700 group-hover:text-fun-blue">{opt.text}</span>
                   <ArrowRight className="text-slate-300 group-hover:text-fun-blue" />
                 </div>
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;
