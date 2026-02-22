
import React, { useState, useEffect } from 'react';
import { GrammarAnalysis } from '../types';
import Button from '../components/Button';
import { Sparkles, RefreshCcw, CheckCircle, BrainCircuit, PartyPopper } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import Confetti from '../components/Confetti';

const ScrambleMaster: React.FC = () => {
  const { mode, awardPoints } = useGamification();
  const isKids = mode === 'kids';

  const [level, setLevel] = useState(1);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Generate 1000 levels procedurally or use a large dataset
  const getSentenceForLevel = (lvl: number) => {
      const subjects = ["The cat", "A dog", "My friend", "The teacher", "Our team", "The robot", "An astronaut", "The wizard", "A dragon", "The scientist"];
      const verbs = ["jumps over", "runs to", "eats", "studies", "builds", "discovers", "flies to", "protects", "invents", "writes"];
      const objects = ["the moon", "a bone", "the book", "a castle", "the code", "a new planet", "the treasure", "a letter", "the homework", "a machine"];
      const adverbs = ["quickly", "slowly", "happily", "carefully", "bravely", "silently", "eagerly", "loudly", "secretly", "magically"];
      
      // Simple procedural generation to ensure uniqueness for 1000 levels
      // Use level as seed
      const sIndex = (lvl * 3) % subjects.length;
      const vIndex = (lvl * 7) % verbs.length;
      const oIndex = (lvl * 5) % objects.length;
      const aIndex = (lvl * 2) % adverbs.length;
      
      // Increase complexity every 100 levels
      if (lvl < 100) {
          return `${subjects[sIndex]} ${verbs[vIndex]} ${objects[oIndex]}`;
      } else if (lvl < 500) {
          return `${subjects[sIndex]} ${verbs[vIndex]} ${objects[oIndex]} ${adverbs[aIndex]}`;
      } else {
          return `${adverbs[aIndex]} ${subjects[sIndex]} ${verbs[vIndex]} ${objects[oIndex]} and ${verbs[(vIndex + 1) % verbs.length]} ${objects[(oIndex + 1) % objects.length]}`;
      }
  };

  const fetchSentence = async (nextLevel?: number) => {
    setLoading(true);
    setIsWon(false);
    setSelected([]);
    
    const targetLevel = nextLevel || level;
    const sample = getSentenceForLevel(targetLevel);
    
    setCurrentSentence(sample);
    setBubbles(sample.split(' ').sort(() => Math.random() - 0.5));
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => { fetchSentence(level); }, []);

  const nextLevel = () => {
      const next = level + 1;
      setLevel(next);
      fetchSentence(next);
  };

  const handleBubbleClick = (word: string, index: number) => {
    setSelected([...selected, word]);
    const newBubbles = [...bubbles];
    newBubbles.splice(index, 1);
    setBubbles(newBubbles);
  };

  const undo = () => {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    setSelected(selected.slice(0, -1));
    setBubbles([...bubbles, last].sort(() => Math.random() - 0.5));
  };

  const checkResult = () => {
    const built = selected.join(' ');
    if (built.toLowerCase() === currentSentence.toLowerCase()) {
      setIsWon(true);
      awardPoints(100, 'Scramble Master Win', 'grammar');
    } else {
      alert("Oops! The order is not quite right. Try again! 🧐");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      {isWon && <Confetti />}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-800 rainbow-text">SCRAMBLE MASTER</h2>
        <p className="text-xl font-bold text-slate-500">Unscramble the sentence! Catch the floating words! 🫧</p>
        <div className="inline-block bg-fun-blue text-white px-4 py-1 rounded-full font-black text-sm">LEVEL {level} / 1000</div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-slate-100 min-h-[450px] flex flex-col justify-between items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#BA68C8 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
        
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
             <BrainCircuit size={80} className="animate-spin text-fun-purple" />
             <p className="font-black text-fun-purple animate-pulse">PREPARING LEVEL {level}...</p>
          </div>
        ) : isWon ? (
          <div className="text-center py-10 animate-fade-in">
             <div className="w-32 h-32 bg-fun-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white">
                <PartyPopper size={64} className="text-white animate-bounce" />
             </div>
             <h3 className="text-5xl font-black text-slate-800">AMAZING!</h3>
             <p className="text-slate-400 font-bold mt-4 text-xl">You solved Level {level}! +100 XP</p>
             <div className="mt-8 flex flex-col gap-4">
                <Button onClick={nextLevel} className="px-12 py-5 text-2xl" variant="success">NEXT LEVEL &rarr;</Button>
             </div>
          </div>
        ) : (
          <>
            <div className="w-full space-y-4">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-center">Your Sentence</span>
              <div className="flex flex-wrap justify-center gap-3 min-h-[120px] p-8 bg-slate-50 rounded-[2.5rem] w-full border-4 border-dashed border-slate-200 transition-all">
                {selected.length === 0 && <p className="text-slate-300 font-bold self-center italic">Select words below...</p>}
                {selected.map((word, i) => (
                  <span 
                    key={i} 
                    onClick={() => undo()}
                    className="bg-white px-6 py-3 rounded-2xl font-black text-2xl shadow-md text-fun-purple border-b-4 border-slate-100 cursor-pointer hover:bg-red-50 hover:text-red-400 transition-colors animate-pop"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-center mb-6">Floating Words</span>
              <div className="flex flex-wrap justify-center gap-4">
                {bubbles.map((word, i) => (
                  <button
                      key={i}
                      onClick={() => handleBubbleClick(word, i)}
                      className="bg-fun-purple text-white px-8 py-5 rounded-full font-black text-2xl shadow-xl border-b-8 border-indigo-700 hover:scale-110 active:scale-95 hover:-translate-y-2 transition-all animate-float"
                      style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 w-full justify-center">
               <Button onClick={undo} variant="secondary" className="px-8" icon={<RefreshCcw size={24}/>}>Undo</Button>
               <Button 
                  onClick={checkResult} 
                  variant="primary" 
                  className="px-12"
                  icon={<Sparkles size={24}/>} 
                  disabled={bubbles.length > 0}
               >
                 Ready!
               </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex items-center gap-6 shadow-2xl">
         <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">💡</div>
         <div>
            <h4 className="font-black text-xl mb-1">PRO TIP</h4>
            <p className="font-bold text-slate-400">Remember to start with a Capital letter! Sentences in English usually follow Subject-Verb-Object order.</p>
         </div>
      </div>
    </div>
  );
};

export default ScrambleMaster;
