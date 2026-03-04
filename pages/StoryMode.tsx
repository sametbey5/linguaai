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

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  story: Record<string, StoryNode>;
}

const COFFEE_SHOP_STORY: Record<string, StoryNode> = {
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

const TRAIN_STATION_STORY: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    text: 'You arrive at the train station ticket counter. The clerk waves at you.',
    speaker: 'Narrator',
    options: [
      { text: "Ticket. City center.", nextId: 'rude', isCorrect: false, feedback: 'Understandable, but too abrupt. Try a full polite request.' },
      { text: "Hi! Could I get a ticket to the city center, please?", nextId: 'polite', isCorrect: true, feedback: 'Excellent! That sounds natural and polite.' }
    ]
  },
  'rude': {
    id: 'rude',
    text: "The clerk nods. 'One-way or round-trip?'",
    speaker: 'Clerk',
    options: [
      { text: 'Return.', nextId: 'end_neutral', isCorrect: false, feedback: "Try saying 'A round-trip ticket, please.'" },
      { text: 'A round-trip ticket, please.', nextId: 'end_good', isCorrect: true, feedback: 'Great recovery!' }
    ]
  },
  'polite': {
    id: 'polite',
    text: "'Sure! One-way or round-trip?' the clerk asks.",
    speaker: 'Clerk',
    options: [
      { text: 'Round-trip, please.', nextId: 'end_great', isCorrect: true, feedback: 'Nice and clear!' },
      { text: 'Just give me the normal one.', nextId: 'end_neutral', isCorrect: false, feedback: 'A bit unclear. Be specific.' }
    ]
  },
  'end_neutral': {
    id: 'end_neutral',
    text: 'Okay, your ticket is ready. That will be $8.',
    speaker: 'Clerk',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  },
  'end_good': {
    id: 'end_good',
    text: 'Perfect, here is your round-trip ticket. Have a safe journey!',
    speaker: 'Clerk',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  },
  'end_great': {
    id: 'end_great',
    text: 'Great choice! Platform 3, departure in 10 minutes. Have a good trip!',
    speaker: 'Clerk',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  }
};

const PHARMACY_STORY: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    text: 'You enter a pharmacy. The pharmacist smiles and asks how they can help.',
    speaker: 'Narrator',
    options: [
      { text: "Need medicine. Head hurts.", nextId: 'rude', isCorrect: false, feedback: 'The message is clear, but try a polite sentence.' },
      { text: "Hi, could you recommend something for a headache, please?", nextId: 'polite', isCorrect: true, feedback: 'Great request! Polite and specific.' }
    ]
  },
  'rude': {
    id: 'rude',
    text: "The pharmacist nods. 'Do you prefer tablets or syrup?'",
    speaker: 'Pharmacist',
    options: [
      { text: 'Tablets.', nextId: 'end_neutral', isCorrect: false, feedback: "Try 'Tablets, please.'" },
      { text: 'Tablets, please.', nextId: 'end_good', isCorrect: true, feedback: 'Much better!' }
    ]
  },
  'polite': {
    id: 'polite',
    text: "'Of course. Do you prefer tablets or syrup?'",
    speaker: 'Pharmacist',
    options: [
      { text: 'Tablets, please.', nextId: 'end_great', isCorrect: true, feedback: 'Excellent response.' },
      { text: 'Whatever, just fast.', nextId: 'end_neutral', isCorrect: false, feedback: 'A bit impolite. Keep your tone friendly.' }
    ]
  },
  'end_neutral': {
    id: 'end_neutral',
    text: 'Here you are. Please follow the instructions on the box.',
    speaker: 'Pharmacist',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  },
  'end_good': {
    id: 'end_good',
    text: 'Great. Take one tablet every 8 hours after meals.',
    speaker: 'Pharmacist',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  },
  'end_great': {
    id: 'end_great',
    text: 'Perfect. Let me know if you have allergies. Get well soon!',
    speaker: 'Pharmacist',
    options: [{ text: 'Finish Story', nextId: 'finish' }]
  }
};

const STORY_SCENARIOS: Scenario[] = [
  {
    id: 'coffee-shop',
    title: 'Coffee Shop Run',
    subtitle: 'Real Life • Level 1',
    icon: '☕',
    story: COFFEE_SHOP_STORY
  },
  {
    id: 'train-station',
    title: 'Train Station Tickets',
    subtitle: 'Real Life • Level 2',
    icon: '🚆',
    story: TRAIN_STATION_STORY
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy Help',
    subtitle: 'Real Life • Level 2',
    icon: '💊',
    story: PHARMACY_STORY
  }
];

const StoryMode: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [selectedScenarioId, setSelectedScenarioId] = useState(STORY_SCENARIOS[0].id);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedScenario = STORY_SCENARIOS.find((scenario) => scenario.id === selectedScenarioId) || STORY_SCENARIOS[0];
  const currentNode = selectedScenario.story[currentNodeId];

  const resetStoryProgress = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setFeedback(null);
    setIsCompleted(false);
  };

  const handleScenarioChange = (scenarioId: string) => {
    if (scenarioId === selectedScenarioId) return;
    setSelectedScenarioId(scenarioId);
    resetStoryProgress();
  };

  const handleOption = (option: any) => {
    setHistory((prev) => [...prev, option.text]);
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
            <h2 className="font-black text-2xl text-slate-800">{selectedScenario.title}</h2>
            <p className="text-slate-400 font-bold text-sm">{selectedScenario.subtitle}</p>
          </div>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-500">
          Progress: {history.length / 5 * 100}%
        </div>
      </div>

      {/* Story Stage */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border-4 border-slate-100 overflow-hidden relative flex flex-col">
        <div className="px-6 pt-6 pb-3 flex gap-3 overflow-x-auto">
          {STORY_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap border-2 transition-all ${
                scenario.id === selectedScenarioId
                  ? 'bg-fun-blue text-white border-fun-blue'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-fun-blue hover:text-fun-blue'
              }`}
            >
              {scenario.icon} {scenario.title}
            </button>
          ))}
        </div>

        {/* Visual / Context Area */}
        <div className="h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
           <div className="text-9xl animate-float">{selectedScenario.icon}</div>
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
