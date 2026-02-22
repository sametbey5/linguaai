
// Mock Service - No external API calls

export const generateResponse = async (prompt: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "This is a simulated response. The AI features are currently in standalone mode.";
};

export const chat = async (history: { role: string; parts: string }[], message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `I heard you say: "${message}". I am a mock AI running locally.`;
};

export const createGeminiChat = (systemInstruction: string) => {
    return {
        sendMessage: async (message: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simple keyword-based responses for demo purposes
            if (message.toLowerCase().includes('hello')) return "Hello there! Ready to practice English?";
            if (message.toLowerCase().includes('help')) return "I can help you practice conversation, vocabulary, and grammar.";
            
            return `That's interesting! Tell me more about "${message}". (Offline Mode)`;
        }
    };
};

export const generateVocab = async (topic: string, level: string, context?: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return static mock data based on topic and context
    const baseWords = [
        {
            word: "Example",
            definition: "A representative form or pattern.",
            exampleSentence: "This is an example sentence.",
            pronunciation: "/ɪɡˈzæmpəl/"
        },
        {
            word: "Mock",
            definition: "Not authentic or real, but without the intention to deceive.",
            exampleSentence: "We are using mock data.",
            pronunciation: "/mɒk/"
        }
    ];

    if (context === 'Business') {
        return [
            {
                word: "Negotiation",
                definition: "Discussion aimed at reaching an agreement.",
                exampleSentence: "The negotiation lasted for hours.",
                pronunciation: "/nɪˌɡəʊʃiˈeɪʃən/"
            },
            {
                word: "Strategy",
                definition: "A plan of action designed to achieve a long-term or overall aim.",
                exampleSentence: "We need a new marketing strategy.",
                pronunciation: "/ˈstrætədʒi/"
            },
            {
                word: "Revenue",
                definition: "Income, especially when of a company or organization.",
                exampleSentence: "The company's revenue increased by 20%.",
                pronunciation: "/ˈrɛvənjuː/"
            },
            ...baseWords
        ];
    }

    if (context === 'Travel') {
        return [
            {
                word: "Itinerary",
                definition: "A planned route or journey.",
                exampleSentence: "Our itinerary includes a visit to the museum.",
                pronunciation: "/aɪˈtɪnərəri/"
            },
            {
                word: "Accommodation",
                definition: "A room, group of rooms, or building in which someone may live or stay.",
                exampleSentence: "We booked our accommodation online.",
                pronunciation: "/əˌkɒməˈdeɪʃən/"
            },
            {
                word: "Departure",
                definition: "The action of leaving, especially to start a journey.",
                exampleSentence: "Our departure time is 10 AM.",
                pronunciation: "/dɪˈpɑːtʃə/"
            },
            ...baseWords
        ];
    }

    return [
        ...baseWords,
        {
            word: "Standalone",
            definition: "Operating independently of other hardware or software.",
            exampleSentence: "The app is now standalone.",
            pronunciation: "/ˈstændəˌləʊn/"
        },
        {
            word: "Simulation",
            definition: "Imitation of a situation or process.",
            exampleSentence: "This is a simulation of AI.",
            pronunciation: "/ˌsɪmjʊˈleɪʃən/"
        },
        {
            word: "Offline",
            definition: "Not connected to a computer or network.",
            exampleSentence: "You can use this feature offline.",
            pronunciation: "/ˈɒflaɪn/"
        }
    ];
};

export const generateQuiz = async (words: string[]): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
        {
            id: 'q1',
            type: 'multiple-choice',
            question: "What does 'Standalone' mean?",
            options: [
                "Operating independently",
                "Connected to the internet",
                "Requiring a server",
                "Broken software"
            ],
            correctAnswer: "Operating independently",
            explanation: "Standalone means it works by itself without needing external connections."
        },
        {
            id: 'q2',
            type: 'fill-blank',
            question: "The app is running in _____ mode.",
            options: ["online", "offline", "broken", "slow"],
            correctAnswer: "offline",
            explanation: "Since we removed the API, it is offline."
        },
        {
            id: 'q3',
            type: 'multiple-choice',
            question: "Which word means 'not authentic'?",
            options: ["Real", "Mock", "True", "Genuine"],
            correctAnswer: "Mock",
            explanation: "Mock means simulated or not real."
        }
    ];
};

export const analyzeGrammar = async (text: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock analysis
    const isShort = text.length < 10;
    return {
        isCorrect: !isShort,
        corrections: isShort ? ["Please write a longer sentence."] : [],
        explanation: isShort ? "Your sentence is too short to analyze properly." : "Your sentence looks good! (Mock analysis)"
    };
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    console.log("Speech generation requested for:", text);
    return null; // Return null to indicate no audio generated in offline mode
};

export const geminiService = {
  generateResponse,
  chat,
  createGeminiChat,
  generateVocab,
  generateQuiz,
  analyzeGrammar,
  generateSpeech
};
