
import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Heart, Backpack, Sword, Shield, Zap, Globe } from 'lucide-react';
import { QUESTS_KIDS, QUESTS_ADULTS } from '../constants';
import { Message, Scenario } from '../types';
import { useGamification } from '../context/GamificationContext';
import { SCENARIO_TRANSLATIONS, UI_TRANSLATIONS } from '../translations';

// Mock Chat Service
const createMockChat = (systemInstruction: string) => {
  return {
    sendMessage: async ({ message }: { message: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        text: `(AI Removed) You said: "${message}". This is a mock response because the AI service has been removed.`
      };
    }
  };
};
// Added missing Button import
import Button from '../components/Button';

const QuestAdventure: React.FC = () => {
  const { mode, awardPoints, usageContext, preferredLanguage } = useGamification();
  const isKids = mode === 'kids';
  
  const t = (key: string) => UI_TRANSLATIONS[preferredLanguage]?.[key] || UI_TRANSLATIONS['Turkish']?.[key] || key;
  const translateScenario = (id: string, field: 'title' | 'description', fallback: string) => {
    return SCENARIO_TRANSLATIONS[preferredLanguage]?.[id]?.[field] || fallback;
  };

  const [selectedQuest, setSelectedQuest] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [health, setHealth] = useState(3);
  const [inventory, setInventory] = useState<string[]>(['Basic Compass']);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Quests based on Context
  const getQuests = () => {
    if (isKids) return QUESTS_KIDS;
    
    const baseQuests = [...QUESTS_ADULTS];
    
    if (usageContext === 'Travel') {
      baseQuests.push({
        id: 'quest-travel-1',
        title: 'Airport Check-in',
        description: 'Navigate through customs and check-in without missing your flight!',
        emoji: '✈️',
        character: 'Officer Smith',
        avatar: '👮',
        themeColor: 'from-sky-500 to-blue-600',
        difficulty: 'Intermediate',
        systemInstruction: "You are an immigration officer. The user is a traveler. Ask them questions about their visa, purpose of visit, and luggage. If they hesitate or make big mistakes, they lose a 'Patience Heart'."
      });
      baseQuests.push({
        id: 'quest-travel-2',
        title: 'Lost in Tokyo',
        description: 'Ask locals for directions to your hotel. Don\'t get lost!',
        emoji: '🗺️',
        character: 'Local Guide',
        avatar: '🎎',
        themeColor: 'from-red-500 to-pink-600',
        difficulty: 'Beginner',
        systemInstruction: "You are a helpful local. The user is lost. Give them directions but test their listening skills."
      });
    } else if (usageContext === 'Business') {
       baseQuests.push({
        id: 'quest-business-2',
        title: 'Salary Negotiation',
        description: 'Negotiate your new contract. Be firm but polite!',
        emoji: '💰',
        character: 'HR Manager',
        avatar: '👔',
        themeColor: 'from-green-600 to-emerald-800',
        difficulty: 'Advanced',
        systemInstruction: "You are an HR Manager. The user wants a raise. You are tough but fair. If they are rude or unclear, they lose a 'Negotiation Heart'."
      });
    } else if (usageContext === 'Academic') {
       baseQuests.push({
        id: 'quest-academic-1',
        title: 'Thesis Defense',
        description: 'Defend your research paper against the professor\'s questions.',
        emoji: '🎓',
        character: 'Professor X',
        avatar: '👨‍🏫',
        themeColor: 'from-amber-600 to-orange-800',
        difficulty: 'Advanced',
        systemInstruction: "You are a strict Professor. The user is defending their thesis. Ask hard questions. If they can't explain clearly, they lose a 'Grade Heart'."
      });
    }

    return baseQuests;
  };

  const quests = getQuests();

  const startQuest = async (quest: Scenario) => {
    setSelectedQuest(quest);
    setHealth(3);
    setMessages([]);
    setInventory(['Map of ' + quest.character + "'s World"]);
    setIsLoading(true);
    
    const chat = createMockChat(quest.systemInstruction);
    setActiveChat(chat);
    
    try {
      const result = await chat.sendMessage({ message: "Start the game! Give me my first objective." });
      setMessages([{ id: 'init', role: 'model', text: result.text || "Welcome to the quest!" }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || health <= 0) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await activeChat.sendMessage({ message: inputText });
      const reply = result.text || "The story continues...";
      
      // Simulated "damage" or "loot" detection for game feel
      if (reply.toLowerCase().includes('fail') || reply.toLowerCase().includes('mistake')) {
        setHealth(h => Math.max(0, h - 1));
      }
      if (reply.toLowerCase().includes('found') || reply.toLowerCase().includes('received')) {
        setInventory(prev => [...prev, 'Mysterious Item']);
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: reply }]);
      awardPoints(25, 'Action Performed', 'speaking');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedQuest) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 animate-fade-in py-6 sm:py-10 px-4">
        <div className="text-center space-y-4">
           <h2 className="text-4xl sm:text-6xl font-black text-slate-800 uppercase tracking-tighter">
             AI ADVENTURES
             {preferredLanguage && preferredLanguage !== 'English' && (
               <span className="block text-xl sm:text-2xl text-fun-blue mt-2 opacity-80">
                 {t('ai_adventures')}
               </span>
             )}
           </h2>
           <p className="text-lg sm:text-xl font-bold text-slate-500">
             Embark on epic quests. Your English is your weapon!
             {preferredLanguage && preferredLanguage !== 'English' && (
               <span className="block text-xs sm:text-sm text-slate-400 mt-1 italic">
                 {t('embark_quests')}
               </span>
             )}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
           {quests.map(q => (
             <div key={q.id} onClick={() => startQuest(q)} className={`p-6 sm:p-8 bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border-b-[8px] sm:border-b-[12px] border-slate-100 cursor-pointer hover:scale-105 active:scale-95 transition-all group overflow-hidden relative`}>
                <div className="flex justify-between items-start z-10 relative">
                   <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{q.title}</h3>
                      {preferredLanguage && preferredLanguage !== 'English' && (
                        <p className="text-fun-blue font-bold text-sm mt-1 flex items-center gap-1">
                          <Globe size={14} /> {translateScenario(q.id, 'title', '')}
                        </p>
                      )}
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{q.character}</p>
                   </div>
                   <div className="text-6xl group-hover:scale-125 transition-transform">{q.avatar}</div>
                </div>
                <p className="mt-6 text-slate-600 font-medium leading-relaxed z-10 relative">{q.description}</p>
                {preferredLanguage && preferredLanguage !== 'English' && (
                  <p className="mt-2 text-slate-400 font-medium italic text-sm z-10 relative">
                    {translateScenario(q.id, 'description', '')}
                  </p>
                )}
                <div className="mt-8 flex gap-2 z-10 relative">
                   <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-400 border border-slate-100">{q.difficulty}</div>
                   <div className="bg-fun-blue/10 px-3 py-1 rounded-full text-[10px] font-black uppercase text-fun-blue border border-fun-blue/20">3 HEARTS</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-7xl mx-auto animate-fade-in px-2 sm:px-4">
      {/* Game View */}
      <div className="flex-1 bg-white rounded-[2rem] sm:rounded-[3rem] border-4 border-slate-100 shadow-2xl flex flex-col overflow-hidden">
        <header className="p-4 sm:p-6 bg-slate-900 text-white flex justify-between items-center px-6 sm:px-10">
           <button onClick={() => setSelectedQuest(null)} className="hover:bg-white/10 p-1 sm:p-2 rounded-xl"><ChevronLeft size={24} className="sm:w-8 sm:h-8"/></button>
           <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex gap-1">
                 {[...Array(3)].map((_, i) => (
                   <Heart key={i} size={18} className={`${i < health ? "text-fun-pink fill-current" : "text-white/20"} sm:w-6 sm:h-6`} />
                 ))}
              </div>
              <div className="h-6 sm:h-8 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                 <Zap className="text-fun-yellow fill-current sm:w-6 sm:h-6" size={18} />
                 <span className="font-black text-sm sm:text-base">LVL 1</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-4 sm:space-y-6 bg-slate-50/50">
           {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-6 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg shadow-lg ${msg.role === 'user' ? 'bg-fun-blue text-white' : 'bg-white border-2 border-slate-100 text-slate-800'}`}>
                   {msg.text}
                </div>
             </div>
           ))}
            {health <= 0 && (
             <div className="bg-red-500 text-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl text-center font-black text-xl sm:text-2xl animate-wiggle">
                YOU DIED! YOUR ENGLISH WASN'T STRONG ENOUGH.
                {preferredLanguage && preferredLanguage !== 'English' && (
                  <span className="block text-sm mt-2 opacity-80">({t('wrong')})</span>
                )}
                {/* Fixed missing Button component by adding missing import */}
                <Button onClick={() => startQuest(selectedQuest)} className="mt-4 block mx-auto" variant="secondary">
                  TRY AGAIN {preferredLanguage && preferredLanguage !== 'English' && <span className="text-sm ml-2 opacity-70">({t('try_again')})</span>}
                </Button>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAction} className="p-4 sm:p-8 border-t-4 border-slate-50 bg-white">
           <div className="flex gap-2 sm:gap-4">
              <input 
                disabled={health <= 0 || isLoading}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="What will you do next?"
                className="flex-1 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-4 border-slate-100 focus:border-fun-blue outline-none font-bold text-lg sm:text-xl"
              />
              <button disabled={health <= 0 || isLoading} className="bg-fun-blue text-white w-16 sm:w-20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl border-b-4 sm:border-b-8 border-sky-700 active:translate-y-1 active:border-b-0 transition-all">
                 <Send size={24} className="sm:w-8 sm:h-8" />
              </button>
           </div>
        </form>
      </div>

      {/* Sidebar Game Info */}
      <div className="w-80 space-y-6 hidden lg:block">
         <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-xl">
            <h4 className="flex items-center gap-2 font-black text-slate-800 text-xl mb-6 uppercase">
               <Backpack className="text-fun-orange" /> {t('inventory')}
            </h4>
            <div className="space-y-3">
               {inventory.map((item, i) => (
                 <div key={i} className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 font-bold text-sm text-slate-600 flex items-center gap-2">
                    <Sword size={14} className="text-slate-400" /> {item}
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h4 className="flex items-center gap-2 font-black text-xl mb-4 uppercase">
               <Shield className="text-fun-blue" /> {t('tutor_tip')}
            </h4>
            <p className="text-sm font-bold text-white/60 italic leading-relaxed">
               "Try using full sentences to avoid taking damage! Adjectives like 'shiny' or 'dangerous' gain bonus XP."
            </p>
         </div>
      </div>
    </div>
  );
};

export default QuestAdventure;
