import React, { useState, useRef, useEffect } from 'react';

const DEPT_COLORS = {
    'Video Editing': { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500', border: 'border-purple-500/30' },
    'Photography': { bg: 'bg-pink-500/20', text: 'text-pink-400', dot: 'bg-pink-500', border: 'border-pink-500/30' },
    'Web Development': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500', border: 'border-blue-500/30' },
    'Social Media': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500', border: 'border-green-500/30' },
};

const DEPT_ICONS = {
    'Video Editing': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    ),
    'Photography': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    'Web Development': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    ),
    'Social Media': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
    ),
};

const renderDeptIcon = (icon) => {
    if (!icon) return '📁';
    if (typeof icon === 'string') {
        if (icon.startsWith('M')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
                </svg>
            );
        }
        return <span className="text-xl">{icon}</span>;
    }
    return icon; // Already a JSX element
};

export { DEPT_COLORS, DEPT_ICONS, renderDeptIcon };

const InternalSidebar = ({ activeTab, setActiveTab, user, onLogout, notifications = [], unreadCount = 0, onMarkRead, onMarkAllRead, theme, toggleTheme, soundEnabled, toggleSound, onTestNotif, isOpen, setIsOpen }) => {
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifs && notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifs]);
    const menuItems = [
        {
            id: 'dashboard', label: 'لوحة التحكم',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        },
        {
            id: 'tasks', label: 'المهام',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        },
        {
            id: 'chat', label: 'المحادثات',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        },
        {
            id: 'settings', label: 'الإعدادات',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        },
    ];

    if (user.role === 'Admin' || user.role === 'Chairman') {
        menuItems.push({
            id: 'employees', label: 'الموظفون',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        });
    }

    const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1e3a5f&textColor=60a5fa`;

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = Math.max(0, new Date() - new Date(dateStr));
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'الآن';
        if (mins < 60) return `منذ ${mins} د`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `منذ ${hrs} س`;
        return `منذ ${Math.floor(hrs / 24)} ي`;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:relative inset-y-0 right-0 z-50
                w-[280px] lg:w-60 h-screen flex flex-col 
                bg-[var(--bg-sidebar)] border-l border-[var(--border-main)] 
                shrink-0 transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between lg:justify-start px-4 border-b border-[var(--border-main)] shrink-0 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/20 shrink-0 text-white">A</div>
                        <div>
                            <p className="text-sm font-black leading-none text-[var(--text-main)]">أقربلك ميديا</p>
                            <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mt-0.5">Internal</p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 lg:hidden text-[var(--text-dim)] hover:text-[var(--text-main)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setShowNotifs(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-[0_8px_24px_var(--shadow-btn)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                                }`}
                        >
                            <span className={`shrink-0 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} relative`}>
                                {item.icon}
                                {/* Unread Indicator dot for Tasks/Chat */}
                                {(item.id === 'tasks' || item.id === 'chat') && notifications.some(n => !n.isRead && (
                                    (item.id === 'tasks' && n.type === 'task') ||
                                    (item.id === 'chat' && n.type === 'message')
                                )) && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-sidebar)]" />
                                    )}
                            </span>
                            <span className={`${isOpen ? 'block' : 'hidden lg:block'} text-sm font-bold`}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Notifications & User section */}
                <div ref={notifRef} className="p-3 border-t border-[var(--border-main)] space-y-2 shrink-0 relative">
                    {/* Notification Dropdown */}
                    {showNotifs && (
                        <div
                            className="absolute bottom-full right-12 w-96 mb-4 bg-[var(--bg-sidebar)]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 z-50 ring-1 ring-white/10"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.03]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                                    <h3 className="text-base font-black text-[var(--text-main)] tracking-tight">الإشعارات</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">{unreadCount} جديد</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onMarkAllRead(); }}
                                        className="text-[11px] text-[var(--text-dim)] hover:text-blue-400 font-bold transition-colors"
                                    >
                                        تعيين الكل كمقروء
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-[480px] overflow-y-auto custom-scrollbar bg-black/10">
                                {notifications.length === 0 ? (
                                    <div className="p-16 text-center flex flex-col items-center gap-5">
                                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                        </div>
                                        <p className="text-[13px] text-[var(--text-dim)] font-black uppercase tracking-[0.2em] opacity-40">صندوق الإشعارات فارغ</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <button
                                            key={notif.id}
                                            onClick={() => {
                                                onMarkRead(notif.id);
                                                if (notif.link) {
                                                    const [tab, sub] = notif.link.split('/');
                                                    setActiveTab(tab, sub);
                                                }
                                                setShowNotifs(false);
                                            }}
                                            className={`w-full text-right p-6 border-b border-white/5 hover:bg-white/[0.06] transition-all relative flex gap-5 items-start ${!notif.isRead ? 'bg-blue-500/[0.03]' : ''}`}
                                        >
                                            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${notif.type === 'task' ? 'bg-orange-500 linear-gradient(135deg, #f97316 0%, #ea580c 100%) text-white shadow-orange-500/20' : 'bg-blue-600 linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) text-white shadow-blue-500/20'}`}>
                                                {notif.type === 'task' ? (
                                                    <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                ) : (
                                                    <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-500">{notif.type === 'task' ? 'مهمة' : 'رسالة'}</p>
                                                    <span className="text-[10px] text-[var(--text-dim)] font-bold">{timeAgo(notif.createdAt)}</span>
                                                </div>
                                                <h4 className="text-[14px] font-black text-[var(--text-main)] mb-1 leading-tight truncate">{notif.title}</h4>
                                                <p className="text-[12px] text-[var(--text-muted)] font-bold leading-relaxed line-clamp-2 opacity-80">{notif.message}</p>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-pulse" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notif Bell */}
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all group ${showNotifs ? 'bg-[var(--bg-card-hover)] text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'}`}
                    >
                        <div className="relative shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[var(--bg-sidebar)]">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <span className={`${isOpen ? 'block' : 'hidden lg:block'} text-xs font-bold uppercase tracking-widest`}>الإشعارات</span>
                    </button>

                    {/* Sound Toggle */}
                    <button
                        onClick={toggleSound}
                        className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-all group"
                    >
                        <div className="relative shrink-0 transition-transform duration-300">
                            {soundEnabled ? (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                            )}
                        </div>
                        <span className={`${isOpen ? 'block' : 'hidden lg:block'} text-xs font-bold uppercase tracking-widest`}>{soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-all group"
                    >
                        <div className="relative shrink-0 transition-transform duration-300 group-hover:rotate-45">
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </div>
                        <span className={`${isOpen ? 'block' : 'hidden lg:block'} text-xs font-bold uppercase tracking-widest`}>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}</span>
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`${isOpen ? 'flex' : 'hidden lg:flex'} items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-transparent'}`}
                    >
                        <img src={avatarUrl} className="w-8 h-8 rounded-lg shrink-0 object-cover" alt={user.name} />
                        <div className="min-w-0 text-right">
                            <p className="text-sm font-black truncate leading-tight text-[var(--text-main)]">{user.name}</p>
                            <p className="text-[10px] text-[var(--text-dim)] font-bold truncate">
                                {user.role === 'Admin' ? 'مدير' : user.role === 'Chairman' ? 'مجلس الإدارة' : user.department}
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all group"
                    >
                        <svg className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className={`${isOpen ? 'block' : 'hidden lg:block'} text-xs font-bold uppercase tracking-widest`}>تسجيل خروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default InternalSidebar;
