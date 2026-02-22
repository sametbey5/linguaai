
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { Store, ArrowRight, ArrowRightLeft, Lock, RefreshCcw, Briefcase, Users, UserPlus, Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import Confetti from '../components/Confetti';
import { Badge, UserTrade } from '../types';

const BadgeTrading: React.FC = () => {
  const { mode, badges, tradeOffers, tradeBadge, userId, userTrades, sendP2PTrade, respondToP2PTrade } = useGamification();
  const isKids = mode === 'kids';
  
  const [activeTab, setActiveTab] = useState<'npc' | 'p2p'>('npc');
  const [justTraded, setJustTraded] = useState(false);
  
  // Create Trade State
  const [recipientId, setRecipientId] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [tradeStatus, setTradeStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });
  
  // Trade Session State
  const [activeSession, setActiveSession] = useState<{ trade: UserTrade, status: 'opening' | 'swapping' | 'complete' } | null>(null);

  const handleNpcTrade = (offerId: string) => {
    tradeBadge(offerId);
    setJustTraded(true);
    setTimeout(() => setJustTraded(false), 3000);
  };

  const handleSendTrade = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!recipientId || !selectedBadgeId) return;
      
      const badge = badges.find(b => b.id === selectedBadgeId);
      if (!badge) return;

      setTradeStatus({ type: 'loading', msg: 'Sending request...' });
      
      const result = await sendP2PTrade(recipientId.trim().toLowerCase().replace(/\s+/g, '_'), badge);
      
      if (result.success) {
          setTradeStatus({ type: 'success', msg: result.msg });
          setRecipientId('');
          setSelectedBadgeId(null);
          setTimeout(() => setTradeStatus({ type: 'idle', msg: '' }), 3000);
      } else {
          setTradeStatus({ type: 'error', msg: result.msg });
      }
  };

  const openTradeSession = async (trade: UserTrade) => {
     setActiveSession({ trade, status: 'opening' });
     
     // Animation sequence
     setTimeout(() => {
         setActiveSession(prev => prev ? { ...prev, status: 'swapping' } : null);
         
         // Trigger actual API call during animation
         respondToP2PTrade(trade.id, 'accept').then(res => {
             if (res.success) {
                 setTimeout(() => {
                     setActiveSession(prev => prev ? { ...prev, status: 'complete' } : null);
                 }, 2000);
             } else {
                 alert(res.msg);
                 setActiveSession(null);
             }
         });
     }, 1000);
  };
  
  const rejectRequest = async (tradeId: string) => {
      await respondToP2PTrade(tradeId, 'reject');
  };

  const BadgeCard = ({ badge, missing }: { badge: Badge | { name: string, icon: string, color: string }, missing?: boolean }) => {
    if (missing) {
      return (
        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-4 border-dashed border-slate-300 flex flex-col items-center justify-center opacity-50 grayscale">
           <div className="text-2xl mb-1 opacity-50">🔒</div>
           <span className="text-[10px] font-bold text-slate-400 text-center px-1 leading-tight">Missing Badge</span>
        </div>
      );
    }

    return (
       <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg ${badge.color || 'bg-slate-500'} border-b-4 border-black/10`}>
         {'image' in badge && badge.image ? (
            <img src={badge.image} alt={badge.name} className="w-10 h-10 object-contain drop-shadow-md mb-1" />
         ) : (
            <div className="text-3xl mb-1">{badge.icon}</div>
         )}
         <span className="text-[9px] font-black text-white uppercase px-1 leading-tight line-clamp-2">{badge.name}</span>
       </div>
    );
  };

  // --- TRADING SESSION MODAL ---
  const TradingSessionModal = () => {
      if (!activeSession) return null;
      const { trade, status } = activeSession;
      
      return (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-2xl h-[400px] flex flex-col items-center justify-center">
                  {status === 'complete' && <Confetti />}
                  
                  <h2 className="text-4xl font-black text-white mb-12 animate-bounce">
                      {status === 'opening' ? 'INITIATING TRADE...' : status === 'swapping' ? 'TRADING...' : 'TRADE COMPLETE!'}
                  </h2>

                  <div className="flex items-center gap-12 relative">
                      {/* Sender Item */}
                      <div className={`transition-all duration-1000 transform ${status === 'swapping' || status === 'complete' ? 'translate-x-[150px] scale-125 rotate-12' : ''}`}>
                          <div className="text-white text-center font-bold mb-2 uppercase text-xs">Incoming</div>
                          <BadgeCard badge={trade.offeredBadge} />
                      </div>

                      {/* Swap Icon */}
                      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fun-yellow transition-all duration-500 ${status === 'swapping' ? 'rotate-180 scale-150 opacity-100' : 'opacity-20'}`}>
                          <RefreshCcw size={64} />
                      </div>
                      
                      {/* You (Just receiving visually for now, P2P logic can be bidirectional later) */}
                      <div className={`transition-all duration-1000 transform ${status === 'swapping' || status === 'complete' ? '-translate-x-[150px] opacity-0' : ''}`}>
                         <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-dashed border-white/20 flex items-center justify-center">
                            <span className="text-4xl">😎</span>
                         </div>
                      </div>
                  </div>
                  
                  {status === 'complete' && (
                      <Button onClick={() => setActiveSession(null)} className="mt-12 text-xl px-8" variant="success">Awesome!</Button>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {justTraded && <Confetti />}
      <TradingSessionModal />
      
      <div className="text-center space-y-4">
        <div className="inline-block relative">
           <Store size={80} className="text-fun-orange mx-auto animate-bounce-slow" />
           <div className="absolute -top-2 -right-4 bg-fun-green text-white px-3 py-1 rounded-full text-xs font-black rotate-12 shadow-md">OPEN!</div>
        </div>
        <h2 className={`text-5xl font-black ${isKids ? 'text-slate-800 rainbow-text' : 'text-slate-800'} tracking-tight`}>
           TRADING POST
        </h2>
        <p className="text-xl font-bold text-slate-500">
           Swap badges with friends or the shop!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
          <div className="bg-white p-2 rounded-2xl shadow-md border-2 border-slate-100 inline-flex gap-2">
              <button 
                onClick={() => setActiveTab('npc')}
                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'npc' ? 'bg-fun-orange text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                  <Store size={18} /> SHOP KEEPER
              </button>
              <button 
                onClick={() => setActiveTab('p2p')}
                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'p2p' ? 'bg-fun-blue text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                  <Users size={18} /> FRIENDS (P2P)
              </button>
          </div>
      </div>

      {activeTab === 'npc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {tradeOffers.map(offer => {
                const hasRequired = badges.find(b => b.id === offer.requiredBadgeId);
                return (
                <div key={offer.id} className="bg-white rounded-[3rem] border-8 border-slate-100 p-8 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 left-0 w-full h-4 bg-slate-100" />
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-md">🤠</div>
                        <span className="font-black text-slate-400 uppercase text-xs tracking-widest">{offer.merchantName}</span>
                    </div>

                    <div className="mt-10 flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center gap-2 relative">
                        {hasRequired ? (
                            <div className="relative">
                                <BadgeCard badge={hasRequired} />
                                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">-1</div>
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-slate-50 rounded-2xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                                <Lock />
                                <span className="text-[10px] font-black mt-1">LOCKED</span>
                            </div>
                        )}
                        <span className="text-xs font-black text-slate-400 uppercase">Your Item</span>
                        </div>

                        <ArrowRightLeft className={`text-slate-300 ${hasRequired ? 'animate-pulse text-fun-blue' : ''}`} size={32} />

                        <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <BadgeCard badge={offer.rewardBadge} />
                            <div className="absolute -top-6 -right-6 text-2xl animate-bounce">✨</div>
                        </div>
                        <span className="text-xs font-black text-fun-orange uppercase">New Item!</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button 
                        onClick={() => handleNpcTrade(offer.id)}
                        disabled={!hasRequired}
                        variant={hasRequired ? 'success' : 'secondary'}
                        className="w-full text-xl py-4 rounded-2xl shadow-lg"
                        icon={hasRequired ? <RefreshCcw /> : <Lock />}
                        >
                        {hasRequired ? 'TRADE NOW!' : 'NEED BADGE'}
                        </Button>
                    </div>
                </div>
                );
            })}
        </div>
      )}

      {activeTab === 'p2p' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
             {/* Send Request Column */}
             <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-xl h-fit">
                 <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">
                     <UserPlus className="text-fun-blue" /> START NEW TRADE
                 </h3>
                 
                 <form onSubmit={handleSendTrade} className="space-y-6">
                     <div>
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 pl-2">Friend's User ID</label>
                         <input 
                             value={recipientId}
                             onChange={e => setRecipientId(e.target.value)}
                             placeholder="e.g. dragon_slayer_99"
                             className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                         />
                     </div>

                     <div>
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 pl-2">Pick a Badge to Give</label>
                         <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border-4 border-slate-100">
                             {badges.length === 0 && <p className="col-span-3 text-center text-slate-400 py-4 font-bold">No badges to trade!</p>}
                             {badges.map((b, index) => (
                                 <div 
                                    key={`${b.id}-${index}`} 
                                    onClick={() => setSelectedBadgeId(b.id)}
                                    className={`p-2 rounded-xl cursor-pointer border-2 transition-all ${selectedBadgeId === b.id ? 'bg-white border-fun-blue shadow-md' : 'border-transparent hover:bg-white'}`}
                                 >
                                     <div className="flex flex-col items-center">
                                         <div className="text-2xl">{b.icon}</div>
                                         <span className="text-[8px] font-black uppercase text-slate-500 mt-1 truncate w-full text-center">{b.name}</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>

                     <Button 
                        type="submit"
                        variant="primary" 
                        disabled={!recipientId || !selectedBadgeId || tradeStatus.type === 'loading'}
                        className="w-full py-4 rounded-xl text-lg"
                        icon={<Gift />}
                     >
                         SEND OFFER
                     </Button>

                     {tradeStatus.msg && (
                         <div className={`text-center font-bold text-sm py-2 rounded-xl ${tradeStatus.type === 'success' ? 'bg-green-100 text-green-600' : tradeStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'text-slate-400'}`}>
                             {tradeStatus.msg}
                         </div>
                     )}
                 </form>
             </div>

             {/* Incoming Requests Column */}
             <div className="space-y-6">
                 <h3 className="font-black text-xl text-slate-800 pl-4 flex items-center gap-2">
                     <Clock className="text-fun-orange" /> ACTIVE REQUESTS
                 </h3>
                 
                 {userTrades.length === 0 && (
                     <div className="bg-slate-50 p-10 rounded-[2.5rem] border-4 border-dashed border-slate-200 text-center text-slate-400 font-bold">
                         No active trades found.
                     </div>
                 )}

                 {userTrades.map(trade => {
                     const isIncoming = trade.recipientId === userId;
                     const isOutgoing = trade.initiatorId === userId;
                     
                     // Filter only pending for list, or show history differently
                     if (trade.status !== 'pending') return null;

                     return (
                         <div key={trade.id} className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg relative overflow-hidden animate-fade-in">
                             <div className={`absolute top-0 left-0 w-2 h-full ${isIncoming ? 'bg-fun-green' : 'bg-slate-300'}`} />
                             
                             <div className="flex justify-between items-start mb-4 pl-4">
                                 <div>
                                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isIncoming ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                         {isIncoming ? 'INCOMING OFFER' : 'OUTGOING REQUEST'}
                                     </span>
                                     <h4 className="font-black text-lg text-slate-800 mt-2">
                                         {isIncoming ? `From: ${trade.initiatorId}` : `To: ${trade.recipientId}`}
                                     </h4>
                                 </div>
                                 <div className="text-xs font-bold text-slate-400">
                                     {new Date(trade.createdAt).toLocaleDateString()}
                                 </div>
                             </div>

                             <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 mb-4 ml-4">
                                 <div className="text-3xl">{trade.offeredBadge.icon}</div>
                                 <div>
                                     <div className="text-xs font-black text-slate-400 uppercase">Offered Badge</div>
                                     <div className="font-bold text-slate-700">{trade.offeredBadge.name}</div>
                                 </div>
                             </div>

                             {isIncoming && (
                                 <div className="flex gap-3 ml-4">
                                     <button 
                                        onClick={() => openTradeSession(trade)}
                                        className="flex-1 bg-fun-green text-white py-3 rounded-xl font-black text-sm shadow-md hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                                     >
                                         <CheckCircle size={16} /> ACCEPT
                                     </button>
                                     <button 
                                        onClick={() => rejectRequest(trade.id)}
                                        className="bg-slate-100 text-slate-500 px-4 py-3 rounded-xl font-black text-sm hover:bg-red-100 hover:text-red-500 transition-all"
                                     >
                                         <XCircle size={20} />
                                     </button>
                                 </div>
                             )}

                             {isOutgoing && (
                                 <div className="ml-4 text-center text-xs font-bold text-slate-400 italic">
                                     Waiting for response...
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
         </div>
      )}
    </div>
  );
};

export default BadgeTrading;
