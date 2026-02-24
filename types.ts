
export type AppMode = 'kids' | 'adults';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  character: string;
  avatar: string;
  themeColor: string;
  textColor?: string;
  systemInstruction: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Business' | 'Casual';
}

export interface VocabWord {
  word: string;
  definition: string;
  exampleSentence: string;
  pronunciation?: string;
}

export interface GrammarAnalysis {
  original: string;
  corrected: string;
  explanation: string;
  score: number;
  examples?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  color: string;
  category: 'chat' | 'vocab' | 'grammar' | 'general' | 'rare';
  earnedAt?: string;
}

export interface TradeOffer {
  id: string;
  requiredBadgeId: string; // The ID of the badge the user must give up
  rewardBadge: Badge; // The badge the user receives
  merchantName: string;
  expiresIn?: string; // Optional text like "24h left"
}

export interface UserTrade {
  id: string;
  initiatorId: string;
  recipientId: string;
  offeredBadge: Badge;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  userId: string;
  message: string;
  category: 'help' | 'suggestion' | 'bug';
  createdAt: string;
  status: 'pending' | 'read' | 'replied';
  adminReply?: string;
  repliedAt?: string;
}

export interface SkillTree {
  id: string;
  name: string;
  level: number;
  progress: number; // 0-100 for current level
  totalXp: number;
  icon: string;
  color: string;
}

export interface UserStats {
  points: number; // Global XP (Prestige)
  level: number; // Global Level (Prestige)
  streakDays: number;
  lastLoginDate: string;
  claimedDailyReward: boolean;
  awardedBadges: string[];
  themeColor?: string;
  avatar?: string;
  
  // New Skill Trees
  skills: {
    vocabulary: SkillTree;
    speaking: SkillTree;
    listening: SkillTree;
    grammar: SkillTree;
    realLife: SkillTree;
  };
  
  // Identity
  identityTitle: 'Explorer' | 'Speaker' | 'Communicator' | 'Fluent Hero' | 'Legend';
  
  // Legacy support
  messagesSent?: number;
  vocabGenerated?: number;
  grammarChecks?: number;
  rapport?: Record<string, number>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  type: 'chat' | 'vocab' | 'grammar';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  avatar: string;
  color?: string; // New field for leaderboard display
  isCurrentUser?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}

export interface UserProfile {
  stats: UserStats;
  badges: Badge[];
  quests: Quest[];
  mode: AppMode;
  password?: string;
  email?: string;
  resetCode?: string;
  trades?: UserTrade[]; // Added for P2P trading history
  isPremium?: boolean; // New field for FlutterFlow/RevenueCat integration
  focusArea?: string[]; // e.g., ['Vocabulary', 'Speaking']
  usageContext?: string; // e.g., 'Business', 'Travel'
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  preferredLanguage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'update' | 'event' | 'reward';
  createdAt: string;
  isGlobal: boolean;
}

// Added Authentication Types
export interface GamificationContextType {
  userId: string | null;
  isAdmin: boolean;
  login: (id: string, password?: string, isSignUp?: boolean, email?: string) => Promise<boolean>;
  logout: () => void;
  stats: UserStats;
  badges: Badge[];
  quests: Quest[];
  tradeOffers: TradeOffer[];
  userTrades: UserTrade[]; // Added P2P trades list
  awardPoints: (amount: number, reason: string, skillType?: 'vocabulary' | 'speaking' | 'listening' | 'grammar' | 'realLife') => void;
  updateRapport: (characterId: string, amount: number) => void;
  claimDailyReward: () => void;
  completeQuest: (id: string) => void;
  tradeBadge: (offerId: string) => void;
  refreshTradeOffers: () => void;
  grantBadge: (badge: Badge) => void;
  
  // New P2P Trade Functions
  sendP2PTrade: (recipientId: string, badgeToOffer: Badge) => Promise<{success: boolean, msg: string}>;
  respondToP2PTrade: (tradeId: string, action: 'accept' | 'reject') => Promise<{success: boolean, msg: string}>;
  
  // Premium Function
  isPremium: boolean;
  unlockPremium: () => Promise<void>;
  restorePurchases: () => Promise<void>; // New: Required for App Store compliance

  // Contact / Admin Functions
  isContactOpen: boolean;
  setIsContactOpen: (isOpen: boolean) => void;
  sendAdminMessage: (message: string, category: ContactRequest['category']) => Promise<boolean>;
  replyToRequest: (requestId: string, reply: string) => Promise<boolean>;
  
  notification: { text: string; type: 'xp' | 'level' | 'badge' | 'reward' | 'trade' } | null;
  appNotifications: AppNotification[];
  addAppNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => Promise<{success: boolean, msg?: string}>;
  deleteAppNotification: (id: string) => Promise<boolean>;
  leaderboard: LeaderboardEntry[];
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  setThemeColor: (color: string) => void;
  setAvatar: (emoji: string) => void;
  focusArea: string[];
  usageContext: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  preferredLanguage: string;
  email: string;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; msg: string }>;
  verifyResetCode: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; msg: string }>;
  changeUsername: (newUsername: string) => Promise<{ success: boolean; msg: string }>;
  showLevelUp: boolean;
  closeLevelUp: () => void;
  isLoading: boolean;
  loadError: string | null;
}
