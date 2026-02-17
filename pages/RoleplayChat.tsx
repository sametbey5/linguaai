
import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Heart, Backpack, Sword, Shield, Zap } from 'lucide-react';
import { QUESTS_KIDS, QUESTS_ADULTS } from '../constants';
import { createGeminiChat } from '../services/geminiService';
import { Message, Scenario } from '../types';
import { useGamification } from '../context/GamificationContext';
// Added missing Button import
import Button from '../components/Button';

const QuestAdventure: React.FC = () => {
  const { mode, awardPoints } = useGamification();
  const isKids = mode === 'kids';
  
  const [selectedQuest, setSelectedQuest] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [health, setHealth] = useState(3);
  const [inventory, setInventory] = useState<string[]>(['Basic Compass']);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quests = isKids ? QUESTS_KIDS : QUESTS_ADULTS;

  const startQuest = async (quest: Scenario) => {
    setSelectedQuest(quest);
    setHealth(3);
    setMessages([]);
    setInventory(['Map of ' + quest.character + "'s World"]);
    setIsLoading(true);
    
    const chat = createGeminiChat(quest.systemInstruction);
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
      awardPoints(25, 'Action Performed');
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
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in py-10">
        <div className="text-center space-y-4">
           <h2 className="text-6xl font-black text-slate-800">AI ADVENTURES</h2>
           <p className="text-xl font-bold text-slate-500">Embark on epic quests. Your English is your weapon!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {quests.map(q => (
             <div key={q.id} onClick={() => startQuest(q)} className={`p-8 bg-white rounded-[3rem] shadow-2xl border-b-[12px] border-slate-100 cursor-pointer hover:scale-105 active:scale-95 transition-all group overflow-hidden relative`}>
                <div className="flex justify-between items-start z-10 relative">
                   <div>
                      <h3 className="text-3xl font-black text-slate-800">{q.title}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{q.character}</p>
                   </div>
                   <div className="text-6xl group-hover:scale-125 transition-transform">{q.avatar}</div>
                </div>
                <p className="mt-6 text-slate-600 font-medium leading-relaxed z-10 relative">{q.description}</p>
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
    <div className="h-[calc(100vh-160px)] flex gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Game View */}
      <div className="flex-1 bg-white rounded-[3rem] border-4 border-slate-100 shadow-2xl flex flex-col overflow-hidden">
        <header className="p-6 bg-slate-900 text-white flex justify-between items-center px-10">
           <button onClick={() => setSelectedQuest(null)} className="hover:bg-white/10 p-2 rounded-xl"><ChevronLeft size={32}/></button>
           <div className="flex items-center gap-6">
              <div className="flex gap-1">
                 {[...Array(3)].map((_, i) => (
                   <Heart key={i} size={24} className={i < health ? "text-fun-pink fill-current" : "text-white/20"} />
                 ))}
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                 <Zap className="text-fun-yellow fill-current" size={24} />
                 <span className="font-black">LVL 1</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/50">
           {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-6 rounded-3xl font-bold text-lg shadow-lg ${msg.role === 'user' ? 'bg-fun-blue text-white' : 'bg-white border-2 border-slate-100 text-slate-800'}`}>
                   {msg.text}
                </div>
             </div>
           ))}
           {health <= 0 && (
             <div className="bg-red-500 text-white p-10 rounded-3xl text-center font-black text-2xl animate-wiggle">
                YOU DIED! YOUR ENGLISH WASN'T STRONG ENOUGH.
                {/* Fixed missing Button component by adding missing import */}
                <Button onClick={() => startQuest(selectedQuest)} className="mt-4 block mx-auto" variant="secondary">TRY AGAIN</Button>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAction} className="p-8 border-t-4 border-slate-50 bg-white">
           <div className="flex gap-4">
              <input 
                disabled={health <= 0 || isLoading}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="What will you do next?"
                className="flex-1 p-5 rounded-3xl border-4 border-slate-100 focus:border-fun-blue outline-none font-bold text-xl"
              />
              <button disabled={health <= 0 || isLoading} className="bg-fun-blue text-white w-20 rounded-3xl flex items-center justify-center shadow-xl border-b-8 border-sky-700 active:translate-y-1 active:border-b-0 transition-all">
                 <Send size={32} />
              </button>
           </div>
        </form>
      </div>

      {/* Sidebar Game Info */}
      <div className="w-80 space-y-6 hidden lg:block">
         <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-xl">
            <h4 className="flex items-center gap-2 font-black text-slate-800 text-xl mb-6">
               <Backpack className="text-fun-orange" /> INVENTORY
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
            <h4 className="flex items-center gap-2 font-black text-xl mb-4">
               <Shield className="text-fun-blue" /> TUTOR TIP
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
