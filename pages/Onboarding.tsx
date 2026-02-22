import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { BookOpen, Mic, Ear, PenTool, Globe, Briefcase, Plane, GraduationCap, Coffee, Sparkles, Brain, Gamepad2, MessageCircle, Trophy, CheckCircle, XCircle, Languages } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
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

const PLACEMENT_TEST_QUESTIONS = [
  { id: 1, question: "I _____ from Spain.", options: ["is", "are", "am", "be"], answer: "am" },
  { id: 2, question: "She _____ like coffee.", options: ["don't", "doesn't", "isn't", "not"], answer: "doesn't" },
  { id: 3, question: "Yesterday, I _____ to the cinema.", options: ["go", "gone", "went", "going"], answer: "went" },
  { id: 4, question: "Have you ever _____ sushi?", options: ["eat", "ate", "eaten", "eating"], answer: "eaten" },
  { id: 5, question: "If I _____ rich, I would buy a boat.", options: ["am", "was", "were", "been"], answer: "were" },
  { id: 6, question: "I look forward to _____ you.", options: ["see", "seeing", "saw", "seen"], answer: "seeing" },
  { id: 7, question: "He is responsible _____ the project.", options: ["of", "for", "to", "with"], answer: "for" },
  { id: 8, question: "I wish I _____ harder for the exam.", options: ["study", "studied", "have studied", "had studied"], answer: "had studied" },
  { id: 9, question: "No sooner _____ I arrived than it started raining.", options: ["had", "have", "did", "was"], answer: "had" },
  { id: 10, question: "It is essential that he _____ on time.", options: ["is", "be", "was", "being"], answer: "be" },
];

const ABILITIES = [
  { id: 'Vocabulary', icon: <BookOpen size={24} />, label: 'Vocabulary' },
  { id: 'Speaking', icon: <Mic size={24} />, label: 'Speaking' },
  { id: 'Listening', icon: <Ear size={24} />, label: 'Listening' },
  { id: 'Writing', icon: <PenTool size={24} />, label: 'Writing' },
  { id: 'All', icon: <Globe size={24} />, label: 'All of them' },
];

const CONTEXTS = [
  { id: 'Business', icon: <Briefcase size={24} />, label: 'Business & Work' },
  { id: 'Travel', icon: <Plane size={24} />, label: 'Travel & Tourism' },
  { id: 'Academic', icon: <GraduationCap size={24} />, label: 'Academic & Study' },
  { id: 'Daily Life', icon: <Coffee size={24} />, label: 'Daily Life & Casual' },
];

const PREFERENCES = [
    { id: 'Games', icon: <Gamepad2 size={24} />, label: 'Fun Games' },
    { id: 'Stories', icon: <BookOpen size={24} />, label: 'Interactive Stories' },
    { id: 'Speaking', icon: <MessageCircle size={24} />, label: 'Real Conversations' },
    { id: 'Challenges', icon: <Trophy size={24} />, label: 'Hard Challenges' },
];

const Onboarding: React.FC = () => {
  const { updateProfile, isLoading } = useGamification();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading...</div>;
  }
  
  // Steps:
  // 0: Language Selection
  // 1: Test Intro
  // 2: Testing
  // 3: Test Result
  // 4: Goals
  // 5: Context
  // 6: Preference
  const [step, setStep] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [determinedLevel, setDeterminedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

  const handleLanguageSelect = (langName: string) => {
      setSelectedLanguage(langName);
      setStep(1);
  };

  const startTest = () => {
      setStep(2);
      setCurrentQuestionIndex(0);
  };

  const handleTestAnswer = (answer: string) => {
      const questionId = PLACEMENT_TEST_QUESTIONS[currentQuestionIndex].id;
      setTestAnswers(prev => ({ ...prev, [questionId]: answer }));

      if (currentQuestionIndex < PLACEMENT_TEST_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
      } else {
          calculateLevel(answer); // Pass last answer to include it
      }
  };

  const calculateLevel = (lastAnswer: string) => {
      // Combine state and last answer
      const allAnswers = { ...testAnswers, [PLACEMENT_TEST_QUESTIONS[currentQuestionIndex].id]: lastAnswer };
      
      let score = 0;
      PLACEMENT_TEST_QUESTIONS.forEach(q => {
          if (allAnswers[q.id] === q.answer) {
              score++;
          }
      });

      let level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'A1';
      if (score >= 9) level = 'C2'; // Actually C1/C2 boundary, let's say 9-10 is very high
      else if (score >= 8) level = 'C1';
      else if (score >= 7) level = 'B2';
      else if (score >= 5) level = 'B1';
      else if (score >= 3) level = 'A2';
      else level = 'A1';

      setDeterminedLevel(level);
      setStep(3);
  };

  const toggleAbility = (id: string) => {
    if (id === 'All') {
      if (selectedAbilities.includes('All')) {
        setSelectedAbilities([]);
      } else {
        setSelectedAbilities(['All']);
      }
      return;
    }

    let newSelection = selectedAbilities.filter(a => a !== 'All');
    if (newSelection.includes(id)) {
      newSelection = newSelection.filter(a => a !== id);
    } else {
      newSelection.push(id);
    }
    setSelectedAbilities(newSelection);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        preferredLanguage: selectedLanguage || 'Turkish',
        cefrLevel: determinedLevel,
        focusArea: selectedAbilities,
        usageContext: selectedContext || 'Daily Life',
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-fun-blue rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Sparkles size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Setting Up Your Profile...</h2>
        <p className="text-slate-500 font-medium">Calibrating to {determinedLevel} level with {selectedLanguage} support.</p>
      </div>
    );
  }

  // --- STEP 0: LANGUAGE ---
  if (step === 0) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-fun-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Languages size={40} className="text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Welcome to LinguistAI! 👋</h1>
                  <p className="text-xl text-slate-500 font-medium mb-8">Choose your native language for side-by-side translations & support.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-2">
                      {SUPPORTED_LANGUAGES.map(lang => (
                          <button
                              key={lang.code}
                              onClick={() => handleLanguageSelect(lang.name)}
                              className="p-6 rounded-2xl border-4 border-slate-100 hover:border-fun-blue hover:bg-blue-50 transition-all group flex flex-col items-center gap-2"
                          >
                              <span className="text-4xl">{lang.flag}</span>
                              <span className="font-bold text-slate-700 group-hover:text-fun-blue">{lang.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- STEP 1: TEST INTRO ---
  if (step === 1) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-fun-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Brain size={40} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-4">Let's Check Your Level</h2>
                  <p className="text-slate-500 font-medium mb-8">Take a quick 10-question test to find your perfect starting point. No pressure!</p>
                  <Button onClick={startTest} variant="primary" className="w-full py-4 text-xl rounded-2xl shadow-xl">Start Quiz</Button>
              </div>
          </div>
      );
  }

  // --- STEP 2: TESTING ---
  if (step === 2) {
      const question = PLACEMENT_TEST_QUESTIONS[currentQuestionIndex];
      const progress = ((currentQuestionIndex) / PLACEMENT_TEST_QUESTIONS.length) * 100;

      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-slate-400">Question {currentQuestionIndex + 1}/{PLACEMENT_TEST_QUESTIONS.length}</span>
                      <span className="font-black text-fun-purple">Level Check</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-3 rounded-full mb-8 overflow-hidden">
                      <div className="bg-fun-purple h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 leading-tight">
                      {question.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((opt, idx) => (
                          <button
                              key={idx}
                              onClick={() => handleTestAnswer(opt)}
                              className="p-5 rounded-2xl border-4 border-slate-100 hover:border-fun-purple hover:bg-purple-50 text-left font-bold text-xl text-slate-700 transition-all"
                          >
                              {opt}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- STEP 3: RESULT ---
  if (step === 3) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-fade-in">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                      <Sparkles size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Great Job!</h2>
                  <p className="text-slate-500 font-medium mb-6">We've analyzed your results.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl border-4 border-slate-100 mb-8">
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Your Level</div>
                      <div className="text-5xl font-black text-fun-blue">{determinedLevel}</div>
                  </div>

                  <Button onClick={() => setStep(4)} variant="primary" className="w-full py-4 text-xl rounded-2xl shadow-xl">Continue Setup</Button>
              </div>
          </div>
      );
  }

  // --- STEPS 4, 5, 6: PREFERENCES ---
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border-4 border-slate-100 p-8 md:p-12 relative overflow-hidden animate-fade-in">
        {/* Progress Bar for Setup Phase */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-fun-blue transition-all duration-500" 
            style={{ width: `${((step - 3) / 3) * 100}%` }} 
          />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
            {step === 4 ? "What's your goal?" : step === 5 ? "Where will you use English?" : "How do you like to learn?"}
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {step === 4 ? "Select the skills you want to improve." : step === 5 ? "We'll tailor the topics to your life." : "Choose your favorite way to practice."}
          </p>
        </div>

        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in">
            {ABILITIES.map(ability => (
              <button
                key={ability.id}
                onClick={() => toggleAbility(ability.id)}
                className={`p-6 rounded-2xl border-4 transition-all flex items-center gap-4 text-left group ${
                  selectedAbilities.includes(ability.id) 
                    ? 'border-fun-blue bg-blue-50' 
                    : 'border-slate-100 hover:border-blue-200 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedAbilities.includes(ability.id) ? 'bg-fun-blue text-white' : 'bg-slate-100 text-slate-400 group-hover:text-fun-blue'
                }`}>
                  {ability.icon}
                </div>
                <span className={`font-bold text-lg ${selectedAbilities.includes(ability.id) ? 'text-fun-blue' : 'text-slate-600'}`}>
                  {ability.label}
                </span>
              </button>
            ))}
          </div>
        )}
        
        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in">
            {CONTEXTS.map(ctx => (
              <button
                key={ctx.id}
                onClick={() => setSelectedContext(ctx.id)}
                className={`p-6 rounded-2xl border-4 transition-all flex items-center gap-4 text-left group ${
                  selectedContext === ctx.id
                    ? 'border-fun-green bg-green-50' 
                    : 'border-slate-100 hover:border-green-200 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedContext === ctx.id ? 'bg-fun-green text-white' : 'bg-slate-100 text-slate-400 group-hover:text-fun-green'
                }`}>
                  {ctx.icon}
                </div>
                <span className={`font-bold text-lg ${selectedContext === ctx.id ? 'text-fun-green' : 'text-slate-600'}`}>
                  {ctx.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in">
                {PREFERENCES.map(pref => (
                <button
                    key={pref.id}
                    onClick={() => setSelectedPreference(pref.id)}
                    className={`p-6 rounded-2xl border-4 transition-all flex items-center gap-4 text-left group ${
                    selectedPreference === pref.id
                        ? 'border-fun-purple bg-purple-50' 
                        : 'border-slate-100 hover:border-purple-200 bg-white'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    selectedPreference === pref.id ? 'bg-fun-purple text-white' : 'bg-slate-100 text-slate-400 group-hover:text-fun-purple'
                    }`}>
                    {pref.icon}
                    </div>
                    <span className={`font-bold text-lg ${selectedPreference === pref.id ? 'text-fun-purple' : 'text-slate-600'}`}>
                    {pref.label}
                    </span>
                </button>
                ))}
            </div>
        )}

        <div className="flex justify-between items-center mt-8">
          {step > 4 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="text-slate-400 font-bold hover:text-slate-600 px-4"
            >
              Back
            </button>
          )}
          <div className="flex-1"></div>
          <Button 
            variant="primary" 
            className="px-8 py-4 text-xl rounded-2xl shadow-xl"
            onClick={() => {
                if (step === 4 && selectedAbilities.length > 0) setStep(5);
                else if (step === 5 && selectedContext) setStep(6);
                else if (step === 6 && selectedPreference) handleFinish();
            }}
            disabled={
                (step === 4 && selectedAbilities.length === 0) || 
                (step === 5 && !selectedContext) ||
                (step === 6 && !selectedPreference)
            }
          >
            {step === 6 ? 'Start Journey' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
