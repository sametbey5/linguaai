import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { BarChart, BookOpen, Mic, Ear, PenTool, Globe, TrendingUp } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const { stats } = useGamification();

  const skills = [
    { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpen size={20} />, color: 'bg-yellow-500', text: 'text-yellow-500' },
    { id: 'speaking', label: 'Speaking', icon: <Mic size={20} />, color: 'bg-red-500', text: 'text-red-500' },
    { id: 'listening', label: 'Listening', icon: <Ear size={20} />, color: 'bg-blue-500', text: 'text-blue-500' },
    { id: 'grammar', label: 'Grammar', icon: <PenTool size={20} />, color: 'bg-purple-500', text: 'text-purple-500' },
    { id: 'realLife', label: 'Real Life', icon: <Globe size={20} />, color: 'bg-green-500', text: 'text-green-500' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 p-8 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={32} className="text-fun-blue fill-current" />
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Your Progress</h3>
      </div>
      
      <div className="space-y-6">
        {skills.map((skill) => {
          // @ts-ignore
          const skillData = stats.skills[skill.id];
          if (!skillData) return null;
          
          return (
            <div key={skill.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${skill.color} bg-opacity-10 ${skill.text}`}>
                    {skill.icon}
                  </div>
                  <span className="font-bold text-slate-700">{skill.label}</span>
                </div>
                <span className="font-black text-slate-400 text-sm">Lvl {skillData.level}</span>
              </div>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${skill.color} transition-all duration-1000 ease-out`} 
                  style={{ width: `${skillData.progress}%` }} 
                />
              </div>
              
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>{Math.floor(skillData.totalXp)} XP Total</span>
                <span>{Math.floor(skillData.progress)}% to next level</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t-2 border-slate-100 flex justify-between items-center">
        <div className="text-center flex-1 border-r-2 border-slate-100">
            <div className="text-3xl font-black text-slate-800">{stats.level}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Global Level</div>
        </div>
        <div className="text-center flex-1">
            <div className="text-3xl font-black text-fun-blue">{stats.points}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total XP</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
