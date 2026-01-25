import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import AdminChatPanel from '../components/AdminChatPanel';
import AdminSettings from '../components/AdminSettings';
import { API_BASE_URL } from '../config';

const DashboardPage = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useParams();

    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState('');

    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Current tab detection
    const isMessages = location.pathname.includes('/messages');
    const isStats = location.pathname.includes('/stats');
    const isSettings = location.pathname.includes('/settings');
    const isOverview = !isMessages && !isStats && !isSettings;

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
            localStorage.setItem('auth_token', data.access_token);
            setToken(data.access_token);
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setStats(null);
        navigate(`/${lang}/dashboard`);
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
                    countries: data.countries || []
                });
            } catch (error) {
                setStatsError(error.message);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [token, language]);

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
                    <div className="w-24 h-24 bg-white/5 rounded-full flex flex-col items-center justify-center backdrop-blur-md border border-white/10">
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
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl w-full max-w-md shadow-2xl">
                    <h2 className="text-3xl font-black mb-8 text-center">{t('dashboard.welcome_admin')}</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center outline-none" placeholder={t('dashboard.username')} />
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center outline-none pr-12" placeholder={t('dashboard.password')} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943-9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                        {loginError && <p className="text-red-400 text-sm text-center animate-pulse">{loginError}</p>}
                        <button type="submit" disabled={isLoggingIn} className="w-full bg-blue-600 hover:bg-blue-700 font-black py-4 rounded-2xl shadow-lg transition-all">{isLoggingIn ? t('dashboard.loading') : t('dashboard.login_title')}</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white flex overflow-hidden bg-transparent">
            {/* Sidebar */}
            <aside className={`fixed top-24 ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} h-[calc(100vh-100px)] w-24 lg:w-64 bg-transparent border-white/10 z-[100] transition-all flex flex-col items-center py-6`}>
                <div className="mb-10 px-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/${lang}/dashboard`)}>
                    <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" className="w-full h-auto object-contain" alt="Logo" />
                </div>
                <nav className="flex-1 w-full px-4 space-y-6">
                    <button onClick={() => navigate(`/${lang}/dashboard/stats`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isStats ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-gray-200'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{t('dashboard.sidebar_stats')}</span>
                    </button>
                    <button onClick={() => navigate(`/${lang}/dashboard/messages`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isMessages ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-gray-200'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{t('dashboard.sidebar_messages')}</span>
                    </button>
                    <button onClick={() => navigate(`/${lang}/dashboard/settings`)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isSettings ? 'text-blue-500 bg-white/5' : 'text-gray-500 hover:text-gray-200'}`}>
                        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="hidden lg:block text-sm font-black uppercase tracking-tight">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
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
                                    ? (language === 'ar' ? 'مرحباً بك في لوحة تحكم أقربلك' : 'Welcome to Aqrablik Dashboard')
                                    : (t('dashboard.sidebar_stats') + ' 📈')
                                }
                            </h1>
                            {stats ? (
                                <div className={`grid grid-cols-1 ${isStats ? 'lg:grid-cols-2' : ''} gap-10 pb-32`}>
                                    {/* Pages Section */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl md:rounded-[4rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col items-center w-full">
                                        <h2 className="text-xl md:text-2xl font-black text-white mb-10">{t('dashboard.top_pages')}</h2>
                                        <div className="scale-110 mb-10">{renderPieChart(stats.pages)}</div>

                                        {/* Legend (Always shown now, but list controlled by isStats) */}
                                        <div className="w-full space-y-3 mt-4">
                                            {stats.pages.map((p, idx) => {
                                                const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all">
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
                                        <div className="bg-white/5 border border-white/10 rounded-3xl md:rounded-[4rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col items-center w-full">
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
                                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-green-500/30 transition-all">
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
                            ) : (
                                <div className="flex items-center justify-center min-h-[400px]">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                </div>
                            )}
                        </div>
                    )}
                    {isMessages && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-right-10 duration-700">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{t('dashboard.sidebar_messages')} 💬</h1>
                            <AdminChatPanel token={token} />
                        </div>
                    )}
                    {isSettings && (
                        <div className="max-w-6xl mx-auto animate-in slide-in-from-left-10 duration-700 pb-20">
                            <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">{language === 'ar' ? 'الإعدادات' : 'Settings'} ⚙️</h1>
                            <AdminSettings token={token} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
