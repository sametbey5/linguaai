
import React from 'react';
import { useGamification } from '../context/GamificationContext';
import TalkingAvatar from '../components/TalkingAvatar';
import { MASCOT_CHARACTERS } from '../constants';
import { useNavigate } from 'react-router-dom';

const MascotTalk: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useGamification();
  const isKids = mode === 'kids';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-4">
        <h2 className={`text-5xl font-black ${isKids ? 'text-fun-blue rainbow-text' : 'text-slate-800'} tracking-tight`}>
           {isKids ? 'TALK TO A FRIEND!' : 'Conversation Practice'}
        </h2>
        <p className="text-xl font-bold text-slate-500">
           {isKids ? 'Pick a buddy to start talking!' : 'Select an AI persona for conversation practice.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASCOT_CHARACTERS.map((char) => (
            <div 
              key={char.id}
              onClick={() => navigate(`/talk/${char.id}`)}
              className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col items-center ${char.color} opacity-90 hover:opacity-100 hover:shadow-xl`}
            >
               <div className="h-40 w-full flex items-center justify-center mb-4">
                  {/* Static Preview */}
                  <TalkingAvatar character={char.id as any} volume={0} />
               </div>
               <div className="text-center">
                  <h3 className="font-black text-2xl text-slate-800">{char.name}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-2 leading-tight px-4">{char.desc}</p>
               </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MascotTalk;
