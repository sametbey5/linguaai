
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { User, Rocket, Gamepad2, Briefcase, Lock, Key, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login, requestPasswordReset, verifyResetCode } = useGamification();
  const [inputName, setInputName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'reset-request' | 'reset-verify'>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    if (authMode === 'login') {
        if (!inputName.trim() || !password.trim()) return;
        setIsSubmitting(true);
        try {
            const userId = inputName.trim().toLowerCase().replace(/\s+/g, '_');
            const success = await login(userId, password, isSignUp, isSignUp ? email : undefined);
            if (!success) {
                // Error is handled by context loadError
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    } else if (authMode === 'reset-request') {
        if (!email.trim()) return;
        setIsSubmitting(true);
        const res = await requestPasswordReset(email);
        setIsSubmitting(false);
        if (res.success) {
            setSuccessMsg(res.msg);
            setAuthMode('reset-verify');
        } else {
            setError(res.msg);
        }
    } else if (authMode === 'reset-verify') {
        if (!email.trim() || !resetCode.trim() || !password.trim()) return;
        setIsSubmitting(true);
        const res = await verifyResetCode(email, resetCode, password);
        setIsSubmitting(false);
        if (res.success) {
            setSuccessMsg(res.msg);
            setAuthMode('login');
            setIsSignUp(false);
        } else {
            setError(res.msg);
        }
    }
  };

  const { loadError: contextError } = useGamification();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#e0f2fe,transparent)] opacity-70" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fun-pink/10 rounded-full blur-3xl" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-fun-yellow/20 rounded-full blur-2xl animate-float" />

      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl border-4 border-slate-100 p-6 sm:p-10 relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="mb-6 flex items-center justify-center">
             <img 
               src="https://i.ibb.co/23HGg63k/lingavo.png" 
               alt="Lingavo Logo" 
               className="h-20 w-auto object-contain"
               referrerPolicy="no-referrer"
             />
          </div>
          <p className="text-slate-500 font-bold">
            {authMode === 'login' 
                ? (isSignUp ? "Create your hero account!" : "Welcome back, Hero!")
                : (authMode === 'reset-request' ? "Reset your password" : "Enter reset code")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'login' && (
            <>
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

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
                     Email Address
                  </label>
                  <div className="relative">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="hero@example.com"
                       className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
                       required
                     />
                  </div>
                </div>
              )}

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
            </>
          )}

          {authMode === 'reset-request' && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
                 Registered Email
              </label>
              <div className="relative">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="hero@example.com"
                   className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
                   autoFocus
                   required
                 />
              </div>
            </div>
          )}

          {authMode === 'reset-verify' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
                   Reset Code
                </label>
                <div className="relative">
                   <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input
                     type="text"
                     value={resetCode}
                     onChange={(e) => setResetCode(e.target.value)}
                     placeholder="123456"
                     className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
                     autoFocus
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4">
                   New Password
                </label>
                <div className="relative">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xl font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors placeholder:text-slate-300"
                     required
                   />
                </div>
              </div>
            </>
          )}

          {(error || contextError) && (
             <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-center font-bold text-sm border-2 border-red-100">
                {error || contextError}
             </div>
          )}

          {successMsg && (
             <div className="bg-green-50 text-green-600 p-3 rounded-2xl text-center font-bold text-sm border-2 border-green-100">
                {successMsg}
             </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-5 text-xl rounded-3xl shadow-xl hover:shadow-2xl mt-4" 
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {authMode === 'login' ? (isSignUp ? "Create Account" : "Login") : (authMode === 'reset-request' ? "Send Reset Code" : "Change Password")}
          </Button>

          {authMode !== 'login' && (
            <button 
              type="button" 
              onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
              className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 mt-2"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          )}
        </form>

        {authMode === 'login' && (
            <div className="mt-6 flex flex-col gap-3 text-center">
                <button 
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
                  className="text-fun-blue font-bold text-sm hover:underline"
                >
                  {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
                </button>
                {!isSignUp && (
                    <button 
                      type="button"
                      onClick={() => { setAuthMode('reset-request'); setError(null); setSuccessMsg(null); }}
                      className="text-slate-400 font-bold text-xs hover:text-fun-blue"
                    >
                      Forgot Password?
                    </button>
                )}
            </div>
        )}

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
