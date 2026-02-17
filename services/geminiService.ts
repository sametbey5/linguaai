
import { VocabWord, GrammarAnalysis, AppMode, QuizQuestion } from "../types";

/**
 * Local Data Library for Word Rush
 */
const VOCAB_DATABASE: Record<string, VocabWord[]> = {
  "Animals": [
    { word: "Magnificent", definition: "Very beautiful and impressive", exampleSentence: "The lion looked magnificent in the sun.", pronunciation: "mag-NIF-uh-suhnt" },
    { word: "Nocturnal", definition: "Active at night", exampleSentence: "Owls are nocturnal hunters.", pronunciation: "nok-TUR-nuhl" },
    { word: "Camouflage", definition: "Hiding by blending in", exampleSentence: "The lizard used camouflage to hide.", pronunciation: "KAM-uh-flahzh" },
    { word: "Predator", definition: "An animal that hunts others", exampleSentence: "The shark is a top predator.", pronunciation: "PRED-uh-ter" },
    { word: "Habitat", definition: "A natural home", exampleSentence: "The forest is the bear's habitat.", pronunciation: "HAB-ih-tat" }
  ],
  "Space": [
    { word: "Celestial", definition: "Related to the sky or outer space", exampleSentence: "The moon is a celestial body.", pronunciation: "suh-LES-chuhl" },
    { word: "Orbit", definition: "Path around a star or planet", exampleSentence: "The Earth is in orbit around the Sun.", pronunciation: "OR-bit" },
    { word: "Cosmos", definition: "The universe seen as a well-ordered whole", exampleSentence: "The cosmos is full of mysteries.", pronunciation: "KOZ-mohs" },
    { word: "Gravity", definition: "The force that pulls objects toward Earth", exampleSentence: "Gravity keeps us on the ground.", pronunciation: "GRAV-ih-tee" },
    { word: "Nebula", definition: "A giant cloud of dust and gas in space", exampleSentence: "Stars are born inside a nebula.", pronunciation: "NEB-yuh-luh" }
  ],
  "Technology": [
    { word: "Algorithm", definition: "A set of rules for solving a problem", exampleSentence: "The app uses a complex algorithm.", pronunciation: "AL-guh-ridh-uhm" },
    { word: "Bandwidth", definition: "Data transfer capacity", exampleSentence: "Streaming 4K video requires high bandwidth.", pronunciation: "BAND-width" },
    { word: "Encryption", definition: "Coding information for security", exampleSentence: "The message was sent with strong encryption.", pronunciation: "en-KRIP-shuhn" },
    { word: "Interface", definition: "The point where a user meets a computer", exampleSentence: "The user interface is easy to use.", pronunciation: "IN-ter-feys" },
    { word: "Protocol", definition: "A set of rules for data communication", exampleSentence: "The website uses the HTTPS protocol.", pronunciation: "PROH-tuh-kol" }
  ]
};

/**
 * MOCK: Generates vocabulary words locally.
 */
export const generateVocab = async (topic: string, mode: AppMode = 'kids'): Promise<VocabWord[]> => {
  // Simulate network delay for "feel"
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const results = VOCAB_DATABASE[topic] || VOCAB_DATABASE["Animals"];
  return results.sort(() => Math.random() - 0.5);
};

/**
 * MOCK: Generates a quiz based on a topic.
 */
export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const words = VOCAB_DATABASE[topic] || VOCAB_DATABASE["Animals"];
  const questions: QuizQuestion[] = [];

  // Generate 5 questions mixing types
  const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, 5);

  shuffledWords.forEach((wordObj, index) => {
    const isMultipleChoice = Math.random() > 0.5;

    if (isMultipleChoice) {
      // Type 1: Definition matching
      const others = words.filter(w => w.word !== wordObj.word).map(w => w.definition);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [wordObj.definition, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q-${index}`,
        type: 'multiple-choice',
        question: `What is the definition of "${wordObj.word}"?`,
        correctAnswer: wordObj.definition,
        options: options,
        explanation: wordObj.exampleSentence
      });
    } else {
      // Type 2: Fill in the blank
      // Replace the word (case insensitive) with blanks
      const regex = new RegExp(wordObj.word, 'gi');
      const blankedSentence = wordObj.exampleSentence.replace(regex, '_______');
      
      const others = words.filter(w => w.word !== wordObj.word).map(w => w.word);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [wordObj.word, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q-${index}`,
        type: 'fill-blank',
        question: `Complete the sentence: "${blankedSentence}"`,
        correctAnswer: wordObj.word,
        options: options,
        explanation: `Correct! ${wordObj.definition}`
      });
    }
  });

  return questions;
};

/**
 * MOCK: Local Grammar Analysis Engine.
 * Uses heuristics to simulate AI feedback.
 */
export const checkGrammar = async (text: string, mode: AppMode = 'kids'): Promise<GrammarAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).length;
  let score = 70;
  let correction = text;
  let feedback = "Good effort! Try to add more descriptive adjectives.";

  if (words < 3) {
    score = 40;
    feedback = "This is a bit short. Try to write a full sentence!";
  } else if (!text.match(/[.!?]$/)) {
    score = 85;
    correction = text + ".";
    feedback = "Don't forget your punctuation at the end of the sentence!";
  } else if (words > 8) {
    score = 95;
    feedback = "Excellent complexity and flow! You are a Scramble Master!";
  }

  return {
    original: text,
    corrected: correction,
    explanation: feedback,
    score: score
  };
};

/**
 * MOCK: Local Quest Game Master.
 * Simulates a conversation for RPG quests.
 */
export const createGeminiChat = (systemInstruction: string) => {
  let turnCount = 0;
  
  const gmResponses = [
    "You find yourself at a crossroads. To the left is a dark cave, to the right a bustling market. What do you do?",
    "Interesting choice! You encounter a strange character who asks you for a password. Do you know it?",
    "Success! You've gained some valuable information. Your next objective is just ahead.",
    "A challenge appears! You must explain your intentions clearly to proceed.",
    "The journey continues. The air is thick with mystery. What's your next move?"
  ];

  return {
    sendMessage: async ({ message }: { message: string }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const responseText = turnCount === 0 
        ? "Greetings, Adventurer! Your quest begins now. I am your guide. Tell me, are you ready to face the challenges ahead?"
        : gmResponses[Math.min(turnCount - 1, gmResponses.length - 1)];
      
      turnCount++;
      return { text: responseText };
    }
  };
};

/**
 * Browser-native Text-to-Speech
 */
export const generateSpeech = async (text: string, character?: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    if (character) {
        const lowerChar = character.toLowerCase();
        if (lowerChar.includes('spongebob')) { utterance.pitch = 1.6; utterance.rate = 1.2; }
        else if (lowerChar.includes('batman')) { utterance.pitch = 0.5; utterance.rate = 0.8; }
        else if (lowerChar.includes('mickey')) { utterance.pitch = 1.5; utterance.rate = 1.1; }
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};
