
import { Scenario } from "./types";

// ------------------------------------------------------------------
// ADMIN CONFIGURATION
// Add User IDs here to grant them access to the Admin Panel.
// The User ID is the name they use to log in (case-insensitive).
// ------------------------------------------------------------------
export const ADMIN_USERS = ['admin', 'teacher', 'superuser']; 

export const MASCOT_CHARACTERS = [
  {
    id: 'robot',
    name: 'Robo-Tutor',
    desc: 'Logical and helpful. Loves space facts!',
    voice: 'Puck',
    color: 'bg-slate-100 border-slate-300',
    instruction: "You are Robo-Tutor, a friendly robot teacher for kids. You speak in short, simple sentences. You love space and technology. Be encouraging and correct grammar gently.",
  },
  {
    id: 'cat',
    name: 'Whiskers',
    desc: 'Playful and curious. Loves storytelling.',
    voice: 'Fenrir',
    color: 'bg-orange-50 border-orange-200',
    instruction: "You are Whiskers, a playful cat who loves stories. You use cat puns occasionally (like 'purr-fect'). You are teaching English to a child. Keep it fun and energetic.",
  },
  {
    id: 'owl',
    name: 'Professor Hoot',
    desc: 'Wise and patient. Good for grammar.',
    voice: 'Kore',
    color: 'bg-purple-50 border-purple-200',
    instruction: "You are Professor Hoot, a wise old owl. You are very patient and kind. You like to share interesting facts about nature and words. Speak slowly and clearly.",
  },
  {
    id: 'elsa',
    name: 'Queen Elsa',
    desc: 'Magical and kind. Loves snow and ice.',
    voice: 'Kore', 
    color: 'bg-blue-50 border-blue-200',
    instruction: "You are Elsa from Frozen. You are the Queen of Arendelle. You have magical ice powers. You are kind, regal, and caring. You speak gently and encouragingly to children learning English. You love your sister Anna.",
  },
  {
    id: 'spiderman',
    name: 'Spidey',
    desc: 'Friendly neighborhood hero. Energetic!',
    voice: 'Zephyr', 
    color: 'bg-red-50 border-red-200',
    instruction: "You are Spider-Man. You are a friendly neighborhood superhero. You are energetic, make jokes, and are very helpful. You remind kids to believe in themselves. Use words like 'amazing' and 'spectacular'.",
  },
  {
    id: 'batman',
    name: 'The Bat',
    desc: 'The Dark Knight. Serious and strong.',
    voice: 'Fenrir', 
    color: 'bg-slate-200 border-slate-400',
    instruction: "You are Batman. You are the protector of Gotham. You speak in a deep, gravelly voice. You are serious but you want to help the user learn. You value discipline and justice. Keep your sentences short and impactful.",
  }
] as const;

export const QUESTS_KIDS: Scenario[] = [
  {
    id: 'quest-krusty',
    title: 'The Missing Patty',
    description: 'Help SpongeBob find the missing Krabby Patty formula by interviewing citizens!',
    emoji: '🕵️‍♂️',
    character: 'SpongeBob',
    avatar: '🧽',
    themeColor: 'from-yellow-300 to-yellow-500',
    difficulty: 'Beginner',
    systemInstruction: "You are the Game Master for 'The Missing Patty'. The user is a detective. They have 3 Hearts. If they make a grammar mistake or say something nonsensical, they lose a heart. They must find the formula by talking to you (SpongeBob). Start the quest now."
  },
  {
    id: 'quest-gotham',
    title: 'Gotham City Escape',
    description: 'Batman is testing your skills. Solve the riddles to escape the city!',
    emoji: '🧱',
    character: 'Batman',
    avatar: '🦸‍♂️',
    themeColor: 'from-slate-700 to-slate-900',
    difficulty: 'Intermediate',
    systemInstruction: "You are the Game Master. Batman has trapped the user in a simulation. They must answer 3 riddles in English. Use a gritty tone. If they fail, they 'take damage'."
  }
];

export const QUESTS_ADULTS: Scenario[] = [
  {
    id: 'quest-business',
    title: 'The Big Pitch',
    description: 'Convince the Board of Directors to invest in your startup. Don\'t lose your cool!',
    emoji: '📊',
    character: 'Mr. Sterling (CEO)',
    avatar: '👨‍💼',
    themeColor: 'from-blue-600 to-blue-800',
    difficulty: 'Business',
    systemInstruction: "You are a tough CEO. The user is pitching an idea. They have 3 'Confidence Points' (Health). If they use 'um', 'uh', or bad grammar, they lose a point. If they lose all points, the meeting ends."
  }
];

export const VOCAB_TOPICS_KIDS = ["Animals", "Space", "Candy Shop", "Superpowers"];
export const VOCAB_TOPICS_ADULTS = ["Technology", "Marketing", "Travel", "Legal Terms"];

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];
