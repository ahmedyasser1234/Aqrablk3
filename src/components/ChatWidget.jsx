import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { SOCKET_URL } from '../config';

const ChatWidget = () => {
    const { t, language } = useLanguage();
    const location = useLocation();

    // Hide if on Admin Messages dashboard (to prevent overlap)
    if (location.pathname.includes('/dashboard/messages')) return null;
    const [isOpen, setIsOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [hasUnread, setHasUnread] = useState(false);

    // Admin specific states
    const [isAdmin, setIsAdmin] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);

    const socketRef = useRef(null);
    const containerRef = useRef(null);

    // Detect if current user is admin
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsAdmin(!!token);
    }, [isOpen]); // Re-check when opening

    const [visitorId] = useState(() => {
        let id = localStorage.getItem('chat_visitor_id');
        if (!id) {
            id = 'v_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_visitor_id', id);
        }
        return id;
    });

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedVisitorId]);

    // Socket Management
    useEffect(() => {
        if (!isOpen) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const token = localStorage.getItem('auth_token');
        const role = token ? 'admin' : 'visitor';

        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                withCredentials: true,
                query: token ? { role: 'admin' } : { visitorId }
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                if (!token) {
                    socketRef.current.emit('joinChat', { name: 'Visitor', visitorId });
                }
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
                setIsAdminOnline(false);
            });

            // Visitor listeners
            socketRef.current.on('adminStatus', (data) => {
                if (!token) setIsAdminOnline(data.online);
            });

            socketRef.current.on('receiveMessage', (msg) => {
                if (!token) {
                    setMessages((prev) => [...prev, msg]);
                }
            });

            // Admin listeners
            socketRef.current.on('activeSessions', (data) => {
                if (token) setSessions(Array.isArray(data) ? data : []);
            });

            socketRef.current.on('chatHistory', (history) => {
                setMessages(Array.isArray(history) ? history : []);
            });

            socketRef.current.on('receiveAdminMessage', (msg) => {
                if (token && msg.sessionId === selectedVisitorId) {
                    setMessages(prev => [...prev, msg]);
                }
            });
        }

        return () => {
            // Cleanup listeners but keep socket if we want (or just disconnect on close)
            if (socketRef.current) {
                socketRef.current.off('adminStatus');
                socketRef.current.off('receiveMessage');
                socketRef.current.off('activeSessions');
                socketRef.current.off('chatHistory');
                socketRef.current.off('receiveAdminMessage');
            }
        };
    }, [isOpen, isAdmin, visitorId, selectedVisitorId]);

    // Fetch history for admin when visitor is selected
    useEffect(() => {
        if (isAdmin && selectedVisitorId && socketRef.current) {
            socketRef.current.emit('adminGetHistory', { visitorId: selectedVisitorId });
        }
    }, [selectedVisitorId, isAdmin]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current) return;

        if (isAdmin) {
            if (!selectedVisitorId) return;
            socketRef.current.emit('adminReply', { visitorId: selectedVisitorId, text: input });
            const optimisticMsg = { sender: 'admin', text: input, timestamp: new Date() };
            setMessages(prev => [...prev, optimisticMsg]);
        } else {
            socketRef.current.emit('sendMessage', { text: input, visitorId });
        }
        setInput('');
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setHasUnread(false);
    };

    return (
        <div className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-[9999] flex flex-col items-end`}>
            {isOpen && (
                <div className="bg-[#15182b] border border-white/10 rounded-2xl w-80 md:w-96 h-[500px] mb-4 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl animate-in slide-in-from-bottom-4 duration-300">

                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center relative overflow-hidden h-20 shadow-lg">
                        <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors relative z-10 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="flex-1 text-end relative z-10 pr-2">
                            <h3 className="text-white font-black text-lg tracking-tight">
                                {isAdmin ? (selectedVisitorId ? sessions.find(s => s.id === selectedVisitorId)?.name || t('chat.visitor') : t('chat.inbox')) : t('chat.title')}
                            </h3>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                {isAdmin ? (
                                    selectedVisitorId && (
                                        <button onClick={() => setSelectedVisitorId(null)} className="text-[10px] text-white/90 font-bold underline bg-white/10 px-2 py-0.5 rounded-md">
                                            {language === 'ar' ? 'رجوع للصندوق' : 'Back to Inbox'}
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">
                                            {isAdminOnline ? 'الدعم متصل' : 'بوت الرد الآلي'}
                                        </span>
                                        <span className={`h-2 w-2 rounded-full ${isAdminOnline ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-gray-400'}`}></span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-black/20">
                        {isAdmin && !selectedVisitorId ? (
                            // Admin Inbox View
                            <div className="space-y-2">
                                {sessions.length === 0 ? (
                                    <p className="text-gray-500 text-center text-xs mt-20">{language === 'ar' ? 'لا توجد محادثات نشطة' : 'No active conversations'}</p>
                                ) : (
                                    sessions.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => setSelectedVisitorId(s.id)}
                                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-all flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{s.name || t('chat.visitor')}</h4>
                                                <p className="text-[10px] text-gray-500 font-mono">ID: {s.id.slice(-6)}</p>
                                            </div>
                                            {s.unread > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full pulse">{s.unread}</span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Chat View (Visitor or Admin responding to a specific visitor)
                            <>
                                {messages.length === 0 && <p className="text-gray-500 text-center text-xs mt-20 italic">{language === 'ar' ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</p>}
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${(isAdmin ? msg.sender === 'admin' : msg.sender === 'user') ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${(isAdmin ? msg.sender === 'admin' : msg.sender === 'user')
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-sm'
                                            }`}>
                                            <div className="text-[8px] opacity-40 mb-1 font-black uppercase">
                                                {msg.sender === 'admin' ? t('chat.support') : (msg.sender === 'bot' ? 'Assistant' : t('chat.visitor'))}
                                            </div>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Input (only shown in chat view) */}
                    {(!isAdmin || selectedVisitorId) && (
                        <form onSubmit={sendMessage} className="p-4 border-t border-white/5 flex gap-2 bg-[#15182b]">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isAdmin ? t('chat.typing') : t('chat.placeholder')}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.493-7.493Z" /></svg>
                            </button>
                        </form>
                    )}
                </div>
            )}

            <button onClick={toggleChat} className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-[0_5px_25px_rgba(37,99,235,0.5)] transition-all hover:scale-110 active:scale-95 relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" /></svg>
                {hasUnread && <span className="absolute -top-1 -right-1 block h-3 w-3 md:h-4 md:w-4 rounded-full border-2 border-[#0d0e1b] bg-red-500 animate-bounce" />}
                {isAdmin && <span className="absolute -top-1.5 -left-1.5 bg-yellow-500 text-black text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-md">Admin</span>}
            </button>
        </div>
    );
};

export default ChatWidget;
