
import React, { useState } from 'react';
import { Badge } from '../types';

export const BadgeDisplayPro: React.FC<{ badge: Badge }> = ({ badge }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <div className="flex-shrink-0 flex flex-col items-center bg-slate-50 p-3 rounded-lg border border-slate-200 w-24 text-center hover:bg-slate-100 transition-colors">
            {!imgError && badge.image ? (
                <img 
                    src={badge.image} 
                    alt={badge.name} 
                    className="w-10 h-10 object-contain mb-1 drop-shadow-sm"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'; // Immediate visual hide
                        setImgError(true);
                    }}
                />
            ) : (
                <div className="text-3xl mb-1">{badge.icon}</div>
            )}
            <span className="text-xs font-medium text-slate-700 leading-tight">{badge.name}</span>
        </div>
    );
};

export const BadgeDisplayKids: React.FC<{ badge: Badge }> = ({ badge }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <div className={`flex-shrink-0 w-32 p-4 rounded-3xl border-b-4 flex flex-col items-center text-center gap-2 transition-transform hover:scale-105 ${badge.color} border-black/10`}>
            {!imgError && badge.image ? (
                <div className="w-20 h-20 mb-2 filter drop-shadow-md transition-transform hover:scale-110">
                    <img 
                        src={badge.image} 
                        alt={badge.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'; // Immediate visual hide
                            setImgError(true);
                        }}
                    />
                </div>
            ) : (
                <div className="text-5xl drop-shadow-md">{badge.icon}</div>
            )}
            <span className="text-white font-black text-xs leading-tight uppercase drop-shadow-sm">{badge.name}</span>
        </div>
    );
};
