
import React from 'react';

interface TalkingAvatarProps {
  character: 'robot' | 'owl' | 'cat' | 'elsa' | 'spiderman' | 'batman';
  volume: number; // 0 to 100
}

const TalkingAvatar: React.FC<TalkingAvatarProps> = ({ character, volume }) => {
  // Map volume (0-100) to mouth opening scale (0-1)
  const mouthOpen = Math.min(Math.max(volume / 50, 0.1), 1); 

  if (character === 'robot') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
        {/* Antenna */}
        <line x1="100" y1="50" x2="100" y2="20" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="100" cy="20" r="8" fill="#ef4444" className={volume > 10 ? "animate-pulse" : ""} />
        
        {/* Head */}
        <rect x="50" y="50" width="100" height="100" rx="20" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
        
        {/* Eyes */}
        <circle cx="80" cy="90" r="10" fill="#0f172a" />
        <circle cx="120" cy="90" r="10" fill="#0f172a" />
        <circle cx="82" cy="88" r="3" fill="white" />
        <circle cx="122" cy="88" r="3" fill="white" />

        {/* Mouth (Scales height based on volume) */}
        <rect 
            x="75" 
            y="120" 
            width="50" 
            height={4 + (mouthOpen * 20)} 
            rx="4" 
            fill="#334155" 
            transform={`translate(0, ${-mouthOpen * 10})`} // Keep centered
            className="transition-all duration-75"
        />
      </svg>
    );
  }

  if (character === 'cat') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
         {/* Ears */}
         <path d="M60 60 L40 20 L90 50 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
         <path d="M140 60 L160 20 L110 50 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
         
         {/* Head */}
         <circle cx="100" cy="110" r="60" fill="#fcd34d" stroke="#d97706" strokeWidth="4" />
         
         {/* Eyes */}
         <ellipse cx="80" cy="100" rx="12" ry="15" fill="white" />
         <ellipse cx="120" cy="100" rx="12" ry="15" fill="white" />
         <circle cx="80" cy="100" r="5" fill="black" />
         <circle cx="120" cy="100" r="5" fill="black" />
         
         {/* Nose */}
         <path d="M95 120 L105 120 L100 128 Z" fill="#ec4899" />
         
         {/* Mouth (Opens vertically) */}
         <path 
            d={`M90 135 Q100 ${135 + (mouthOpen * 25)} 110 135`} 
            fill="none" 
            stroke="#92400e" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="transition-all duration-75"
         />
         
         {/* Whiskers */}
         <line x1="50" y1="120" x2="20" y2="115" stroke="black" strokeWidth="2" opacity="0.5" />
         <line x1="50" y1="125" x2="20" y2="130" stroke="black" strokeWidth="2" opacity="0.5" />
         <line x1="150" y1="120" x2="180" y2="115" stroke="black" strokeWidth="2" opacity="0.5" />
         <line x1="150" y1="125" x2="180" y2="130" stroke="black" strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }

  if (character === 'owl') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
         {/* Body */}
         <ellipse cx="100" cy="110" rx="60" ry="70" fill="#a78bfa" stroke="#7c3aed" strokeWidth="4" />
         
         {/* Belly */}
         <ellipse cx="100" cy="130" rx="40" ry="40" fill="#ddd6fe" />
         
         {/* Eyes */}
         <circle cx="75" cy="80" r="25" fill="white" stroke="#7c3aed" strokeWidth="3" />
         <circle cx="125" cy="80" r="25" fill="white" stroke="#7c3aed" strokeWidth="3" />
         <circle cx="75" cy="80" r="10" fill="#0f172a" />
         <circle cx="125" cy="80" r="10" fill="#0f172a" />
         
         {/* Beak / Mouth */}
         <path 
           d={`M90 105 L110 105 L100 ${115 + (mouthOpen * 15)} Z`} 
           fill="#facc15" 
           stroke="#ca8a04" 
           strokeWidth="2" 
           className="transition-all duration-75"
         />
         
         {/* Wings */}
         <path d="M40 110 Q20 130 40 160" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
         <path d="M160 110 Q180 130 160 160" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (character === 'elsa') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
         {/* Hair Back */}
         <path d="M50 80 Q50 20 100 20 Q150 20 150 80 L140 160 L60 160 Z" fill="#fdf4ff" />
         
         {/* Braid */}
         <path d="M140 80 Q160 120 130 180" stroke="#fdf4ff" strokeWidth="25" strokeLinecap="round" fill="none" />
         
         {/* Face */}
         <path d="M60 80 Q60 150 100 150 Q140 150 140 80 Q140 40 100 40 Q60 40 60 80" fill="#ffe4c4" />
         
         {/* Bangs */}
         <path d="M60 60 Q100 20 140 60 Q120 30 100 30 Q80 30 60 60" fill="#fdf4ff" />
         
         {/* Eyes */}
         <ellipse cx="85" cy="90" rx="8" ry="10" fill="white" />
         <ellipse cx="115" cy="90" rx="8" ry="10" fill="white" />
         <circle cx="85" cy="90" r="4" fill="#0d75eb" />
         <circle cx="115" cy="90" r="4" fill="#0d75eb" />
         <circle cx="85" cy="90" r="1.5" fill="black" />
         <circle cx="115" cy="90" r="1.5" fill="black" />
         
         {/* Mouth */}
         <path 
           d={`M90 125 Q100 ${125 + (mouthOpen * 15)} 110 125`} 
           fill={mouthOpen > 0.3 ? "#be123c" : "none"}
           stroke="#be123c" 
           strokeWidth={mouthOpen > 0.3 ? "0" : "2"}
           strokeLinecap="round"
           className="transition-all duration-75"
         />
         
         {/* Snow Sparkles */}
         <circle cx="170" cy="50" r="5" fill="#a5f3fc" className="animate-pulse" />
         <circle cx="30" cy="140" r="3" fill="#a5f3fc" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      </svg>
    );
  }

  if (character === 'spiderman') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
         {/* Head */}
         <path d="M50 50 Q100 0 150 50 Q170 100 150 150 Q100 200 50 150 Q30 100 50 50" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
         
         {/* Webbing - Simple Lines */}
         <path d="M100 25 L100 175 M50 50 L150 150 M150 50 L50 150 M35 100 L165 100" stroke="#7f1d1d" strokeWidth="1" opacity="0.6" fill="none" />
         
         {/* Eyes */}
         <path d="M60 80 Q80 70 90 90 Q80 110 60 100 Q50 90 60 80" fill="white" stroke="black" strokeWidth="4" />
         <path d="M140 80 Q120 70 110 90 Q120 110 140 100 Q150 90 140 80" fill="white" stroke="black" strokeWidth="4" />
         
         {/* Mouth (Mask movement) */}
         {/* Simulating mask moving by stretching the jaw line slightly or drawing a mouth line on mask */}
         <path 
           d={`M90 140 Q100 ${140 + (mouthOpen * 10)} 110 140`} 
           stroke="#7f1d1d" 
           strokeWidth="2" 
           fill="none"
           opacity={mouthOpen > 0.1 ? 0.8 : 0}
           className="transition-all duration-75"
         />
      </svg>
    );
  }

  if (character === 'batman') {
    return (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl animate-float">
         {/* Ears */}
         <path d="M60 60 L60 10 L90 50 Z" fill="#1e293b" />
         <path d="M140 60 L140 10 L110 50 Z" fill="#1e293b" />
         
         {/* Cowl Top */}
         <path d="M50 60 Q100 40 150 60 L150 110 L50 110 Z" fill="#1e293b" />
         
         {/* Jaw (Skin) */}
         <path d="M60 110 L140 110 L130 160 Q100 180 70 160 Z" fill="#ffdbac" />

         {/* Cowl Sides */}
         <path d="M50 110 L60 160 L70 160 L60 110 Z" fill="#1e293b" />
         <path d="M150 110 L140 160 L130 160 L140 110 Z" fill="#1e293b" />
         
         {/* Eyes */}
         <path d="M70 90 L100 95 L75 80 Z" fill="white" />
         <path d="M130 90 L100 95 L125 80 Z" fill="white" />
         
         {/* Mouth */}
         <path 
           d={`M90 140 Q100 ${140 + (mouthOpen * 20)} 110 140`} 
           fill={mouthOpen > 0.3 ? "#4a0404" : "none"} 
           stroke="#4a0404"
           strokeWidth={mouthOpen > 0.3 ? "0" : "3"}
           className="transition-all duration-75"
         />
      </svg>
    );
  }

  return null;
};

export default TalkingAvatar;
