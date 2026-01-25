import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useLanguage } from '../context/LanguageContext';
import { SOCKET_URL } from '../config';

const AdminChatPanel = ({ token }) => {
    const { t, language } = useLanguage();
    const [sessions, setSessions] = useState([]);
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef(null);
    const containerRef = useRef(null);

    // Controlled scroll only for the container
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socketRef.current && token) {
            socketRef.current = io(SOCKET_URL, {
                autoConnect: false,
                transports: ['websocket', 'polling'],
                withCredentials: true,
                query: { role: 'admin' }
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
            });

            socketRef.current.on('activeSessions', (data) => {
                setSessions(Array.isArray(data) ? data : []);
            });

            socketRef.current.on('chatHistory', (history) => {
                setMessages(Array.isArray(history) ? history : []);
            });

            socketRef.current.connect();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [token]);

    // Request Notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const showNotification = (msg) => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        // Don't notify if tab is focused and user is already looking at this exact chat
        if (!document.hidden && msg.sessionId === selectedVisitorId) return;

        const visitor = sessions.find(s => s.id === msg.sessionId);
        const name = visitor?.name || t('chat.visitor');

        new Notification(language === 'ar' ? 'رسالة جديدة من ' + name : 'New message from ' + name, {
            body: msg.text,
            icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png'
        });
    };

    // Update messages in real-time
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleNewMsg = (msg) => {
            // Trigger browser notification for all visitor messages
            if (msg.sender !== 'admin' && msg.sender !== 'bot') {
                showNotification(msg);
            }

            if (msg.sessionId === selectedVisitorId) {
                setMessages(prev => [...prev, msg]);
                socket.emit('markAsRead', { visitorId: selectedVisitorId });
            }
        };

        socket.on('receiveAdminMessage', handleNewMsg);
        return () => {
            if (socket) socket.off('receiveAdminMessage', handleNewMsg);
        };
    }, [selectedVisitorId, sessions, language]);

    // Fetch history when selection changes
    useEffect(() => {
        if (selectedVisitorId && socketRef.current) {
            socketRef.current.emit('adminGetHistory', { visitorId: selectedVisitorId });
        } else {
            setMessages([]);
        }
    }, [selectedVisitorId]);

    const sendReply = (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedVisitorId || !socketRef.current) return;

        socketRef.current.emit('adminReply', { visitorId: selectedVisitorId, text: reply });
        const optimisticMsg = { sender: 'admin', text: reply, timestamp: new Date() };
        setMessages(prev => [...prev, optimisticMsg]);
        setReply('');
    };

    const clearChat = () => {
        if (!selectedVisitorId || !socketRef.current) return;
        if (window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح المحادثة؟' : 'Are you sure you want to clear this conversation?')) {
            socketRef.current.emit('clearChat', { visitorId: selectedVisitorId });
            setSelectedVisitorId(null);
        }
    };

    const selectedSession = sessions.find(s => s.id === selectedVisitorId);

    return (
        <div className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-4 md:p-6 backdrop-blur-2xl mt-12 min-h-[500px] h-[75vh] lg:h-[650px] flex overflow-hidden shadow-2xl relative ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'} gap-0 lg:gap-10`}>

            {/* Sidebar / Inbox List */}
            <div className={`w-full lg:w-1/3 border-b lg:border-r lg:border-b-0 border-white/10 lg:pr-4 overflow-y-auto custom-scrollbar transition-all duration-300 ${selectedVisitorId ? 'hidden lg:block' : 'block animate-in slide-in-from-left-4'}`}>
                <div className="flex justify-between items-center mb-6 px-2 sticky top-0 bg-[#0d0e1b]/80 backdrop-blur-md py-2 z-10">
                    <h2 className={`text-xl lg:text-2xl font-black text-white flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        {t('chat.inbox')}
                    </h2>
                </div>

                <div className="space-y-3 pb-4">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedVisitorId(session.id)}
                            className={`p-4 md:p-5 rounded-3xl cursor-pointer transition-all duration-300 relative group ${selectedVisitorId === session.id ? 'bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-white">{session.name || t('chat.visitor')}</h4>
                                    <p className={`text-[9px] uppercase font-mono ${selectedVisitorId === session.id ? 'text-blue-100' : 'text-gray-500'}`}>ID: {session.id?.slice(-6) || 'N/A'}</p>
                                </div>
                                {session.unread > 0 && selectedVisitorId !== session.id && (
                                    <div className="bg-red-500 text-white text-[10px] font-black min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 shadow-lg">
                                        {session.unread}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="py-20 text-center opacity-30 italic text-sm">{language === 'ar' ? 'لا توجد محادثات نشطة' : 'No active chats'}</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl lg:rounded-[2.5rem] overflow-hidden ${!selectedVisitorId ? 'hidden lg:flex items-center justify-center opacity-40' : 'flex animate-in slide-in-from-right-4'}`}>
                {selectedSession ? (
                    <>
                        <div className="p-3 md:p-5 border-b border-white/10 flex flex-wrap gap-2 justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                <button
                                    onClick={() => setSelectedVisitorId(null)}
                                    className="flex items-center gap-1 bg-white/5 hover:bg-white/10 p-2 px-3 lg:px-4 rounded-xl text-white transition-all border border-white/5 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                    <span className="text-xs font-bold">{language === 'ar' ? 'رجوع' : 'Back'}</span>
                                </button>
                                <h3 className="font-black text-sm md:text-xl text-white truncate max-w-[100px] md:max-w-none">{selectedSession.name || t('chat.visitor')}</h3>
                            </div>
                            <button
                                onClick={clearChat}
                                className="text-[9px] md:text-xs bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 md:gap-2 font-black uppercase flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>
                                <span>{t('chat.clear_btn')}</span>
                            </button>
                        </div>

                        <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 custom-scrollbar p-6 bg-gradient-to-b from-black/20 to-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] lg:max-w-[70%] p-3 px-5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>
                                        <div className="mb-1 text-[9px] opacity-40 font-black uppercase tracking-widest">{msg.sender === 'bot' ? 'Assistant' : (msg.sender === 'admin' ? t('chat.support') : t('chat.visitor'))}</div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendReply} className="p-3 md:p-6 bg-white/5 border-t border-white/10 flex gap-2 md:gap-3">
                            <input
                                type="text"
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white text-sm md:text-base placeholder:text-gray-600 outline-none focus:border-blue-500 min-w-0"
                                placeholder={t('chat.typing')}
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-lg flex-shrink-0 flex items-center justify-center">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
                        <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                        <p className="text-gray-500">{t('chat.no_messages')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPanel;
