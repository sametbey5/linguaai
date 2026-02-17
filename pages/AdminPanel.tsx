import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from '../components/Button';
import { ShieldCheck, Award, User, RefreshCw, CheckCircle, AlertTriangle, MessageSquare, Mail, Reply, Send } from 'lucide-react';
import { db } from '../services/db';
import { Badge, ContactRequest } from '../types';

interface MessageItemProps {
  msg: ContactRequest;
  onReply: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, onReply }) => {
    const { replyToRequest } = useGamification();
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const handleSend = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        const success = await replyToRequest(msg.id, replyText);
        setSending(false);
        if (success) {
            setIsReplying(false);
            onReply(); // Refresh list
        }
    };

    const isReplied = msg.status === 'replied' || !!msg.adminReply;

    return (
        <div className={`bg-slate-50 p-6 rounded-2xl border-2 transition-all ${isReplied ? 'border-green-100 bg-green-50/30' : 'border-slate-100 hover:border-blue-200'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                        msg.category === 'bug' ? 'bg-red-100 text-red-600' :
                        msg.category === 'suggestion' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {msg.category}
                    </span>
                    <span className="font-bold text-slate-700">From: {msg.userId}</span>
                    {isReplied && <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Replied</span>}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                    {new Date(msg.createdAt).toLocaleString()}
                </span>
            </div>
            
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
                {msg.message}
            </p>

            {isReplied ? (
                <div className="bg-white p-4 rounded-xl border border-green-200 mt-4">
                    <p className="text-xs font-bold text-green-600 uppercase mb-1 flex items-center gap-1">
                        <Reply size={12} /> Admin Reply
                    </p>
                    <p className="text-slate-600 text-sm">{msg.adminReply}</p>
                    {msg.repliedAt && <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date(msg.repliedAt).toLocaleString()}</p>}
                </div>
            ) : (
                <div className="mt-4">
                    {isReplying ? (
                        <div className="space-y-3 animate-fade-in">
                            <textarea 
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-fun-blue text-sm font-medium h-24 resize-none"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <Button variant="secondary" onClick={() => setIsReplying(false)} className="text-xs py-2">Cancel</Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSend} 
                                    isLoading={sending} 
                                    disabled={!replyText.trim()}
                                    className="text-xs py-2"
                                    icon={<Send size={14}/>}
                                >
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsReplying(true)}
                            className="text-fun-blue font-bold text-sm flex items-center gap-1 hover:underline"
                        >
                            <Reply size={16} /> Reply to User
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const AdminPanel: React.FC = () => {
  const { isAdmin, mode } = useGamification();
  const isKids = mode === 'kids';

  const [activeTab, setActiveTab] = useState<'badges' | 'messages'>('badges');
  
  // Badge State
  const [targetUser, setTargetUser] = useState('');
  const [badgeName, setBadgeName] = useState('');
  const [badgeDesc, setBadgeDesc] = useState('Awarded for excellent performance.');
  const [badgeIcon, setBadgeIcon] = useState('🌟');
  const [badgeColor, setBadgeColor] = useState('bg-blue-500');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | 'idle'; msg: string }>({ type: 'idle', msg: '' });

  // Message State
  const [messages, setMessages] = useState<ContactRequest[]>([]);

  const fetchMessages = () => {
      db.getContactRequests().then(setMessages);
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'messages') {
        fetchMessages();
    }
  }, [isAdmin, activeTab]);

  if (!isAdmin) {
      return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-10 space-y-4">
              <ShieldCheck size={80} className="text-slate-300" />
              <h2 className="text-3xl font-bold text-slate-800">Access Denied</h2>
              <p className="text-slate-500">You do not have permission to view the Admin Panel.</p>
          </div>
      );
  }

  const handleGrantBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !badgeName) return;

    // Normalize ID to match Login logic (lowercase, snake_case)
    const normalizedUserId = targetUser.trim().toLowerCase().replace(/\s+/g, '_');

    setStatus({ type: 'loading', msg: `Saving badge to database for '${normalizedUserId}'...` });

    const newBadge: Badge = {
        id: `custom_badge_${Date.now()}`,
        name: badgeName,
        description: badgeDesc,
        icon: badgeIcon,
        color: badgeColor,
        category: 'general',
        earnedAt: new Date().toISOString(),
        image: imageUrl || undefined
    };

    const result = await db.grantBadgeToUser(normalizedUserId, newBadge);
    
    if (result.success) {
        setStatus({ type: 'success', msg: result.message });
        // Reset form slightly, keep user to allow multi-grant
        setBadgeName('');
    } else {
        setStatus({ type: 'error', msg: result.message });
    }
  };

  const BadgePreview = () => (
    <div className={`w-32 h-32 rounded-3xl border-4 border-white/20 shadow-xl flex flex-col items-center justify-center text-center p-2 relative overflow-hidden ${badgeColor}`}>
        {imageUrl ? (
            <img src={imageUrl} alt="preview" className="w-16 h-16 object-contain drop-shadow-md mb-1" />
        ) : (
            <div className="text-5xl drop-shadow-md mb-1">{badgeIcon}</div>
        )}
        <span className="text-white font-black text-xs uppercase leading-tight drop-shadow-sm z-10">{badgeName || 'Badge Name'}</span>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
       <div className="flex items-center justify-between border-b border-slate-200 pb-6">
           <div className="flex items-center gap-4">
               <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-slate-800">Admin Control Panel</h2>
                  <p className="text-slate-500 font-bold">Manage users and grant special rewards.</p>
               </div>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                  onClick={() => setActiveTab('badges')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'badges' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
               >
                   Badges
               </button>
               <button 
                  onClick={() => setActiveTab('messages')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'messages' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
               >
                   Messages
               </button>
           </div>
       </div>

       {activeTab === 'badges' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Form Section */}
               <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-slate-100">
                   <h3 className="font-black text-xl text-slate-700 mb-6 flex items-center gap-2">
                       <Award className="text-fun-blue" /> Create & Grant Badge
                   </h3>

                   <form onSubmit={handleGrantBadge} className="space-y-4">
                       <div>
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Target User ID</label>
                           <div className="relative">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                               <input 
                                    value={targetUser}
                                    onChange={e => setTargetUser(e.target.value)}
                                    placeholder="e.g. student_alex"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                               />
                           </div>
                           <p className="text-[10px] text-slate-400 mt-1 pl-1">ID will be normalized (e.g. "Alex Smith" &rarr; "alex_smith")</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Badge Name</label>
                                <input 
                                        value={badgeName}
                                        onChange={e => setBadgeName(e.target.value)}
                                        placeholder="Super Star"
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors"
                                />
                           </div>
                           <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Icon (Emoji)</label>
                                <input 
                                        value={badgeIcon}
                                        onChange={e => setBadgeIcon(e.target.value)}
                                        placeholder="🌟"
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 text-center outline-none focus:border-fun-blue transition-colors"
                                />
                           </div>
                       </div>

                       <div>
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                           <textarea 
                                value={badgeDesc}
                                onChange={e => setBadgeDesc(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-600 outline-none focus:border-fun-blue transition-colors h-24 resize-none"
                           />
                       </div>

                       <div>
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Background Color</label>
                           <select 
                                value={badgeColor}
                                onChange={e => setBadgeColor(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-fun-blue transition-colors cursor-pointer"
                           >
                               <option value="bg-blue-500">Blue</option>
                               <option value="bg-red-500">Red</option>
                               <option value="bg-green-500">Green</option>
                               <option value="bg-yellow-400">Yellow</option>
                               <option value="bg-purple-500">Purple</option>
                               <option value="bg-pink-500">Pink</option>
                               <option value="bg-slate-800">Black/Dark</option>
                               <option value="bg-gradient-to-br from-purple-500 to-pink-500">Magic Gradient</option>
                               <option value="bg-gradient-to-r from-yellow-400 to-orange-500">Gold Gradient</option>
                               <option value="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 animate-gradient-xy bg-[length:200%_200%]">Moving Galaxy</option>
                               <option value="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient-xy bg-[length:200%_200%]">Moving Fire</option>
                               <option value="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 animate-gradient-xy bg-[length:200%_200%]">Moving Ocean</option>
                               <option value="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-xy bg-[length:200%_200%]">Moving Sunset</option>
                           </select>
                       </div>
                       
                       <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Image URL (Optional)</label>
                            <input 
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 font-medium text-slate-600 outline-none focus:border-fun-blue transition-colors text-sm"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">If provided, replaces the emoji icon.</p>
                       </div>

                       <div className="pt-4">
                           <Button 
                                type="submit" 
                                variant="success" 
                                className="w-full justify-center py-4 text-lg" 
                                isLoading={status.type === 'loading'}
                                disabled={!targetUser || !badgeName}
                            >
                                <Award className="mr-2" /> Grant Badge
                           </Button>
                       </div>
                       
                       {status.type !== 'idle' && (
                           <div className={`p-4 rounded-xl flex items-center gap-2 font-bold ${
                               status.type === 'success' ? 'bg-green-100 text-green-600' : 
                               status.type === 'error' ? 'bg-red-100 text-red-600' : 
                               'bg-blue-50 text-blue-600'
                           }`}>
                               {status.type === 'success' && <CheckCircle size={20} />}
                               {status.type === 'error' && <AlertTriangle size={20} />}
                               {status.type === 'loading' && <RefreshCw size={20} className="animate-spin" />}
                               {status.msg}
                           </div>
                       )}
                   </form>
               </div>

               {/* Preview Section */}
               <div className="space-y-6">
                   <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl text-center">
                       <h3 className="font-black text-xl mb-6 uppercase tracking-widest opacity-60">Live Preview</h3>
                       <div className="flex justify-center mb-6">
                           <BadgePreview />
                       </div>
                       <p className="text-slate-400 text-sm">
                           This is how the badge will appear in the user's dashboard and trophy case.
                       </p>
                   </div>
                   
                   <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100">
                       <h4 className="font-black text-blue-800 mb-2">Instructions</h4>
                       <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside font-medium">
                           <li>Enter the exact <strong>User ID</strong> the student uses to log in.</li>
                           <li>Badges are awarded immediately.</li>
                           <li>The user will receive +500 XP bonus.</li>
                           <li>Custom badges appear in the "General" category.</li>
                       </ul>
                   </div>
               </div>
           </div>
       )}

       {activeTab === 'messages' && (
           <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-slate-100 min-h-[400px]">
               <h3 className="font-black text-xl text-slate-700 mb-6 flex items-center gap-2">
                   <Mail className="text-fun-blue" /> Inbox
               </h3>

               {messages.length === 0 ? (
                   <div className="text-center py-20 text-slate-400 font-bold">
                       <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                       No messages found.
                   </div>
               ) : (
                   <div className="space-y-4">
                       {messages.map((msg) => (
                           <MessageItem key={msg.id} msg={msg} onReply={fetchMessages} />
                       ))}
                   </div>
               )}
           </div>
       )}
    </div>
  );
};

export default AdminPanel;