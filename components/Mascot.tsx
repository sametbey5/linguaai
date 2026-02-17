
import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';

const MESSAGES = [
  "You're doing amazing! High five! ✋",
  "English is your superpower! 🦸‍♀️",
  "Don't forget to practice every day! 📅",
  "Wow, your level is climbing fast! 🚀",
  "Did you know 'Dreamt' is the only word ending in 'mt'? 🧠",
  "Ready for another challenge? Let's go! 💨"
];

const Mascot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 5000);

    const hideTimer = setInterval(() => {
      setVisible(v => !v);
      if (!visible) setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-40 flex flex-col items-end animate-fade-in group pointer-events-none">
      <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-slate-100 mb-2 relative max-w-[200px] pointer-events-auto cursor-help transform group-hover:-translate-y-2 transition-transform">
        <p className="text-sm font-bold text-slate-700">{msg}</p>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-100 rotate-45" />
      </div>
      <div className="w-20 h-20 bg-fun-blue rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-float pointer-events-auto cursor-pointer active:scale-90 transition-transform">
        🤖
      </div>
    </div>
  );
};

export default Mascot;
