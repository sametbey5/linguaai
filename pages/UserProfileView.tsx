
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { useGamification } from '../context/GamificationContext';
import { BadgeDisplayKids, BadgeDisplayPro } from '../components/BadgeDisplay';
import Button from '../components/Button';
import { ChevronLeft, Trophy, Star, Flame, User, LayoutDashboard } from 'lucide-react';

const UserProfileView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { mode } = useGamification();
    const isKids = mode === 'kids';
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

    // Professional View
    if (!isKids) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                    <Button variant="pro-outline" onClick={() => navigate(-1)} className="p-2 h-auto">
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <User size={24} className="text-blue-600" />
                            {userId}'s Profile
                        </h2>
                        <p className="text-slate-500">Player Overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total XP</p>
                            <p className="text-xl font-bold text-slate-900">{profile.stats.points}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Level</p>
                            <p className="text-xl font-bold text-slate-900">{profile.stats.level}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                            <Flame size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Streak</p>
                            <p className="text-xl font-bold text-slate-900">{profile.stats.streakDays} Days</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Trophy size={20} className="text-blue-600"/> Achievement Collection
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {profile.badges.length === 0 && <p className="text-slate-400">No badges earned yet.</p>}
                        {profile.badges.map(b => (
                            <BadgeDisplayPro key={b.id} badge={b} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Kids View
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => navigate(-1)} className="rounded-2xl">
                    <ChevronLeft size={24} /> Back
                </Button>
                <div className="bg-white px-6 py-3 rounded-3xl border-4 border-slate-100 shadow-sm">
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <span className="text-4xl">{profile.mode === 'kids' ? '😎' : '👨‍💼'}</span>
                        {userId}
                    </h2>
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
                    {profile.badges.map(badge => (
                        <BadgeDisplayKids key={badge.id} badge={badge} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfileView;
