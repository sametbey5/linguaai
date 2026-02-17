
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import { useLiveAvatar } from '../hooks/useLiveAvatar';
import TalkingAvatar from '../components/TalkingAvatar';
import Button from '../components/Button';
import { Mic, MicOff, Volume2, ChevronLeft } from 'lucide-react';
import { MASCOT_CHARACTERS } from '../constants';

const MascotChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useGamification();
  const isKids = mode === 'kids';

  const character = MASCOT_CHARACTERS.find(c => c.id === id);

  const { connect, disconnect, isConnected, volume, error } = useLiveAvatar({
    systemInstruction: character?.instruction || '',
    voiceName: character?.voice || 'Puck'
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // If we navigate away, ensure we disconnect. 
      // Note: The hook handles basic cleanup but explicit check here is safe.
      if (isConnected) disconnect();
    };
  }, [isConnected, disconnect]);

  if (!character) {
      return (
        <div className="text-center p-10 font-bold space-y-4">
            <h2 className="text-2xl">Character not found</h2>
            <Button onClick={() => navigate('/talk')}>Go Back</Button>
        </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/talk')} className="rounded-xl px-4 py-2 text-sm md:text-base">
              <ChevronLeft className="mr-1" size={20} /> Back
          </Button>
          <h2 className={`text-2xl md:text-3xl font-black ${isKids ? 'text-slate-700' : 'text-slate-800'} tracking-tight`}>
             Chat with {character.name}
          </h2>
      </div>

      {/* Active Session View */}
      <div className={`flex-1 bg-white rounded-[3rem] shadow-2xl border-8 ${isKids ? 'border-fun-yellow' : 'border-slate-200'} p-8 relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center`}>
          
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
          
          <div className="flex flex-col items-center justify-center space-y-8 relative z-10 w-full max-w-lg">
             
             {/* The Avatar */}
             <div className={`transform transition-all duration-500 ${isConnected ? 'scale-110' : 'scale-100 grayscale-[0.2] opacity-80'}`}>
                <TalkingAvatar character={character.id as any} volume={isConnected ? volume : 0} />
             </div>

             {/* Connection Controls */}
             <div className="space-y-4 text-center w-full">
                {!isConnected ? (
                   <Button 
                      onClick={connect} 
                      className="w-full py-6 text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" 
                      variant="success"
                   >
                      <Mic className="mr-3 animate-pulse" /> START CALL
                   </Button>
                ) : (
                   <div className="space-y-6 w-full">
                      <div className="flex items-center justify-center gap-2 text-fun-green font-black animate-pulse">
                         <div className="w-3 h-3 bg-fun-green rounded-full" />
                         LIVE
                      </div>
                      
                      <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-center gap-4">
                         <Volume2 className={volume > 5 ? "text-fun-blue" : "text-slate-400"} />
                         <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-fun-blue transition-all duration-75" 
                              style={{ width: `${Math.min(volume, 100)}%` }} 
                            />
                         </div>
                      </div>

                      <Button 
                        onClick={disconnect} 
                        className="w-full py-4 text-xl" 
                        variant="danger"
                      >
                         <MicOff className="mr-3" /> END CALL
                      </Button>
                   </div>
                )}
                
                {error && (
                  <div className="text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
                     {error}
                  </div>
                )}
                
                <p className="text-slate-400 font-bold text-sm mt-4">
                   {isConnected ? "They are listening! Say hello!" : "Microphone access required."}
                </p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default MascotChat;
