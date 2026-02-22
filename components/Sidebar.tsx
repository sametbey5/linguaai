
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, BookOpen, PenTool, Trophy, Gamepad2, Briefcase, Zap, Sword, Brain, MonitorPlay, BarChart3, Settings, Mic, Crown, Store, ArrowRightLeft, LogOut, User, ShieldCheck, HelpCircle, Globe, ChevronDown } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const Sidebar: React.FC = () => {
  const { mode, setMode, userId, logout, isAdmin, setIsContactOpen, preferredLanguage, updateProfile } = useGamification();
  const isKids = mode === 'kids';
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navItems = [
    { name: isKids ? 'Arcade Home' : 'Overview', path: '/', icon: <LayoutDashboard size={isKids ? 24 : 20} />, color: 'text-fun-blue' },
    { name: isKids ? 'Quest Mode' : 'Scenarios', path: '/roleplay', icon: isKids ? <Sword size={24} /> : <MessageCircle size={20} />, color: 'text-fun-pink' },
    { name: isKids ? 'Talk to Friend' : 'Live Conversation', path: '/talk', icon: <Mic size={isKids ? 24 : 20} />, color: 'text-fun-green' }, 
    { name: isKids ? 'Word Rush' : 'Vocabulary', path: '/vocab', icon: isKids ? <Zap size={24} /> : <BookOpen size={20} />, color: 'text-fun-yellow' },
    { name: isKids ? 'Scramble' : 'Grammar', path: isKids ? '/grammar' : '/grammar-lessons', icon: isKids ? <Brain size={24} /> : <PenTool size={20} />, color: 'text-fun-purple' },
    { name: isKids ? 'TV Time' : 'Video Content', path: '/videos', icon: <MonitorPlay size={isKids ? 24 : 20} />, color: 'text-fun-orange' },
    { name: isKids ? 'Trading Post' : 'Exchange', path: '/trading', icon: isKids ? <Store size={24} /> : <ArrowRightLeft size={20} />, color: 'text-teal-500' },
    { name: isKids ? 'Leaderboard' : 'Analytics', path: '/leaderboard', icon: isKids ? <Trophy size={24} /> : <BarChart3 size={20} />, color: 'text-fun-green' },
  ];

  const handleLanguageChange = (lang: string) => {
    updateProfile({ preferredLanguage: lang });
    setIsLangMenuOpen(false);
  };

  if (!isKids) {
    // Professional Sidebar Structure
    return (
      <div className="w-64 bg-slate-900 hidden md:flex flex-col h-screen fixed left-0 top-0 z-10 border-r border-slate-800 text-slate-300">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Briefcase size={20} />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Linguist<span className="text-blue-500">AI</span> <span className="text-xs font-normal text-slate-500 ml-1">Pro</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 transition-all duration-200 text-sm font-medium rounded-lg group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`
              }
            >
              <span className={`mr-3 ${({ isActive }: any) => isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
          
          <div className="mt-6 pt-6 border-t border-slate-800 px-3 space-y-1">
             <NavLink
               to="/premium"
               className={({ isActive }) => 
                 `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-amber-500 hover:bg-amber-500/10'}`
               }
             >
                <Crown size={20} className="mr-3" />
                Premium Plan
             </NavLink>

             <button
               onClick={() => setIsContactOpen(true)}
               className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-100"
             >
                <HelpCircle size={20} className="mr-3" />
                Support
             </button>

             {isAdmin && (
               <NavLink
                 to="/admin"
                 className={({ isActive }) => 
                   `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-red-500/10 text-red-400' : 'text-red-400 hover:bg-red-500/10'}`
                 }
               >
                  <ShieldCheck size={20} className="mr-3" />
                  Admin Panel
               </NavLink>
             )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe size={14} />
                <span>{preferredLanguage || 'Turkish'}</span>
              </div>
              <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.name)}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <p className="font-medium text-slate-400 text-xs mb-3 flex items-center gap-2"><Settings size={12}/> Mode Selection</p>
             <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                 <button 
                    onClick={() => setMode('kids')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${(mode as string) === 'kids' ? 'bg-fun-blue text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    Junior
                 </button>
                 <button 
                    onClick={() => setMode('adults')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${(mode as string) === 'adults' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    Pro
                 </button>
             </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                    <User size={14} />
                </div>
                <span className="text-xs font-medium text-slate-400 truncate max-w-[80px]">{userId}</span>
             </div>
             <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={16} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Original Fun Sidebar for Kids
  return (
    <div className={`w-72 bg-white hidden md:flex flex-col h-screen fixed left-0 top-0 z-10 border-r-4 border-slate-100 shadow-lg rounded-r-[3rem]`}>
      <div className="p-8 flex items-center space-x-3">
        <div className={`bg-fun-blue p-3 rounded-2xl transform rotate-3 shadow-md border-b-4 border-sky-600 text-white`}>
          <Gamepad2 size={32} />
        </div>
        <h1 className={`text-2xl font-black text-slate-800`}>
          Linguist<span className={'text-fun-blue'}>AI</span>
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-4 transition-all duration-200 group text-lg font-black rounded-3xl border-2 ${
                isActive ? 'bg-blue-50 text-fun-blue border-fun-blue shadow-sm' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:scale-105'
              }`
            }
          >
            <span className={`mr-4 ${item.color}`}>
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
        
        <NavLink
            to="/premium"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 transition-all duration-200 group text-lg font-black rounded-3xl border-4 ${
                isActive 
                  ? 'bg-amber-50 text-amber-500 border-amber-400 shadow-sm' 
                  : 'text-amber-500 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:scale-105'
              }`
            }
          >
            <span className="mr-4">
              <Crown size={24} className="fill-current animate-pulse" />
            </span>
            SUPER PASS
        </NavLink>

        <button
            onClick={() => setIsContactOpen(true)}
            className={`w-full flex items-center px-6 py-4 transition-all duration-200 group text-lg font-black rounded-3xl border-4 border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-500 hover:scale-105`}
          >
            <span className="mr-4">
              <HelpCircle size={24} />
            </span>
            ASK FOR HELP
        </button>

        {isAdmin && (
           <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center px-6 py-4 transition-all duration-200 group text-lg font-black rounded-3xl border-4 ${
                  isActive 
                    ? 'bg-red-50 text-red-500 border-red-400 shadow-sm' 
                    : 'text-red-400 border-red-200 bg-red-50/50 hover:bg-red-100 hover:scale-105'
                }`
              }
            >
              <span className="mr-4">
                <ShieldCheck size={24} />
              </span>
              ADMIN ZONE
          </NavLink>
        )}
      </nav>

      <div className="p-8 border-t-4 border-slate-50 space-y-4">
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-full flex items-center justify-between px-6 py-3 rounded-3xl bg-slate-50 border-2 border-slate-200 text-slate-500 font-black text-xs hover:bg-slate-100 transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-fun-blue" />
              <span>{preferredLanguage || 'Turkish'}</span>
            </div>
            <ChevronDown size={16} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLangMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white border-4 border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.name)}
                  className="w-full px-6 py-3 text-left text-sm font-black text-slate-500 hover:bg-blue-50 hover:text-fun-blue flex items-center gap-3 transition-colors"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-200 text-center">
             <p className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-3">Target Audience</p>
             <div className="flex bg-white rounded-full p-1 border-2 border-slate-200 shadow-inner relative">
                 <button 
                    onClick={() => setMode('kids')}
                    className={`flex-1 py-2 rounded-full text-xs font-black transition-all z-10 ${(mode as string) === 'kids' ? 'bg-fun-blue text-white shadow-md' : 'text-slate-400'}`}
                 >
                    Junior
                 </button>
                 <button 
                    onClick={() => setMode('adults')}
                    className={`flex-1 py-2 rounded-full text-xs font-black transition-all z-10 ${(mode as string) === 'adults' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                 >
                    Elite
                 </button>
             </div>
        </div>

        <div className="flex items-center justify-between px-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-xs">
                 <User size={14} />
              </div>
              <span className="font-black text-slate-400 text-xs truncate max-w-[100px]">{userId}</span>
           </div>
           <button onClick={logout} className="text-slate-400 hover:text-red-400 font-bold text-xs flex items-center gap-1 transition-colors">
              <LogOut size={14} /> Logout
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
