
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain, Sword, Star, Flame, CheckCircle2, Rocket, PlayCircle, Sparkles, Wand2, RocketIcon, BarChart, ArrowRight, BookOpen, Clock, Target, Calendar, Award, Palette, X, Smile, Mic, Ear, Globe, Map, Settings, Flag } from 'lucide-react';
import Button from '../components/Button';
import { Badge, SkillTree } from '../types';
import { useGamification } from '../context/GamificationContext';
import { BadgeDisplayKids, BadgeDisplayPro } from '../components/BadgeDisplay';
import ProgressTracker from '../components/ProgressTracker';
import { ALL_BADGES } from '../constants/badges';
import MysteryBox from '../components/MysteryBox';

const THEME_COLORS = [
  'bg-fun-blue', 'bg-fun-green', 'bg-fun-yellow', 'bg-fun-orange', 'bg-fun-pink', 'bg-fun-purple',
  'bg-fun-red', 'bg-fun-teal', 'bg-fun-indigo', 'bg-fun-lime', 'bg-fun-amber',
  'bg-slate-800', 'bg-emerald-500', 'bg-rose-500', 'bg-violet-600'
];
const AVATAR_OPTIONS = [
  '😎', '🚀', '🦄', '🦖', '🤖', '🦊', '🐯', '🐼', '🐸', '🐙',
  '🦁', '🦒', '🦓', '🦩', '🐲', '🧜‍♀️', '🧙‍♂️', '🦸‍♂️', '🛸', '🌈',
  '🍎', '🍕', '🍦', '🎸', '⚽️', '🎨', '🎭', '🎮', '🎧', '📸'
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, quests, mode, awardPoints, badges, setThemeColor, setAvatar, grantBadge, userId } = useGamification();
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [isBoxClaimed, setIsBoxClaimed] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [modalTab, setModalTab] = useState<'avatar' | 'color'>('avatar');
  
  const isKids = mode === 'kids';

  // Helper to format username
  const displayName = userId ? userId.charAt(0).toUpperCase() + userId.slice(1) : `Hero ${stats.level}`;

  const pointsPerLevel = 500;
  const currentLevelPoints = stats.points % pointsPerLevel;
  const progressPercent = (currentLevelPoints / pointsPerLevel) * 100;

  const handleRewardClaimed = (reward: { type: 'xp' | 'badge', value: any }) => {
    if (reward.type === 'xp') {
      awardPoints(reward.value, 'Mystery Box');
    } else {
      grantBadge({
        ...reward.value,
        earnedAt: new Date().toISOString()
      });
    }
    setIsBoxClaimed(true);
  };

  const StylePickerModal = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-slate-100 relative">
        <button onClick={() => setShowStyleModal(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2">
          <X size={20} />
        </button>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 text-center">Customize Look</h3>
        
        <div className="flex gap-2 sm:gap-4 mb-6 bg-slate-100 p-2 rounded-2xl">
           <button onClick={() => setModalTab('avatar')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${modalTab === 'avatar' ? 'bg-white text-fun-blue shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}>Avatar</button>
           <button onClick={() => setModalTab('color')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${modalTab === 'color' ? 'bg-white text-fun-blue shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}>Color</button>
        </div>

        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {modalTab === 'avatar' ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
              {AVATAR_OPTIONS.map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => { setAvatar(emoji); setShowStyleModal(false); }}
                  className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-2xl border-4 transition-all hover:scale-110 active:scale-95 ${stats.avatar === emoji ? 'border-fun-blue bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {THEME_COLORS.map(color => (
                <button 
                  key={color} 
                  onClick={() => { setThemeColor(color); setShowStyleModal(false); }}
                  className={`h-20 sm:h-24 rounded-2xl border-4 transition-all hover:scale-110 active:scale-95 ${color} ${stats.themeColor === color ? 'border-slate-800 shadow-lg scale-105' : 'border-white shadow-sm'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SkillTreeCard = ({ skill, onClick }: { skill: SkillTree, onClick: () => void }) => (
      <div onClick={onClick} className={`bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg cursor-pointer hover:border-fun-blue hover:scale-105 transition-all group relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-125 transition-transform`}>
              {skill.icon}
          </div>
          <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 ${skill.color} rounded-2xl flex items-center justify-center text-3xl text-white shadow-md`}>
                  {skill.icon}
              </div>
              <div>
                  <h4 className="font-black text-xl text-slate-800">{skill.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Level {skill.level}</p>
              </div>
          </div>
          
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-slate-50">
              <div className={`${skill.color} h-full transition-all duration-1000`} style={{ width: `${skill.progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
              <span>{Math.floor(skill.progress)} / 100 XP</span>
              <span>Next Lvl</span>
          </div>
      </div>
  );

  const DailyFlowCard = ({ title, time, icon, color, onClick, completed }: any) => (
      <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-3xl border-4 transition-all cursor-pointer ${completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:border-fun-blue hover:shadow-lg'}`}>
          <div className={`w-14 h-14 ${completed ? 'bg-slate-200' : color} rounded-full flex items-center justify-center text-white text-2xl shadow-sm`}>
              {completed ? <CheckCircle2 /> : icon}
          </div>
          <div className="flex-1">
              <h4 className={`font-black text-lg ${completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{title}</h4>
              <p className="text-xs font-bold text-slate-400">{time}</p>
          </div>
          {!completed && <div className="bg-slate-100 p-2 rounded-full text-slate-400"><PlayCircle size={24} /></div>}
      </div>
  );

  // --- FUN DASHBOARD (KIDS) ---
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {showStyleModal && <StylePickerModal />}
      {showMysteryBox && (
        <MysteryBox 
          onClose={() => setShowMysteryBox(false)} 
          onRewardClaimed={handleRewardClaimed}
          availableBadges={ALL_BADGES}
        />
      )}
      
      {/* Header */}
      <header className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 shadow-sm bg-white rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-100 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-fun-blue/5 rounded-full -mr-16 -mt-16 animate-pulse" />
        <div className="flex items-center gap-4 sm:gap-6">
           <div onClick={() => setShowStyleModal(true)} className={`w-16 h-16 sm:w-20 sm:h-20 ${stats.themeColor || 'bg-fun-blue'} rounded-2xl sm:rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center text-4xl sm:text-5xl transform rotate-3 animate-float cursor-pointer hover:scale-110 transition-transform relative group`}>
             <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm"><Palette size={12} className="text-slate-400" /></div>
             {stats.avatar || '😎'}
           </div>
           <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
                {stats.identityTitle || 'Explorer'} <Sparkles className="text-fun-yellow animate-pulse shrink-0" size={20} />
              </h2>
              <p className="text-slate-500 font-bold text-sm sm:text-base">Level {stats.level} • <span className="text-fun-pink">{displayName}</span></p>
           </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
            <div className="group flex flex-col items-center px-4 sm:px-6 py-2 bg-orange-100 border-b-4 border-orange-200 rounded-2xl sm:rounded-3xl text-orange-600 font-black cursor-help">
               <Flame size={20} className="sm:w-6 sm:h-6 fill-current animate-pulse group-hover:scale-125 transition-transform" />
               <span className="text-xl sm:text-2xl">{stats.streakDays}</span>
               <span className="text-[8px] uppercase">STREAK</span>
            </div>
            <div className="group flex flex-col items-center px-4 sm:px-6 py-2 bg-yellow-100 border-b-4 border-yellow-200 rounded-2xl sm:rounded-3xl text-yellow-600 font-black">
               <Star size={20} className="sm:w-6 sm:h-6 fill-current animate-bounce-slow group-hover:rotate-180 transition-transform duration-500" />
               <span className="text-xl sm:text-2xl">{stats.points}</span>
               <span className="text-[8px] uppercase">TOTAL XP</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Flow & Skills */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Daily Flow Section */}
            <div className="bg-white p-6 sm:p-8 rounded-[3rem] border-4 border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <div className="h-full bg-fun-green w-1/3" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                    <Map className="text-fun-blue" /> TODAY'S JOURNEY
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DailyFlowCard 
                        title="Warm Up: Word Rush" 
                        time="2 min • Vocabulary" 
                        icon={<Zap />} 
                        color="bg-fun-yellow" 
                        onClick={() => navigate('/vocab')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Live Race: Compete!" 
                        time="3 min • Multiplayer" 
                        icon={<Flag />} 
                        color="bg-red-500" 
                        onClick={() => navigate('/race')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Speak: Pronunciation" 
                        time="3 min • Speaking" 
                        icon={<Mic />} 
                        color="bg-fun-green" 
                        onClick={() => navigate('/pronunciation')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Story: Coffee Run" 
                        time="5 min • Real Life" 
                        icon={<BookOpen />} 
                        color="bg-fun-pink" 
                        onClick={() => navigate('/story')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Speak: Roleplay" 
                        time="5 min • Speaking" 
                        icon={<Mic />} 
                        color="bg-fun-purple" 
                        onClick={() => navigate('/roleplay')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Learn: Grammar" 
                        time="10 min • Lessons" 
                        icon={<BookOpen />} 
                        color="bg-fun-orange" 
                        onClick={() => navigate('/grammar-lessons')}
                        completed={false}
                    />
                    <DailyFlowCard 
                        title="Review: Scramble" 
                        time="3 min • Grammar" 
                        icon={<Brain />} 
                        color="bg-fun-blue" 
                        onClick={() => navigate('/game/scramble')}
                        completed={false}
                    />
                </div>
            </div>

            {/* Skill Trees Grid */}
            <div>
                <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3 px-4">
                    <Globe className="text-fun-purple" /> SKILL TREES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.skills && (
                        <>
                            <SkillTreeCard skill={stats.skills.vocabulary} onClick={() => navigate('/vocab')} />
                            <SkillTreeCard skill={stats.skills.speaking} onClick={() => navigate('/roleplay')} />
                            <SkillTreeCard skill={stats.skills.listening} onClick={() => navigate('/story')} />
                            <SkillTreeCard skill={stats.skills.grammar} onClick={() => navigate('/grammar-lessons')} />
                            <SkillTreeCard skill={stats.skills.realLife} onClick={() => navigate('/story')} />
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Quests & Loot */}
        <div className="space-y-8">
            {/* Progress Tracker */}
            <ProgressTracker />

            {/* Daily Loot */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
               <h3 className="text-white font-black text-xl mb-6 flex items-center justify-center gap-2">
                  <Wand2 className="text-fun-blue" /> DAILY LOOT
               </h3>
               
               <div 
                 onClick={() => !isBoxClaimed && setShowMysteryBox(true)}
                 className={`w-32 h-32 mx-auto mb-6 flex items-center justify-center text-6xl cursor-pointer transition-all ${!isBoxClaimed ? 'hover:scale-110 active:scale-95 animate-float' : 'opacity-50 grayscale'}`}
               >
                  {isBoxClaimed ? '✨' : '🎁'}
               </div>
               
               <p className="text-white font-bold mb-4">
                  {isBoxClaimed ? 'Come back tomorrow!' : 'Win XP or Rare Badges!'}
               </p>
               
               {!isBoxClaimed && (
                 <button onClick={() => setShowMysteryBox(true)} className="bg-fun-blue text-white px-8 py-3 rounded-2xl font-black shadow-lg border-b-4 border-blue-800 hover:bg-blue-500">
                    OPEN BOX
                 </button>
               )}
            </div>

            {/* Badges Trophy Case */}
            <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <Award size={32} className="text-fun-yellow fill-current" />
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Trophy Case</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {badges.map((badge, index) => (
                    <BadgeDisplayKids key={`${badge.id}_${index}`} badge={badge} />
                    ))}
                    {badges.length === 0 && (
                    <div className="text-slate-400 font-bold italic">Play games to unlock your first badge!</div>
                    )}
                </div>
            </div>

            {/* Customize Look Card */}
            <div 
              onClick={() => setShowStyleModal(true)}
              className="bg-white p-6 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-100 shadow-xl cursor-pointer hover:scale-105 transition-transform group"
            >
               <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="font-black text-lg sm:text-xl text-slate-800 flex items-center gap-2">
                     <Smile className="text-fun-purple shrink-0" /> MY STYLE
                  </h3>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${stats.themeColor || 'bg-fun-blue'} border-2 border-slate-200 shadow-sm flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
                     {stats.avatar || '😎'}
                  </div>
               </div>
               <p className="text-slate-500 font-bold text-xs sm:text-sm">Change color & avatar!</p>
               <button 
                 onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
                 className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 font-black text-[10px] sm:text-xs transition-colors flex items-center justify-center gap-2 border-2 border-slate-100"
               >
                 <Settings size={14} /> MANAGE ACCOUNT
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// ... (Keep Helper Components if needed, but mostly replaced)

export default Dashboard;
