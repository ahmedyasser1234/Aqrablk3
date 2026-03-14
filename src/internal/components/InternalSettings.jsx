import React, { useState } from 'react';
import { API, BASE_URL } from '../InternalSystem';

const InternalSettings = ({ user, setUser }) => {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const res = await fetch(`${API}/internal/employees/upload`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const { url } = await res.json();
                // Ensure the URL is absolute using BASE_URL (no /api prefix)
                const finalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
                setAvatar(finalUrl);
                setMessage({ text: 'تم رفع الصورة بنجاح، لا تنسى حفظ التغييرات', type: 'success' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ text: 'فشل رفع الصورة', type: 'error' });
        }
        setLoading(false);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        if (user.id === 0 || user.role === 'Chairman') {
            const res = await fetch(`${API}/internal/auth/admin-profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, avatar, role: user.role })
            });
            if (res.ok) {
                const updated = await res.json();
                const newUser = { ...user, name: updated.name, avatar: updated.avatar };
                localStorage.setItem('internal_user', JSON.stringify(newUser));
                setUser(newUser);
                setMessage({ text: user.role === 'Chairman' ? 'تم تحديث بيانات مجلس الإدارة بنجاح' : 'تم تحديث بيانات المدير بنجاح', type: 'success' });
            } else {
                setMessage({ text: 'فشل تحديث البيانات', type: 'error' });
            }
            setLoading(false);
            return;
        }

            const res = await fetch(`${API}/internal/employees/${user.id}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, avatar })
            });
            if (res.ok) {
                const updated = await res.json();
                const newUser = { ...user, name: updated.name, avatar: updated.avatar };
                localStorage.setItem('internal_user', JSON.stringify(newUser));
                setUser(newUser);
                setMessage({ text: 'تم تحديث البيانات بنجاح', type: 'success' });
            } else {
                setMessage({ text: 'فشل تحديث البيانات', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'خطأ في الاتصال بالسيرفر', type: 'error' });
        }
        setLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            setMessage({ text: 'كلمات المرور غير متطابقة', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/internal/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: user.id, oldPass, newPass })
            });
            if (res.ok) {
                setMessage({ text: 'تم تغيير كلمة المرور بنجاح', type: 'success' });
                setOldPass('');
                setNewPass('');
                setConfirmPass('');
            } else {
                const errData = await res.json();
                setMessage({ text: errData.message || 'فشل تغيير كلمة المرور', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'خطأ في الاتصال بالسيرفر', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-right">
                <h1 className="text-3xl font-black text-[var(--text-main)]">إعدادات الحساب</h1>
                <p className="text-sm text-[var(--text-dim)] font-bold mt-1">تعديل بيانات ملفك الشخصي وتأمين حسابك</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-[var(--bg-sidebar)] border border-[var(--border-main)] rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-blue-500/10" />
                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[var(--text-main)]">البيانات الشخصية</h2>
                            <p className="text-sm text-[var(--text-dim)] font-bold">تعديل اسمك وصورة الحساب</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex flex-col gap-4 py-2">
                            <div className="flex items-center gap-4">
                                <img
                                    src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1e3a5f&textColor=60a5fa`}
                                    className="w-20 h-20 rounded-2xl border border-[var(--border-main)] object-cover bg-[var(--bg-input)] shadow-lg"
                                    alt="Avatar Preview"
                                />
                                <div className="flex-1 space-y-2">
                                    <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">صورة الملف الشخصي</label>
                                    <div className="flex gap-2">
                                        <label className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/20 py-2.5 rounded-xl text-[11px] font-black cursor-pointer transition-all flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            رفع من الجهاز
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">أو ضع رابط الصورة</label>
                                <input
                                    value={avatar}
                                    onChange={e => setAvatar(e.target.value)}
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-2.5 px-3 text-[12px] text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all"
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">اسم المستخدم</label>
                            <input
                                disabled
                                value={user.username}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-muted)] font-bold outline-none cursor-not-allowed opacity-60"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">الاسم الكامل *</label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all"
                                placeholder="ادخل اسمك الكامل"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">القسم</label>
                            <input
                                disabled
                                value={user.role === 'Chairman' ? 'مجلس الإدارة' : (user.department || 'إدارة')}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-muted)] font-bold outline-none cursor-not-allowed opacity-60"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-[0_8px_24px_var(--shadow-btn)] mt-2"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-main)]">
                        <div className="w-10 h-10 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h2 className="font-black text-lg text-[var(--text-main)]">تأمين الحساب</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">كلمة المرور الحالية</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showOldPass ? "text" : "password"}
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 pl-12 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPass(!showOldPass)}
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all z-10"
                                >
                                    {showOldPass ? (
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
                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showNewPass ? "text" : "password"}
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 pl-12 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all font-mono"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all z-10"
                                >
                                    {showNewPass ? (
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
                        <div className="space-y-1.5">
                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest px-1">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <input
                                    required
                                    type={showConfirmPass ? "text" : "password"}
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 pl-12 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all font-mono"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all z-10"
                                >
                                    {showConfirmPass ? (
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
                        <button
                            type="submit"
                            disabled={loading || (user.role !== 'Chairman' && user.id === 0)}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-[0_8px_24px_rgba(234,88,12,0.25)] mt-2"
                        >
                            {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InternalSettings;
