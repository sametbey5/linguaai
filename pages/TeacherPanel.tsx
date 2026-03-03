
import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { MessageSquare, CheckCircle, Clock, User, ArrowRight, Send, GraduationCap, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';

const TeacherPanel: React.FC = () => {
  const { helpRequests, answerHelpRequest, isVerifiedTeacher, isAdmin, userId } = useGamification();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVerifiedTeacher && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
          <ShieldCheck size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Access Denied</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          This panel is only accessible to verified teachers. If you are a teacher, please apply for verification in your profile settings.
        </p>
      </div>
    );
  }

  const pendingRequests = helpRequests.filter(r => r.status === 'pending');
  const resolvedRequests = helpRequests.filter(r => r.status === 'resolved' && (isAdmin || r.answeredBy === userId));

  const handleAnswer = async (requestId: string) => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    const success = await answerHelpRequest(requestId, answer);
    if (success) {
      setAnswer('');
      setSelectedRequest(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            Teacher Help Center <GraduationCap className="text-fun-blue" size={32} />
          </h1>
          <p className="text-slate-500 font-bold">Answer student questions and help them grow!</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border-4 border-slate-100 shadow-sm">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Pending</span>
             <span className="text-2xl font-black text-fun-orange">{pendingRequests.length}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border-4 border-slate-100 shadow-sm">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Resolved</span>
             <span className="text-2xl font-black text-fun-green">{resolvedRequests.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requests List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-fun-orange" /> Active Requests
          </h3>
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                <p className="text-slate-400 font-bold">No pending requests. Great job!</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div 
                  key={req.id}
                  onClick={() => setSelectedRequest(req.id)}
                  className={`p-4 rounded-2xl border-4 transition-all cursor-pointer ${selectedRequest === req.id ? 'bg-fun-blue/5 border-fun-blue shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border-2 border-white">
                      <img src={req.studentAvatar} alt={req.studentName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{req.studentName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{req.topic}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.message}</p>
                </div>
              ))
            )}
          </div>

          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 pt-4">
            <CheckCircle size={20} className="text-fun-green" /> Your History
          </h3>
          <div className="space-y-3">
            {resolvedRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border-4 border-slate-100 opacity-80">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-slate-700 text-sm">{req.studentName}</h4>
                   <span className="text-[8px] font-black bg-fun-green/10 text-fun-green px-2 py-0.5 rounded-full uppercase">Resolved</span>
                </div>
                <p className="text-xs text-slate-500 italic">"{req.message}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Area */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-xl p-8 sticky top-24">
              {pendingRequests.find(r => r.id === selectedRequest) && (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-md">
                      <img src={pendingRequests.find(r => r.id === selectedRequest)?.studentAvatar} alt="Student" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">{pendingRequests.find(r => r.id === selectedRequest)?.studentName}</h2>
                      <p className="text-sm font-bold text-fun-blue uppercase tracking-widest">Topic: {pendingRequests.find(r => r.id === selectedRequest)?.topic}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 mb-8 border-2 border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Student's Message:</h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {pendingRequests.find(r => r.id === selectedRequest)?.message}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Answer:</h4>
                    <textarea 
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your helpful explanation here..."
                      className="w-full h-48 bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 focus:border-fun-blue outline-none transition-all font-medium text-slate-700"
                    />
                    <div className="flex justify-end gap-4">
                       <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                       <Button 
                         onClick={() => handleAnswer(selectedRequest)} 
                         disabled={!answer.trim() || isSubmitting}
                         icon={<Send size={18} />}
                       >
                         {isSubmitting ? 'Sending...' : 'Send Answer'}
                       </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border-4 border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                 <MessageSquare size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-400">Select a request to start helping!</h3>
               <p className="text-slate-400 max-w-xs mt-2">Students are waiting for your expert guidance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
