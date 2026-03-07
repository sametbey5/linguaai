
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, GraduationCap, Circle } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import UserRoleBadge from '../components/UserRoleBadge';

const Teachers: React.FC = () => {
  const { verifiedTeachers } = useGamification();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight uppercase">
          Our Expert Teachers
        </h1>
        <p className="text-xl font-bold text-slate-500 max-w-2xl mx-auto">
          Connect with professional educators who are ready to help you on your language learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {verifiedTeachers.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-4 border-slate-100 shadow-xl">
            <GraduationCap size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black text-xl">No verified teachers yet. Check back soon!</p>
          </div>
        ) : (
          verifiedTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[3rem] border-4 border-slate-100 shadow-xl overflow-hidden group hover:border-fun-blue transition-all"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-center relative">
                  <div className="relative">
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.username} 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-fun-green border-4 border-white rounded-full shadow-sm flex items-center justify-center" title="Online">
                      <Circle size={8} className="text-white fill-current animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-2xl font-black text-slate-800">{teacher.username}</h3>
                    <UserRoleBadge role="teacher" size="md" />
                  </div>
                  <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">
                    {teacher.specialty}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {teacher.experience}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-fun-green font-black text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 bg-fun-green rounded-full animate-pulse" />
                  Currently Online
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-fun-blue/5 rounded-[3rem] p-12 border-4 border-fun-blue/10 text-center space-y-6 mt-12">
        <div className="w-16 h-16 bg-fun-blue text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Verified Educators</h2>
        <p className="text-slate-600 font-medium max-w-xl mx-auto">
          All our teachers are background-checked and certified professionals with years of experience in language instruction.
        </p>
      </div>
    </div>
  );
};

export default Teachers;
