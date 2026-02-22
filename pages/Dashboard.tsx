
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain, Sword, Star, Flame, CheckCircle2, Rocket, PlayCircle, Sparkles, Wand2, RocketIcon, BarChart, ArrowRight, BookOpen, Clock, Target, Calendar, Award, Palette, X, Smile } from 'lucide-react';
import Button from '../components/Button';
import { useGamification } from '../context/GamificationContext';
import { BadgeDisplayKids, BadgeDisplayPro } from '../components/BadgeDisplay';

const THEME_COLORS = [
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Green', class: 'bg-green-500' },
    { name: 'Teal', class: 'bg-teal-500' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Indigo', class: 'bg-indigo-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Pink', class: 'bg-pink-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Slate', class: 'bg-slate-700' },
    { name: 'Black', class: 'bg-black' },
];

const AVATAR_OPTIONS = [
    '😎', '🤓', '🤠', '🥳', '🦄', '🤖', 
    '🦁', '🐯', '🐶', '🐱', '🦊', '🐻',
    '🐼', '🐨', '🐸', '🐙', '🦋', '🦕',
    '🚀', '⭐', '🌈', '🔥', '🎮', '🎨',
    '👨‍💼', '👩‍💼', '🦸', '🥷', '🧙', '🧜‍♀️',
    '😀', '😄', '😁', '🤩', '😺', '🫶',
    '💡', '📚', '🎯', '🏆', '⚡', '🌟',
    '🌍', '🧠', '🎧', '🍀', '🍕', '☕'
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, quests, mode, awardPoints, badges, setThemeColor, setAvatar } = useGamification();
  const [boxState, setBoxState] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [boxContent, setBoxContent] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [modalTab, setModalTab] = useState<'avatar' | 'color'>('avatar');
  
  const isKids = mode === 'kids';

  const pointsPerLevel = 500;
  const currentLevelPoints = stats.points % pointsPerLevel;
  const progressPercent = (currentLevelPoints / pointsPerLevel) * 100;

  const openMysteryBox = () => {
    if (boxState !== 'idle') return;
    setBoxState('opening');
    setTimeout(() => {
      const rewards = ["+50 XP Luck!", "+100 Wisdom!", "New Badge Soon!", "Double Combo Boost!"];
      setBoxContent(rewards[Math.floor(Math.random() * rewards.length)]);
      setBoxState('opened');
      awardPoints(25, 'Mystery Box Opened');
    }, 1500);
  };

  const StylePickerModal = () => (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setShowStyleModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-pop border-8 border-slate-100 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowStyleModal(false)} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-lg border-4 border-slate-100"><X size={24} strokeWidth={3} /></button>
              
              <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Style Your Hero</h3>
                  <p className="text-slate-400 font-bold text-sm">Customize your look!</p>
              </div>

              <div className="flex justify-center mb-8">
                  <div className={`w-32 h-32 ${stats.themeColor || 'bg-fun-blue'} rounded-[2.5rem] border-4 border-slate-100 shadow-xl flex items-center justify-center text-6xl transition-colors duration-300 animate-float`}>
                      {stats.avatar || '😎'}
                  </div>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                 <button 
                   className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${modalTab === 'avatar' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                   onClick={() => setModalTab('avatar')}
                 >
                   AVATAR
                 </button>
                 <button 
                   className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${modalTab === 'color' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                   onClick={() => setModalTab('color')}
                 >
                   COLOR
                 </button>
              </div>

              {modalTab === 'color' && (
                <div className="grid grid-cols-4 gap-4 animate-fade-in">
                    {THEME_COLORS.map(c => (
                        <button 
                            key={c.name} 
                            className={`${c.class} w-14 h-14 rounded-2xl shadow-md hover:scale-110 active:scale-95 transition-all ring-4 ${stats.themeColor === c.class ? 'ring-slate-900 scale-110 z-10' : 'ring-transparent'}`}
                            onClick={() => setThemeColor(c.class)}
                            title={c.name}
                        />
                    ))}
                </div>
              )}

              {modalTab === 'avatar' && (
                <div className="grid grid-cols-5 gap-3 animate-fade-in">
                    {AVATAR_OPTIONS.map(emoji => (
                        <button 
                            key={emoji} 
                            className={`w-12 h-12 bg-slate-50 rounded-xl shadow-sm hover:bg-white hover:scale-110 active:scale-95 transition-all text-2xl flex items-center justify-center border-2 ${stats.avatar === emoji ? 'border-fun-blue bg-blue-50' : 'border-slate-200'}`}
                            onClick={() => setAvatar(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
              )}
              
              <div className="mt-8">
                 <Button variant="primary" className="w-full py-4 rounded-xl text-xl" onClick={() => setShowStyleModal(false)}>Looks Good!</Button>
              </div>
          </div>
      </div>
  );

  // --- PROFESSIONAL DASHBOARD (ADULTS) ---
  if (!isKids) {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        {showStyleModal && <StylePickerModal />}
        {/* Pro Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Dashboard Overview</h2>
            <p className="text-slate-500 text-sm">Welcome back, User. Here is your daily progress summary.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="pro-outline" icon={<Palette size={16}/>} onClick={() => setShowStyleModal(true)}>Theme</Button>
             <Button variant="pro-outline" icon={<Calendar size={16}/>}>Schedule</Button>
             <Button variant="pro-primary" icon={<PlayCircle size={16}/>} onClick={() => navigate('/vocab')}>Quick Start</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCardPro title="Total Experience" value={`${stats.points} XP`} icon={<Star size={20} />} trend="+12% this week" />
          <StatCardPro title="Current Streak" value={`${stats.streakDays} Days`} icon={<Flame size={20} />} trend="Keep it up!" />
          <StatCardPro title="Lessons Completed" value="24" icon={<CheckCircle2 size={20} />} trend="3 pending" />
          <StatCardPro title="Fluency Score" value="Intermediate" icon={<BarChart size={20} />} trend="B2 Level" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Content Column */}
           <div className="lg:col-span-2 space-y-8">
              {/* Badges Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                   <Award size={20} className="text-blue-600"/> Achievements
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                   {badges.length === 0 && <p className="text-slate-400 text-sm">No badges earned yet.</p>}
                   {badges.map(b => (
                     <BadgeDisplayPro key={b.id} badge={b} />
                   ))}
                </div>
              </div>

              {/* Continue Learning Path */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-800">Continue Learning</h3>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Curriculum &rarr;</button>
                 </div>
                 
                 <div className="space-y-4">
                    <CourseCardPro 
                      title="Business English Negotiation" 
                      subtitle="Scenario • 15 mins"
                      progress={75}
                      onClick={() => navigate('/roleplay')}
                      active
                    />
                     <CourseCardPro 
                      title="Advanced Grammar Patterns" 
                      subtitle="Module 4 • Conditionals"
                      progress={30}
                      onClick={() => navigate('/grammar')}
                    />
                 </div>
              </div>

              {/* Recommended Modules */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <ModuleCardPro 
                      title="Vocabulary Expansion" 
                      desc="Tech & Business Terms" 
                      icon={<BookOpen size={20} />}
                      onClick={() => navigate('/vocab')}
                   />
                   <ModuleCardPro 
                      title="Pronunciation Lab" 
                      desc="Reduce Accent" 
                      icon={<Brain size={20} />}
                      onClick={() => navigate('/videos')}
                   />
                </div>
              </div>
           </div>

           {/* Sidebar Column */}
           <div className="space-y-6">
              {/* Daily Goal */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-blue-600"/> Daily Goals
                 </h3>
                 <div className="space-y-4">
                    {quests.slice(0, 3).map(q => (
                       <div key={q.id} className="flex items-start gap-3">
                          <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${q.isCompleted ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                             {q.isCompleted && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                             <p className={`text-sm font-medium ${q.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{q.title}</p>
                             <p className="text-xs text-slate-400">Reward: {q.xpReward} XP</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles size={16} className="text-yellow-400"/> Pro Tip</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                       "Consistency beats intensity. 15 minutes a day is better than 2 hours once a week."
                    </p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- FUN DASHBOARD (KIDS) ---
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {showStyleModal && <StylePickerModal />}
      <header className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 shadow-sm bg-white rounded-[2.5rem] border-4 border-slate-100 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-fun-blue/5 rounded-full -mr-16 -mt-16 animate-pulse" />
        <div className="flex items-center gap-6">
           <div onClick={() => setShowStyleModal(true)} className={`w-20 h-20 ${stats.themeColor || 'bg-fun-blue'} rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center text-5xl transform rotate-3 animate-float cursor-pointer hover:scale-110 transition-transform relative group`}>
             <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm"><Palette size={14} className="text-slate-400" /></div>
             {stats.avatar || '😎'}
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                AI ARCADE <Sparkles className="text-fun-yellow animate-pulse" />
              </h2>
              <p className="text-slate-500 font-bold">Welcome back, <span className="text-fun-pink">Hero {stats.level}</span>!</p>
           </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="group flex flex-col items-center px-6 py-2 bg-orange-100 border-b-4 border-orange-200 rounded-3xl text-orange-600 font-black cursor-help">
               <Flame size={24} className="fill-current animate-pulse group-hover:scale-125 transition-transform" />
               <span className="text-2xl">{stats.streakDays}</span>
               <span className="text-[8px] uppercase">STREAK</span>
            </div>
            <div className="group flex flex-col items-center px-6 py-2 bg-yellow-100 border-b-4 border-yellow-200 rounded-3xl text-yellow-600 font-black">
               <Star size={24} className="fill-current animate-bounce-slow group-hover:rotate-180 transition-transform duration-500" />
               <span className="text-2xl">{stats.points}</span>
               <span className="text-[8px] uppercase">TOTAL XP</span>
            </div>
        </div>
      </header>

      {/* Badges Trophy Case */}
      <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 p-8 shadow-sm relative overflow-hidden">
         <div className="flex items-center gap-3 mb-6">
            <Award size={32} className="text-fun-yellow fill-current" />
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Trophy Case</h3>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {badges.map(badge => (
               <BadgeDisplayKids key={badge.id} badge={badge} />
            ))}
            {badges.length === 0 && (
               <div className="text-slate-400 font-bold italic">Play games to unlock your first badge!</div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Real Games Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <RocketIcon className="text-fun-pink" /> ACTION GAMES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionGameCard 
                title="Grammar Galaxy" 
                desc="Blast asteroids with the right words!" 
                icon="🚀" 
                color="bg-slate-900" 
                onClick={() => navigate('/game/galaxy')} 
              />
              <ActionGameCard 
                title="Dragon Boss Battle" 
                desc="Type spells to defeat the monster!" 
                icon="🐲" 
                color="bg-red-600" 
                onClick={() => navigate('/game/boss')} 
              />
              <ActionGameCard 
                title="Speed Racer" 
                desc="Type fast to win the race!" 
                icon="🏎️" 
                color="bg-fun-orange" 
                onClick={() => navigate('/game/racer')} 
              />
               <ActionGameCard 
                title="Word Whack" 
                desc="Smash the correct words!" 
                icon="🔨" 
                color="bg-green-600" 
                onClick={() => navigate('/game/whack')} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GameCard title="WORD RUSH" sub="Speed Match" icon={<Zap size={48} />} color="bg-fun-yellow" onClick={() => navigate('/vocab')} />
            <GameCard title="SCRAMBLE" sub="Logic Game" icon={<Brain size={48} />} color="bg-fun-purple" onClick={() => navigate('/grammar')} />
            <GameCard title="ADVENTURE" sub="Story Mode" icon={<Sword size={48} />} color="bg-fun-pink" onClick={() => navigate('/roleplay')} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-slate-50 relative group">
             <div className="absolute -top-4 -right-4 bg-fun-green text-white p-3 rounded-2xl rotate-12 shadow-lg font-black text-xs">
                PRO PLAYER
             </div>
             <div className="flex justify-between items-end mb-6">
                <h3 className="font-black text-2xl text-slate-800">LEVEL PROGRESS</h3>
                <span className="font-black text-slate-400">LVL {stats.level} &rarr; {stats.level + 1}</span>
             </div>
             <div className="w-full bg-slate-100 h-10 rounded-full border-4 border-slate-50 p-1.5 overflow-hidden">
                <div 
                   className="bg-gradient-to-r from-fun-blue via-cyan-400 to-fun-green h-full rounded-full transition-all duration-1000 relative shadow-inner" 
                   style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
             </div>
             <p className="mt-4 text-center font-bold text-slate-400 text-sm">{500 - (stats.points % 500)} XP until next Level Up!</p>
          </div>
        </div>

        <div className="space-y-8">
           {/* Customize Look Card */}
           <div 
             onClick={() => setShowStyleModal(true)}
             className="bg-white p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-xl cursor-pointer hover:scale-105 transition-transform group"
           >
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                    <Smile className="text-fun-purple" /> MY STYLE
                 </h3>
                 <div className={`w-12 h-12 rounded-2xl ${stats.themeColor || 'bg-fun-blue'} border-2 border-slate-200 shadow-sm flex items-center justify-center text-2xl`}>
                    {stats.avatar || '😎'}
                 </div>
              </div>
              <p className="text-slate-500 font-bold text-sm">Change color & avatar!</p>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
              <h3 className="text-white font-black text-xl mb-6 flex items-center justify-center gap-2">
                 <Wand2 className="text-fun-blue" /> DAILY LOOT
              </h3>
              
              <div 
                onClick={openMysteryBox}
                className={`w-32 h-32 mx-auto mb-6 flex items-center justify-center text-6xl cursor-pointer transition-all ${boxState === 'opening' ? 'animate-wiggle scale-110' : 'hover:scale-110 active:scale-95 animate-float'}`}
              >
                 {boxState === 'idle' ? '🎁' : boxState === 'opening' ? '✨' : '⭐'}
              </div>
              
              <p className="text-white font-bold mb-4">
                 {boxState === 'idle' ? 'What\'s inside today?' : boxState === 'opening' ? 'Opening...' : boxContent}
              </p>
              
              {boxState === 'idle' && (
                <button onClick={openMysteryBox} className="bg-fun-blue text-white px-8 py-3 rounded-2xl font-black shadow-lg border-b-4 border-sky-700 hover:bg-sky-400">
                   OPEN BOX
                </button>
              )}
              {boxState === 'opened' && (
                <div className="text-fun-yellow font-black text-sm uppercase animate-fade-in">Come back tomorrow!</div>
              )}
           </div>

           <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-2xl space-y-6">
              <h3 className="flex items-center gap-2 font-black text-2xl text-slate-800">
                <Rocket className="text-fun-blue" /> MISSIONS
              </h3>
              <div className="space-y-4">
                {quests.map(q => (
                  <div key={q.id} className={`p-5 rounded-3xl border-2 transition-all hover:scale-102 cursor-default ${q.isCompleted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-black ${q.isCompleted ? 'text-green-600 line-through opacity-60' : 'text-slate-800'}`}>{q.title}</span>
                        {q.isCompleted ? <CheckCircle2 className="text-green-600" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{q.xpReward} XP</p>
                        <div className="w-1/2 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${q.isCompleted ? 'bg-green-500 w-full' : 'bg-slate-300 w-1/3'}`} />
                        </div>
                      </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

// PRO COMPONENTS
const StatCardPro = ({ title, value, icon, trend }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">{icon}</div>
      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const CourseCardPro = ({ title, subtitle, progress, onClick, active }: any) => (
  <div onClick={onClick} className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors shadow-sm">
        {active ? <PlayCircle size={24} className="fill-blue-600 text-white" /> : <Clock size={20} />}
     </div>
     <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
           <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }} />
        </div>
     </div>
     <div className="text-slate-300 group-hover:text-blue-600">
        <ArrowRight size={20} />
     </div>
  </div>
);

const ModuleCardPro = ({ title, desc, icon, onClick }: any) => (
  <div onClick={onClick} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-all group">
     <div className="mb-3 text-slate-500 group-hover:text-blue-600">{icon}</div>
     <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
     <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

// KIDS COMPONENTS
const ActionGameCard = ({ title, desc, icon, color, onClick }: any) => (
  <div onClick={onClick} className={`group ${color} p-6 rounded-[2.5rem] text-white shadow-xl cursor-pointer hover:translate-y-[-8px] transition-all relative overflow-hidden flex items-center gap-6 border-b-8 border-black/20`}>
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
      <Star size={80} fill="white" />
    </div>
    <div className="text-5xl group-hover:animate-bounce">{icon}</div>
    <div className="flex-1">
      <h4 className="font-black text-xl">{title}</h4>
      <p className="text-xs font-bold text-white/70">{desc}</p>
    </div>
    <PlayCircle className="text-white/40 group-hover:text-white" size={32} />
  </div>
);

const GameCard = ({ title, sub, icon, color, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-8 rounded-[3.5rem] shadow-2xl border-b-[16px] border-slate-100 cursor-pointer transition-all hover:translate-y-[-12px] group text-center flex flex-col items-center">
    <div className={`${color} w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-xl group-hover:rotate-12 group-hover:scale-110 transition-all ring-4 ring-white`}>
      {icon}
    </div>
    <h3 className="font-black text-2xl text-slate-800 leading-tight group-hover:text-fun-blue transition-colors">{title}</h3>
    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1 mb-6">{sub}</p>
    <div className="bg-slate-900 text-white px-6 py-2 rounded-full flex items-center gap-2 font-black text-xs group-hover:bg-fun-blue group-active:scale-90 transition-all">
       GO PLAY <PlayCircle size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default Dashboard;
