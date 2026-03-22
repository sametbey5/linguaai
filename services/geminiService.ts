
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

export const generateVocab = async (topic: string, level: string, context?: string, cefrLevel?: string): Promise<any[]> => {
    // In a real implementation, we would use cefrLevel in the prompt:
    const prompt = `Generate vocabulary appropriate for a CEFR ${cefrLevel || 'A1'} English learner on the topic of ${topic}. Context: ${context || 'General'}.`;
    console.log("AI Prompt (Vocab):", prompt);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const activeContext = context || topic;

    if (activeContext === 'Business') {
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
            {
                word: "Stakeholder",
                definition: "A person with an interest or concern in something, especially a business.",
                exampleSentence: "We need to identify all key stakeholders.",
                pronunciation: "/ˈsteɪkˌhoʊldər/"
            },
            {
                word: "Acquisition",
                definition: "An asset or object bought or obtained, typically by a library or museum.",
                exampleSentence: "The company's latest acquisition was a small tech startup.",
                pronunciation: "/ˌæk.wɪˈzɪʃ.ən/"
            }
        ];
    }

    if (activeContext === 'Travel') {
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
            {
                word: "Destination",
                definition: "The place to which someone or something is going or being sent.",
                exampleSentence: "Paris is a popular tourist destination.",
                pronunciation: "/ˌdes.tɪˈneɪ.ʃən/"
            },
            {
                word: "Expedition",
                definition: "A journey undertaken by a group of people with a particular purpose.",
                exampleSentence: "The scientific expedition to the Antarctic was a success.",
                pronunciation: "/ˌek.spəˈdɪʃ.ən/"
            }
        ];
    }

    if (activeContext === 'Academic') {
        return [
            {
                word: "Hypothesis",
                definition: "A proposed explanation made on the basis of limited evidence.",
                exampleSentence: "The researchers are testing their hypothesis.",
                pronunciation: "/haɪˈpɒθɪsɪs/"
            },
            {
                word: "Curriculum",
                definition: "The subjects comprising a course of study in a school or college.",
                exampleSentence: "The school is revising its science curriculum.",
                pronunciation: "/kəˈrɪkjʊləm/"
            },
            {
                word: "Thesis",
                definition: "A long essay or dissertation involving personal research.",
                exampleSentence: "She is writing her doctoral thesis on climate change.",
                pronunciation: "/ˈθiːsɪs/"
            },
            {
                word: "Pedagogy",
                definition: "The method and practice of teaching.",
                exampleSentence: "The professor's pedagogy focuses on active learning.",
                pronunciation: "/ˈped.ə.ɡɒdʒ.i/"
            },
            {
                word: "Scholarly",
                definition: "Involving or relating to serious academic study.",
                exampleSentence: "The journal publishes scholarly articles on history.",
                pronunciation: "/ˈskɒl.ə.li/"
            }
        ];
    }

    if (activeContext === 'Daily Life') {
        return [
            {
                word: "Errand",
                definition: "A short journey undertaken in order to deliver or collect something.",
                exampleSentence: "I have a few errands to run this afternoon.",
                pronunciation: "/ˈer.ənd/"
            },
            {
                word: "Commute",
                definition: "Travel some distance between one's home and place of work on a regular basis.",
                exampleSentence: "My daily commute takes about 45 minutes.",
                pronunciation: "/kəˈmjuːt/"
            },
            {
                word: "Chore",
                definition: "A routine task, especially a household one.",
                exampleSentence: "Doing the laundry is my least favorite chore.",
                pronunciation: "/tʃɔːr/"
            },
            {
                word: "Leisure",
                definition: "Use of free time for enjoyment.",
                exampleSentence: "I enjoy reading during my leisure time.",
                pronunciation: "/ˈleʒ.ər/"
            },
            {
                word: "Grocery",
                definition: "Items of food sold in a grocery store.",
                exampleSentence: "I need to buy some groceries for dinner.",
                pronunciation: "/ˈɡroʊ.sə.ri/"
            }
        ];
    }

    // Default / General words
    return [
        {
            word: "Resilient",
            definition: "Able to withstand or recover quickly from difficult conditions.",
            exampleSentence: "She is a resilient person who never gives up.",
            pronunciation: "/rɪˈzɪl.i.ənt/"
        },
        {
            word: "Eloquent",
            definition: "Fluent or persuasive in speaking or writing.",
            exampleSentence: "The politician gave an eloquent speech.",
            pronunciation: "/ˈel.ə.kwənt/"
        },
        {
            word: "Ambiguous",
            definition: "Open to more than one interpretation; not having one obvious meaning.",
            exampleSentence: "The instructions were ambiguous and confusing.",
            pronunciation: "/æmˈbɪɡ.ju.əs/"
        },
        {
            word: "Pragmatic",
            definition: "Dealing with things sensibly and realistically.",
            exampleSentence: "We need to take a pragmatic approach to the problem.",
            pronunciation: "/præɡˈmæt.ɪk/"
        },
        {
            word: "Ubiquitous",
            definition: "Present, appearing, or found everywhere.",
            exampleSentence: "Smartphones are ubiquitous in modern society.",
            pronunciation: "/juːˈbɪk.wɪ.təs/"
        }
    ];
};

export const generateQuiz = async (words: string[], cefrLevel?: string): Promise<any[]> => {
    // In a real implementation, we would use cefrLevel in the prompt:
    const prompt = `Generate a quiz appropriate for a CEFR ${cefrLevel || 'A1'} English learner based on these words: ${words.join(', ')}.`;
    console.log("AI Prompt (Quiz):", prompt);

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

export const generateRaceQuestions = async (cefrLevel?: string): Promise<any[]> => {
    const prompt = `Generate 20 fast-paced English race questions for CEFR ${cefrLevel || 'A1'} level. 
    Include: Word meaning, Fill in the blank, Sentence correction, and Synonym matching.`;
    console.log("AI Prompt (Race):", prompt);

    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data for race questions
    return [
        {
            id: 'r1',
            type: 'meaning',
            question: "What does 'Resilient' mean?",
            options: ["Weak", "Strong/Flexible", "Angry", "Slow"],
            answer: "Strong/Flexible",
            explanation: "Resilient means able to recover quickly from difficulties."
        },
        {
            id: 'r2',
            type: 'fill',
            question: "She _____ to the store every morning.",
            options: ["go", "goes", "going", "gone"],
            answer: "goes",
            explanation: "Third-person singular 'she' requires 'goes'."
        },
        {
            id: 'r3',
            type: 'correction',
            question: "Find the error: 'He don't like apples.'",
            options: ["He doesn't like apples", "He don't likes apples", "He not like apples", "No error"],
            answer: "He doesn't like apples",
            explanation: "'He' uses 'does not' (doesn't) instead of 'do not'."
        },
        {
            id: 'r4',
            type: 'synonym',
            question: "What is a synonym for 'Happy'?",
            options: ["Sad", "Joyful", "Tired", "Angry"],
            answer: "Joyful",
            explanation: "Joyful and happy have similar meanings."
        },
        {
            id: 'r5',
            type: 'meaning',
            question: "What is the meaning of 'Commute'?",
            options: ["To talk", "To travel to work", "To eat", "To sleep"],
            answer: "To travel to work",
            explanation: "Commute refers to the regular journey between home and work."
        },
        {
            id: 'r6',
            type: 'fill',
            question: "I have _____ lunch yet.",
            options: ["not eat", "not eaten", "no eat", "eaten not"],
            answer: "not eaten",
            explanation: "Present perfect 'have not eaten' is correct here."
        },
        {
            id: 'r7',
            type: 'correction',
            question: "Correct this: 'I am more tall than you.'",
            options: ["I am taller than you", "I am most tall than you", "I am more taller than you", "No error"],
            answer: "I am taller than you",
            explanation: "Short adjectives use '-er' for comparison, not 'more'."
        },
        {
            id: 'r8',
            type: 'synonym',
            question: "Synonym of 'Difficult'?",
            options: ["Easy", "Hard", "Soft", "Simple"],
            answer: "Hard",
            explanation: "Hard and difficult are synonyms."
        },
        {
            id: 'r9',
            type: 'meaning',
            question: "What does 'Eloquent' mean?",
            options: ["Quiet", "Well-spoken", "Loud", "Confused"],
            answer: "Well-spoken",
            explanation: "Eloquent means fluent or persuasive in speaking or writing."
        },
        {
            id: 'r10',
            type: 'fill',
            question: "If it rains, I _____ stay home.",
            options: ["will", "would", "am", "was"],
            answer: "will",
            explanation: "First conditional uses 'will' for the result."
        }
    ];
};

export const geminiService = {
  generateResponse,
  chat,
  createGeminiChat,
  generateVocab,
  generateQuiz,
  analyzeGrammar,
  generateSpeech,
  generateRaceQuestions
};
