
import React, { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, LayoutDashboard, MessageCircle, BookOpen, PenTool, Trophy, Gamepad2, Briefcase, MonitorPlay, Crown, Store, ArrowRightLeft, LogOut, User, HelpCircle } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import ContactModal from './ContactModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mode, userId, logout, setIsContactOpen } = useGamification();
  const isKids = mode === 'kids';

  const navItems = [
    { name: isKids ? 'My Dashboard' : 'Dashboard', path: '/', icon: <LayoutDashboard size={24} />, color: isKids ? 'text-fun-blue' : 'text-slate-600' },
    { name: isKids ? 'Chat Games' : 'Roleplay', path: '/roleplay', icon: <MessageCircle size={24} />, color: isKids ? 'text-fun-pink' : 'text-slate-600' },
    { name: isKids ? 'Word Cards' : 'Vocabulary', path: '/vocab', icon: <BookOpen size={24} />, color: isKids ? 'text-fun-green' : 'text-slate-600' },
    { name: isKids ? 'Word Fixer' : 'Grammar', path: isKids ? '/grammar' : '/grammar-lessons', icon: <PenTool size={24} />, color: isKids ? 'text-fun-purple' : 'text-slate-600' },
    { name: isKids ? 'TV Time' : 'Videos', path: '/videos', icon: <MonitorPlay size={24} />, color: isKids ? 'text-fun-orange' : 'text-slate-600' },
    { name: isKids ? 'Trading Post' : 'Exchange', path: '/trading', icon: isKids ? <Store size={24} /> : <ArrowRightLeft size={24} />, color: isKids ? 'text-teal-500' : 'text-slate-600' },
    { name: isKids ? 'Winners' : 'Leaderboard', path: '/leaderboard', icon: <Trophy size={24} />, color: isKids ? 'text-fun-yellow' : 'text-slate-600' },
    { name: isKids ? 'Super Pass' : 'Premium', path: '/premium', icon: <Crown size={24} />, color: isKids ? 'text-amber-500' : 'text-amber-600' },
  ];

  return (
    <div className={`min-h-screen ${isKids ? 'font-sans bg-white' : 'font-adult bg-slate-50 text-slate-900'}`}>
      <style>
        {isKids ? `
          body {
            background-image: radial-gradient(#e0f7fa 2px, transparent 2px);
            background-size: 30px 30px;
            background-color: #ffffff;
          }
        ` : `
          body {
            background-image: none;
            background-color: #f8fafc;
          }
        `}
      </style>
      <Sidebar />
      <ContactModal />
      
      {/* Mobile Header */}
      <div className={`md:hidden p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm ${isKids ? 'bg-white border-b-4 border-slate-100' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center gap-2">
            <div className={`${isKids ? 'bg-fun-yellow p-1.5 rounded-lg border-b-2 border-yellow-400 rotate-3' : 'bg-blue-600 p-1.5 rounded'} text-white transform shadow-sm`}>
                {isKids ? <Gamepad2 size={20} /> : <Briefcase size={20} />}
            </div>
            <h1 className={`${isKids ? 'text-xl font-black' : 'text-lg font-semibold'} text-slate-800 tracking-tight`}>
                Linguist<span className={isKids ? 'text-fun-blue' : 'text-blue-600'}>AI</span>
            </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto flex flex-col shadow-2xl relative ${isKids ? '' : 'font-adult'}`} onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2">
                    <h2 className={`text-2xl text-slate-800 ${isKids ? 'font-black' : 'font-bold'}`}>Menu</h2>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <X size={24} />
                 </button>
            </div>
            
            <nav className="space-y-4 flex-1">
                {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                    `flex items-center px-5 py-4 transition-all duration-200 ${
                        isKids 
                        ? `text-lg font-bold rounded-2xl border-2 ${isActive ? 'bg-blue-50 text-fun-blue border-fun-blue shadow-sm' : 'text-slate-500 border-transparent hover:bg-slate-50 hover:scale-105'}`
                        : `text-base font-medium rounded-lg ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`
                    }`
                    }
                >
                    {({ isActive }) => (
                      <>
                        <span className={`mr-4 ${isActive && !isKids ? 'text-blue-600' : item.color}`}>
                        {item.icon}
                        </span>
                        {item.name}
                      </>
                    )}
                </NavLink>
                ))}
                
                <button
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsContactOpen(true);
                    }}
                    className={`w-full flex items-center px-5 py-4 transition-all duration-200 ${
                        isKids 
                        ? `text-lg font-bold rounded-2xl border-2 text-slate-500 border-transparent hover:bg-slate-50`
                        : `text-base font-medium rounded-lg text-slate-600 hover:bg-slate-50`
                    }`}
                >
                    <span className={`mr-4 ${isKids ? 'text-slate-500' : 'text-slate-600'}`}>
                        <HelpCircle size={24} />
                    </span>
                    {isKids ? 'Ask for Help' : 'Contact Support'}
                </button>
            </nav>

            {/* Mobile Footer with Logout */}
            <div className={`mt-6 pt-6 border-t ${isKids ? 'border-slate-100' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 overflow-hidden max-w-[50%]">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${isKids ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                         <User size={20} />
                      </div>
                      <span className={`font-bold truncate ${isKids ? 'text-slate-500' : 'text-slate-700'}`}>{userId}</span>
                   </div>
                   <button 
                      onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-colors ${isKids ? 'bg-red-50 text-red-400 hover:bg-red-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                   >
                      <LogOut size={20} />
                      Logout
                   </button>
                </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Area - Reduced padding for Pro mode */}
      <main className={`md:ml-${isKids ? '72' : '64'} p-4 md:p-${isKids ? '10' : '8'} max-w-7xl mx-auto transition-all`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
