
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

export interface UserStats {
  points: number;
  level: number;
  messagesSent: number;
  vocabGenerated: number;
  grammarChecks: number;
  streakDays: number;
  lastLoginDate: string;
  rapport: Record<string, number>; // characterId -> points
  claimedDailyReward: boolean;
  awardedBadges: string[];
  themeColor?: string; // New field for profile color
  avatar?: string; // New field for profile emoji
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
  trades?: UserTrade[]; // Added for P2P trading history
  isPremium?: boolean; // New field for FlutterFlow/RevenueCat integration
}

// Added Authentication Types
export interface GamificationContextType {
  userId: string | null;
  isAdmin: boolean;
  login: (id: string, password?: string, isSignUp?: boolean) => Promise<boolean>;
  logout: () => void;
  stats: UserStats;
  badges: Badge[];
  quests: Quest[];
  tradeOffers: TradeOffer[];
  userTrades: UserTrade[]; // Added P2P trades list
  awardPoints: (amount: number, reason: string) => void;
  updateRapport: (characterId: string, amount: number) => void;
  claimDailyReward: () => void;
  completeQuest: (id: string) => void;
  tradeBadge: (offerId: string) => void;
  
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
  leaderboard: LeaderboardEntry[];
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  setThemeColor: (color: string) => void;
  setAvatar: (emoji: string) => void;
  showLevelUp: boolean;
  closeLevelUp: () => void;
  isLoading: boolean;
  loadError: string | null;
}
