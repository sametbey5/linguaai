
import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const { leaderboard } = useGamification();
  const navigate = useNavigate();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="text-fun-yellow fill-fun-yellow animate-bounce" size={32} />;
      case 1: return <Medal className="text-slate-400 fill-slate-300" size={32} />;
      case 2: return <Medal className="text-amber-700 fill-amber-600" size={32} />;
      default: return <span className="font-black text-slate-300 text-2xl w-8 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">🏆 Hall of Fame 🏆</h2>
        <p className="text-xl text-slate-500 mt-2 font-bold">Top English Learners this Week</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-slate-100 overflow-hidden">
        <div className="bg-fun-yellow p-8 text-white flex justify-between items-center border-b-8 border-yellow-400">
            <div>
                <h3 className="font-black text-3xl">Top Players</h3>
                <p className="text-yellow-800 font-bold bg-white/20 inline-block px-3 py-1 rounded-lg mt-1">Weekly Ranking</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl transform rotate-6">
                <Trophy size={48} className="text-white drop-shadow-md" />
            </div>
        </div>

        <div className="p-4 space-y-3">
          {leaderboard.map((user, index) => (
            <div 
              key={user.id} 
              onClick={() => navigate(`/profile/${user.id}`)}
              className={`flex items-center p-5 rounded-3xl transition-all border-b-4 cursor-pointer group ${
                user.isCurrentUser 
                  ? 'bg-blue-50 border-fun-blue transform scale-[1.02] shadow-md z-10' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 hover:scale-[1.01] hover:border-slate-200'
              }`}
            >
              <div className="w-16 flex justify-center flex-shrink-0">
                {getRankIcon(index)}
              </div>
              
              <div className={`w-16 h-16 rounded-2xl ${user.color || 'bg-slate-100'} text-4xl flex items-center justify-center mr-6 border-4 border-white shadow-sm ring-2 ring-slate-100 group-hover:scale-110 transition-transform`}>
                {user.avatar}
              </div>

              <div className="flex-1">
                <h4 className={`text-xl font-black ${user.isCurrentUser ? 'text-fun-blue' : 'text-slate-700'}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Rank #{index + 1}</p>
              </div>

              <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border-2 border-slate-100 group-hover:bg-white transition-colors">
                <p className="font-black text-2xl text-slate-800">{user.points.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">XP Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
