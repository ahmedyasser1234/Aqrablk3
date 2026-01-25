import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';

const AdminSettings = ({ token }) => {
    const { t, language } = useLanguage();

    // Password Change State
    const [newPassword, setNewPassword] = useState('');
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);

    // New Admin State
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
    const [adminStatus, setAdminStatus] = useState({ type: '', msg: '' });
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setIsUpdatingPass(true);
        setPassStatus({ type: '', msg: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/users/me/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });
            if (!res.ok) throw new Error('Failed to update password');
            setPassStatus({ type: 'success', msg: language === 'ar' ? 'تم تحديث كلمة السر بنجاح' : 'Password updated successfully' });
            setNewPassword('');
        } catch (err) {
            setPassStatus({ type: 'error', msg: err.message });
        } finally {
            setIsUpdatingPass(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setIsCreatingAdmin(true);
        setAdminStatus({ type: '', msg: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAdmin)
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create admin');
            }
            setAdminStatus({ type: 'success', msg: language === 'ar' ? 'تم إضافة أدمن جديد بنجاح' : 'New admin added successfully' });
            setNewAdmin({ username: '', password: '' });
        } catch (err) {
            setAdminStatus({ type: 'error', msg: err.message });
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Change Password Section */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    {language === 'ar' ? 'تغيير كلمة السر' : 'Change Password'}
                </h2>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'كلمة السر الجديدة' : 'New Password'}</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {passStatus.msg && (
                        <p className={`text-sm font-bold text-center ${passStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{passStatus.msg}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isUpdatingPass}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                    >
                        {isUpdatingPass ? '...' : (language === 'ar' ? 'تحديث كلمة السر' : 'Update Password')}
                    </button>
                </form>
            </div>

            {/* Add New Admin Section */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-green-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    {language === 'ar' ? 'إضافة أدمن جديد' : 'Add New Admin'}
                </h2>

                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                        <input
                            type="text"
                            value={newAdmin.username}
                            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-green-500 transition-all text-white"
                            placeholder="admin_name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'كلمة السر' : 'Password'}</label>
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-green-500 transition-all text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        {adminStatus.msg && (
                            <p className={`text-sm font-bold text-center mb-4 ${adminStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{adminStatus.msg}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isCreatingAdmin}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                        >
                            {isCreatingAdmin ? '...' : (language === 'ar' ? 'إنشاء حساب أدمن' : 'Create Admin Account')}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default AdminSettings;
