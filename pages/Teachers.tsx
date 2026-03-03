
import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Star, Award, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';

const TEACHERS = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    username: '@sarah_grammar',
    specialty: 'Grammar & Syntax',
    bio: 'Expert in English linguistics with over 10 years of experience helping students master complex grammar rules.',
    image: 'https://i.pravatar.cc/150?u=sarah',
    rating: 4.9,
    students: 1240,
    online: true
  },
  {
    id: 't2',
    name: 'Michael Chen',
    username: '@mike_vocab',
    specialty: 'Vocabulary & Idioms',
    bio: 'Passionate about expanding students\' word power through creative storytelling and mnemonic techniques.',
    image: 'https://i.pravatar.cc/150?u=mike',
    rating: 4.8,
    students: 850,
    online: false
  },
  {
    id: 't3',
    name: 'Elena Rodriguez',
    username: '@elena_pro',
    specialty: 'Pronunciation & Fluency',
    bio: 'Certified accent reduction coach dedicated to helping non-native speakers speak with confidence and clarity.',
    image: 'https://i.pravatar.cc/150?u=elena',
    rating: 5.0,
    students: 2100,
    online: true
  }
];

const Teachers: React.FC = () => {
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
        {TEACHERS.map((teacher, index) => (
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
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {teacher.online && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-fun-green border-4 border-white rounded-full shadow-sm" />
                  )}
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-800">{teacher.name}</h3>
                <p className="text-fun-blue font-bold">{teacher.username}</p>
                <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">
                  {teacher.specialty}
                </div>
              </div>

              <p className="text-slate-500 text-sm text-center leading-relaxed">
                {teacher.bio}
              </p>

              <div className="flex items-center justify-around border-t border-slate-50 pt-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-fun-yellow font-black">
                    <Star size={16} fill="currentColor" />
                    <span>{teacher.rating}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-fun-purple font-black">
                    <Award size={16} />
                    <span>{teacher.students}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Students</p>
                </div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                className="rounded-2xl py-4"
                icon={<MessageCircle size={20} />}
              >
                Send Message
              </Button>
            </div>
          </motion.div>
        ))}
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
