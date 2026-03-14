import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import AdminChatPanel from '../components/AdminChatPanel';
import AdminSettings from '../components/AdminSettings';
import AdminRequestsPanel from '../components/AdminRequestsPanel';
import AdminManagement from '../components/AdminManagement';
import AdminMarketingManagement from '../components/AdminMarketingManagement';
import AdminSEOManagement from '../components/AdminSEOManagement';
import AdminTestimonialsManagement from '../components/AdminTestimonialsManagement';
import AdminVideosManagement from '../components/AdminVideosManagement';
import AdminPartnersManagement from '../components/AdminPartnersManagement';
import AdminBlogManagement from '../components/AdminBlogManagement';
import AdminCommentsManagement from '../components/AdminCommentsManagement';
import SupportEmailsManagement from '../components/SupportEmailsManagement';
import AdminChatbotManagement from '../components/AdminChatbotManagement';
import AdminChatbotConfig from '../components/AdminChatbotConfig';
import AdminServicePricing from '../components/AdminServicePricing';
import AdminPricingHub from '../components/AdminPricingHub';
import AdminPricingEditor from '../components/AdminPricingEditor';
import { API_BASE_URL, SOCKET_URL } from '../config';
import io from 'socket.io-client';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();


    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState('');
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('auth_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginRole, setLoginRole] = useState('superadmin'); // 'superadmin' or 'support'

    // Support Emails Display State
    const [supportEmails, setSupportEmails] = useState([]);

    // Notification Counts
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [unreadTestimonials, setUnreadTestimonials] = useState(0);

    const [lastPendingCount, setLastPendingCount] = useState(0);
    const [lastUnreadCount, setLastUnreadCount] = useState(0);
    const [lastTestimonialCount, setLastTestimonialCount] = useState(0);

    // Tab detection
    const isSEO = location.pathname.includes('/seo');
    const isBlog = location.pathname.includes('/blog');
    const isMessages = location.pathname.includes('/messages');
    const isEmails = location.pathname.includes('/emails');
    const isServices = location.pathname.includes('/services');
    const isPricing = location.pathname.includes('/pricing');
    const isStats = location.pathname.includes('/stats');
    const isSettings = location.pathname.includes('/settings');
    const isRequests = location.pathname.includes('/requests');
    const isPartners = location.pathname.includes('/partners');
    const isTestimonials = location.pathname.includes('/testimonials');
    const isAdminManagement = location.pathname.includes('/admins');
    const isSupportEmails = location.pathname.includes('/support-emails');
    const isSupportPage = location.pathname.includes('/support-desk');
    const isComments = location.pathname.includes('/blog-comments');
    const isChatbot = location.pathname.includes('/chatbot');
    const isOverview = !isMessages && !isStats && !isSettings && !isRequests && !isAdminManagement && !isSupportEmails && !isSupportPage && !isPartners && !isTestimonials && !isServices && !isEmails && !isSEO && !isBlog && !isComments && !isChatbot && !isPricing;
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error(t('dashboard.error'));
            const data = await response.json();

            // Security check: Ensure the role matches the selection
            if (data.user && data.user.role !== loginRole) {
                const errorMsg = language === 'ar'
                    ? (loginRole === 'superadmin' ? 'هذا الحساب ليس لديه صلاحيات أدمن' : 'هذا الحساب ليس من فريق الدعم')
                    : (loginRole === 'superadmin' ? 'This account does not have admin privileges' : 'This account is not a support account');
                throw new Error(errorMsg);
            }

            localStorage.setItem('auth_token', data.access_token);
            if (data.user) {
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                setUser(data.user);
            }
            setToken(data.access_token);
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
        setStats(null);
        navigate(`/dashboard`);
    };
    const getPageName = (route) => {
        if (!route) return '/';
        const cleanRoute = route.replace(/^\/(ar|en)/, '') || '/';
        if (cleanRoute === '/' || cleanRoute === '') return t('nav.home');
        if (cleanRoute === '/about') return t('nav.about');
        if (cleanRoute === '/contact') return t('nav.contact');
        if (cleanRoute === '/services') return t('nav.services');
        const services = ['motion', 'montage', 'photography', 'design', 'studio', 'web', 'content', 'marketing'];
        for (const s of services) {
            if (cleanRoute.includes(`/services/${s}`)) return t(`service.${s}`);
        }
        return cleanRoute;
    };
    const getCountryName = (code) => {
        if (!code) return language === 'ar' ? 'غير معروف' : 'Unknown';
        const c = code.toUpperCase();
        const mapping = {
            'EG': { ar: 'مصر', en: 'Egypt' },
            'SA': { ar: 'السعودية', en: 'Saudi Arabia' },
            'AE': { ar: 'الإمارات', en: 'UAE' },
            'KW': { ar: 'الكويت', en: 'Kuwait' },
            'QA': { ar: 'قطر', en: 'Qatar' },
            'JO': { ar: 'الأردن', en: 'Jordan' },
            'MA': { ar: 'المغرب', en: 'Morocco' },
            'DZ': { ar: 'الجزائر', en: 'Algeria' },
            'IQ': { ar: 'العراق', en: 'Iraq' },
            'LY': { ar: 'ليبيا', en: 'Libya' },
            'LB': { ar: 'لبنان', en: 'Lebanon' },
            'TN': { ar: 'تونس', en: 'Tunisia' },
            'OM': { ar: 'عمان', en: 'Oman' },
            'BH': { ar: 'البحرين', en: 'Bahrain' },
            'SY': { ar: 'سوريا', en: 'Syria' },
            'PS': { ar: 'فلسطين', en: 'Palestine' },
            'YE': { ar: 'اليمن', en: 'Yemen' },
            'SD': { ar: 'السودان', en: 'Sudan' },
            'US': { ar: 'الولايات المتحدة', en: 'USA' },
            'UK': { ar: 'بريطانيا', en: 'UK' },
            'TR': { ar: 'تركيا', en: 'Turkey' },
            'DE': { ar: 'ألمانيا', en: 'Germany' },
            'FR': { ar: 'فرنسا', en: 'France' },
            'IT': { ar: 'إيطاليا', en: 'Italy' },
            'ES': { ar: 'إسبانيا', en: 'Spain' },
            'UNKNOWN': { ar: 'غير معروف', en: 'Unknown' }
        };
        return mapping[c] ? mapping[c][language] : code;
    };
    useEffect(() => {
        if (!token) return;

        // Fetch Initial Counts
        const fetchInitialCounts = async () => {
            try {
                // Pending Requests
                const resReq = await fetch(`${API_BASE_URL}/requests/pending-count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resReq.ok) {
                    const count = await resReq.json();
                    setPendingRequests(count);
                    setLastPendingCount(count);
                }

                // Unread Testimonials
                const resTest = await fetch(`${API_BASE_URL}/testimonials/unread-count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resTest.ok) {
                    const count = await resTest.json();
                    setUnreadTestimonials(count);
                    setLastTestimonialCount(count);
                }
            } catch (err) { console.error('Error fetching initial counts:', err); }
        };

        fetchInitialCounts();

        // Setup Socket for real-time notifications
        const socket = io(SOCKET_URL, {
            query: { role: 'admin' },
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => console.log('Dashboard Socket Connected'));

        // Handle Unread Messages from activeSessions
        socket.on('activeSessions', (sessions) => {
            const totalUnread = sessions.reduce((sum, s) => sum + (s.unread || 0), 0);
            setUnreadMessages(totalUnread);
        });

        // Handle New Requests
        socket.on('requestsUpdate', (data) => {
            if (data && typeof data.pendingCount === 'number') {
                setPendingRequests(data.pendingCount);
                if (data.newRequest) {
                    showDesktopNotification(
                        language === 'ar' ? 'طلب خدمة جديد 🚀' : 'New Service Request 🚀',
                        `${data.newRequest.name}: ${data.newRequest.service}`
                    );
                }
            }
        });

        // Handle Testimonials (Reviews)
        socket.on('testimonialsUpdate', (data) => {
            if (data && typeof data.unreadCount === 'number') {
                setUnreadTestimonials(data.unreadCount);
                if (data.newTestimonial) {
                    showDesktopNotification(
                        language === 'ar' ? 'تقييم جديد ⭐' : 'New Review ⭐',
                        `${data.newTestimonial.name}: ${data.newTestimonial.comment.substring(0, 50)}...`
                    );
                }
            }
        });

        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/analytics/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 401) { handleLogout(); return; }
                if (!response.ok) throw new Error(t('dashboard.error'));
                const data = await response.json();
                const aggregatedPages = {};
                (data.pages || []).forEach(item => {
                    if (!item.page || item.page.includes('dashboard')) return;
                    const name = getPageName(item.page);
                    aggregatedPages[name] = (aggregatedPages[name] || 0) + parseInt(item.count || 0, 10);
                });
                const distinctPages = Object.keys(aggregatedPages)
                    .map(name => ({ page: name, count: aggregatedPages[name] }))
                    .sort((a, b) => b.count - a.count);
                setStats({
                    total: data.total || 0,
                    pages: distinctPages,
                    countries: data.countries || [],
                    daily: data.daily || []
                });
            } catch (error) {
                setStatsError(error.message);
            }
        };
        const fetchSupportEmails = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/support-emails`);
                if (res.ok) {
                    const data = await res.json();
                    setSupportEmails(data);
                }
            } catch (err) {
                console.error('Error fetching support emails:', err);
            }
        };

        fetchStats();
        fetchSupportEmails();
        const interval = setInterval(() => {
            fetchStats();
            fetchSupportEmails();
            // Periodic fallback for counts if socket missed
            fetchInitialCounts();
        }, 30000);

        return () => {
            clearInterval(interval);
            socket.disconnect();
        };
    }, [token, language]);

    const showDesktopNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png'
                });
            } catch (e) {
                console.error('Notification failed:', e);
            }
        }
    };

    // Sound & Browser Notification Logic
    useEffect(() => {
        // Request Notification Permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const playNotify = () => {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
        };

        if (pendingRequests > lastPendingCount) {
            playNotify();
            setLastPendingCount(pendingRequests);
        }
        if (unreadMessages > lastUnreadCount) {
            playNotify();
            showDesktopNotification(
                language === 'ar' ? 'رسالة جديدة 💬' : 'New Message 💬',
                language === 'ar' ? 'لديك رسالة لم تقرأ بعد' : 'You have a new unread message'
            );
            setLastUnreadCount(unreadMessages);
        }
        if (unreadTestimonials > lastTestimonialCount) {
            playNotify();
            setLastTestimonialCount(unreadTestimonials);
        }
        // If counts decreased (viewed), just update the tracker without sound
        if (pendingRequests < lastPendingCount) setLastPendingCount(pendingRequests);
        if (unreadMessages < lastUnreadCount) setLastUnreadCount(unreadMessages);
        if (unreadTestimonials < lastTestimonialCount) setLastTestimonialCount(unreadTestimonials);

    }, [pendingRequests, unreadMessages, unreadTestimonials, lastPendingCount, lastUnreadCount, lastTestimonialCount, language]);
    const renderLineChart = (data) => {
        if (!data || data.length === 0) return null;
        const maxCount = Math.max(...data.map(d => parseInt(d.count, 10)), 5);
        const width = 1000;
        const height = 250;
        const padding = 40;
        const points = data.map((d, i) => ({
            x: padding + (i * (width - 2 * padding) / (data.length - 1 || 1)),
            y: height - padding - (parseInt(d.count, 10) / maxCount * (height - 2 * padding))
        }));

        const pathD = points.length > 1
            ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
            : '';

        return (
            <div className="w-full bg-[#1a1b26]/40 p-6 rounded-3xl border border-white/5 mb-8 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        {language === 'ar' ? 'إحصائيات الأسبوع الأخير' : 'Last 7 Days Visitors'}
                    </h3>
                    <span className="text-xs text-gray-500">{language === 'ar' ? 'نمو الزيارات يومياً' : 'Daily visit growth'}</span>
                </div>
                <div className="relative h-[250px] w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = padding + (i * (height - 2 * padding) / 4);
                            return (
                                <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            );
                        })}

                        {/* Area Gradient */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {points.length > 1 && (
                            <path
                                d={`${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`}
                                fill="url(#chartGradient)"
                            />
                        )}

                        {/* Line */}
                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Points & Labels */}
                        {points.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r="6" fill="#1a1b26" stroke="#3b82f6" strokeWidth="3" className="hover:r-8 transition-all pointer-events-auto" />
                                <text x={p.x} y={height - 10} textAnchor="middle" fill="#555" fontSize="12" className="font-medium">
                                    {data[i].date.split('-').slice(1).join('/')}
                                </text>
                                <text x={p.x} y={p.y - 15} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                                    {data[i].count}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        );
    };

    const renderPieChart = (data) => {
        if (!data || data.length === 0) return null;
        let cumulativePercent = 0;
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
        const innerR = 10;
        const outerR = 16;
        return (
            <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                    {data.slice(0, 7).map((item, i) => {
                        const percent = (item.count / (stats.total || 1)) * 100;
                        if (percent <= 0) return null;
                        const startAngle = (cumulativePercent / 100) * 2 * Math.PI;
                        const endAngle = ((cumulativePercent + percent) / 100) * 2 * Math.PI;
                        const largeArcFlag = percent > 50 ? 1 : 0;
                        const x1_outer = Math.cos(startAngle) * outerR + 16;
                        const y1_outer = Math.sin(startAngle) * outerR + 16;
                        const x2_outer = Math.cos(endAngle) * outerR + 16;
                        const y2_outer = Math.sin(endAngle) * outerR + 16;
                        const x1_inner = Math.cos(startAngle) * innerR + 16;
                        const y1_inner = Math.sin(startAngle) * innerR + 16;
                        const x2_inner = Math.cos(endAngle) * innerR + 16;
                        const y2_inner = Math.sin(endAngle) * innerR + 16;
                        const pathData = `
                            M ${x1_inner} ${y1_inner}
                            L ${x1_outer} ${y1_outer}
                            A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2_outer} ${y2_outer}
                            L ${x2_inner} ${y2_inner}
                            A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x1_inner} ${y1_inner}
                            Z
                        `;
                        cumulativePercent += percent;
                        return (
                            <path
                                key={i}
                                d={pathData}
                                fill={colors[i % colors.length]}
                                className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                            >
                                <title>{item.page}: {item.count}</title>
                            </path>
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-transparent rounded-full flex flex-col items-center justify-center backdrop-blur-md border border-white/10">
                        <span className="text-3xl font-black text-white leading-none">{stats.total}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">
                            {language === 'ar' ? 'زيارة' : 'VISITS'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 text-white bg-transparent">
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-700">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h2 className="text-3xl font-black text-center">{t('dashboard.welcome_admin')}</h2>
                    </div>

                    {/* Role Selector */}
                    <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button
                            type="button"
                            onClick={() => setLoginRole('superadmin')}
                            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${loginRole === 'superadmin' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {language === 'ar' ? 'أدمن' : 'Admin'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginRole('support')}
                            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${loginRole === 'support' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {language === 'ar' ? 'فريق الدعم' : 'Support Team'}
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center outline-none focus:border-blue-500 transition-all font-medium" placeholder={t('dashboard.username')} required />
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center outline-none pr-12 focus:border-blue-500 transition-all font-medium" placeholder={t('dashboard.password')} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943-9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                        {loginError && <p className="text-red-400 text-sm text-center animate-pulse font-medium">{loginError}</p>}
                        <button type="submit" disabled={isLoggingIn} className={`w-full ${loginRole === 'superadmin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50`}>{isLoggingIn ? t('dashboard.loading') : t('dashboard.login_title')}</button>
                    </form>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen text-white flex overflow-hidden bg-transparent">
            {/* Sidebar */}
            <aside className={`fixed top-24 ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} h-[calc(100vh-100px)] w-24 lg:w-64 bg-[var(--glass-bg)] backdrop-blur-3xl border-white/10 z-[100] transition-all flex flex-col items-center py-6 overflow-y-auto custom-scrollbar`}>
                <div className="mb-10 px-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/dashboard`)}>
                    <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" className="w-full h-auto object-contain" alt="Logo" />
                </div>
                <nav className="flex-1 w-full px-4 space-y-6">
                    <button onClick={() => navigate(`/dashboard/stats`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isStats ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{t('dashboard.sidebar_stats')}</span>
                    </button>
                    <button onClick={() => navigate(`/dashboard/messages`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative ${isMessages ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <div className="relative">
                            <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-bounce shadow-lg shadow-red-500/40 border border-[#0d0e1b]">
                                    {unreadMessages}
                                </span>
                            )}
                        </div>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{t('dashboard.sidebar_messages')}</span>
                    </button>
                    <button onClick={() => navigate(`/dashboard/requests`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative ${isRequests ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <div className="relative">
                            <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            {pendingRequests > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-bounce shadow-lg shadow-red-500/40 border border-[#0d0e1b]">
                                    {pendingRequests}
                                </span>
                            )}
                        </div>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'الطلبات' : 'Requests'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/testimonials`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative ${isTestimonials ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <div className="relative">
                            <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            {unreadTestimonials > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-bounce shadow-lg shadow-red-500/40 border border-[#0d0e1b]">
                                    {unreadTestimonials}
                                </span>
                            )}
                        </div>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'التقييمات' : 'Reviews'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/services`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative ${isServices ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'إدارة الصفحات' : 'Manage Pages'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/partners`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isPartners ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'عملائنا' : 'Our Clients'}</span>
                    </button>

                    {/* Superadmin Only: Manage Admins */}
                    {user?.role === 'superadmin' && (
                        <>
                            <button onClick={() => navigate(`/dashboard/admins`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isAdminManagement ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                                <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'المشرفين' : 'Admins'}</span>
                            </button>
                        </>
                    )}

                    <button onClick={() => navigate(`/dashboard/seo`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isSEO ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'محركات البحث' : 'SEO'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/blog`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isBlog ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'المدونة' : 'Blog'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/blog-comments`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isComments ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'تعليقات المدونة' : 'Blog Comments'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/chatbot`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isChatbot ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'إعدادات البوت' : 'AI Chatbot'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/settings`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isSettings ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                    </button>

                    <button onClick={() => navigate(`/dashboard/pricing`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isPricing ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-blue-400'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'أسعار الخدمات' : 'Pricing'}</span>
                    </button>

                </nav>
                <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 mb-10 text-red-500 hover:bg-red-500/5 rounded-3xl transition-all">
                    <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{t('dashboard.logout')}</span>
                </button>
            </aside>
            {/* Content Area */}
            <main className={`flex-1 overflow-y-auto h-screen transition-all ${language === 'ar' ? 'mr-24 lg:mr-64' : 'ml-24 lg:ml-64'} pt-20 bg-transparent`}>
                <div className="p-4 md:p-8 lg:p-12">
                    {(isStats || isOverview) && (
                        <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
                            <h1 className="text-4xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">
                                {isOverview
                                    ? (language === 'ar' ? `مرحباً بك، ${user?.username || 'أدمن'}` : `Welcome, ${user?.username || 'Admin'}`)
                                    : (t('dashboard.sidebar_stats') + ' 📈')
                                }
                            </h1>
                            {stats ? (
                                <div className="max-w-6xl mx-auto space-y-10">
                                    {isStats && renderLineChart(stats.daily)}
                                    <div className={`grid grid-cols-1 ${isStats ? 'lg:grid-cols-2' : ''} gap-10 pb-32 w-full`}>
                                        {/* Pages Section */}
                                        <div className="bg-white/5 border border-white/10 rounded-3xl md:rounded-[4rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col items-center w-full">
                                            <h2 className="text-xl md:text-2xl font-black text-white mb-10">{t('dashboard.top_pages')}</h2>
                                            <div className="scale-110 mb-10">{renderPieChart(stats.pages)}</div>
                                            {/* Legend (Always shown now, but list controlled by isStats) */}
                                            <div className="w-full space-y-3 mt-4">
                                                {stats.pages.map((p, idx) => {
                                                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-transparent border border-white/5 hover:border-blue-500/30 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-3 h-3 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                                                                <span className="text-xs font-black text-gray-300 uppercase tracking-tighter">{p.page}</span>
                                                            </div>
                                                            {isStats && <span className="text-sm font-black text-blue-400 font-mono">{p.count}</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* Countries Section (Only shown on STATS route) */}
                                        {isStats && (
                                            <div className="bg-transparent border border-white/10 rounded-3xl md:rounded-[4rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col items-center w-full">
                                                <h2 className="text-xl md:text-2xl font-black text-white mb-10">{t('dashboard.top_countries')}</h2>
                                                <div className="flex items-end justify-center gap-6 h-64 border-b border-white/10 pb-6 w-full px-4 mb-8">
                                                    {stats.countries.slice(0, 6).map((c, i) => {
                                                        const barHeight = Math.max(10, (c.count / (stats.total || 1)) * 100);
                                                        return (
                                                            <div key={i} className="flex flex-col items-center gap-4 w-full max-w-[40px] group cursor-pointer">
                                                                <div className="relative w-full flex justify-center">
                                                                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl" style={{ height: `${barHeight * 2}px` }}></div>
                                                                </div>
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate text-center">{getCountryName(c.country)}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="w-full space-y-3">
                                                    {stats.countries.map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-transparent border border-white/5 hover:border-green-500/30 transition-all">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black text-gray-300 uppercase">{getCountryName(c.country)}</span>
                                                            </div>
                                                            <span className="text-sm font-black text-green-400 font-mono">{c.count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <LoadingSpinner />
                            )}
                        </div>
                    )}
                    {isMessages && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-right-10 duration-700">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{t('dashboard.sidebar_messages')} 💬</h1>
                            <AdminChatPanel token={token} />
                        </div>
                    )}
                    {isAdminManagement && user?.role === 'superadmin' && (
                        <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'إدارة المشرفين' : 'Admin Management'} 👑</h1>
                            <AdminManagement token={token} />
                        </div>
                    )}
                    {isSEO && (
                        <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-700 pb-20">
                            <AdminSEOManagement token={token} />
                        </div>
                    )}
                    {isBlog && (
                        <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-700 pb-20">
                            <AdminBlogManagement token={token} />
                        </div>
                    )}
                    {isComments && (
                        <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-700 pb-20">
                            <AdminCommentsManagement token={token} />
                        </div>
                    )}
                    {isChatbot && (
                        <div className="max-w-6xl mx-auto animate-in zoom-in-95 duration-700 pb-20 space-y-12">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'إعدادات البوت الذكي' : 'AI Chatbot Settings'} 🤖</h1>
                            {/* Chatbot Configuration */}
                            <div className="mb-8">
                                <AdminChatbotConfig />
                            </div>

                            {/* Chatbot Responses Management */}
                            <div className="pt-8 border-t border-white/10">
                                <h2 className="text-3xl font-black text-white mb-8">{language === 'ar' ? 'ردود البوت' : 'Bot Responses'}</h2>
                                <AdminChatbotManagement token={token} />
                            </div>
                        </div>
                    )}
                    {isSettings && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-left-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'الإعدادات' : 'Settings'} ⚙️</h1>
                            <AdminSettings token={token} role={user?.role} />
                        </div>
                    )}
                    {isRequests && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'طلبات الخدمات' : 'Service Requests'} 📋</h1>
                            <AdminRequestsPanel token={token} />
                        </div>
                    )}
                    {isPartners && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'إدارة العملاء' : 'Clients Management'} 🤝</h1>
                            <AdminPartnersManagement token={token} />
                        </div>
                    )}
                    {isTestimonials && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'إدارة التقييمات' : 'Reviews Management'} ⭐</h1>
                            <AdminTestimonialsManagement token={token} />
                        </div>
                    )}
                    {isServices && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-20">
                            <AdminVideosManagement token={token} />
                        </div>
                    )}
                    {isSupportEmails && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'رسائل الدعم' : 'Support Emails'} 📧</h1>
                            <SupportEmailsManagement token={token} />
                        </div>
                    )}

                    {isPricing && (
                        <div className="max-w-7xl mx-auto pb-20">
                            {/* If exact match to /pricing, show hub. If has ID, show editor */}
                            {location.pathname.endsWith('/pricing') ? (
                                <AdminPricingHub />
                            ) : (
                                <AdminPricingEditor />
                            )}
                        </div>
                    )}

                    {/* Support for nested routes via Outlet */}
                    <div className="mt-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div >
    );
};

export default DashboardPage;
