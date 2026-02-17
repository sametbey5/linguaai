
import React from 'react';

const Confetti: React.FC = () => {
  const colors = ['bg-fun-pink', 'bg-fun-blue', 'bg-fun-yellow', 'bg-fun-green', 'bg-fun-purple'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i}
          className={`absolute w-3 h-3 rounded-sm animate-confetti ${colors[Math.floor(Math.random() * colors.length)]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
