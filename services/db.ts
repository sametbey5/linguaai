
import { UserProfile, Quest, Badge, LeaderboardEntry, UserTrade, ContactRequest } from '../types';
import { supabase } from './supabaseClient';

const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'First Conversation', description: 'Send 5 messages in any roleplay chat', xpReward: 100, isCompleted: false, type: 'chat' },
  { id: 'q2', title: 'Vocabulary Hunt', description: 'Generate a new vocabulary set', xpReward: 50, isCompleted: false, type: 'vocab' },
  { id: 'q3', title: 'Grammar Master', description: 'Get a 90+ score in Word Fixer', xpReward: 75, isCompleted: false, type: 'grammar' },
];

export const db = {
  /**
   * Fetch user data from Supabase
   */
  async getUser(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('data')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error("Supabase read error", error);
        throw error;
      }
      
      const parsed = data.data;

      // Data Migration / Integrity Checks
      if (!parsed.stats.awardedBadges) {
          parsed.stats.awardedBadges = parsed.badges.map((b: Badge) => b.id);
      }
      if (!parsed.stats.themeColor) {
          parsed.stats.themeColor = 'bg-blue-500';
      }
      if (!parsed.stats.avatar) {
          parsed.stats.avatar = parsed.mode === 'kids' ? '😎' : '👨‍💼';
      }
      if (!parsed.stats.skills) {
          parsed.stats.skills = {
            vocabulary: { id: 'vocab', name: 'Vocabulary', level: 1, progress: 0, totalXp: 0, icon: '📚', color: 'bg-yellow-500' },
            speaking: { id: 'speaking', name: 'Speaking', level: 1, progress: 0, totalXp: 0, icon: '🎤', color: 'bg-red-500' },
            listening: { id: 'listening', name: 'Listening', level: 1, progress: 0, totalXp: 0, icon: '🎧', color: 'bg-blue-500' },
            grammar: { id: 'grammar', name: 'Grammar', level: 1, progress: 0, totalXp: 0, icon: '🧩', color: 'bg-purple-500' },
            realLife: { id: 'realLife', name: 'Real Life', level: 1, progress: 0, totalXp: 0, icon: '🌍', color: 'bg-green-500' },
          };
      }
      if (!parsed.stats.identityTitle) {
          parsed.stats.identityTitle = 'Explorer';
      }
      if (!parsed.trades) {
          parsed.trades = [];
      }
      if (parsed.isPremium === undefined) {
          parsed.isPremium = false;
      }
      if (!parsed.email) {
          parsed.email = '';
      }
      
      return parsed;
    } catch (e) {
      console.error("Database read exception", e);
      throw e;
    }
  },

  /**
   * Find user by email
   */
  async getUserByEmail(email: string): Promise<{ id: string; profile: UserProfile } | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, data')
        .eq('data->>email', email);

      if (error) {
        console.error("Supabase email search error", error);
        return null;
      }

      if (data && data.length > 0) {
        return { id: data[0].id, profile: data[0].data };
      }
      return null;
    } catch (e) {
      console.error("Database email search exception", e);
      return null;
    }
  },

  /**
   * Save user data to Supabase (Upsert)
   */
  async saveUser(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, data: profile });
      
      if (error) {
          console.error("Supabase write error", error);
          return false;
      }
      return true;
    } catch (e) {
      console.error("Database write exception", e);
      return false;
    }
  },

  /**
   * Send a P2P Trade Request
   * Updates BOTH users' profiles to include the pending trade object.
   */
  async createTradeRequest(initiatorId: string, recipientId: string, badge: Badge): Promise<{ success: boolean; msg: string }> {
      try {
          const initiator = await this.getUser(initiatorId);
          const recipient = await this.getUser(recipientId);

          if (!initiator || !recipient) return { success: false, msg: 'User not found.' };

          // Verify initiator owns badge
          if (!initiator.badges.find(b => b.id === badge.id)) {
              return { success: false, msg: 'You do not own this badge anymore.' };
          }

          const trade: UserTrade = {
              id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              initiatorId,
              recipientId,
              offeredBadge: badge,
              status: 'pending',
              createdAt: new Date().toISOString()
          };

          // Update both profiles
          initiator.trades = [trade, ...(initiator.trades || [])];
          recipient.trades = [trade, ...(recipient.trades || [])];

          const saveInit = await this.saveUser(initiatorId, initiator);
          const saveRecip = await this.saveUser(recipientId, recipient);

          if (saveInit && saveRecip) return { success: true, msg: 'Trade request sent!' };
          return { success: false, msg: 'Connection failed.' };
      } catch (e) {
          console.error(e);
          return { success: false, msg: 'Unexpected error.' };
      }
  },

  /**
   * Process a Trade Response (Accept/Reject)
   * Handles the actual badge swapping if accepted.
   */
  async processTradeResponse(tradeId: string, action: 'accept' | 'reject'): Promise<{ success: boolean; msg: string; trade?: UserTrade }> {
      try {
          return { success: false, msg: "Internal Logic Error: IDs required." }; 
      } catch (e) {
          return { success: false, msg: "Error." };
      }
  },

  /**
   * Revised Process Trade that accepts IDs to ensure transactional-like safety
   */
  async finalizeTrade(tradeId: string, initiatorId: string, recipientId: string, action: 'accept' | 'reject'): Promise<{ success: boolean; msg: string }> {
      try {
          const initiator = await this.getUser(initiatorId);
          const recipient = await this.getUser(recipientId);

          if (!initiator || !recipient) return { success: false, msg: 'Users not found.' };

          // Find trade in both (should exist in both)
          const initTradeIdx = (initiator.trades || []).findIndex(t => t.id === tradeId);
          const recipTradeIdx = (recipient.trades || []).findIndex(t => t.id === tradeId);

          if (initTradeIdx === -1 || recipTradeIdx === -1) {
              return { success: false, msg: 'Trade expired or invalid. Please cancel and retry.' };
          }

          const trade = initiator.trades![initTradeIdx];

          if (trade.status !== 'pending') return { success: false, msg: 'Trade already processed.' };

          if (action === 'reject') {
              trade.status = 'rejected';
              initiator.trades![initTradeIdx] = { ...trade, status: 'rejected' };
              recipient.trades![recipTradeIdx] = { ...trade, status: 'rejected' };
          } else {
              // ACCEPT LOGIC
              // 1. Verify Initiator still has badge
              const badgeIndex = initiator.badges.findIndex(b => b.id === trade.offeredBadge.id);
              if (badgeIndex === -1) {
                  // Cancel trade
                  initiator.trades![initTradeIdx] = { ...trade, status: 'rejected' };
                  recipient.trades![recipTradeIdx] = { ...trade, status: 'rejected' };
                  await this.saveUser(initiatorId, initiator);
                  await this.saveUser(recipientId, recipient);
                  return { success: false, msg: 'Owner no longer has the item!' };
              }

              // 2. Swap
              const badgeToTransfer = initiator.badges[badgeIndex];
              initiator.badges.splice(badgeIndex, 1); // Remove from initiator
              
              // Add to recipient with new earned date
              recipient.badges.push({ ...badgeToTransfer, earnedAt: new Date().toISOString() });

              // 3. Update Status
              initiator.trades![initTradeIdx] = { ...trade, status: 'completed' };
              recipient.trades![recipTradeIdx] = { ...trade, status: 'completed' };
              
              // 4. Update Stats (awardedBadges array)
              initiator.stats.awardedBadges = initiator.stats.awardedBadges.filter(id => id !== badgeToTransfer.id);
              recipient.stats.awardedBadges.push(badgeToTransfer.id);
          }

          // Save Both
          await this.saveUser(initiatorId, initiator);
          await this.saveUser(recipientId, recipient);

          return { success: true, msg: action === 'accept' ? 'Trade successful!' : 'Trade rejected.' };

      } catch (e) {
          console.error(e);
          return { success: false, msg: 'Trade failed.' };
      }
  },

  /**
   * Grant a specific badge to a user (Admin Function)
   */
  async grantBadgeToUser(targetUserId: string, newBadge: Badge): Promise<{ success: boolean; message: string }> {
    try {
      let profile;
      try {
        profile = await this.getUser(targetUserId);
      } catch (e) {
        return { success: false, message: `Database error or User '${targetUserId}' not found.` };
      }

      if (!profile) {
        return { success: false, message: `User '${targetUserId}' not found in database.` };
      }

      // 2. Prepare updated profile
      const updatedProfile: UserProfile = {
        ...profile,
        badges: [newBadge, ...profile.badges],
        stats: {
          ...profile.stats,
          points: profile.stats.points + 500, // Bonus XP
          awardedBadges: [...(profile.stats.awardedBadges || []), newBadge.id]
        }
      };

      // 3. Save to Supabase
      const saved = await this.saveUser(targetUserId, updatedProfile);
      
      if (!saved) {
        return { success: false, message: 'Failed to write to database. Check network/permissions.' };
      }

      return { success: true, message: `Badge '${newBadge.name}' granted to ${targetUserId}!` };

    } catch (e) {
      console.error("Grant Badge Error", e);
      return { success: false, message: 'Unexpected database error occurred.' };
    }
  },

  /**
   * Fetch Global Leaderboard from Supabase
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, data')
        .limit(50);

      if (error) {
          console.error("Leaderboard fetch error", error);
          return [];
      }

      const entries: LeaderboardEntry[] = data.map((row: any) => {
        const stats = row.data.stats;
        const mode = row.data.mode;
        // Fallback for avatar if missing in old data
        const defaultAvatar = mode === 'kids' ? '😎' : '👨‍💼';

        return {
           id: row.id,
           name: row.id, // Using ID as name for now
           points: stats?.points || 0,
           avatar: stats?.avatar || defaultAvatar,
           color: stats?.themeColor || 'bg-blue-500',
           isCurrentUser: false // Will be set by context
        };
      });

      return entries.sort((a, b) => b.points - a.points);
    } catch (e) {
      console.error("Leaderboard exception", e);
      return [];
    }
  },

  /**
   * Get default profile for new users
   */
  getDefaults(): UserProfile {
    return {
      stats: {
        points: 0, 
        level: 1, 
        streakDays: 1, 
        lastLoginDate: new Date().toISOString().split('T')[0],
        claimedDailyReward: false,
        awardedBadges: [],
        themeColor: 'bg-blue-500',
        avatar: '😎',
        identityTitle: 'Explorer',
        skills: {
          vocabulary: { id: 'vocab', name: 'Vocabulary', level: 1, progress: 0, totalXp: 0, icon: '📚', color: 'bg-yellow-500' },
          speaking: { id: 'speaking', name: 'Speaking', level: 1, progress: 0, totalXp: 0, icon: '🎤', color: 'bg-red-500' },
          listening: { id: 'listening', name: 'Listening', level: 1, progress: 0, totalXp: 0, icon: '🎧', color: 'bg-blue-500' },
          grammar: { id: 'grammar', name: 'Grammar', level: 1, progress: 0, totalXp: 0, icon: '🧩', color: 'bg-purple-500' },
          realLife: { id: 'realLife', name: 'Real Life', level: 1, progress: 0, totalXp: 0, icon: '🌍', color: 'bg-green-500' },
        },
        // Legacy
        messagesSent: 0,
        vocabGenerated: 0,
        grammarChecks: 0,
        rapport: {}
      },
      badges: [],
      quests: INITIAL_QUESTS,
      mode: 'kids',
      trades: [],
      isPremium: false,
      focusArea: [],
      usageContext: '',
      preferredLanguage: 'Turkish'
    };
  },

  /**
   * Create a Contact Request (Persisted in LocalStorage for demo purposes)
   */
  async createContactRequest(req: ContactRequest): Promise<boolean> {
      try {
          const stored = localStorage.getItem('admin_requests');
          const requests: ContactRequest[] = stored ? JSON.parse(stored) : [];
          requests.unshift(req);
          localStorage.setItem('admin_requests', JSON.stringify(requests));
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  },

  /**
   * Get All Contact Requests (For Admin)
   */
  async getContactRequests(): Promise<ContactRequest[]> {
      try {
          const stored = localStorage.getItem('admin_requests');
          return stored ? JSON.parse(stored) : [];
      } catch (e) {
          return [];
      }
  },

  /**
   * Reply to a Contact Request (Admin)
   */
  async replyToContactRequest(requestId: string, reply: string): Promise<boolean> {
      try {
          const stored = localStorage.getItem('admin_requests');
          const requests: ContactRequest[] = stored ? JSON.parse(stored) : [];
          
          const idx = requests.findIndex(r => r.id === requestId);
          if (idx === -1) return false;
          
          requests[idx].adminReply = reply;
          requests[idx].repliedAt = new Date().toISOString();
          requests[idx].status = 'replied';
          
          localStorage.setItem('admin_requests', JSON.stringify(requests));
          return true;
      } catch (e) {
          return false;
      }
  },

  /**
   * Get Requests for a specific user
   */
  async getUserRequests(userId: string): Promise<ContactRequest[]> {
      try {
          const stored = localStorage.getItem('admin_requests');
          const requests: ContactRequest[] = stored ? JSON.parse(stored) : [];
          return requests.filter(r => r.userId === userId);
      } catch (e) {
          return [];
      }
  },

  /**
   * Global Notifications System
   * 
   * IMPORTANT: This requires a "notifications" table in Supabase.
   * Run this SQL in your Supabase SQL Editor:
   * 
   * CREATE TABLE notifications (
   *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   *   created_at TIMESTAMPTZ DEFAULT now(),
   *   title TEXT NOT NULL,
   *   message TEXT NOT NULL,
   *   type TEXT NOT NULL DEFAULT 'info',
   *   is_global BOOLEAN DEFAULT true
   * );
   * 
   * -- Enable Realtime for this table
   * ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
   * 
   * -- FIX RLS POLICIES (Run these if you get "violates row-level security policy")
   * ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   * 
   * CREATE POLICY "Allow public read" ON notifications FOR SELECT USING (true);
   * CREATE POLICY "Allow public insert" ON notifications FOR INSERT WITH CHECK (true);
   * CREATE POLICY "Allow public delete" ON notifications FOR DELETE USING (true);
   */
  async getGlobalNotifications(): Promise<any[]> {
    try {
      // Primary attempt: notifications table
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or RLS prevents access, fall back to profiles
        if (error.code === '42P01' || error.code === '42501') {
          if (error.code === '42501') {
            console.warn("Supabase: RLS policy prevents access to 'notifications'. Falling back to profiles. Please run the SQL policies provided in db.ts.");
          } else {
            console.warn("Supabase: 'notifications' table not found. Falling back to profiles.");
          }
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('data')
            .eq('id', '__global_notifications__')
            .single();
          
          if (profileError) {
            if (profileError.code === 'PGRST116') return [];
            throw profileError;
          }
          return profileData?.data?.notifications || [];
        }
        throw error;
      }

      return data?.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isGlobal: n.is_global ?? true,
        createdAt: n.created_at || new Date().toISOString()
      })) || [];
    } catch (e) {
      console.error("Failed to fetch notifications", e);
      return [];
    }
  },

  async addNotification(notification: any): Promise<{success: boolean, msg?: string}> {
    try {
      const now = new Date().toISOString();
      
      // Primary attempt: notifications table
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          is_global: notification.isGlobal ?? true,
          created_at: now
        });
      
      if (error) {
        // If table doesn't exist or RLS prevents access, fall back to profiles
        if (error.code === '42P01' || error.code === '42501') {
          if (error.code === '42501') {
            console.warn("Supabase: RLS policy prevents insert to 'notifications'. Falling back to profiles.");
          } else {
            console.warn("Supabase: 'notifications' table not found. Falling back to profiles.");
          }
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('data')
            .eq('id', '__global_notifications__')
            .single();
          
          const existing = profileData?.data?.notifications || [];
          const newNotif = {
            ...notification,
            id: `notif_${Date.now()}`,
            createdAt: now
          };
          
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({ 
              id: '__global_notifications__', 
              data: { notifications: [newNotif, ...existing] } 
            });
          
          if (upsertError) throw upsertError;
          return { success: true };
        }
        
        // Handle other common schema mismatches gracefully
        if (error.code === '42703' || error.code === '23502') {
          console.warn("Supabase: Schema mismatch in 'notifications' table. Retrying with minimal payload.", error.message);
          const { error: retryError } = await supabase
            .from('notifications')
            .insert({
              title: notification.title,
              message: notification.message,
              type: notification.type
            });
          if (retryError) throw retryError;
          return { success: true };
        }
        
        throw error;
      }

      return { success: true };
    } catch (e: any) {
      console.error("Failed to add notification", e);
      return { success: false, msg: e.message || 'Unknown error' };
    }
  },

  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) {
        if (error.code === '42P01' || error.code === '42501') { // fallback for delete
          if (error.code === '42501') {
            console.warn("Supabase: RLS policy prevents delete from 'notifications'. Falling back to profiles.");
          }
          const { data: profileData } = await supabase
            .from('profiles')
            .select('data')
            .eq('id', '__global_notifications__')
            .single();
          
          const existing = profileData?.data?.notifications || [];
          const updated = existing.filter((n: any) => n.id !== id);
          
          await supabase
            .from('profiles')
            .upsert({ 
              id: '__global_notifications__', 
              data: { notifications: updated } 
            });
          return true;
        }
        throw error;
      }
      return true;
    } catch (e) {
      console.error("Failed to delete notification", e);
      return false;
    }
  }
};
