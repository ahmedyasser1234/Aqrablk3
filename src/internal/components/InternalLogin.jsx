import React, { useState } from 'react';

const InternalLogin = ({ onLogin, loading }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const success = await onLogin(username, password);
        if (!success) {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة');
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4 relative overflow-hidden transition-colors duration-500" dir="rtl">
            {/* Background glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <div className="backdrop-blur-xl bg-[var(--bg-card)] border border-[var(--border-main)] p-10 rounded-[2rem] shadow-2xl space-y-8">
                    {/* Logo */}
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-[0_20px_50px_var(--shadow-btn)]">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)]">نظام الإدارة الداخلي</h1>
                            <p className="text-xs text-[var(--text-dim)] font-bold uppercase tracking-[0.2em] mt-2">AQRAB MEDIA · INTERNAL OPS</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest block">
                                اسم المستخدم
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3.5 px-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-blue-500/60 focus:bg-[var(--bg-card-hover)] transition-all placeholder:text-[var(--text-dim)]"
                                placeholder="أدخل اسم المستخدم"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest block">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3.5 px-4 pl-12 text-sm font-bold text-[var(--text-main)] outline-none focus:border-blue-500/60 focus:bg-[var(--bg-card-hover)] transition-all placeholder:text-[var(--text-dim)] font-mono"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all z-10"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold px-4 py-3 rounded-xl">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || loading}
                            className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-[0_10px_40px_var(--shadow-btn)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : 'تسجيل الدخول'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InternalLogin;
