import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, ChevronRight, ArrowLeft, Award, Sparkles, Lock, Star, Globe } from 'lucide-react';
import Button from '../components/Button';
import { useGamification } from '../context/GamificationContext';
import Confetti from '../components/Confetti';
import { UI_TRANSLATIONS } from '../translations';

import { LESSONS, Lesson, Level, Exercise } from '../components/grammarLessonsData';

const LEVELS: { id: Level; title: string; desc: string; color: string }[] = [
  { id: 'A1', title: 'Beginner', desc: 'Essential foundations', color: 'bg-green-500' },
  { id: 'A2', title: 'Elementary', desc: 'Basic communication', color: 'bg-teal-500' },
  { id: 'B1', title: 'Intermediate', desc: 'Everyday fluency', color: 'bg-blue-500' },
  { id: 'B2', title: 'Upper Int.', desc: 'Complex ideas', color: 'bg-indigo-500' },
  { id: 'C1', title: 'Advanced', desc: 'Professional mastery', color: 'bg-purple-500' },
  { id: 'C2', title: 'Proficiency', desc: 'Native-like nuance', color: 'bg-pink-500' },
];

// LESSONS are now imported from ../data/grammarLessons

const GrammarLessons: React.FC = () => {
  const { awardPoints, cefrLevel, updateProfile, preferredLanguage } = useGamification();
  const navigate = useNavigate();
  
  const t = (key: string) => UI_TRANSLATIONS[preferredLanguage]?.[key] || UI_TRANSLATIONS['Turkish']?.[key] || key;

  const [selectedLevel, setSelectedLevel] = useState<Level>(cefrLevel || 'A1');
  
  const levelOrder: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  
  const isLevelLocked = (lvl: Level) => {
      const userLevelIndex = levelOrder.indexOf(cefrLevel || 'A1');
      const targetLevelIndex = levelOrder.indexOf(lvl);
      return targetLevelIndex > userLevelIndex;
  };
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<'list' | 'explanation' | 'quiz' | 'completed'>('list');
  
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setPhase('explanation');
    setCurrentExerciseIndex(0);
    setFeedback(null);
    setUserAnswer('');
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
  };

  const handleSubmitAnswer = () => {
    if (!selectedLesson) return;
    
    const currentExercise = selectedLesson.exercises[currentExerciseIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase();
    
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Correct! Great job!' : `Not quite. ${currentExercise.explanation}`
    });

    if (isCorrect) {
      awardPoints(20, 'Correct Answer', 'grammar');
    }
  };

  const handleNextExercise = () => {
    if (!selectedLesson) return;
    
    if (currentExerciseIndex < selectedLesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setPhase('completed');
      if (!completedLessons.includes(selectedLesson.id)) {
        setCompletedLessons([...completedLessons, selectedLesson.id]);
        
        // Check if it's an exam
        if (selectedLesson.id.includes('exam')) {
             handleExamPass(selectedLesson.level);
        } else {
             awardPoints(100, 'Lesson Completed', 'grammar');
        }
      }
    }
  };

  const handleExamPass = (passedLevel: Level) => {
      const levelOrder: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const currentIndex = levelOrder.indexOf(passedLevel);
      
      if (currentIndex < levelOrder.length - 1) {
          const nextLevel = levelOrder[currentIndex + 1];
          // Only promote if they are currently at the passed level
          if (cefrLevel === passedLevel) {
              updateProfile({ cefrLevel: nextLevel });
              awardPoints(500, `Promoted to ${nextLevel}!`, 'grammar');
          } else {
              awardPoints(200, 'Exam Retaken', 'grammar');
          }
      } else {
          awardPoints(1000, 'Grammar Master!', 'grammar');
      }
  };

  const handleBackToList = () => {
    setPhase('list');
    setSelectedLesson(null);
  };

  // --- RENDER: LEVEL SELECTOR ---
  if (phase === 'list') {
    const filteredLessons = LESSONS.filter(l => l.level === selectedLevel);

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight uppercase">{t('grammar_academy')}</h2>
          <p className="text-xl font-bold text-slate-500">{t('master_english')}</p>
          {preferredLanguage && (
            <div className="inline-block bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-sm font-bold mt-2">
              🌍 {t('support_language')}: {preferredLanguage}
            </div>
          )}
          <div className="flex justify-center mt-4">
             <Button onClick={() => navigate('/grammar')} variant="secondary" className="px-6 py-2 text-sm">
                {t('play_scramble')} 🎮
             </Button>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {LEVELS.map((lvl) => {
            const locked = isLevelLocked(lvl.id);
            return (
            <button
              key={lvl.id}
              onClick={() => !locked && setSelectedLevel(lvl.id)}
              disabled={locked}
              className={`relative px-6 py-4 rounded-2xl border-b-4 transition-all flex flex-col items-center min-w-[100px] ${
                selectedLevel === lvl.id 
                  ? `${lvl.color} border-black/20 text-white shadow-lg scale-110 z-10` 
                  : locked 
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed grayscale'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:scale-105'
              }`}
            >
              {locked && <Lock size={16} className="absolute top-2 right-2 opacity-50" />}
              <span className="text-2xl font-black">{lvl.id}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{lvl.title}</span>
            </button>
          )})}
        </div>

        {/* Current Level Info */}
        <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 shadow-sm text-center max-w-2xl mx-auto">
           <h3 className="text-2xl font-black text-slate-800 mb-2">
             {LEVELS.find(l => l.id === selectedLevel)?.title} Level
           </h3>
           <p className="text-slate-500 font-medium">
             {LEVELS.find(l => l.id === selectedLevel)?.desc}
           </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isExam = lesson.id.includes('exam');
            
            return (
            <div 
              key={lesson.id}
              onClick={() => handleStartLesson(lesson)}
              className={`p-6 rounded-[2rem] border-4 shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden ${
                isExam 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-400'
                  : 'bg-white border-slate-100 hover:border-fun-blue'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-fun-green text-white p-2 rounded-full shadow-md z-10">
                  <CheckCircle size={20} />
                </div>
              )}
              
              <div className={`w-16 h-16 ${isExam ? 'bg-orange-500' : LEVELS.find(l => l.id === lesson.level)?.color || 'bg-blue-500'} text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                {isExam ? <Star size={32} fill="white" /> : <BookOpen size={32} />}
              </div>
              
              <span className={`text-xs font-black uppercase tracking-widest ${isExam ? 'text-orange-600' : 'text-slate-400'}`}>
                {lesson.topic}
              </span>
              <h3 className={`text-xl font-black mt-1 mb-2 leading-tight ${isExam ? 'text-slate-800' : 'text-slate-800'}`}>
                {lesson.title}
              </h3>
              {preferredLanguage && preferredLanguage !== 'English' && lesson.translations && lesson.translations[preferredLanguage] && (
                <p className="text-fun-blue font-bold text-sm flex items-center gap-1 mb-2">
                  <Globe size={14} /> {lesson.translations[preferredLanguage].title}
                </p>
              )}
              <p className={`font-medium mb-4 text-sm ${isExam ? 'text-orange-700/70' : 'text-slate-500'}`}>
                {lesson.exercises.length} interactive exercises
              </p>
              
              <div className={`flex items-center font-bold group-hover:translate-x-2 transition-transform text-sm ${isExam ? 'text-orange-600' : 'text-fun-blue'}`}>
                {isExam ? 'Start Exam' : t('start_lesson')} <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          )})}
          
          {filteredLessons.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 font-bold">
              <Lock size={48} className="mx-auto mb-4 opacity-50" />
              <p>{t('lessons_coming_soon')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: EXPLANATION ---
  if (phase === 'explanation' && selectedLesson) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in pb-20">
        <button onClick={handleBackToList} className="flex items-center text-slate-400 hover:text-slate-600 font-bold mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> {t('back')}
        </button>
        
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border-4 border-slate-100 shadow-xl">
          <div className={`inline-block ${LEVELS.find(l => l.id === selectedLesson.level)?.color} text-white px-4 py-1 rounded-full font-black text-sm mb-4 uppercase tracking-widest shadow-sm`}>
            {selectedLesson.level} • {selectedLesson.topic}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-8">{selectedLesson.title}</h2>
          
          <div className="prose prose-lg max-w-none">
            {selectedLesson.explanation}
          </div>
          
          {preferredLanguage && preferredLanguage !== 'English' && selectedLesson.translations && selectedLesson.translations[preferredLanguage] && (
            <div className="mt-8 border-t-2 border-slate-100 pt-8">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 animate-fade-in">
                    <h4 className="font-bold text-fun-blue mb-4 flex items-center">
                        <Globe size={20} className="mr-2" /> 
                        {t('support_language')}: {selectedLesson.translations[preferredLanguage].title}
                    </h4>
                    <div className="prose prose-blue max-w-none whitespace-pre-wrap text-slate-700">
                        {selectedLesson.translations[preferredLanguage].explanation}
                    </div>
                </div>
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <Button onClick={handleStartQuiz} className="px-8 py-4 text-lg" icon={<Sparkles size={24} />}>
              {t('start_practice')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: QUIZ ---
  if (phase === 'quiz' && selectedLesson) {
    const exercise = selectedLesson.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex) / selectedLesson.exercises.length) * 100;

    return (
      <div className="max-w-3xl mx-auto animate-fade-in pb-20">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBackToList} className="flex items-center text-slate-400 hover:text-slate-600 font-bold transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Quit
          </button>
          <div className="text-slate-500 font-bold">
            Question {currentExerciseIndex + 1} of {selectedLesson.exercises.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
          <div className="bg-fun-blue h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border-4 border-slate-100 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 leading-tight">
            {exercise.question}
          </h3>

          <div className="space-y-4">
            {exercise.type === 'multiple-choice' && exercise.options ? (
              <div className="grid grid-cols-1 gap-4">
                {exercise.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => !feedback && setUserAnswer(option)}
                    disabled={feedback !== null}
                    className={`p-5 rounded-2xl border-4 text-left font-bold text-xl transition-all ${
                      userAnswer === option 
                        ? 'border-fun-blue bg-blue-50 text-fun-blue' 
                        : 'border-slate-100 hover:border-slate-300 text-slate-700 bg-white'
                    } ${feedback !== null && option === exercise.correctAnswer ? 'border-fun-green bg-green-50 text-fun-green' : ''}
                      ${feedback !== null && userAnswer === option && !feedback.isCorrect ? 'border-red-400 bg-red-50 text-red-500' : ''}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={feedback !== null}
                  placeholder="Type your answer here..."
                  className="w-full p-5 rounded-2xl border-4 border-slate-200 text-xl font-bold text-slate-800 focus:border-fun-blue focus:outline-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim() && !feedback) {
                      handleSubmitAnswer();
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="mt-10 min-h-[100px]">
            {!feedback ? (
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={!userAnswer.trim()}
                className="w-full py-4 text-xl"
              >
                Check Answer
              </Button>
            ) : (
              <div className={`p-6 rounded-2xl border-4 animate-fade-in ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${feedback.isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {feedback.isCorrect ? <CheckCircle size={24} /> : <span className="font-black text-xl px-2">!</span>}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-xl mb-1 ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {feedback.isCorrect ? 'Excellent!' : 'Not quite!'}
                    </h4>
                    <p className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {feedback.message}
                    </p>
                  </div>
                  <Button onClick={handleNextExercise} variant={feedback.isCorrect ? 'success' : 'primary'}>
                    {currentExerciseIndex < selectedLesson.exercises.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: COMPLETED ---
  if (phase === 'completed' && selectedLesson) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in pb-20 pt-10">
        <Confetti />
        <div className="w-32 h-32 bg-fun-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-8 border-white animate-bounce-slow">
          <Award size={64} className="text-orange-500" />
        </div>
        <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">Lesson Complete!</h2>
        <p className="text-2xl font-bold text-slate-500 mb-8">You mastered: {selectedLesson.title}</p>
        
        <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-xl mb-10">
          <div className="flex items-center justify-center gap-4 text-fun-blue font-black text-2xl">
            <Sparkles /> +100 XP Earned! <Sparkles />
          </div>
        </div>

        <Button onClick={handleBackToList} className="px-12 py-5 text-xl">
          Back to Lessons
        </Button>
      </div>
    );
  }

  return null;
};

export default GrammarLessons;
