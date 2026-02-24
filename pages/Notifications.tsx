
import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Bell, Info, Sparkles, Gift, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

const Notifications: React.FC = () => {
  const { appNotifications, isAdmin, deleteAppNotification, mode } = useGamification();
  const isKids = mode === 'kids';

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'reward': return 'bg-fun-pink/10 text-fun-pink border-fun-pink/20';
      case 'update': return 'bg-fun-blue/10 text-fun-blue border-fun-blue/20';
      case 'event': return 'bg-fun-yellow/10 text-fun-yellow border-fun-yellow/20';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reward': return <Gift size={20} />;
      case 'update': return <Sparkles size={20} />;
      case 'event': return <Calendar size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      <div className="text-center space-y-4">
        <div className="inline-block bg-fun-blue/10 p-4 rounded-full mb-2">
            <Bell size={48} className="text-fun-blue" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight uppercase">
           {isKids ? 'News & Updates' : 'Notifications'}
        </h2>
        <p className="text-lg sm:text-xl font-bold text-slate-500 max-w-2xl mx-auto">
           {isKids ? 'Check out what\'s new in the English Universe! 🚀' : 'Stay updated with the latest news, events, and rewards.'}
        </p>
      </div>

      <div className="space-y-4">
        {appNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border-4 border-slate-100 text-center shadow-xl">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-lg">No notifications yet!</p>
            <p className="text-slate-400">Check back later for exciting updates.</p>
          </div>
        ) : (
          appNotifications.map((notif, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={notif.id}
              className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border-2 shrink-0 ${getTypeStyles(notif.type)}`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-slate-800">{notif.title}</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteAppNotification(notif.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              {/* Decorative background element */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${getTypeStyles(notif.type).split(' ')[0]}`} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
