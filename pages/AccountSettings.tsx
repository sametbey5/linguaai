
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { User, Lock, Mail, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountSettings: React.FC = () => {
  const { userId, changeUsername, requestPasswordReset, verifyResetCode } = useGamification();
  const navigate = useNavigate();
  
  const [newUsername, setNewUsername] = useState(userId || '');
  const [authMode, setAuthMode] = useState<'view' | 'change-username' | 'reset-request' | 'reset-verify'>('view');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername === userId) return;
    
    setIsSubmitting(true);
    setMessage(null);
    const res = await changeUsername(newUsername.trim());
    setIsSubmitting(false);
    
    if (res.success) {
      setMessage({ text: res.msg, type: 'success' });
      setAuthMode('view');
    } else {
      setMessage({ text: res.msg, type: 'error' });
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setMessage(null);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    
    if (res.success) {
      setMessage({ text: res.msg, type: 'success' });
      setAuthMode('reset-verify');
    } else {
      setMessage({ text: res.msg, type: 'error' });
    }
  };

  const handlePasswordResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !resetCode.trim() || !newPassword.trim()) return;
    
    setIsSubmitting(true);
    setMessage(null);
    const res = await verifyResetCode(email, resetCode, newPassword);
    setIsSubmitting(false);
    
    if (res.success) {
      setMessage({ text: res.msg, type: 'success' });
      setAuthMode('view');
    } else {
      setMessage({ text: res.msg, type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white rounded-2xl shadow-sm border-2 border-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Account Settings</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-3xl border-4 flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Username Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-fun-blue/10 rounded-2xl flex items-center justify-center text-fun-blue">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Username</h3>
                <p className="text-slate-400 font-bold text-sm">Your unique hero identity</p>
              </div>
            </div>
            {authMode === 'view' && (
              <button 
                onClick={() => setAuthMode('change-username')}
                className="text-fun-blue font-black text-sm hover:underline"
              >
                Change
              </button>
            )}
          </div>

          {authMode === 'change-username' ? (
            <form onSubmit={handleUsernameChange} className="space-y-4">
              <input 
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl py-4 px-6 text-lg font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                autoFocus
              />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Save Username</Button>
                <Button type="button" variant="outline" onClick={() => { setAuthMode('view'); setNewUsername(userId || ''); }}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl font-black text-slate-600 text-xl">
              {userId}
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-fun-purple/10 rounded-2xl flex items-center justify-center text-fun-purple">
                <Lock size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Password</h3>
                <p className="text-slate-400 font-bold text-sm">Keep your account secure</p>
              </div>
            </div>
            {authMode === 'view' && (
              <button 
                onClick={() => setAuthMode('reset-request')}
                className="text-fun-blue font-black text-sm hover:underline"
              >
                Change Password
              </button>
            )}
          </div>

          {authMode === 'reset-request' && (
            <form onSubmit={handlePasswordResetRequest} className="space-y-4 animate-fade-in">
              <p className="text-slate-500 font-bold text-sm">Enter your registered email to receive a reset code.</p>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@example.com"
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Send Code</Button>
                <Button type="button" variant="outline" onClick={() => setAuthMode('view')}>Cancel</Button>
              </div>
            </form>
          )}

          {authMode === 'reset-verify' && (
            <form onSubmit={handlePasswordResetVerify} className="space-y-4 animate-fade-in">
              <p className="text-slate-500 font-bold text-sm">Enter the 6-digit code sent to your email and your new password.</p>
              <div className="space-y-4">
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Reset Code"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                    required
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-lg font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Update Password</Button>
                <Button type="button" variant="outline" onClick={() => setAuthMode('view')}>Cancel</Button>
              </div>
            </form>
          )}

          {authMode === 'view' && (
            <div className="bg-slate-50 p-4 rounded-2xl font-black text-slate-400 text-xl tracking-widest">
              ••••••••••••
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
