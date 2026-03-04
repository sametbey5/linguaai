
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { useGamification } from '../context/GamificationContext';
import { BadgeDisplayKids, BadgeDisplayPro } from '../components/BadgeDisplay';
import Button from '../components/Button';
import { ChevronLeft, Trophy, Star, Flame, User, LayoutDashboard, Crown, ShieldCheck, GraduationCap } from 'lucide-react';

import UserRoleBadge from '../components/UserRoleBadge';

const UserProfileView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { mode } = useGamification();
    const isKids = true; // Forced to kids mode
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        db.getUser(userId).then(p => {
            setProfile(p);
            setLoading(false);
        });
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin text-4xl">⏳</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center p-10 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">User Not Found</h2>
                <Button onClick={() => navigate('/leaderboard')}>Back to Leaderboard</Button>
            </div>
        );
    }

    // Kids View
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={() => navigate(-1)} className="rounded-2xl">
                        <ChevronLeft size={24} /> Back
                    </Button>
                    <div className="bg-white px-6 py-3 rounded-3xl border-4 border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-fun-blue/10 border-2 border-fun-blue/20 overflow-hidden shadow-inner">
                            <img 
                                src={profile.stats.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                                alt={userId} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2">
                                {userId}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {profile.isAdmin && <UserRoleBadge role="admin" size="md" />}
                                {profile.isVerifiedTeacher && <UserRoleBadge role="teacher" size="md" />}
                                {profile.isPremium && <UserRoleBadge role="premium" size="md" />}
                            </div>
                            <p className="text-fun-pink font-black text-sm uppercase tracking-widest mt-1">{profile.stats.identityTitle || 'Explorer'}</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block bg-fun-blue text-white px-6 py-3 rounded-3xl font-black shadow-lg border-b-4 border-blue-700">
                    #{profile.stats.level} LEVEL
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg flex flex-col items-center text-center">
                    <div className="text-5xl mb-2 text-yellow-400 drop-shadow-sm"><Star fill="currentColor" /></div>
                    <div className="text-3xl font-black text-slate-800">{profile.stats.points}</div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Total XP</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg flex flex-col items-center text-center">
                    <div className="text-5xl mb-2 text-fun-blue drop-shadow-sm"><Trophy fill="currentColor" /></div>
                    <div className="text-3xl font-black text-slate-800">{profile.stats.level}</div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Level</div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-lg flex flex-col items-center text-center">
                    <div className="text-5xl mb-2 text-orange-500 drop-shadow-sm animate-pulse"><Flame fill="currentColor" /></div>
                    <div className="text-3xl font-black text-slate-800">{profile.stats.streakDays}</div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Day Streak</div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-fun-yellow p-3 rounded-2xl text-white transform rotate-3 shadow-md">
                        <Trophy size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Trophy Room</h3>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {profile.badges.length === 0 && (
                        <div className="text-slate-400 font-bold italic p-10 text-center w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            No trophies yet!
                        </div>
                    )}
                    {profile.badges.map((badge, index) => (
                        <BadgeDisplayKids key={`${badge.id}-${index}`} badge={badge} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfileView;
