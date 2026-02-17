
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { User, Rocket, Gamepad2, Briefcase, Lock, Key } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useGamification();
  const [inputName, setInputName] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !password.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Normalize ID: simple lowercase replacement for consistency
      const userId = inputName.trim().toLowerCase().replace(/\s+/g, '_');
      const success = await login(userId, password, isSignUp);
      
      if (!success) {
        // Error handling is mostly done in context and logged, but context sets loadError. 
        // We can also catch specific returns here if needed, but context handles state.
        // Wait, context returns boolean.
        // We need to read the error from context? Context has loadError state.
        // Let's just rely on the loadError if it fails.
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // We can also use the loadError from context to display here if we want global error handling
  // but for login form specific errors (like "wrong password"), passing it via state or ref is cleaner.
  // Since context sets `loadError` on login fail, let's grab it.
  const { loadError: contextError } = useGamification();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#e0f2fe,transparent)] opacity-70" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fun-pink/10 rounded-full blur-3xl" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-fun-yellow/20 rounded-full blur-2xl animate-float" />

      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl border-4 border-slate-100 p-10 relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-fun-blue to-purple-500 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-500">
             <Rocket size={48} className="animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            Linguist<span className="text-fun-blue">AI</span>
          </h1>
          <p className="text-slate-500 font-bold">
            {isSignUp ? "Create your hero account!" : "Welcome back, Hero!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
               User ID / Username
            </label>
            <div className="relative">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input
                 type="text"
                 value={inputName}
                 onChange={(e) => setInputName(e.target.value)}
                 placeholder="e.g. SuperLearner"
                 className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
                 autoFocus
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
               Password
            </label>
            <div className="relative">
               <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••"
                 className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
               />
            </div>
          </div>

          {(error || contextError) && (
             <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-center font-bold text-sm border-2 border-red-100">
                {error || contextError}
             </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-5 text-xl rounded-3xl shadow-xl hover:shadow-2xl mt-4" 
            disabled={!inputName.trim() || !password.trim() || isSubmitting}
            isLoading={isSubmitting}
          >
            {isSignUp ? "Create Account" : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-fun-blue font-bold text-sm hover:underline"
            >
              {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
            </button>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-slate-50 flex justify-center gap-6 text-slate-400">
           <div className="flex flex-col items-center gap-2">
              <Gamepad2 size={24} />
              <span className="text-[10px] font-black uppercase">Kids Mode</span>
           </div>
           <div className="w-px bg-slate-200 h-10" />
           <div className="flex flex-col items-center gap-2">
              <Briefcase size={24} />
              <span className="text-[10px] font-black uppercase">Pro Mode</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
