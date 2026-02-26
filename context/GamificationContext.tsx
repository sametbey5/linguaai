
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserStats, Badge, LeaderboardEntry, AppMode, Quest, TradeOffer, GamificationContextType, UserProfile, UserTrade, ContactRequest, AppNotification } from '../types';
import { Star, Zap, Award, Gift, Sparkles, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { db } from '../services/db';
import { supabase } from '../services/supabaseClient';
import { ALL_BADGES } from '../constants/badges';
import { IAP, PurchasesPackage } from '../services/iap'; // Import IAP Service
import { ADMIN_USERS } from '../constants';

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const generateRandomTradeOffers = (count: number): TradeOffer[] => {
  const offers: TradeOffer[] = [];
  const merchants = ['Trader Tom', 'Library Owl', 'Mystic Maya', 'Gadget Guy', 'Forest Fairy', 'Space Scout', 'Chef Charlie'];
  
  for (let i = 0; i < count; i++) {
    const rewardBadge = ALL_BADGES[Math.floor(Math.random() * ALL_BADGES.length)];
    // For required badge, we can either pick another random one or use a specific one
    // Let's pick another random one from the pool, but maybe a common one?
    // For simplicity, let's just pick another random one.
    const requiredBadge = ALL_BADGES[Math.floor(Math.random() * ALL_BADGES.length)];
    
    offers.push({
      id: `t_gen_${i}`,
      requiredBadgeId: requiredBadge.id,
      merchantName: merchants[i % merchants.length],
      expiresIn: `${Math.floor(Math.random() * 5) + 1} Days`,
      rewardBadge: rewardBadge
    });
  }
  return offers;
};

const INITIAL_TRADES: TradeOffer[] = generateRandomTradeOffers(10);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication State
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('current_user_id'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('current_user_id'));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Game State
  const defaultProfile = db.getDefaults();
  const [stats, setStats] = useState<UserStats>(defaultProfile.stats);
  const [badges, setBadges] = useState<Badge[]>(defaultProfile.badges);
  const [quests, setQuests] = useState<Quest[]>(defaultProfile.quests);
  const [mode, setMode] = useState<AppMode>(defaultProfile.mode);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userTrades, setUserTrades] = useState<UserTrade[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumDetails, setPremiumDetails] = useState<{
    expirationDate?: string;
    willRenew?: boolean;
    productIdentifier?: string;
  } | null>(null);
  const [focusArea, setFocusArea] = useState<string[]>(defaultProfile.focusArea || []);
  const [usageContext, setUsageContext] = useState<string>(defaultProfile.usageContext || '');
  const [cefrLevel, setCefrLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>(defaultProfile.cefrLevel || 'A1');
  const [preferredLanguage, setPreferredLanguage] = useState<string>(defaultProfile.preferredLanguage || 'Turkish');
  const [email, setEmail] = useState<string>(defaultProfile.email || '');
  
  // Local (non-persisted) state
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>(INITIAL_TRADES);
  const [notification, setNotification] = useState<{ text: string; type: 'xp' | 'level' | 'badge' | 'reward' | 'trade' } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // UI State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);

  // --- IAP Initialization ---
  useEffect(() => {
    // Initialize RevenueCat when userId is available
    if (userId) {
        IAP.initialize(userId).then(() => {
            // Check if user has active subscription from RevenueCat
            IAP.checkSubscriptionStatus().then(isActive => {
                if (isActive) {
                    setIsPremium(true);
                    IAP.getPremiumDetails().then(setPremiumDetails);
                    
                    // Also sync to DB if needed
                    db.getUser(userId).then(u => {
                        if (u && !u.isPremium) {
                             db.saveUser(userId, { ...u, isPremium: true });
                        }
                    });
                } else {
                    setIsPremium(false);
                    setPremiumDetails(null);
                }
            });
        });
    }
  }, [userId]);

  // --- Auth & Data Loading Logic ---

  const login = async (id: string, password?: string, isSignUp?: boolean, email?: string): Promise<boolean> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const existingProfile = await db.getUser(id);

      if (isSignUp) {
        // REGISTER FLOW
        if (existingProfile) {
          throw new Error("User ID already exists. Please login.");
        }

        if (email) {
            const emailCheck = await db.getUserByEmail(email);
            if (emailCheck) {
                throw new Error("Email already registered. Please login.");
            }
        }
        
        // Create new user
        const newProfile: UserProfile = {
          ...db.getDefaults(),
          password: password, // Store password
          email: email
        };
        
        const success = await db.saveUser(id, newProfile);
        if (!success) throw new Error("Failed to create account.");
        
        // Set local state
        setStats(newProfile.stats);
        setBadges(newProfile.badges);
        setQuests(newProfile.quests);
        setMode(newProfile.mode);
        setUserTrades(newProfile.trades || []);
        setIsPremium(newProfile.isPremium || false);
        setFocusArea(newProfile.focusArea || []);
        setUsageContext(newProfile.usageContext || '');
        setCefrLevel(newProfile.cefrLevel || 'A1');
        setPreferredLanguage(newProfile.preferredLanguage || 'Turkish');
        setEmail(newProfile.email || '');
      } else {
        // LOGIN FLOW
        if (!existingProfile) {
          throw new Error("User not found. Please sign up.");
        }

        // Validate Password (if one exists on the profile)
        if (existingProfile.password && existingProfile.password !== password) {
          throw new Error("Incorrect password.");
        }

        // Set local state
        setStats(existingProfile.stats);
        setBadges(existingProfile.badges);
        setQuests(existingProfile.quests);
        setMode(existingProfile.mode);
        setUserTrades(existingProfile.trades || []);
        setIsPremium(existingProfile.isPremium || false);
        setFocusArea(existingProfile.focusArea || []);
        setUsageContext(existingProfile.usageContext || '');
        setCefrLevel(existingProfile.cefrLevel || 'A1');
        setPreferredLanguage(existingProfile.preferredLanguage || 'Turkish');
        setEmail(existingProfile.email || '');
      }

      // Success
      localStorage.setItem('current_user_id', id);
      setUserId(id);
      setIsInitialized(true);
      return true;

    } catch (e: any) {
      console.error("Login Error", e);
      setLoadError(e.message || "Authentication failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('current_user_id');
    setUserId(null);
    setIsAdmin(false);
    setIsInitialized(false);
    setLoadError(null);
    
    // Reset to defaults
    const defaults = db.getDefaults();
    setStats(defaults.stats);
    setBadges(defaults.badges);
    setQuests(defaults.quests);
    setMode(defaults.mode);
    setLeaderboard([]);
    setUserTrades([]);
    setIsPremium(false);
    setFocusArea([]);
    setUsageContext('');
    setCefrLevel('A1');
    setPreferredLanguage('Turkish');
    setEmail('');
  };

  // Load User Data from DB when userId changes (e.g. on page refresh)
  useEffect(() => {
    if (userId) {
      // Check Admin Status
      const adminStatus = ADMIN_USERS.includes(userId);
      setIsAdmin(adminStatus);
      setLoadError(null);

      const loadData = async () => {
        setIsLoading(true);
        try {
          const profile = await db.getUser(userId);
          
          if (profile) {
            setStats(profile.stats);
            setBadges(profile.badges);
            setQuests(profile.quests);
            setMode(profile.mode);
            setUserTrades(profile.trades || []);
            setIsPremium(profile.isPremium || false);
            setFocusArea(profile.focusArea || []);
            setUsageContext(profile.usageContext || '');
            setCefrLevel(profile.cefrLevel || 'A1');
            setPreferredLanguage(profile.preferredLanguage || 'Turkish');
            setEmail(profile.email || '');
            setIsInitialized(true);
          } else {
            // Edge case: ID in local storage but not in DB anymore
            logout();
          }
        } catch (e) {
          console.error("Critical Load Error", e);
          setLoadError("Could not connect to database. Please check your internet connection.");
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    } else {
      setIsInitialized(true); // Initialized as "no user"
      setIsAdmin(false);
    }
  }, [userId]);

  // Real-time Subscription for Remote Updates (e.g. Admin Badges, Trades, Premium Status)
  useEffect(() => {
    if (!userId || !isInitialized) return;

    const channel = supabase
      .channel(`user_updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new.data as UserProfile;
          if (!newData) return;

          // Sync Premium Status
          setIsPremium(prev => {
             if (newData.isPremium && !prev) {
                setNotification({ text: `PREMIUM UNLOCKED!`, type: 'reward' });
                setTimeout(() => setNotification(null), 3000);
             }
             return newData.isPremium || false;
          });

          // Merge Badges: Server authority
          setBadges((prev) => {
             const serverBadges = newData.badges || [];
             if (serverBadges.length !== prev.length) {
                 const prevIds = new Set(prev.map(b => b.id));
                 const added = serverBadges.find(b => !prevIds.has(b.id));
                 if (added) {
                     setNotification({ text: `Badge Received: ${added.name}!`, type: 'badge' });
                     setTimeout(() => setNotification(null), 3000);
                 }
                 return serverBadges;
             }
             return prev;
          });

          // Sync Trades
          setUserTrades(newData.trades || []);

          // Merge Stats
          setStats((prev) => {
              const serverStats = newData.stats;
              if (serverStats.points > prev.points + 100) {
                   setNotification({ text: `Bonus XP Received!`, type: 'xp' });
                   setTimeout(() => setNotification(null), 3000);
                   return { 
                       ...prev, 
                       points: serverStats.points, 
                       awardedBadges: serverStats.awardedBadges 
                   };
              }
              if (serverStats.awardedBadges.length > prev.awardedBadges.length) {
                   return { ...prev, awardedBadges: serverStats.awardedBadges };
              }
              return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isInitialized]);


  // Load Leaderboard periodically or on load
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await db.getLeaderboard();
      // Mark current user
      const marked = data.map(entry => ({
        ...entry,
        isCurrentUser: entry.id === userId
      }));
      setLeaderboard(marked);
    };

    const fetchNotifications = async () => {
      const data = await db.getGlobalNotifications();
      setAppNotifications(data);
    };

    fetchLeaderboard();
    fetchNotifications();
    const interval = setInterval(fetchLeaderboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [userId]);

  // Real-time Subscription for Global Notifications
  useEffect(() => {
    const channel = supabase
      .channel('global_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        async () => {
          // Re-fetch all notifications on any change to keep it simple
          const data = await db.getGlobalNotifications();
          setAppNotifications(data);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'id=eq.__global_notifications__',
        },
        async () => {
          const data = await db.getGlobalNotifications();
          setAppNotifications(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Revised Save Logic with Password Persistence and SAFE Trade handling
  useEffect(() => {
      const saveToDb = async () => {
          if (!userId || !isInitialized || isLoading || loadError) return;
          
          // CRITICAL FIX: Fetch latest DB state before saving to prevent overwrites
          const currentDb = await db.getUser(userId);
          const passwordToSave = currentDb?.password;
          const emailToSave = currentDb?.email || email;
          
          // Maintain isPremium from DB unless we are actively upgrading via web mock
          // But now we prefer DB to be source of truth for premium.
          const premiumStatus = currentDb?.isPremium || isPremium;

          // CRITICAL FIX: Always use the DB's trade list. 
          const tradesToSave = currentDb?.trades || [];

          await db.saveUser(userId, {
              stats,
              badges,
              quests,
              mode,
              trades: tradesToSave, // Use DB source of truth for trades
              password: passwordToSave,
              email: emailToSave,
              isPremium: premiumStatus,
              focusArea,
              usageContext,
              cefrLevel,
              preferredLanguage
          });
      };
      
      const timeout = setTimeout(saveToDb, 2000);
      return () => clearTimeout(timeout);
  }, [stats, badges, quests, mode, userId, isInitialized, isLoading, loadError, isPremium, focusArea, usageContext, cefrLevel, preferredLanguage]);

  const updateProfile = async (data: Partial<UserProfile>) => {
      if (data.focusArea) setFocusArea(data.focusArea);
      if (data.usageContext) setUsageContext(data.usageContext);
      if (data.cefrLevel) setCefrLevel(data.cefrLevel);
      if (data.preferredLanguage) setPreferredLanguage(data.preferredLanguage);
      
      // Force immediate save for critical onboarding data
      if (userId) {
         try {
             const currentProfile = await db.getUser(userId);
             if (currentProfile) {
                 await db.saveUser(userId, {
                     ...currentProfile,
                     ...data
                 });
             }
         } catch (e) {
             console.error("Failed to save profile update", e);
         }
      }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; msg: string }> => {
      try {
          const user = await db.getUserByEmail(email);
          if (!user) return { success: false, msg: 'Email not found.' };

          const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
          
          await db.saveUser(user.id, {
              ...user.profile,
              resetCode
          });

          // MOCK EMAIL SENDING
          console.log(`[MOCK EMAIL] To: ${email}, Subject: Password Reset, Body: Your reset code is ${resetCode}`);
          
          return { success: true, msg: `Reset code sent to ${email}. (Check console for code in this demo)` };
      } catch (e) {
          return { success: false, msg: 'Failed to request reset.' };
      }
  };

  const verifyResetCode = async (email: string, code: string, newPassword: string): Promise<{ success: boolean; msg: string }> => {
      try {
          const user = await db.getUserByEmail(email);
          if (!user) return { success: false, msg: 'Email not found.' };

          if (user.profile.resetCode !== code) {
              return { success: false, msg: 'Invalid reset code.' };
          }

          await db.saveUser(user.id, {
              ...user.profile,
              password: newPassword,
              resetCode: undefined // Clear code
          });

          return { success: true, msg: 'Password changed successfully! Please login.' };
      } catch (e) {
          return { success: false, msg: 'Failed to reset password.' };
      }
  };

  const changeUsername = async (newUsername: string): Promise<{ success: boolean; msg: string }> => {
      if (!userId) return { success: false, msg: 'Not logged in.' };
      try {
          const existing = await db.getUser(newUsername);
          if (existing) return { success: false, msg: 'Username already taken.' };

          const currentProfile = await db.getUser(userId);
          if (!currentProfile) return { success: false, msg: 'User not found.' };

          // Create new record
          await db.saveUser(newUsername, currentProfile);
          
          // Delete old record (Supabase doesn't have a direct rename for ID)
          await supabase.from('profiles').delete().eq('id', userId);

          setUserId(newUsername);
          localStorage.setItem('current_user_id', newUsername);
          
          return { success: true, msg: 'Username changed successfully!' };
      } catch (e) {
          return { success: false, msg: 'Failed to change username.' };
      }
  };


  // Check for day reset
  useEffect(() => {
    if (userId && isInitialized) {
        const today = new Date().toISOString().split('T')[0];
        if (stats.lastLoginDate !== today) {
        setStats(prev => ({
            ...prev,
            lastLoginDate: today,
            claimedDailyReward: false,
            streakDays: prev.lastLoginDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? prev.streakDays + 1 : 1
        }));
        }
    }
  }, [userId, isInitialized]);

  // Check for auto-awarding badges
  useEffect(() => {
    if (userId && isInitialized && stats.level >= 1 && !stats.awardedBadges.includes('badge_lvl1')) {
        const lvl1Badge: Badge = {
            id: 'badge_lvl1',
            name: 'Level 1 Beginner',
            description: 'Welcome to your English journey!',
            icon: '🧸',
            image: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png', 
            color: 'bg-blue-600',
            category: 'general',
            earnedAt: new Date().toISOString()
        };
        
        setBadges(prev => {
           if (prev.find(b => b.id === 'badge_lvl1')) return prev;
           return [...prev, lvl1Badge];
        });
        
        setStats(prev => ({
            ...prev,
            awardedBadges: [...prev.awardedBadges, 'badge_lvl1']
        }));

        setNotification({ text: "Unlocked: Beginner Badge!", type: 'badge' });
        setTimeout(() => setNotification(null), 3000);
    }
  }, [stats.level, stats.awardedBadges, userId, isInitialized]);

  const awardPoints = (amount: number, reason: string, skillType?: 'vocabulary' | 'speaking' | 'listening' | 'grammar' | 'realLife') => {
    setStats(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 500) + 1;
      
      let newSkills = { ...prev.skills };
      
      if (skillType && newSkills[skillType]) {
          const skill = newSkills[skillType];
          const newSkillXp = skill.totalXp + amount;
          // Micro-leveling: Every 100 XP is a level
          const newSkillLevel = Math.floor(newSkillXp / 100) + 1;
          const newProgress = (newSkillXp % 100); // 0-99
          
          newSkills[skillType] = {
              ...skill,
              totalXp: newSkillXp,
              level: newSkillLevel,
              progress: newProgress
          };
          
          if (newSkillLevel > skill.level) {
              setNotification({ text: `${skill.name} Level Up! Lvl ${newSkillLevel}`, type: 'level' });
          }
      }

      // Identity System
      let newIdentity = prev.identityTitle;
      if (newLevel >= 10) newIdentity = 'Speaker';
      if (newLevel >= 50) newIdentity = 'Communicator';
      if (newLevel >= 100) newIdentity = 'Fluent Hero';
      if (newLevel >= 500) newIdentity = 'Legend';

      // Prestige Mode Check
      if (newLevel > 1000) {
          // Reset to Level 1, keep prestige (maybe add a prestige counter in future)
          // For now, just cap at 1000 or show a special notification
          setNotification({ text: "PRESTIGE MODE UNLOCKED! You are a Legend!", type: 'level' });
          newIdentity = 'Legend';
      }

      if (newLevel > prev.level) {
        setShowLevelUp(true);
      }

      if (!skillType) {
          setNotification({ text: `+${amount} XP: ${reason}`, type: 'xp' });
          setTimeout(() => setNotification(null), 2500);
      }

      return { ...prev, points: newPoints, level: newLevel, skills: newSkills, identityTitle: newIdentity };
    });
  };

  const updateRapport = (characterId: string, amount: number) => {
    setStats(prev => {
      const currentRapport = prev.rapport?.[characterId] || 0;
      const newRapport = currentRapport + amount;
      return {
        ...prev,
        rapport: { ...(prev.rapport || {}), [characterId]: newRapport }
      };
    });
  };

  const claimDailyReward = () => {
    if (stats.claimedDailyReward) return;
    const reward = 50 * stats.streakDays;
    awardPoints(reward, `${stats.streakDays} Day Streak Bonus!`);
    setStats(prev => ({ ...prev, claimedDailyReward: true }));
  };

  const completeQuest = (id: string) => {
    setQuests(prev => {
      const quest = prev.find(q => q.id === id);
      if (quest && !quest.isCompleted) {
        awardPoints(quest.xpReward, `Completed Quest: ${quest.title}`);
        return prev.map(q => q.id === id ? { ...q, isCompleted: true } : q);
      }
      return prev;
    });
  };

  // NPC Trade
  const tradeBadge = (offerId: string) => {
    const offer = tradeOffers.find(t => t.id === offerId);
    if (!offer) return;

    // Check if user has required badge
    const hasBadge = badges.find(b => b.id === offer.requiredBadgeId);
    if (!hasBadge) {
      setNotification({ text: "Trade Failed: You don't have this badge!", type: 'trade' });
      setTimeout(() => setNotification(null), 2500);
      return;
    }

    // Execute Trade
    setBadges(prev => {
      const filtered = prev.filter(b => b.id !== offer.requiredBadgeId);
      return [...filtered, { ...offer.rewardBadge, earnedAt: new Date().toISOString() }];
    });
    
    setNotification({ text: "Trade Successful!", type: 'trade' });
    setTimeout(() => setNotification(null), 2500);
    awardPoints(100, "Successful Trade");
  };

  const refreshTradeOffers = () => {
    setTradeOffers(generateRandomTradeOffers(10));
    setNotification({ text: "Trade Offers Refreshed!", type: 'trade' });
    setTimeout(() => setNotification(null), 2000);
  };

  const grantBadge = (badge: Badge) => {
      setBadges(prev => {
          if (prev.some(b => b.id === badge.id)) return prev;
          const newBadge = { ...badge, earnedAt: new Date().toISOString() };
          return [...prev, newBadge];
      });
      
      setStats(prev => {
          if (prev.awardedBadges.includes(badge.id)) return prev;
          return {
              ...prev,
              awardedBadges: [...prev.awardedBadges, badge.id]
          };
      });

      // Only show notification if we actually granted it (or just show it anyway, but logic above prevents dupes in state)
      // We can't easily check if we returned prev above inside this scope without refactoring, 
      // but showing notification is fine.
      setNotification({ text: `Badge Unlocked: ${badge.name}!`, type: 'badge' });
      setTimeout(() => setNotification(null), 3000);
  };

  // P2P Trade Logic
  const sendP2PTrade = async (recipientId: string, badgeToOffer: Badge): Promise<{success: boolean, msg: string}> => {
     if (!userId) return { success: false, msg: 'Not logged in' };
     // Validate ID first
     const recipientProfile = await db.getUser(recipientId);
     if (!recipientProfile) return { success: false, msg: 'User does not exist!' };
     if (recipientId === userId) return { success: false, msg: 'Cannot trade with yourself!' };
     
     const res = await db.createTradeRequest(userId, recipientId, badgeToOffer);
     // Note: We don't update local state manually here, we wait for subscription to update userTrades
     return res;
  };

  const respondToP2PTrade = async (tradeId: string, action: 'accept' | 'reject'): Promise<{success: boolean, msg: string}> => {
     if (!userId) return { success: false, msg: 'Not logged in' };
     const trade = userTrades.find(t => t.id === tradeId);
     if (!trade) return { success: false, msg: 'Trade not found' };
     
     const res = await db.finalizeTrade(tradeId, trade.initiatorId, trade.recipientId, action);
     
     if (res.success && action === 'accept') {
         setNotification({ text: "Trade Completed!", type: 'trade' });
     }
     return res;
  };

  // Helper to Grant Premium Badge and Rewards
  const grantPremiumRewards = async (uid: string) => {
      const premiumBadgeId = 'badge_premium';
      const currentUser = await db.getUser(uid);
      if (!currentUser) return;

      if (currentUser.badges.find(b => b.id === premiumBadgeId)) return; // Already granted

      const premiumBadge: Badge = {
          id: premiumBadgeId,
          name: 'Super Hero Pass',
          description: 'Unlocked full access to the English Universe!',
          icon: '👑',
          color: 'bg-amber-500',
          category: 'rare',
          earnedAt: new Date().toISOString()
      };

      const newStats = {
          ...currentUser.stats,
          points: currentUser.stats.points + 1000,
          awardedBadges: [...currentUser.stats.awardedBadges, premiumBadgeId]
      };

      await db.saveUser(uid, {
          ...currentUser,
          isPremium: true,
          badges: [premiumBadge, ...currentUser.badges],
          stats: newStats
      });

      // Update local state if it's the current user
      if (uid === userId) {
          setStats(newStats);
          setBadges(prev => {
              if (prev.some(b => b.id === premiumBadgeId)) return prev;
              return [premiumBadge, ...prev];
          });
          setIsPremium(true);
          IAP.getPremiumDetails().then(setPremiumDetails);
          setNotification({ text: "SUPER PASS UNLOCKED!", type: 'reward' });
      }
  };

  // Premium Subscription Logic using IAP Service
  const unlockPremium = async (pkg?: any) => {
      if (!userId) return;

      let targetPackage = pkg;

      // 1. If no package provided, try to get the first available one
      if (!targetPackage) {
          const packages = await IAP.getPackages();
          if (packages.length === 0) {
              alert("No premium packages available at the moment.");
              return;
          }
          targetPackage = packages[0];
      }
      
      // 2. Attempt Purchase
      const success = await IAP.purchasePackage(targetPackage);

      if (success) {
          await grantPremiumRewards(userId);
      }
  };

  const restorePurchases = async () => {
      if (!userId) return;
      const restored = await IAP.restorePurchases();
      if (restored) {
          await grantPremiumRewards(userId);
          alert("Purchases restored successfully!");
      } else {
          alert("No active subscription found to restore.");
      }
  };

  // Contact / Admin Logic
  const sendAdminMessage = async (message: string, category: ContactRequest['category']): Promise<boolean> => {
      if (!userId) return false;
      const req: ContactRequest = {
          id: `msg_${Date.now()}`,
          userId,
          message,
          category,
          createdAt: new Date().toISOString(),
          status: 'pending'
      };
      
      const success = await db.createContactRequest(req);
      if (success) {
          setNotification({ text: 'Message Sent to Admin!', type: 'badge' });
          setTimeout(() => setNotification(null), 2500);
      }
      return success;
  };

  const replyToRequest = async (requestId: string, reply: string): Promise<boolean> => {
     const success = await db.replyToContactRequest(requestId, reply);
     if (success) {
         setNotification({ text: 'Reply Sent!', type: 'badge' });
         setTimeout(() => setNotification(null), 2500);
     }
     return success;
  };

  const setThemeColor = (color: string) => {
      setStats(prev => ({ ...prev, themeColor: color }));
      setNotification({ text: "Theme Saved!", type: 'badge' });
      setTimeout(() => setNotification(null), 2000);
  };

  const setAvatar = (emoji: string) => {
      setStats(prev => ({ ...prev, avatar: emoji }));
      setNotification({ text: "Avatar Updated!", type: 'badge' });
      setTimeout(() => setNotification(null), 2000);
  };

  const addAppNotification = async (notif: Omit<AppNotification, 'id' | 'createdAt'>): Promise<{success: boolean, msg?: string}> => {
    if (!isAdmin) return { success: false, msg: 'Not admin' };
    const result = await db.addNotification(notif);
    if (result.success) {
      const data = await db.getGlobalNotifications();
      setAppNotifications(data);
    }
    return result;
  };

  const deleteAppNotification = async (id: string): Promise<boolean> => {
    if (!isAdmin) return false;
    const success = await db.deleteNotification(id);
    if (success) {
      const data = await db.getGlobalNotifications();
      setAppNotifications(data);
    }
    return success;
  };

  if (userId && isLoading) {
      return (
          <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
              <div className="text-6xl animate-bounce mb-4">🚀</div>
              <h2 className="text-2xl font-black text-slate-800">Loading your profile...</h2>
          </div>
      );
  }

  if (userId && loadError) {
      return (
          <div className="fixed inset-0 bg-slate-50 z-[999] flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="text-red-500 mb-4" size={64} />
              <h2 className="text-3xl font-black text-slate-800 mb-2">Connection Error</h2>
              <p className="text-slate-500 mb-8 max-w-md">{loadError}</p>
              <button 
                  onClick={() => window.location.reload()} 
                  className="bg-fun-blue text-white px-8 py-3 rounded-2xl font-black shadow-xl"
              >
                  Retry Connection
              </button>
          </div>
      );
  }

  return (
    <GamificationContext.Provider value={{ 
      userId, isAdmin, login, logout, isLoading, loadError,
      stats, badges, quests, tradeOffers, userTrades, awardPoints, completeQuest, updateRapport, claimDailyReward, tradeBadge, grantBadge, sendP2PTrade, respondToP2PTrade, 
      unlockPremium, restorePurchases, isPremium, premiumDetails, setThemeColor, setAvatar,
      notification, appNotifications, addAppNotification, deleteAppNotification, leaderboard, mode, setMode, 
      showLevelUp, closeLevelUp: () => setShowLevelUp(false),
      isContactOpen, setIsContactOpen, sendAdminMessage, replyToRequest,
      focusArea, usageContext, cefrLevel, preferredLanguage, email, updateProfile,
      requestPasswordReset, verifyResetCode, changeUsername, refreshTradeOffers
    }}>
      {children}
      
      {/* Dynamic Notification Popup */}
      {notification && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-slow pointer-events-none">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border-2 border-white/20 backdrop-blur-md">
            {notification.type === 'xp' && <Zap className="text-yellow-400 fill-current" size={24} />}
            {notification.type === 'reward' && <Gift className="text-fun-pink fill-current" size={24} />}
            {notification.type === 'badge' && <Award className="text-fun-green fill-current" size={24} />}
            {notification.type === 'trade' && <ArrowRightLeft className="text-fun-blue fill-current" size={24} />}
            <span className="font-black tracking-tight text-lg">{notification.text}</span>
            <Sparkles className="text-white/20" size={20} />
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl border-b-[12px] border-fun-blue transform animate-wiggle relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-fun-pink/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-fun-blue/10 rounded-full blur-3xl" />
            
            <div className="w-28 h-28 bg-fun-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white ring-4 ring-yellow-100">
              <Star size={56} className="text-white fill-current animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">LEVEL {stats.level}!</h2>
            <p className="text-slate-500 font-bold mb-8">Your English is getting super strong! Keep it up!</p>
            <button 
              onClick={() => setShowLevelUp(false)}
              className="w-full py-5 bg-gradient-to-r from-fun-blue to-cyan-400 text-white rounded-2xl font-black text-2xl shadow-lg border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all"
            >
              YAY!
            </button>
          </div>
        </div>
      )}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) throw new Error('useGamification must be used within a GamificationProvider');
  return context;
};
