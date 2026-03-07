import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { BookOpen, MessageCircle, Mic, ArrowRight, CheckCircle, XCircle, Sparkles, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

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
  level: number;
  description: string;
  nodes: Record<string, StoryNode>;
  background: string;
  person: string;
}

const SCENARIOS: Record<string, Scenario> = {
  'coffee_shop': {
    id: 'coffee_shop',
    title: 'Coffee Shop Run',
    level: 1,
    description: 'Order a coffee politely.',
    background: 'https://i.ibb.co/0px38NbK/Layer-0-original.png',
    person: 'https://i.ibb.co/QyCJN1s/Layer-1-original.png',
    nodes: {
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
    }
  },
  'airport_checkin': {
    id: 'airport_checkin',
    title: 'Airport Check-in',
    level: 2,
    description: 'Check in for your flight and handle baggage.',
    background: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1200&q=80',
    person: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent&mouth=smile',
    nodes: {
      'start': {
        id: 'start',
        text: "You approach the check-in counter. The agent looks up from their screen.",
        speaker: "Narrator",
        options: [
          { text: "I want to go to London.", nextId: 'direct', isCorrect: false, feedback: "Try to be more formal. 'I'd like to check in...'" },
          { text: "Hello, I'd like to check in for my flight to London, please.", nextId: 'formal', isCorrect: true, feedback: "Excellent! Very professional." }
        ]
      },
      'direct': {
        id: 'direct',
        text: "The agent nods slowly. 'Passport and ticket, please. Do you have any bags to check?'",
        speaker: "Agent",
        options: [
          { text: "Yes, this bag.", nextId: 'bag_check', isCorrect: true, feedback: "Clear and simple." },
          { text: "No bags.", nextId: 'no_bags', isCorrect: true, feedback: "Straightforward." }
        ]
      },
      'formal': {
        id: 'formal',
        text: "The agent smiles. 'Certainly. May I see your passport? And are you checking any luggage today?'",
        speaker: "Agent",
        options: [
          { text: "Yes, I have one suitcase to check.", nextId: 'bag_check', isCorrect: true, feedback: "Perfect phrasing." },
          { text: "Just this carry-on, thank you.", nextId: 'no_bags', isCorrect: true, feedback: "Polite and clear." }
        ]
      },
      'bag_check': {
        id: 'bag_check',
        text: "Please place it on the scale. Oh, it's slightly overweight. That will be an extra $30.",
        speaker: "Agent",
        options: [
          { text: "Can I take some things out?", nextId: 'repack', isCorrect: true, feedback: "Good solution!" },
          { text: "Okay, I'll pay.", nextId: 'pay_fee', isCorrect: true, feedback: "Accepting the situation." }
        ]
      },
      'no_bags': {
        id: 'no_bags',
        text: "Great. Here is your boarding pass. Your gate is B12. Have a safe flight!",
        speaker: "Agent",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      },
      'repack': {
        id: 'repack',
        text: "Sure, you can do that over there. Come back when you're ready.",
        speaker: "Agent",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      },
      'pay_fee': {
        id: 'pay_fee',
        text: "Thank you. Here is your boarding pass. Gate B12. Enjoy your trip!",
        speaker: "Agent",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      }
    }
  },
  'grocery_store': {
    id: 'grocery_store',
    title: 'Grocery Store',
    level: 1,
    description: 'Find items and pay at the checkout.',
    background: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    person: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cashier&mouth=smile',
    nodes: {
      'start': {
        id: 'start',
        text: "You are looking for milk. You see a store employee.",
        speaker: "Narrator",
        options: [
          { text: "Where is milk?", nextId: 'direct', isCorrect: false, feedback: "Try: 'Excuse me, where can I find...'" },
          { text: "Excuse me, could you tell me where the milk is?", nextId: 'polite', isCorrect: true, feedback: "Great! Using 'Excuse me' is very polite." }
        ]
      },
      'direct': {
        id: 'direct',
        text: "The employee points to the back. 'Aisle 4.'",
        speaker: "Employee",
        options: [
          { text: "Thanks.", nextId: 'checkout', isCorrect: true, feedback: "Simple and okay." },
          { text: "Thank you very much!", nextId: 'checkout', isCorrect: true, feedback: "Being extra polite is always good." }
        ]
      },
      'polite': {
        id: 'polite',
        text: "Of course! It's in Aisle 4, right next to the eggs.",
        speaker: "Employee",
        options: [
          { text: "Thank you! Have a nice day.", nextId: 'checkout', isCorrect: true, feedback: "Perfect closing." }
        ]
      },
      'checkout': {
        id: 'checkout',
        text: "You go to the checkout. 'Paper or plastic?'",
        speaker: "Cashier",
        options: [
          { text: "Paper, please.", nextId: 'finish', isCorrect: true, feedback: "Good choice." },
          { text: "I have my own bag.", nextId: 'finish', isCorrect: true, feedback: "Eco-friendly!" }
        ]
      }
    }
  },
  'doctor_visit': {
    id: 'doctor_visit',
    title: 'Doctor\'s Visit',
    level: 2,
    description: 'Explain your symptoms to a doctor.',
    background: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    person: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor&mouth=serious',
    nodes: {
      'start': {
        id: 'start',
        text: "You are in the exam room. The doctor walks in.",
        speaker: "Narrator",
        options: [
          { text: "Hello, Doctor. I don't feel well.", nextId: 'symptoms', isCorrect: true, feedback: "Good start." }
        ]
      },
      'symptoms': {
        id: 'symptoms',
        text: "I'm sorry to hear that. What seems to be the problem?",
        speaker: "Doctor",
        options: [
          { text: "My head hurts.", nextId: 'headache', isCorrect: true, feedback: "Simple explanation." },
          { text: "I've had a persistent headache for two days.", nextId: 'headache_detailed', isCorrect: true, feedback: "More detailed! Doctors love details." }
        ]
      },
      'headache': {
        id: 'headache',
        text: "I see. Any other symptoms? Fever? Cough?",
        speaker: "Doctor",
        options: [
          { text: "No, just the headache.", nextId: 'advice', isCorrect: true, feedback: "Clear." },
          { text: "I also have a slight fever.", nextId: 'advice', isCorrect: true, feedback: "Important info." }
        ]
      },
      'headache_detailed': {
        id: 'headache_detailed',
        text: "That sounds uncomfortable. Are you sensitive to light?",
        speaker: "Doctor",
        options: [
          { text: "Yes, a little bit.", nextId: 'advice', isCorrect: true, feedback: "Helpful detail." },
          { text: "No, not really.", nextId: 'advice', isCorrect: true, feedback: "Good to know." }
        ]
      },
      'advice': {
        id: 'advice',
        text: "I'll prescribe some rest and plenty of water. If it doesn't improve, call me.",
        speaker: "Doctor",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      }
    }
  },
  'business_meeting': {
    id: 'business_meeting',
    title: 'Business Meeting',
    level: 3,
    description: 'Present your ideas in a professional setting.',
    background: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    person: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CEO&mouth=serious',
    nodes: {
      'start': {
        id: 'start',
        text: "The meeting begins. Everyone is waiting for your presentation.",
        speaker: "Narrator",
        options: [
          { text: "Let's start.", nextId: 'casual', isCorrect: false, feedback: "Try: 'Thank you all for coming. Let's begin...'" },
          { text: "Thank you all for being here. I'd like to present our quarterly results.", nextId: 'professional', isCorrect: true, feedback: "Very professional opening." }
        ]
      },
      'casual': {
        id: 'casual',
        text: "The team looks ready. 'What are the main points?'",
        speaker: "Colleague",
        options: [
          { text: "Sales are up.", nextId: 'details', isCorrect: true, feedback: "Direct." },
          { text: "We've seen a significant increase in user engagement.", nextId: 'details', isCorrect: true, feedback: "Better business vocabulary." }
        ]
      },
      'professional': {
        id: 'professional',
        text: "The CEO nods. 'Please, proceed. What's the key takeaway?'",
        speaker: "CEO",
        options: [
          { text: "Our new strategy is working well.", nextId: 'details', isCorrect: true, feedback: "Positive and clear." },
          { text: "The data suggests our recent campaign has exceeded expectations.", nextId: 'details', isCorrect: true, feedback: "Data-driven and professional." }
        ]
      },
      'details': {
        id: 'details',
        text: "Interesting. How do you plan to sustain this growth?",
        speaker: "CEO",
        options: [
          { text: "We will keep doing what we're doing.", nextId: 'end_neutral', isCorrect: false, feedback: "Try to be more specific about future plans." },
          { text: "We plan to expand our reach into new markets and optimize our current processes.", nextId: 'end_great', isCorrect: true, feedback: "Excellent strategic thinking!" }
        ]
      },
      'end_neutral': {
        id: 'end_neutral',
        text: "I see. Let's discuss this further in our next session.",
        speaker: "CEO",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      },
      'end_great': {
        id: 'end_great',
        text: "I'm impressed with your vision. Let's move forward with this plan.",
        speaker: "CEO",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      }
    }
  },
  'job_interview': {
    id: 'job_interview',
    title: 'Job Interview',
    level: 3,
    description: 'Practice answering common interview questions.',
    background: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    person: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager&mouth=serious',
    nodes: {
      'start': {
        id: 'start',
        text: "You sit down in the office. The interviewer looks at your resume.",
        speaker: "Narrator",
        options: [
          { text: "Tell me about yourself.", nextId: 'intro', isCorrect: true, feedback: "Be ready to summarize your experience." }
        ]
      },
      'intro': {
        id: 'intro',
        text: "I see you have some experience. Why do you want to work for this company?",
        speaker: "Interviewer",
        options: [
          { text: "I need a job.", nextId: 'bad_answer', isCorrect: false, feedback: "Too honest! Focus on the company's values." },
          { text: "I've always admired your company's innovation and I want to contribute my skills.", nextId: 'good_answer', isCorrect: true, feedback: "Great! Shows you did your research." }
        ]
      },
      'bad_answer': {
        id: 'bad_answer',
        text: "I see. And what are your strengths?",
        speaker: "Interviewer",
        options: [
          { text: "I'm a hard worker.", nextId: 'end_neutral', isCorrect: true, feedback: "A bit generic, but okay." },
          { text: "I'm great at problem-solving and working in teams.", nextId: 'end_good', isCorrect: true, feedback: "Much better!" }
        ]
      },
      'good_answer': {
        id: 'good_answer',
        text: "That's good to hear. Where do you see yourself in five years?",
        speaker: "Interviewer",
        options: [
          { text: "I hope to be in a leadership role within this company.", nextId: 'end_great', isCorrect: true, feedback: "Shows ambition and loyalty." },
          { text: "I'm not sure yet.", nextId: 'end_good', isCorrect: false, feedback: "Try to have a vision." }
        ]
      },
      'end_neutral': {
        id: 'end_neutral',
        text: "Thank you for your time. We'll be in touch.",
        speaker: "Interviewer",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      },
      'end_good': {
        id: 'end_good',
        text: "You've given some solid answers. We'll let you know our decision soon.",
        speaker: "Interviewer",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      },
      'end_great': {
        id: 'end_great',
        text: "Excellent. You seem like a great fit for our team. Expect a call from us!",
        speaker: "Interviewer",
        options: [
          { text: "Finish Story", nextId: 'finish' }
        ]
      }
    }
  }
};

const StoryMode: React.FC = () => {
  const navigate = useNavigate();
  const { awardPoints } = useGamification();
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentScenario = currentScenarioId ? SCENARIOS[currentScenarioId] : null;
  const currentNode = currentScenario ? currentScenario.nodes[currentNodeId] : null;

  const handleScenarioSelect = (id: string) => {
    setCurrentScenarioId(id);
    setCurrentNodeId('start');
    setHistory([]);
    setFeedback(null);
    setIsCompleted(false);
  };

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

  if (!currentScenario) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
        <div className="text-center space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight uppercase">
            Real Life Stories
          </h1>
          <p className="text-lg md:text-xl font-bold text-slate-500 max-w-2xl mx-auto">
            Practice your language skills in realistic scenarios. Choose a story to begin!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
          {Object.values(SCENARIOS).map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleScenarioSelect(scenario.id)}
              className="bg-white rounded-3xl md:rounded-[3rem] border-4 border-slate-100 shadow-xl overflow-hidden group hover:border-fun-blue transition-all cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={scenario.background} alt={scenario.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-fun-blue text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Level {scenario.level}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-black text-slate-800">{scenario.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-fun-green font-black text-xs uppercase tracking-widest">
                    <Sparkles size={16} />
                    +150 XP
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-fun-blue transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-8 animate-fade-in">
        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <CheckCircle size={64} className="text-white" />
        </div>
        <h2 className="text-4xl font-black text-slate-800">Story Complete!</h2>
        <p className="text-xl text-slate-500">You practiced real-life communication in "{currentScenario.title}".</p>
        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Rewards Earned</h3>
          <div className="flex justify-center gap-4">
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">+150 XP</div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">+1 Real Life Level</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setCurrentScenarioId(null)} variant="secondary" className="flex-1 py-4 text-xl">Back to Stories</Button>
          <Button onClick={() => navigate('/')} variant="primary" className="flex-1 py-4 text-xl">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setCurrentScenarioId(null)} className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle size={20} className="md:size-6 text-slate-400" />
          </button>
          <div className="bg-fun-blue p-2 md:p-3 rounded-xl text-white">
            <BookOpen size={20} className="md:size-6" />
          </div>
          <div>
            <h2 className="font-black text-lg md:text-2xl text-slate-800 line-clamp-1">{currentScenario.title}</h2>
            <p className="text-slate-400 font-bold text-[10px] md:text-sm">Real Life • Level {currentScenario.level}</p>
          </div>
        </div>
        <div className="bg-slate-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-[10px] md:text-sm text-slate-500 whitespace-nowrap">
          <span className="hidden xs:inline">Progress: </span>{Math.min(100, (history.length / 5 * 100))}%
        </div>
      </div>

      {/* Story Stage */}
      <div className="flex-1 bg-white rounded-3xl md:rounded-[3rem] shadow-2xl border-4 border-slate-100 overflow-hidden relative flex flex-col">
        {/* Visual / Context Area */}
        <div className="h-40 md:h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
           {/* Background Layer */}
           <img 
             src={currentScenario.background} 
             alt="Background" 
             className="absolute inset-0 w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
           
           {/* Person Layer with Movement */}
           <motion.img 
             src={currentScenario.person} 
             alt="Character" 
             className="relative h-full object-contain z-10"
             referrerPolicy="no-referrer"
             animate={{ 
               y: [0, -4, 0],
               rotate: [0, 0.5, 0, -0.5, 0],
               scale: [1, 1.01, 1]
             }}
             transition={{ 
               duration: 5, 
               repeat: Infinity, 
               ease: "easeInOut" 
             }}
           />
           
           {/* Subtle Overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Dialogue Area */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-between relative overflow-y-auto">
           {feedback && (
             <div className="absolute top-0 left-0 w-full bg-slate-900/90 backdrop-blur-sm text-white p-3 md:p-4 text-center font-bold z-10 animate-fade-in flex items-center justify-center gap-2 text-sm md:text-base">
               <Sparkles className="text-yellow-400 size-4 md:size-5" /> {feedback}
             </div>
           )}

           <div className="space-y-4 md:space-y-6">
             <div className="flex gap-3 md:gap-4 items-start">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl md:text-2xl border-2 border-slate-300 overflow-hidden shrink-0">
                 {currentNode?.speaker === 'Narrator' ? '📖' : <img src={currentScenario.person} className="w-full h-full object-cover" />}
               </div>
               <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl rounded-tl-none border-2 border-slate-100 shadow-sm max-w-[90%] md:max-w-[80%]">
                 <p className="font-bold text-slate-400 text-[10px] md:text-xs uppercase mb-1 md:mb-2">{currentNode?.speaker}</p>
                 <p className="text-base md:text-xl font-medium text-slate-800 leading-relaxed">{currentNode?.text}</p>
               </div>
             </div>
           </div>

           {/* Options */}
           <div className="grid grid-cols-1 gap-3 md:gap-4 mt-6 md:mt-8">
             {currentNode?.options.map((opt, idx) => (
               <button
                 key={idx}
                 onClick={() => handleOption(opt)}
                 className="p-4 md:p-5 rounded-xl md:rounded-2xl border-2 md:border-4 border-slate-100 bg-white hover:border-fun-blue hover:bg-blue-50 text-left transition-all group shadow-sm hover:shadow-md active:scale-98"
               >
                 <div className="flex items-center justify-between">
                   <span className="font-bold text-sm md:text-lg text-slate-700 group-hover:text-fun-blue">{opt.text}</span>
                   <ArrowRight className="text-slate-300 group-hover:text-fun-blue size-4 md:size-5" />
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
