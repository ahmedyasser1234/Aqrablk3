import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const SupportEmailsManagement = ({ token, compact = false, onUpdate }) => {
    const { language } = useLanguage();
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingEmail, setEditingEmail] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editName, setEditName] = useState('');
    const [editPassword, setEditPassword] = useState('');

    const fetchEmails = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/support-emails`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch support emails');
            const data = await res.json();
            setEmails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleAddEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/support-emails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: newEmail,
                    name: newName,
                    password: newPassword
                })
            });
            if (!res.ok) throw new Error('Failed to add support account');
            const added = await res.json();
            setEmails([...emails, added]);
            setNewEmail('');
            setNewName('');
            setNewPassword('');
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const body = { username: editValue, name: editName };
            if (editPassword) body.password = editPassword;

            const res = await fetch(`${API_BASE_URL}/support-emails/${editingEmail.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Failed to update support account');
            const updated = await res.json();
            setEmails(emails.map(e => e.id === updated.id ? updated : e));
            setEditingEmail(null);
            setEditValue('');
            setEditName('');
            setEditPassword('');
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/support-emails/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            setEmails(emails.filter(e => e.id !== id));
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className={`space-y-8 animate-in fade-in duration-500 ${compact ? '' : 'pb-20'}`}>
            <div className={`bg-white/5 border border-white/10 rounded-[2.5rem] ${compact ? 'p-6' : 'p-8'} backdrop-blur-3xl`}>
                <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-white mb-8 flex items-center gap-4`}>
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    {language === 'ar' ? 'إدارة حسابات الدعم' : 'Support Accounts Management'}
                </h2>

                {editingEmail ? (
                    <form onSubmit={handleUpdate} className="flex flex-col gap-6 mb-10 p-6 bg-purple-600/10 border border-purple-500/20 rounded-3xl animate-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                                required
                            />
                            <input
                                type="text"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                placeholder={language === 'ar' ? 'اسم المستخدم / الإيميل' : 'Username / Email'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                                required
                            />
                            <input
                                type="password"
                                value={editPassword}
                                onChange={e => setEditPassword(e.target.value)}
                                placeholder={language === 'ar' ? 'كلمة السر (اتركها فارغة للتجاهل)' : 'Password (leave blank to skip)'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-4 rounded-2xl transition-all active:scale-95">
                                {language === 'ar' ? 'حفظ' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setEditingEmail(null)} className="bg-white/5 hover:bg-white/10 text-white font-black px-8 py-4 rounded-2xl transition-all">
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleAddEmail} className="flex flex-col gap-6 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                                required
                            />
                            <input
                                type="text"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                placeholder={language === 'ar' ? 'اسم المستخدم / الإيميل' : 'Username / Email'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                                required
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder={language === 'ar' ? 'كلمة السر' : 'Password'}
                                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all font-medium"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-black px-12 py-4 rounded-2xl shadow-lg transition-all active:scale-95 whitespace-nowrap">
                            {language === 'ar' ? 'إضافة حساب دعم جديد' : 'Add Support Account'}
                        </button>
                    </form>
                )}

                <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                    {emails.map(e => (
                        <div key={e.id} className="bg-black/40 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-4 group hover:border-purple-500/30 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-white font-bold truncate">{e.name || (language === 'ar' ? 'بدون اسم' : 'No Name')}</span>
                                        <span className="text-white/40 text-xs truncate">{e.username}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingEmail(e); setEditValue(e.username); setEditName(e.name || ''); setEditPassword(''); }} className="text-blue-500 hover:text-blue-400 p-2 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(e.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupportEmailsManagement;
