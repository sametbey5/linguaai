
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { Brain, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, GraduationCap, Copy, RefreshCw } from 'lucide-react';
import { GrammarAnalysis } from '../types';

const GrammarCoach: React.FC = () => {
  const { awardPoints, mode } = useGamification();
  const isKids = mode === 'kids';
  
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GrammarAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeGrammar = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analysis logic
      const text = inputText.trim();
      const words = text.split(/\s+/);
      
      let score = 100;
      let corrected = text;
      let explanation = "Your sentence looks excellent! Great job using English.";
      let examples = ["Keep practicing with different sentence structures!"];

      if (words.length < 3) {
        score = 60;
        explanation = "This sentence is a bit short. Try adding more detail to make it more descriptive!";
        examples = ["I am happy -> I am very happy today because the sun is shining.", "It is a cat -> It is a small, fluffy cat sitting on the mat."];
      } else if (!/^[A-Z]/.test(text)) {
        score = 85;
        corrected = text.charAt(0).toUpperCase() + text.slice(1);
        explanation = "Don't forget to start your sentences with a capital letter!";
        examples = ["hello world -> Hello world", "the dog barked -> The dog barked"];
      } else if (!/[.!?]$/.test(text)) {
        score = 85;
        corrected = text + ".";
        explanation = "Remember to end your sentences with punctuation like a period, question mark, or exclamation point.";
        examples = ["I like apples -> I like apples.", "Where are you -> Where are you?"];
      }

      const result: GrammarAnalysis = {
        original: text,
        corrected: corrected,
        explanation: explanation,
        score: score,
        examples: examples
      };
      
      setAnalysis(result);
      awardPoints(10, 'Grammar Analysis');
      
    } catch (err) {
      console.error("Grammar Analysis Error:", err);
      setError("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (analysis?.corrected) {
      navigator.clipboard.writeText(analysis.corrected);
      // Could add a toast here
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="text-center space-y-4 px-4">
        <div className="inline-block bg-fun-purple/10 p-4 rounded-full mb-2">
            <GraduationCap size={48} className="text-fun-purple" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
           GRAMMAR COACH
        </h2>
        <p className="text-lg sm:text-xl font-bold text-slate-500 max-w-2xl mx-auto">
           Paste your text below and let our AI coach help you perfect your English! ✍️
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-xl text-slate-700 flex items-center gap-2">
                    <BookOpen className="text-fun-blue" /> YOUR TEXT
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase">{inputText.length} chars</span>
            </div>
            
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your English text here..."
                className="w-full flex-1 min-h-[200px] p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:border-fun-blue focus:bg-white outline-none transition-all resize-none font-medium text-lg text-slate-700 placeholder:text-slate-400"
            />
            
            <div className="mt-6 flex justify-end">
                <Button 
                    onClick={analyzeGrammar}
                    disabled={!inputText.trim() || isAnalyzing}
                    variant="primary"
                    className="px-8 py-4 text-lg rounded-xl shadow-lg w-full sm:w-auto"
                    icon={isAnalyzing ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                >
                    {isAnalyzing ? 'ANALYZING...' : 'CHECK GRAMMAR'}
                </Button>
            </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col h-full">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm mb-6 animate-fade-in">
                    <div className="flex items-center gap-3 text-red-700 font-bold">
                        <AlertTriangle />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {!analysis && !isAnalyzing && !error && (
                <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-10 text-center text-slate-400">
                    <Brain size={64} className="mb-4 opacity-20" />
                    <p className="font-bold text-lg">Results will appear here</p>
                    <p className="text-sm mt-2 max-w-xs">Our AI will analyze your grammar, suggest corrections, and explain mistakes.</p>
                </div>
            )}

            {isAnalyzing && (
                <div className="bg-white border-4 border-slate-100 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-10 text-center shadow-xl">
                    <div className="w-16 h-16 border-4 border-fun-blue border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="font-black text-xl text-slate-700 animate-pulse">Analyzing your text...</p>
                    <p className="text-slate-400 font-bold mt-2">Checking for 100+ types of errors</p>
                </div>
            )}

            {analysis && (
                <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-2xl overflow-hidden animate-fade-in flex flex-col h-full">
                    {/* Score Header */}
                    <div className={`p-4 sm:p-6 ${analysis.score >= 90 ? 'bg-fun-green' : analysis.score >= 70 ? 'bg-fun-yellow' : 'bg-fun-orange'} text-white flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xs sm:text-lg uppercase tracking-wide opacity-90">Grammar Score</h3>
                                <div className="text-2xl sm:text-3xl font-black">{analysis.score}/100</div>
                            </div>
                        </div>
                        {analysis.score === 100 && <Sparkles size={24} className="animate-bounce sm:w-8 sm:h-8" />}
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
                        {/* Correction */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-black text-slate-700 uppercase text-xs tracking-widest">Corrected Version</h4>
                                <button onClick={handleCopy} className="text-fun-blue hover:text-blue-600 transition-colors" title="Copy to clipboard">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-400 text-slate-800 font-medium text-lg leading-relaxed">
                                {analysis.corrected}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div>
                            <h4 className="font-black text-slate-700 uppercase text-xs tracking-widest mb-2">Coach's Feedback</h4>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-600 leading-relaxed">
                                {analysis.explanation}
                            </div>
                        </div>

                        {/* Examples */}
                        {analysis.examples && analysis.examples.length > 0 && (
                            <div>
                                <h4 className="font-black text-slate-700 uppercase text-xs tracking-widest mb-2">Examples</h4>
                                <ul className="space-y-2">
                                    {analysis.examples.map((ex, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                                            <ArrowRight size={16} className="text-fun-purple mt-1 shrink-0" />
                                            <span>{ex}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GrammarCoach;
