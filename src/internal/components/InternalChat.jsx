import React, { useState, useEffect, useRef } from 'react';
import { API } from '../InternalSystem';

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

const avatarUrl = (name, customAvatar) =>
    customAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || '?')}&backgroundColor=1e3a5f&textColor=60a5fa`;

const formatDuration = (start, end) => {
    if (!start) return '00:00:00';
    const diff = Math.max(0, (end ? new Date(end) : new Date()) - new Date(start));
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const emojis = [
    // Happy & Pleased
    '😊', '😄', '😃', '😁', '🤩', '🥳', '🥰', '😍', '😘', '😋', '😌', '😏', '😎', '😜', '🤪',
    // Angry & Upset
    '😠', '😡', '🤬', '😤', '👿', '👺', '👹', '😒', '🙄', '😑', '😐', '🤨', '🧐',
    // Sad & Zaalan
    '😢', '😭', '☹️', '🙁', '😔', '😞', '😟', '😕', '😰', '😨', '😧', '😩', '😫', '😖', '😣',
    // Hurt & Broken (Magrouh/Mohmoum)
    '🤕', '🩹', '💔', '🤒', '🤢', '🤮', '🤧', '🫠', '😵‍💫', '🥺', '🙏', '🤲', '🥀', '🖤', '🏚️',
    // Hearts & Hands
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🤍', '💖', '💗', '💓', '💞', '💕', '💘', '💝', '💟',
    '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '💪', '🦾', '🤝',
    // Activities & Objects
    '✨', '⭐', '🌟', '💫', '🔥', '💥', '💢', '💦', '💨', '⚡', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '☃️', '🌬️', '🌊', '💧', '☔', '🚀', '📸', '📁'
];

const InternalChat = ({ user, employees = [], tasks = [], notifications = [], departments = [], onAccept, onComplete, selectedChatId, hideSidebar, onChatSelect, superadminOnline, chairmanOnline, socket, adminAvatar }) => {
    const [tick, setTick] = useState(0);
    const [activeChat, setActiveChat] = useState(() => {
        if (selectedChatId) return selectedChatId;
        const saved = localStorage.getItem('internal_activeChat');
        return saved || null;
    });
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', department: '', assignedTo: '', priority: 'normal', startTime: '', deadline: '' });
    
    // Custom Groups States
    const [customGroups, setCustomGroups] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', memberIds: [] });
    
    // UI states for new features
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const chatEndRef = useRef(null);
    const membersRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMembers && membersRef.current && !membersRef.current.contains(event.target)) {
                setShowMembers(false);
            }
            if (showEmojiPicker && 
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMembers, showEmojiPicker]);

    // Sync activeChat with prop or save to local storage
    useEffect(() => {
        if (selectedChatId) {
            setActiveChat(selectedChatId);
        }
    }, [selectedChatId]);

    useEffect(() => {
        if (activeChat) {
            localStorage.setItem('internal_activeChat', activeChat);
        } else {
            localStorage.removeItem('internal_activeChat');
        }
    }, [activeChat]);

    // Live timer
    useEffect(() => {
        const t = setInterval(() => setTick(p => p + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const fetchGroups = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API}/internal/chat-groups/user/${user.id}`);
            if (res.ok) setCustomGroups(await res.json());
        } catch { }
    };

    useEffect(() => {
        fetchGroups();
        const iv = setInterval(fetchGroups, 10000);
        return () => clearInterval(iv);
    }, [user?.id]);

    const fetchMessages = async () => {
        if (!activeChat) return;
        try {
            let url = '';
            if (activeChat === 'general') {
                url = `${API}/internal/messages/general`;
            } else if (activeChat.startsWith('dept_')) {
                const deptName = activeChat.replace('dept_', '');
                url = `${API}/internal/messages/dept/${deptName}`;
            } else if (activeChat.startsWith('customgroup_')) {
                const groupId = activeChat.replace('customgroup_', '');
                url = `${API}/internal/messages/group/${groupId}`;
            } else {
                url = `${API}/internal/messages/dm/${user.id}/${activeChat}`;
            }
            const res = await fetch(url);
            if (res.ok) setMessages(await res.json());
        } catch { }
    };

    useEffect(() => {
        setMessages([]);
        if (!activeChat) return;
        fetchMessages();
        const iv = setInterval(fetchMessages, 3000);
        return () => clearInterval(iv);
    }, [activeChat, user.id]);

    const markChatRead = async () => {
        if (!user || !activeChat || activeChat === 'general') return;
        try {
            await fetch(`${API}/internal/messages/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, peerId: activeChat })
            });
            // Also notify via socket for real-time update on the other side
            if (socket) {
                socket.emit('markRead', { userId: user.id, peerId: activeChat });
            }
        } catch { }
    };

    useEffect(() => {
        markChatRead();
    }, [activeChat, user.id, messages.length]); // Mark read when switching or new messages arrive

    // Listen for read updates from other users
    useEffect(() => {
        if (!socket) return;
        const handleRead = (payload) => {
            // If the other user read MY messages in current active chat
            if (payload.userId.toString() === activeChat && payload.peerId === user.id) {
                setMessages(prev => prev.map(m => m.senderId === user.id ? { ...m, isRead: true } : m));
            }
        };
        socket.on('messagesRead', handleRead);
        return () => socket.off('messagesRead', handleRead);
    }, [socket, activeChat, user.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark notifications as read
    useEffect(() => {
        if (!user) return;
        const link = activeChat === 'general' ? 'chat' : `chat/${activeChat}`;
        fetch(`${API}/internal/notifications/${user.id}/read-by-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link })
        }).catch(() => { });
    }, [activeChat, user.id]);

    const handleSend = async (e, customImage = null) => {
        if (e) e.preventDefault();
        if ((!inputText.trim() && !customImage) || sending) return;
        setSending(true);
        try {
            const res = await fetch(`${API}/internal/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: user.id,
                    senderName: user.name,
                    senderAvatar: user.avatar,
                    text: inputText.trim(),
                    image: customImage,
                    channel: activeChat === 'general' ? 'general' : 
                             activeChat.startsWith('dept_') ? 'dept' : 
                             activeChat.startsWith('customgroup_') ? 'group' : 'dm',
                    deptName: activeChat.startsWith('dept_') ? activeChat.replace('dept_', '') : null,
                    groupId: activeChat.startsWith('customgroup_') ? parseInt(activeChat.replace('customgroup_', '')) : null,
                    receiverId: (activeChat === 'general' || activeChat.startsWith('dept_') || activeChat.startsWith('customgroup_')) ? null : parseInt(activeChat),
                }),
            });
            if (res.ok) {
                setInputText('');
                await fetchMessages();
            }
        } finally {
            setSending(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch(`${API}/internal/employees/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (res.ok) {
                const { url } = await res.json();
                handleSend(null, url);
            }
        } catch (err) {
            console.error('Image upload failed', err);
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const emojis = [
        '😊', '😂', '😍', '😎', '🙌', '👍', '🔥', '✨', '💡', '✅',
        '🚀', '💻', '🎨', '📁', '📊', '📅', '⏰', '💬', '🔔', '📍',
        '⭐', '❤️', '🎉', '🤝', '💪', '🙏', '💯', '👋', '👀', '📱'
    ];

    const handleAcceptTask = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/accept`, { 
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: user.id })
        });
        if (res.ok) onAccept && onAccept(await res.json());
    };

    const handleCompleteTask = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/complete`, { method: 'PATCH' });
        if (res.ok) onComplete && onComplete(await res.json());
    };

    const handleVerifyTask = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/verify`, { method: 'PATCH' });
        if (res.ok) onComplete && onComplete(await res.json());
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const body = { ...newTask, assignedTo: parseInt(newTask.assignedTo) || null };
        const res = await fetch(`${API}/internal/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            setShowTaskModal(false);
            setNewTask({ title: '', description: '', department: '', assignedTo: '', priority: 'normal', startTime: '', deadline: '' });
            await fetchMessages(); // Fetch the auto-generated chat message right away
        }
        setSubmitting(false);
    };

    const handleClearChat = async () => {
        if (!window.confirm('هل أنت متأكد من مسح جميع الرسائل في هذه المحادثة؟')) return;
        try {
            const res = await fetch(`${API}/internal/messages/clear`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, peerId: activeChat })
            });
            if (res.ok) await fetchMessages();
        } catch { }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroup.name || newGroup.memberIds.length === 0) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/internal/chat-groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newGroup.name, 
                    adminId: user.id, 
                    memberIds: newGroup.memberIds.map(id => parseInt(id))
                })
            });
            if (res.ok) {
                setShowGroupModal(false);
                setNewGroup({ name: '', memberIds: [] });
                await fetchGroups();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المجموعة؟')) return;
        try {
            const res = await fetch(`${API}/internal/chat-groups/${groupId}/${user.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchGroups();
                if (activeChat === `customgroup_${groupId}`) {
                    setActiveChat(null);
                }
            }
        } catch { }
    };

    const activeName = !activeChat 
        ? ''
        : activeChat === 'general'
            ? 'القناة العامة'
            : activeChat.startsWith('dept_')
                ? `قناة قسم ${activeChat.replace('dept_', '')}`
                : activeChat.startsWith('customgroup_')
                    ? (customGroups.find(g => g.id.toString() === activeChat.replace('customgroup_', ''))?.name || 'مجموعة مخصصة')
                    : activeChat === '0'
                        ? 'المدير (الإدارة)'
                        : activeChat === '-1'
                            ? 'مجلس الإدارة'
                            : employees.length > 0 
                                ? (employees.find(e => e.id.toString() === activeChat)?.name || 'مستخدم غير معروف')
                                : 'جاري التحميل...';

    // Check if a specific chat has unread message notifications
    const hasUnread = (targetChat) => {
        if (targetChat === 'general') {
            return notifications.some(n => !n.isRead && n.type === 'message' && n.link === 'chat');
        }
        if (targetChat.startsWith('customgroup_')) {
            return notifications.some(n => !n.isRead && n.type === 'message' && n.link === `chat/${targetChat}`);
        }
        return notifications.some(n => !n.isRead && n.type === 'message' && n.link === `chat/${targetChat}`);
    };

    return (
        // Full-height flex row — fills whatever the parent gives it
        <div
            dir="rtl"
            className="flex gap-4 h-full overflow-hidden"
        >
            {/* ── Contacts list ── */}
            {!hideSidebar && (
                <div className={`
                    ${activeChat || selectedChatId ? 'hidden lg:flex' : 'flex'}
                    w-full lg:w-60 flex-shrink-0 bg-[var(--bg-card)] border border-[var(--border-main)] 
                    rounded-[20px] flex-col overflow-hidden
                `}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', flexShrink: 0 }}>
                        <p style={{ fontWeight: 900, fontSize: 15, color: 'var(--text-main)' }}>المحادثات</p>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* General */}
                        <ContactBtn
                            active={activeChat === 'general'}
                            onClick={() => { setActiveChat('general'); onChatSelect && onChatSelect(null); }}
                            avatar={
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    {hasUnread('general') && (
                                        <span style={{
                                            position: 'absolute', top: -3, right: -3,
                                            width: 12, height: 12, borderRadius: '50%',
                                            background: '#ef4444',
                                            border: '2px solid var(--bg-sidebar)',
                                            boxShadow: '0 0 10px #ef4444',
                                        }} />
                                    )}
                                </div>
                            }
                            name="القناة العامة"
                            sub="الفريق كله"
                        />

                        {/* Department Channels */}
                        <div style={{ padding: '12px 10px 4px', fontSize: 10, color: 'var(--text-dim)', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            قنوات الأقسام
                        </div>
                        {departments.filter(d => user.role === 'Admin' || user.role === 'Chairman' || d.name === user.department).map(dept => {
                            const isDeptOnline = employees.some(e => e.department === dept.name && e.status === 'online');
                            return (
                                <ContactBtn
                                    key={dept.id}
                                    active={activeChat === `dept_${dept.name}`}
                                    onClick={() => { setActiveChat(`dept_${dept.name}`); onChatSelect && onChatSelect(null); setShowMembers(false); }}
                                    avatar={
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="18" height="18" fill="none" stroke="#a855f7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            </div>
                                            {isDeptOnline && (
                                                <span style={{
                                                    position: 'absolute', bottom: -2, right: -2,
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: '#22c55e',
                                                    border: '2px solid var(--bg-sidebar)',
                                                }} />
                                            )}
                                        </div>
                                    }
                                    name={dept.name}
                                    sub="مجموعة القسم"
                                />
                            );
                        })}

                        {/* Custom Groups Section */}
                        <div style={{ padding: '12px 10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                المجموعات المخصصة
                            </span>
                            {user.role === 'Admin' && (
                                <button 
                                    onClick={() => setShowGroupModal(true)}
                                    className="p-1 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                                    title="إنشاء مجموعة جديدة"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {customGroups.map(group => (
                                <div key={group.id} className="relative group/chatitem">
                                    <ContactBtn
                                        active={activeChat === `customgroup_${group.id}`}
                                        onClick={() => { setActiveChat(`customgroup_${group.id}`); onChatSelect && onChatSelect(null); setShowMembers(false); }}
                                        avatar={
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="18" height="18" fill="none" stroke="#22c55e" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                        }
                                        name={group.name}
                                        sub={`${group.memberIds?.length || 0} أعضاء`}
                                    />
                                    {user.role === 'Admin' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 opacity-0 group-hover/chatitem:opacity-100 transition-all z-10"
                                            title="حذف المجموعة"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                    {hasUnread(`customgroup_${group.id}`) && (
                                        <span style={{
                                            position: 'absolute', top: 12, right: 36,
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: '#ef4444', border: '2px solid var(--bg-sidebar)',
                                            boxShadow: '0 0 10px #ef4444',
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '12px 10px 4px', fontSize: 10, color: 'var(--text-dim)', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            رسائل مباشرة
                        </div>
                        {(user.role === 'Employee' || user.role === 'Chairman') && (
                                    <ContactBtn
                                        active={activeChat === '0'}
                                        onClick={() => { setActiveChat('0'); onChatSelect && onChatSelect('0'); }}
                                        avatar={
                                            <div style={{ position: 'relative' }}>
                                                <img 
                                                    src={avatarUrl('المدير', adminAvatar)} 
                                                    className="w-9 h-9 rounded-xl object-cover" 
                                                    alt="المدير" 
                                                    style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
                                                />
                                                {hasUnread('0') && (
                                                    <span style={{
                                                        position: 'absolute', top: -3, right: -3,
                                                        width: 12, height: 12, borderRadius: '50%',
                                                        background: '#ef4444',
                                                        border: '2px solid var(--bg-sidebar)',
                                                        boxShadow: '0 0 10px #ef4444',
                                                    }} />
                                                )}
                                                <span style={{
                                                    position: 'absolute', bottom: -2, right: -2,
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: superadminOnline ? '#22c55e' : '#6b7280',
                                                    border: '2px solid var(--bg-sidebar)',
                                                }} />
                                            </div>
                                        }
                                        name="المدير (الإدارة)"
                                        sub={superadminOnline ? 'متصل الآن' : 'غير متصل'}
                                    />
                        )}

                        {/* Board of Directors (Chairman) */}
                        {user.role !== 'Chairman' && (
                                    <ContactBtn
                                        active={activeChat === '-1'}
                                        onClick={() => { setActiveChat('-1'); onChatSelect && onChatSelect('-1'); }}
                                        avatar={
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234,88,12,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg width="18" height="18" fill="none" stroke="#ea580c" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                {hasUnread('-1') && (
                                                    <span style={{
                                                        position: 'absolute', top: -3, right: -3,
                                                        width: 12, height: 12, borderRadius: '50%',
                                                        background: '#ef4444',
                                                        border: '2px solid var(--bg-sidebar)',
                                                        boxShadow: '0 0 10px #ef4444',
                                                    }} />
                                                )}
                                                <span style={{
                                                    position: 'absolute', bottom: -2, right: -2,
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: chairmanOnline ? '#22c55e' : '#6b7280',
                                                    border: '2px solid var(--bg-sidebar)',
                                                }} />
                                            </div>
                                        }
                                        name="مجلس الإدارة"
                                        sub={chairmanOnline ? 'متصل الآن' : 'غير متصل'}
                                    />
                        )}

                        {employees
                            .filter(e => e.id !== user.id)
                            .sort((a, b) => {
                                if (a.status === b.status) return 0;
                                return a.status === 'online' ? -1 : 1;
                            })
                            .map(emp => (
                                <ContactBtn
                                    key={emp.id}
                                    active={activeChat === emp.id.toString()}
                                    onClick={() => { setActiveChat(emp.id.toString()); onChatSelect && onChatSelect(emp.id.toString()); }}
                                    avatar={
                                        <div style={{ position: 'relative' }}>
                                            <img src={avatarUrl(emp.name, emp.avatar)} style={{ width: 36, height: 36, borderRadius: 10, objectCover: 'cover' }} alt="" />
                                            {hasUnread(emp.id.toString()) && (
                                                <span style={{
                                                    position: 'absolute', top: -3, right: -3,
                                                    width: 12, height: 12, borderRadius: '50%',
                                                    background: '#ef4444',
                                                    border: '2px solid var(--bg-sidebar)',
                                                    zIndex: 1,
                                                    boxShadow: '0 0 10px #ef4444',
                                                }} />
                                            )}
                                            <span style={{
                                                position: 'absolute', bottom: -2, right: -2,
                                                width: 10, height: 10, borderRadius: '50%',
                                                background: emp.status === 'online' ? '#22c55e' : '#6b7280',
                                                border: '2px solid var(--bg-sidebar)',
                                            }} />
                                        </div>
                                    }
                                    name={emp.name}
                                    sub={emp.status === 'online' ? 'متصل الآن' : (emp.lastSeen ? `آخر ظهور ${timeAgo(emp.lastSeen)}` : emp.department)}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* ── Chat area ── */}
            <div className={`
                ${activeChat || selectedChatId ? 'flex' : 'hidden lg:flex'}
                flex-1 min-w-0 bg-[var(--bg-card)] border border-[var(--border-main)] 
                rounded-[20px] flex-col overflow-hidden
            `}>
                {/* Header */}
                <div className="p-3.5 lg:px-5 lg:py-3.5 border-b border-[var(--border-main)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Back Button */}
                        <button
                            onClick={() => { setActiveChat(null); onChatSelect && onChatSelect(null); }}
                            className="lg:hidden p-2 -mr-1 text-[var(--text-dim)] hover:text-[var(--text-main)]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        {activeChat && (
                            <div className="flex items-center gap-3">
                                {activeChat === 'general' ? (
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="16" height="16" fill="none" stroke="#3b82f6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                ) : activeChat.startsWith('dept_') ? (
                                    <div className="relative">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                                            <svg width="22" height="22" fill="none" stroke="#a855f7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                        {(() => {
                                            const currentDept = activeChat.replace('dept_', '');
                                            const isOnline = employees.some(e => e.department === currentDept && e.status === 'online') || (user.department === currentDept);
                                            return <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-sidebar)] ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />;
                                        })()}
                                    </div>
                                ) : activeChat.startsWith('customgroup_') ? (
                                    <div className="relative">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-green-500/15 flex items-center justify-center">
                                            <svg width="22" height="22" fill="none" stroke="#22c55e" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {(() => {
                                            const isSuperadmin = activeChat === '0';
                                            const isChairman = activeChat === '-1';
                                            const targetEmp = (isSuperadmin || isChairman) ? null : employees.find(e => e.id.toString() === activeChat);
                                            const isOnline = isSuperadmin ? superadminOnline : isChairman ? chairmanOnline : targetEmp?.status === 'online';
                                            const name = isSuperadmin ? 'المدير' : isChairman ? 'مجلس الإدارة' : (targetEmp?.name || 'User');
                                            const avatar = isSuperadmin ? (user.role === 'Admin' ? user.avatar : adminAvatar) : isChairman ? null : targetEmp?.avatar;

                                            return (
                                                <>
                                                    <img 
                                                        src={avatarUrl(name, avatar)} 
                                                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover" 
                                                        alt={name} 
                                                    />
                                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-sidebar)] ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-[13px] lg:text-[14px] font-black leading-none text-[var(--text-main)]">{activeName}</p>
                                    <p className="text-[10px] lg:text-[11px] text-[var(--text-dim)] mt-1.5">
                                        {activeChat === 'general' ? 'جميع أعضاء الفريق' : 
                                         activeChat.startsWith('dept_') ? 'مجموعة القسم' : 
                                         activeChat.startsWith('customgroup_') ? 'مجموعة مخصصة' :
                                         (() => {
                                             const isSuperadmin = activeChat === '0';
                                             const isChairman = activeChat === '-1';
                                             const targetEmp = (isSuperadmin || isChairman) ? null : employees.find(e => e.id.toString() === activeChat);
                                             const status = isSuperadmin ? (superadminOnline ? 'online' : 'offline') : isChairman ? (chairmanOnline ? 'online' : 'offline') : targetEmp?.status;
                                             const lastSeen = (isSuperadmin || isChairman) ? null : targetEmp?.lastSeen;
                                             
                                             if (status === 'online') return <span className="text-green-500 font-bold">متصل الآن</span>;
                                             if (lastSeen) return `آخر ظهور ${timeAgo(lastSeen)}`;
                                             return 'محادثة خاصة';
                                         })()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeChat && (activeChat.startsWith('dept_') || activeChat.startsWith('customgroup_')) && (
                            <div className="relative" ref={membersRef}>
                                <button
                                    onClick={() => setShowMembers(!showMembers)}
                                    className={`p-2 rounded-xl transition-all flex items-center gap-2 border border-[var(--border-main)] ${showMembers ? 'bg-purple-600/10 border-purple-500/30 text-purple-400' : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    <span className="text-[11px] font-black hidden sm:inline">أعضاء المجموعة</span>
                                </button>

                                {/* Members Overlay */}
                                {showMembers && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f111a]/95 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 border-b border-white/5 bg-white/[0.03]">
                                            <p className="text-[11px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse" />
                                                الأعضاء الحاليون
                                            </p>
                                        </div>
                                        <div className="p-2 max-h-72 overflow-y-auto flex flex-col gap-1 bg-black/20 custom-scrollbar">
                                            {(() => {
                                                let members = [];
                                                if (activeChat.startsWith('dept_')) {
                                                    const dept = activeChat.replace('dept_', '');
                                                    members = employees.filter(e => e.department === dept);
                                                } else {
                                                    const gid = activeChat.replace('customgroup_', '');
                                                    const group = customGroups.find(g => g.id.toString() === gid);
                                                    members = employees.filter(e => group?.memberIds.includes(e.id));
                                                    if (group?.adminId === 0) {
                                                        // If admin is in group, maybe add a mock object for admin if not in employees list
                                                    }
                                                }
                                                return members.map(emp => (
                                                    <div key={emp.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-input)] transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img src={avatarUrl(emp.name, emp.avatar)} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-card)] ${emp.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[12px] font-bold text-[var(--text-main)] group-hover:text-blue-400 transition-colors">{emp.name}</p>
                                                                <p className="text-[10px] text-[var(--text-dim)]">{emp.status === 'online' ? 'متصل الآن' : (emp.lastSeen ? `آخر ظهور ${timeAgo(emp.lastSeen)}` : 'غير متصل')}</p>
                                                            </div>
                                                        </div>
                                                        {emp.id !== user.id && (
                                                            <button 
                                                                onClick={() => { setActiveChat(emp.id.toString()); onChatSelect && onChatSelect(null); setShowMembers(false); }}
                                                                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                                title="محادثة خاصة"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {user.role === 'Admin' && activeChat && activeChat !== 'general' && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => {
                                        const isSuperadmin = activeChat === '0';
                                        const targetEmp = isSuperadmin ? null : employees.find(e => e.id.toString() === activeChat);
                                        let defaultDept = targetEmp?.department || (departments.length > 0 ? departments[0].name : '');
                                        if (activeChat.startsWith('dept_')) {
                                            defaultDept = activeChat.replace('dept_', '');
                                        }
                                        setNewTask({ title: '', description: '', department: defaultDept, assignedTo: activeChat.startsWith('dept_') ? '' : activeChat, priority: 'normal', startTime: '', deadline: '' });
                                        setShowTaskModal(true);
                                    }}
                                    className="p-2 lg:px-3 lg:py-2 bg-blue-600 text-white border-none rounded-xl font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_var(--shadow-btn)] transition-all hover:bg-blue-500"
                                    title="إسناد مهمة جديدة"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                    <span className="hidden sm:inline">مهمة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const isSuperadmin = activeChat === '0';
                                        const targetEmp = isSuperadmin ? null : employees.find(e => e.id.toString() === activeChat);
                                        let defaultDept = targetEmp?.department || (departments.length > 0 ? departments[0].name : '');
                                        if (activeChat.startsWith('dept_')) {
                                            defaultDept = activeChat.replace('dept_', '');
                                        }
                                        setNewTask({ title: '', description: '', department: defaultDept, assignedTo: activeChat.startsWith('dept_') ? '' : activeChat, priority: 'urgent', startTime: '', deadline: '' });
                                        setShowTaskModal(true);
                                    }}
                                    className="p-2 lg:px-3 lg:py-2 bg-red-600 text-white border-none rounded-xl font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500"
                                    title="إسناد مهمة مستعجلة"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    <span className="hidden sm:inline">مستعجل</span>
                                </button>
                                {user.role === 'Admin' && (
                                    <button
                                        onClick={handleClearChat}
                                        className="p-2 lg:px-3 lg:py-2 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-xl font-black text-xs cursor-pointer flex items-center gap-1.5 transition-all hover:bg-gray-500/20 hover:text-gray-300"
                                        title="مسح المحادثة"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        <span className="hidden sm:inline">مسح المحادثة</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {activeChat ? (
                    <>
                        {/* Messages — scrollable */}
                        <div
                            style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}
                        >
                            {messages.length === 0 && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', paddingTop: 80 }}>
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.3, marginBottom: 12 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p style={{ fontWeight: 700, fontSize: 14 }}>لا توجد رسائل بعد</p>
                                </div>
                            )}

                            {messages.map((msg) => {
                                const isMe = msg.senderId === user.id;
                                const task = msg.taskId ? tasks.find(t => t.id === msg.taskId) : null;

                                // Smart Avatar Lookup
                                let displayAvatar = msg.senderAvatar;
                                if (!displayAvatar) {
                                    if (isMe) {
                                        displayAvatar = user.avatar;
                                    } else if (msg.senderId === 0) {
                                        displayAvatar = adminAvatar;
                                    } else {
                                        const senderEmp = employees.find(e => e.id === msg.senderId);
                                        displayAvatar = senderEmp?.avatar;
                                    }
                                }

                                return (
                                    <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                        <img src={avatarUrl(msg.senderName, displayAvatar)} style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, objectFit: 'cover' }} alt="" />
                                        <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)' }}>{msg.senderName}</span>
                                                <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{timeAgo(msg.createdAt)}</span>
                                            </div>
                                            <div 
                                                className="message-bubble-container"
                                                style={{
                                                    padding: '10px 14px',
                                                    borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                                                    fontSize: 14, fontWeight: 500, lineHeight: 1.6,
                                                    background: isMe ? '#2563eb' : 'var(--bg-input)',
                                                    border: isMe ? 'none' : '1px solid var(--border-light)',
                                                    color: isMe ? 'white' : 'var(--text-main)',
                                                    boxShadow: isMe ? '0 4px 12px var(--shadow-btn)' : 'none',
                                                    position: 'relative',
                                                    group: 'true'
                                                }}
                                            >
                                                {msg.image && (
                                                    <div style={{ marginBottom: 8 }}>
                                                        <img 
                                                            src={msg.image} 
                                                            alt="Attached" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: 300, 
                                                                borderRadius: 12, 
                                                                display: 'block',
                                                                cursor: 'pointer'
                                                            }} 
                                                            onClick={() => window.open(msg.image, '_blank')}
                                                        />
                                                    </div>
                                                )}
                                                {msg.text && <div>{msg.text}</div>}

                                                {/* Read Status Icons */}
                                                {isMe && msg.channel !== 'general' && !msg.channel.startsWith('dept_') && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'flex-end', 
                                                        marginTop: 2, 
                                                        marginRight: -4, 
                                                        marginBottom: -4,
                                                        opacity: 0.8
                                                    }}>
                                                        {msg.isRead ? (
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M7 12l5 5L22 4" />
                                                                <path d="M2 12l5 5L15 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Embedded Task Card */}
                                                {task && (
                                                    <div style={{
                                                        marginTop: 12, padding: 14, borderRadius: 12, minWidth: 260,
                                                        background: 'rgba(0,0,0,0.1)',
                                                        border: '1px solid var(--border-light)',
                                                        color: 'var(--text-main)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                                            <span style={{ fontSize: 13, fontWeight: 900 }}>{task.title}</span>
                                                            <span style={{
                                                                fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6,
                                                                background: task.status === 'verified' ? 'rgba(59,130,246,0.15)' : task.status === 'scheduled' ? 'rgba(168,85,247,0.15)' : task.status === 'completed' ? 'rgba(34,197,94,0.15)' : task.status === 'in-progress' ? 'rgba(249,115,22,0.15)' : 'var(--border-light)',
                                                                color: task.status === 'verified' ? '#3b82f6' : task.status === 'scheduled' ? '#a855f7' : task.status === 'completed' ? '#22c55e' : task.status === 'in-progress' ? '#f97316' : 'var(--text-dim)',
                                                            }}>
                                                                {task.status === 'verified' ? 'تم الاستلام' : task.status === 'scheduled' ? 'مجدولة' : task.status === 'completed' ? 'مكتمل' : task.status === 'in-progress' ? 'جاري' : 'الانتظار'}
                                                            </span>
                                                        </div>

                                                        {/* Scheduling Info */}
                                                        {task.status === 'scheduled' && task.startTime && (
                                                            <div style={{
                                                                background: 'rgba(168,85,247,0.08)',
                                                                border: '1px solid rgba(168,85,247,0.15)',
                                                                padding: '8px 10px', borderRadius: 8, margin: '12px 0', textAlign: 'center'
                                                            }}>
                                                                <p style={{ fontSize: 10, fontWeight: 900, color: '#a855f7', marginBottom: 2 }}>موعد البدء:</p>
                                                                <p style={{ fontSize: 12, fontWeight: 900, color: '#a855f7' }}>
                                                                    {new Date(task.startTime).toLocaleDateString('ar-EG')} - {new Date(task.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Timer visualization */}
                                                        {(task.status === 'in-progress' || task.status === 'completed' || task.status === 'verified') && (
                                                            <div style={{
                                                                background: task.status === 'verified' ? 'rgba(59,130,246,0.08)' : task.status === 'completed' ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)',
                                                                border: `1px solid ${task.status === 'verified' ? 'rgba(59,130,246,0.15)' : task.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)'}`,
                                                                padding: 10, borderRadius: 8, textAlign: 'center', margin: '12px 0'
                                                            }}>
                                                                <p style={{ fontSize: 10, fontWeight: 900, marginBottom: 2, color: task.status === 'verified' ? '#3b82f6' : task.status === 'completed' ? '#22c55e' : '#f97316' }}>
                                                                    {task.status === 'verified' ? 'تم الإنجاز في:' : task.status === 'completed' ? 'استغرقت:' : 'الوقت المنقضي:'}
                                                                </p>
                                                                <span style={{ fontSize: 18, fontFamily: 'monospace', fontWeight: 900, color: task.status === 'verified' ? '#3b82f6' : task.status === 'completed' ? '#22c55e' : '#f97316' }}>
                                                                    {formatDuration(task.acceptedAt, task.completedAt || task.verifiedAt)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Employee Info - who accepted & timestamps */}
                                                        {task.assignedTo && (() => {
                                                            const assignedEmp = employees.find(e => e.id === task.assignedTo);
                                                            if (!assignedEmp) return null;
                                                            return (
                                                                <div style={{
                                                                    marginTop: 10, padding: '8px 10px', borderRadius: 8,
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                                    display: 'flex', flexDirection: 'column', gap: 6
                                                                }}>
                                                                    {/* Employee Row */}
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                        <img
                                                                            src={avatarUrl(assignedEmp.name, assignedEmp.avatar)}
                                                                            style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                                                                            alt=""
                                                                        />
                                                                        <div>
                                                                            <p style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{assignedEmp.name}</p>
                                                                            <p style={{ fontSize: 9, color: 'var(--text-dim)', margin: 0 }}>{assignedEmp.department}</p>
                                                                        </div>
                                                                    </div>
                                                                    {/* Timestamps */}
                                                                    {task.acceptedAt && (
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#f97316' }}>
                                                                            <span style={{ fontWeight: 900 }}>▶ بدأ:</span>
                                                                            <span>{new Date(task.acceptedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} - {new Date(task.acceptedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                    )}
                                                                    {task.completedAt && (
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#22c55e' }}>
                                                                            <span style={{ fontWeight: 900 }}>✓ سُلِّم:</span>
                                                                            <span>{new Date(task.completedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} - {new Date(task.completedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                    )}
                                                                    {task.verifiedAt && (
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#3b82f6' }}>
                                                                            <span style={{ fontWeight: 900 }}>✔✔ استُلم:</span>
                                                                            <span>{new Date(task.verifiedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} - {new Date(task.verifiedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                        {/* Priority badge for urgent tasks */}
                                                        {task.priority === 'urgent' && (
                                                            <div style={{ 
                                                                display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8,
                                                                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                                                                padding: '4px 8px', borderRadius: 6, width: 'fit-content'
                                                            }}>
                                                                <svg width="10" height="10" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                                                <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444' }}>مستعجل</span>
                                                            </div>
                                                        )}
                                                        {/* Actions for Admin */}
                                                        {user.role === 'Admin' && task.status === 'completed' && (
                                                            <button
                                                                onClick={() => handleVerifyTask(task.id)}
                                                                style={{ width: '100%', marginTop: 12, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 12px var(--shadow-btn)' }}
                                                            >
                                                                تاكيد الاستلام
                                                            </button>
                                                        )}
                                                        {/* Actions for Employee */}
                                                        {user.role === 'Employee' && (
                                                            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                                                                {/* Open dept task: any dept member can claim it */}
                                                                {task.status === 'pending' && !task.assignedTo && user.department === task.department && (
                                                                    <button
                                                                        onClick={() => handleAcceptTask(task.id)}
                                                                        style={{ flex: 1, padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                                                                    >
                                                                        استلام المهمة 🙋
                                                                    </button>
                                                                )}
                                                                {/* Personal task: only assigned employee */}
                                                                {task.status === 'pending' && task.assignedTo === user.id && (
                                                                    <button
                                                                        onClick={() => handleAcceptTask(task.id)}
                                                                        style={{ flex: 1, padding: '10px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                                                                    >
                                                                        بدء العمل
                                                                    </button>
                                                                )}
                                                                {task.status === 'in-progress' && task.assignedTo === user.id && (
                                                                    <button
                                                                        onClick={() => handleCompleteTask(task.id)}
                                                                        style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                                                                    >
                                                                        تسليم وإيقاف العداد
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3.5 lg:px-4 lg:py-3.5 border-t border-[var(--border-main)] shrink-0 bg-[var(--bg-card)]">
                            <form onSubmit={(e) => handleSend(e)} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 relative">
                                    <div className="flex-1 relative flex items-center bg-[var(--bg-input)] border border-[var(--border-light)] rounded-2xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                                        <button 
                                            type="button"
                                            ref={emojiButtonRef}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className={`p-3 text-[var(--text-dim)] hover:text-blue-500 transition-colors ${showEmojiPicker ? 'text-blue-500 bg-blue-500/10' : ''}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </button>

                                        <input
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            placeholder="اكتب رسالتك..."
                                            className="flex-1 bg-transparent py-3.5 px-1 text-sm font-bold text-[var(--text-main)] outline-none placeholder:text-[var(--text-dim)]"
                                        />

                                        <div className="flex items-center gap-1 px-2">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                accept="image/*" 
                                                onChange={handleImageUpload} 
                                            />
                                            <button 
                                                type="button"
                                                disabled={uploadingImage}
                                                onClick={() => fileInputRef.current.click()}
                                                className={`p-2.5 rounded-xl text-[var(--text-dim)] hover:text-blue-500 hover:bg-white/5 transition-all ${uploadingImage ? 'animate-pulse' : ''}`}
                                            >
                                                {uploadingImage ? (
                                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {showEmojiPicker && (
                                        <div 
                                            ref={emojiPickerRef}
                                            className="absolute bottom-full right-14 mb-3 w-[280px] bg-[#1a1c2e] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-[100]"
                                        >
                                            <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                                <div className="grid grid-cols-6 gap-1">
                                                    {emojis.map((emoji, i) => (
                                                        <button
                                                            key={`${emoji}-${i}`}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setInputText(prev => prev + emoji);
                                                            }}
                                                            className="text-xl p-2 rounded-xl hover:bg-white/5 transition-all active:scale-90 flex items-center justify-center h-10 w-10"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={(!inputText.trim() && !uploadingImage) || sending}
                                        className={`
                                            bg-blue-600 text-white border-none rounded-2xl w-14 h-[52px] flex-shrink-0 flex items-center justify-center transition-all shadow-[0_12px_24px_-8px_rgba(37,99,235,0.5)]
                                            ${((!inputText.trim() && !uploadingImage) || sending) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500 active:scale-95'}
                                        `}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                        <div style={{ width: 100, height: 100, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.2 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p style={{ fontWeight: 900, fontSize: 16 }}>اختر محادثة للبدء</p>
                        <p style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>يمكنك التواصل مع أي موظف أو استخدام القناة العامة</p>
                    </div>
                )}
            </div>

            {/* Create Task Modal embedded in Chat */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                    <div className="relative bg-[var(--bg-modal)] border border-[var(--border-light)] rounded-2xl p-8 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto text-[var(--text-main)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black">إسناد مهمة جديدة إلى {activeName}</h2>
                            <button onClick={() => setShowTaskModal(false)} className="w-8 h-8 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">العنوان *</label>
                                    <input required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all placeholder-[var(--text-dim)]" placeholder="عنوان المهمة" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">القسم *</label>
                                    <select value={newTask.department} onChange={e => setNewTask({ ...newTask, department: e.target.value, assignedTo: '' })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all [&>option]:bg-[var(--bg-modal)]">
                                        <option value="" className="bg-[var(--bg-modal)] text-[var(--text-main)]">اختر القسم</option>
                                        {departments.map(d => <option key={d.id} value={d.name} className="bg-[var(--bg-modal)] text-[var(--text-main)]">{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الموظف *</label>
                                    <select 
                                        required={!activeChat.startsWith('dept_')} 
                                        value={newTask.assignedTo} 
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} 
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all [&>option]:bg-[var(--bg-modal)]"
                                        disabled={!activeChat.startsWith('dept_')}
                                    >
                                        {activeChat.startsWith('dept_') ? (
                                            <>
                                                <option value="" className="bg-[var(--bg-modal)] text-[var(--text-main)]">عام للقسم (بدون موظف محدد)</option>
                                                {employees
                                                    .filter(e => e.department === activeChat.replace('dept_', ''))
                                                    .map(emp => (
                                                        <option key={emp.id} value={emp.id} className="bg-[var(--bg-modal)] text-[var(--text-main)]">{emp.name}</option>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <option value={activeChat} className="bg-[var(--bg-modal)] text-[var(--text-main)]">{activeName}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">موعد بداية المهمة</label>
                                    <input type="datetime-local" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={newTask.startTime} onChange={e => setNewTask({ ...newTask, startTime: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الموعد النهائي</label>
                                    <input type="datetime-local" min={newTask.startTime || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الوصف</label>
                                    <textarea rows={3} value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all resize-none placeholder-[var(--text-dim)]" placeholder="تفاصيل المهمة (اختياري)" />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-[0_8px_24px_var(--shadow-btn)]">
                                {submitting ? 'جاري الحفظ وإرسال التنبيه...' : 'إنشاء وإسناد المهمة'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowGroupModal(false)} />
                    <div className="relative bg-[#1a1c2e] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white">إنشاء مجموعة محادثة</h2>
                                <p className="text-sm text-gray-400 mt-1">اختر الأعضاء وقم بتسمية المجموعة</p>
                            </div>
                            <button onClick={() => setShowGroupModal(false)} className="w-10 h-10 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 flex items-center justify-center transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateGroup} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] text-gray-400 font-black uppercase tracking-widest px-1">اسم المجموعة</label>
                                <input 
                                    required 
                                    value={newGroup.name} 
                                    onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-base text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
                                    placeholder="مثلاً: فريق التصميم، متابعة المبيعات..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] text-gray-400 font-black uppercase tracking-widest px-1">اختيار الأعضاء</label>
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                    {employees.filter(e => e.id !== user.id).map(emp => (
                                        <label 
                                            key={emp.id} 
                                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${newGroup.memberIds.includes(emp.id) ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <input 
                                                type="checkbox" 
                                                className="hidden"
                                                checked={newGroup.memberIds.includes(emp.id)}
                                                onChange={() => {
                                                    const ids = newGroup.memberIds.includes(emp.id)
                                                        ? newGroup.memberIds.filter(id => id !== emp.id)
                                                        : [...newGroup.memberIds, emp.id];
                                                    setNewGroup({ ...newGroup, memberIds: ids });
                                                }}
                                            />
                                            <img src={avatarUrl(emp.name, emp.avatar)} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                            <span className="text-sm font-bold text-gray-200 truncate">{emp.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting || !newGroup.name || newGroup.memberIds.length === 0}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-base transition-all disabled:opacity-50 disabled:grayscale shadow-[0_12px_40px_-10px_rgba(37,99,235,0.5)] active:scale-[0.98]"
                            >
                                {submitting ? 'جاري الإنشاء...' : 'إنشاء المجموعة الآن'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ContactBtn = ({ active, onClick, avatar, name, sub }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12, border: 'none',
            background: active ? '#2563eb' : 'transparent',
            color: active ? 'white' : '#9ca3af',
            cursor: 'pointer', textAlign: 'right',
            transition: 'background 0.2s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
        <div style={{ flexShrink: 0 }}>{avatar}</div>
        <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontSize: 10, opacity: 0.6, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>
        </div>
    </button>
);

export default InternalChat;
