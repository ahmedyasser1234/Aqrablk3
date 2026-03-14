import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InternalLogin from './components/InternalLogin';
import InternalDashboard from './components/InternalDashboard';
import InternalTaskManagement from './components/InternalTaskManagement';
import InternalChat from './components/InternalChat';
import InternalSidebar from './components/InternalSidebar';
import InternalEmployees from './components/InternalEmployees';
import InternalSettings from './components/InternalSettings';
import { io } from 'socket.io-client';

let socket;

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.hostname.startsWith('192.168.') && !window.location.hostname.startsWith('10.');
export const BASE_URL = isProduction ? 'https://aqrablkmedia.com' : `http://${window.location.hostname}:3545`;
export const API = `${BASE_URL}/api`;

const InternalSystem = () => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('internal_user')); } catch { return null; }
    });
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]);
    const [adminAvatar, setAdminAvatar] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('internal_notif_sound') === 'true');
    const lastNotifIdRef = useRef(0);
    const initialFetchDoneRef = useRef(false);
    const audioRef = useRef(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('internal_theme') || 'dark');
    const [superadminOnline, setSuperadminOnline] = useState(false);
    const [chairmanOnline, setChairmanOnline] = useState(false);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const toggleSound = () => {
        const newVal = !soundEnabled;
        setSoundEnabled(newVal);
        localStorage.setItem('internal_notif_sound', newVal.toString());
        if (newVal && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    useEffect(() => {
        localStorage.setItem('internal_theme', theme);
        document.documentElement.classList.toggle('light-mode', theme === 'light');
    }, [theme]);

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    }, []);

    const addToast = useCallback((notif) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { ...notif, id }]);
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 6000);
    }, [soundEnabled]);

    const { lang, tab, subParam } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'dashboard';

    const setActiveTab = (newTab, sub) => {
        const path = sub ? `/${newTab}/${sub}` : `/${newTab}`;
        navigate(`/internal${path}`);
    };

    const fetchData = useCallback(async () => {
        if (!user) return;
        console.log('Fetching internal data for user:', user.id, user.name);
        try {
            const [empRes, taskRes, notifRes, unreadRes, deptRes, adminAvatarRes] = await Promise.all([
                fetch(`${API}/internal/employees`),
                (user.role === 'Admin' || user.role === 'Chairman')
                    ? fetch(`${API}/internal/tasks`)
                    : fetch(`${API}/internal/tasks/my/${user.id}?dept=${encodeURIComponent(user.department || '')}`),
                fetch(`${API}/internal/notifications/${user.id}`),
                fetch(`${API}/internal/notifications/${user.id}/unread`),
                fetch(`${API}/internal/departments`),
                fetch(`${API}/internal/auth/admin-profile`).catch(() => null)
            ]);

            if (empRes.ok) setEmployees(await empRes.json());
            if (taskRes.ok) setTasks(await taskRes.json());
            if (deptRes && deptRes.ok) setDepartments(await deptRes.json());
            if (adminAvatarRes && adminAvatarRes.ok) {
                const data = await adminAvatarRes.json();
                setAdminAvatar(data.avatar);
            }

            if (notifRes.ok) {
                const newNotifs = await notifRes.json();
                setNotifications(newNotifs);

                if (newNotifs.length > 0) {
                    const latestId = newNotifs[0].id;

                    if (!initialFetchDoneRef.current) {
                        console.log('Baseline established at ID:', latestId);
                        lastNotifIdRef.current = latestId;
                        initialFetchDoneRef.current = true;
                    } else if (latestId > lastNotifIdRef.current) {
                        const fresh = newNotifs.filter(n => n.id > lastNotifIdRef.current && !n.isRead);
                        console.log('New notifications detected:', fresh.length);
                        fresh.reverse().forEach(n => addToast(n));
                        lastNotifIdRef.current = latestId;
                    }
                } else if (!initialFetchDoneRef.current) {
                    console.log('Initial fetch done, no notifications yet.');
                    initialFetchDoneRef.current = true;
                    // lastNotifIdRef.current stays 0, so the first one ID 1 will trigger properly
                }
            }
            if (unreadRes.ok) setUnreadCount(await unreadRes.json());
        } catch (err) {
            console.error('Failed to fetch internal data:', err);
        }
    }, [user, addToast]);

    useEffect(() => {
        if (!user) return;
        
        // Initialize WebSocket connection for the internal system
        const socketUrl = API.replace('http', 'ws'); // Fallback for simple local setups
        // More robust: Socket.io handles the protocol conversion
        socket = io(API + '/internal', {
            query: { empId: user.id },
            transports: ['websocket']
        });

        socket.on('connect', () => console.log('Internal Socket Connected'));

        socket.on('statusUpdate', (data) => {
            console.log('Online status update:', data);
            setSuperadminOnline(data.superadminOnline);
            setChairmanOnline(data.chairmanOnline);
            setEmployees(prev => prev.map(emp => ({
                ...emp,
                status: data.onlineEmployeeIds.includes(emp.id) ? 'online' : 'offline'
            })));
        });

        socket.on('messageReceived', (msg) => {
            // Show toast if it's not from current user (redundant with fetchData polling but faster)
            if (msg.senderId !== user.id) {
                // Ensure we don't duplicate notifications — polling will handle state sync,
                // but we can trigger a toast immediately for better UX.
                // addToast(msg); // Optional, might cause double icons
            }
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s sync fallback
        return () => clearInterval(interval);
    }, [fetchData]);

    // Cleanup activeTab hooks...
    useEffect(() => {
        if (!user) return;
        if (activeTab === 'tasks') {
            fetch(`${API}/internal/notifications/${user.id}/read-by-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: 'tasks' })
            }).catch(() => { });
        } else if (activeTab === 'dashboard') {
            fetch(`${API}/internal/notifications/${user.id}/read-by-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: 'dashboard' })
            }).catch(() => { });
        }
    }, [activeTab, user?.id]);

    const handleLogin = async (username, password) => {
        try {
            const res = await fetch(`${API}/internal/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) return false;
            const data = await res.json();
            const finalUser = data.user;

            localStorage.setItem('internal_user', JSON.stringify(finalUser));
            localStorage.setItem('internal_token', data.token);
            setUser(finalUser);
            return true;
        } catch { return false; }
    };

    const handleLogout = async () => {
        if (user?.id > 0) {
            await fetch(`${API}/internal/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: user.id })
            }).catch(() => { });
        }
        localStorage.removeItem('internal_user');
        localStorage.removeItem('internal_token');
        setUser(null);
        setActiveTab('dashboard');
    };

    const handleTaskUpdate = (upd) => setTasks(prev => prev.map(t => t.id === upd.id ? upd : t));
    const handleTaskDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id));
    const handleTaskCreate = (task) => setTasks(prev => [task, ...prev]);

    const handleMarkNotificationRead = async (id) => {
        try {
            const res = await fetch(`${API}/internal/notifications/${id}/read`, { method: 'PATCH' });
            if (res.ok) fetchData();
        } catch { }
    };

    const handleMarkAllNotificationsRead = async () => {
        try {
            const res = await fetch(`${API}/internal/notifications/${user.id}/read-all`, { method: 'POST' });
            if (res.ok) fetchData();
        } catch { }
    };

    const handleTestNotification = async () => {
        try {
            console.log('Sending test notification request...');
            const res = await fetch(`${API}/internal/notifications/test/${user.id}`, { method: 'POST' });
            if (res.ok) console.log('Test notification request sent successfully!');
        } catch (e) { console.error('Test notification failed', e); }
    };

    // CursorEffect sets document.body.style.cursor = 'none' globally — restore it here
    useEffect(() => {
        const prev = document.body.style.cursor;
        document.body.style.cursor = 'auto';
        return () => { document.body.style.cursor = prev; };
    }, []);

    const forcedCursorStyle = `
      * { cursor: auto !important; }
      button, a, select, [role="button"] { cursor: pointer !important; }
      input, textarea { cursor: text !important; }
    `;

    const themeStyles = `
        :root {
            --bg-main: #080a12;
            --bg-sidebar: #0c0e1a;
            --bg-card: rgba(255, 255, 255, 0.03);
            --bg-card-hover: rgba(255, 255, 255, 0.05);
            --bg-modal: #0f1120;
            --bg-input: #181a29;
            --text-main: #ffffff;
            --text-muted: #9ca3af;
            --text-dim: #6b7280;
            --border-main: rgba(255, 255, 255, 0.06);
            --border-light: rgba(255, 255, 255, 0.1);
            --shadow-btn: rgba(37, 99, 235, 0.25);
            --notif-shadow: rgba(0, 0, 0, 0.5);
        }
        .light-mode {
            --bg-main: #f8fafc;
            --bg-sidebar: #ffffff;
            --bg-card: #ffffff;
            --bg-card-hover: #f1f5f9;
            --bg-modal: #ffffff;
            --bg-input: #f1f5f9;
            --text-main: #0f172a;
            --text-muted: #475569;
            --text-dim: #64748b;
            --border-main: #e2e8f0;
            --border-light: #f1f5f9;
            --shadow-btn: rgba(37, 99, 235, 0.15);
            --notif-shadow: rgba(0, 0, 0, 0.1);
        }
    `;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return (
            <div className={theme === 'light' ? 'light-mode' : ''} style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'background 0.3s ease' }}>
                <style>{themeStyles}</style>
                <style>{forcedCursorStyle}</style>
                <InternalLogin onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
            </div>
        );
    }

    // Chat page needs full height without page padding
    const isChat = activeTab === 'chat';

    return (
        <div
            dir="rtl"
            className={theme === 'light' ? 'light-mode' : ''}
            style={{
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontFamily: "'Noto Sans Arabic', 'Outfit', sans-serif",
                transition: 'background 0.3s ease, color 0.3s ease'
            }}
        >
            <style>{themeStyles}</style>
            <style>{forcedCursorStyle}</style>

            {/* Mobile Header */}
            <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-[var(--bg-sidebar)] border-b border-[var(--border-main)] shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-500/20 text-white">A</div>
                    <span className="text-sm font-black text-[var(--text-main)]">أقربلك ميديا</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                <InternalSidebar
                    activeTab={activeTab}
                    setActiveTab={(t, s) => { setActiveTab(t, s); setSidebarOpen(false); }}
                    user={user}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkRead={handleMarkNotificationRead}
                    onMarkAllRead={handleMarkAllNotificationsRead}
                    onLogout={handleLogout}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    departments={departments}
                />

                <main
                    style={{
                        flex: 1,
                        overflow: isChat ? 'hidden' : 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                    }}
                >
                    {isChat ? (
                        // Chat gets the full height — no padding wrapper
                        <div style={{ flex: 1, overflow: 'hidden', padding: '20px' }}>
                            <InternalChat
                                user={user}
                                employees={employees}
                                tasks={tasks}
                                notifications={notifications}
                                onAccept={fetchData}
                                onComplete={fetchData}
                                selectedChatId={subParam}
                                onChatSelect={(id) => setActiveTab('chat', id)}
                                superadminOnline={superadminOnline}
                                chairmanOnline={chairmanOnline}
                                departments={departments}
                                socket={socket}
                                adminAvatar={adminAvatar}
                            />
                        </div>
                    ) : (
                        <div style={{ padding: '20px 24px 48px', minHeight: '100%' }}>
                            {activeTab === 'dashboard' && (
                                <InternalDashboard user={user} tasks={tasks} employees={employees} superadminOnline={superadminOnline} chairmanOnline={chairmanOnline} departments={departments} adminAvatar={adminAvatar} />
                            )}
                            {activeTab === 'tasks' && (
                                <InternalTaskManagement
                                    user={user}
                                    tasks={tasks}
                                    employees={employees}
                                    onTaskUpdate={handleTaskUpdate}
                                    onTaskDelete={handleTaskDelete}
                                    onTaskCreate={handleTaskCreate}
                                    departments={departments}
                                />
                            )}
                            {activeTab === 'employees' && (user.role === 'Admin' || user.role === 'Chairman') && (
                                <InternalEmployees
                                    user={user}
                                    employees={employees}
                                    tasks={tasks}
                                    onTaskUpdate={handleTaskUpdate}
                                    onEmployeeCreated={fetchData}
                                    goToChat={(id) => setActiveTab('chat', id)}
                                    departments={departments}
                                    onDepartmentsUpdated={fetchData}
                                />
                            )}
                            {activeTab === 'settings' && (
                                <InternalSettings
                                    user={user}
                                    setUser={setUser}
                                />
                            )}
                        </div>
                    )}
                </main>

                {/* Toasts Container */}
                <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none max-w-sm w-full">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className="pointer-events-auto bg-[var(--bg-sidebar)]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex items-start gap-4 animate-in slide-in-from-right-8 fade-in duration-500 ring-1 ring-white/5"
                            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                        >
                            <div className={`p-3 rounded-2xl shrink-0 ${toast.type === 'task' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'} shadow-inner`}>
                                {toast.type === 'task' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                )}
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-500/80">{toast.type === 'task' ? 'مهمة جديدة' : 'رسالة جديدة'}</p>
                                    <span className="text-[9px] text-[var(--text-dim)] font-bold opacity-60">الآن</span>
                                </div>
                                <p className="text-[15px] font-black text-[var(--text-main)] mb-1 leading-tight">{toast.title}</p>
                                <p className="text-[13px] text-[var(--text-muted)] font-bold leading-relaxed line-clamp-2 opacity-80">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="p-1.5 hover:bg-white/10 rounded-xl transition-all text-[var(--text-dim)] hover:text-[var(--text-main)] shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InternalSystem;
