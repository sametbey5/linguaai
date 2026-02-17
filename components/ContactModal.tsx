
import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import Button from './Button';
import { X, Send, HelpCircle, MessageCircle, Bug, Inbox, Reply } from 'lucide-react';
import { ContactRequest } from '../types';
import { db } from '../services/db';

const ContactModal: React.FC = () => {
  const { isContactOpen, setIsContactOpen, mode, sendAdminMessage, userId } = useGamification();
  const [activeTab, setActiveTab] = useState<'write' | 'inbox'>('write');
  
  // Write State
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<ContactRequest['category']>('help');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Inbox State
  const [userMessages, setUserMessages] = useState<ContactRequest[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  const isKids = mode === 'kids';

  useEffect(() => {
    if (isContactOpen && activeTab === 'inbox' && userId) {
      setLoadingInbox(true);
      db.getUserRequests(userId).then(msgs => {
        setUserMessages(msgs);
        setLoadingInbox(false);
      });
    }
  }, [isContactOpen, activeTab, userId]);

  if (!isContactOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    const success = await sendAdminMessage(message, category);
    setIsSending(false);
    
    if (success) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setActiveTab('inbox'); // Switch to inbox to see new message
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsContactOpen(false)}>
      <div 
        className={`relative w-full max-w-lg ${isKids ? 'bg-white rounded-[2.5rem] border-8 border-slate-100' : 'bg-white rounded-xl border border-slate-200'} shadow-2xl p-8 max-h-[80vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsContactOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${isKids ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' : 'text-slate-400 hover:bg-slate-50'}`}
        >
           <X size={24} />
        </button>

        {/* Header Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-100 pb-1">
            <button 
                onClick={() => setActiveTab('write')}
                className={`pb-3 font-black text-sm uppercase transition-colors relative ${activeTab === 'write' ? 'text-fun-blue' : 'text-slate-400 hover:text-slate-600'}`}
            >
                New Message
                {activeTab === 'write' && <div className="absolute bottom-0 left-0 w-full h-1 bg-fun-blue rounded-full" />}
            </button>
            <button 
                onClick={() => setActiveTab('inbox')}
                className={`pb-3 font-black text-sm uppercase transition-colors relative ${activeTab === 'inbox' ? 'text-fun-blue' : 'text-slate-400 hover:text-slate-600'}`}
            >
                My Inbox
                {activeTab === 'inbox' && <div className="absolute bottom-0 left-0 w-full h-1 bg-fun-blue rounded-full" />}
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'write' && (
                sent ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pop">
                            <Send size={40} />
                        </div>
                        <h3 className={`text-2xl font-black ${isKids ? 'text-slate-800' : 'text-slate-700'}`}>Message Sent!</h3>
                        <p className="text-slate-500 font-bold mt-2">The admin will see it soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <h3 className={`text-3xl font-black mb-2 ${isKids ? 'text-fun-blue' : 'text-slate-800'}`}>
                                {isKids ? 'Ask for Help!' : 'Contact Support'}
                            </h3>
                            <p className="text-slate-500 font-bold">
                                {isKids ? 'Tell us what you need or find a bug.' : 'Send a direct message to the administration.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'help', label: 'Help', icon: <HelpCircle size={20}/> },
                                { id: 'suggestion', label: 'Idea', icon: <MessageCircle size={20}/> },
                                { id: 'bug', label: 'Bug', icon: <Bug size={20}/> }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id as any)}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm ${
                                        category === cat.id 
                                        ? isKids ? 'bg-fun-blue text-white border-fun-blue shadow-lg scale-105' : 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <textarea 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={isKids ? "Type your message here..." : "Describe your issue or suggestion..."}
                                className={`w-full h-32 p-4 rounded-xl resize-none outline-none transition-all ${isKids ? 'bg-slate-50 border-4 border-slate-100 focus:border-fun-blue text-lg font-bold text-slate-700 placeholder:text-slate-300' : 'bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700'}`}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            variant={isKids ? "primary" : "pro-primary"} 
                            className="w-full py-4 text-lg"
                            isLoading={isSending}
                            disabled={!message.trim()}
                            icon={<Send />}
                        >
                            Send Message
                        </Button>
                    </form>
                )
            )}

            {activeTab === 'inbox' && (
                <div className="space-y-4">
                    {loadingInbox ? (
                        <div className="text-center py-10 text-slate-400">Loading messages...</div>
                    ) : userMessages.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                            <Inbox size={48} className="mb-2 opacity-50" />
                            <p className="font-bold">No messages yet.</p>
                        </div>
                    ) : (
                        userMessages.map(msg => (
                            <div key={msg.id} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        msg.category === 'bug' ? 'bg-red-100 text-red-600' :
                                        msg.category === 'suggestion' ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {msg.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-600 font-bold text-sm mb-3">"{msg.message}"</p>
                                
                                {msg.adminReply ? (
                                    <div className="bg-white p-3 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-2 mb-1 text-green-600 text-xs font-black uppercase">
                                            <Reply size={12} /> Admin Replied
                                        </div>
                                        <p className="text-slate-700 text-sm">{msg.adminReply}</p>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 italic">Waiting for reply...</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
