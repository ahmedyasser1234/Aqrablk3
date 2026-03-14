import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminManagement = ({ token }) => {
    const { t, language } = useLanguage();
    const { showAlert, showConfirm } = useModal();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [newPass, setNewPass] = useState('');

    // New Admin Form State
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '', name: '', role: 'support' });
    const [isCreating, setIsCreating] = useState(false);

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch admins');
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
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
            const added = await res.json();
            setAdmins([...admins, added]);
            setNewAdmin({ username: '', password: '', name: '', role: 'support' });
            showAlert(
                language === 'ar' ? 'تمت إضافة المشرف بنجاح' : 'Admin added successfully',
                language === 'ar' ? 'نجاح' : 'Success',
                'success'
            );
        } catch (err) {
            showAlert(err.message, language === 'ar' ? 'خطأ' : 'Error', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        showConfirm(
            language === 'ar' ? 'هل أنت متأكد من حذف هذا الأدمن؟' : 'Are you sure you want to delete this admin?',
            async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Failed to delete admin');
                    setAdmins(prev => prev.filter(admin => admin.id !== id));
                    showAlert(
                        language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully',
                        language === 'ar' ? 'نجاح' : 'Success',
                        'success'
                    );
                } catch (err) {
                    showAlert(err.message, language === 'ar' ? 'خطأ' : 'Error', 'error');
                }
            },
            null,
            language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
            { type: 'error', confirmText: language === 'ar' ? 'حذف' : 'Delete' }
        );
    };

    const handleUpdatePass = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/users/${editingAdmin.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPass })
            });
            if (!res.ok) throw new Error('Failed to update password');
            showAlert(
                language === 'ar' ? 'تم تحديث كلمة السر بنجاح' : 'Password updated successfully',
                language === 'ar' ? 'نجاح' : 'Success',
                'success'
            );
            setEditingAdmin(null);
            setNewPass('');
        } catch (err) {
            showAlert(err.message, language === 'ar' ? 'خطأ' : 'Error', 'error');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Create Section */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-green-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    {language === 'ar' ? 'إضافة مشرف جديد' : 'Create New Admin'}
                </h2>

                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                        <input
                            type="text"
                            value={newAdmin.username}
                            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-green-500 transition-all font-medium"
                            placeholder="admin_user"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'كلمة السر' : 'Password'}</label>
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-green-500 transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'الاسم المعروض' : 'Display Name'}</label>
                        <input
                            type="text"
                            value={newAdmin.name}
                            onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-green-500 transition-all font-medium"
                            placeholder="Support Person"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{language === 'ar' ? 'الصلاحيات' : 'Role'}</label>
                        <select
                            value={newAdmin.role}
                            onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-green-500 transition-all font-medium"
                        >
                            <option value="support" className="bg-[#15182b]">Support (Limited)</option>
                            <option value="superadmin" className="bg-[#15182b]">Superadmin (Full Access)</option>
                        </select>
                    </div>
                    <div className="lg:col-span-4">
                        <button type="submit" disabled={isCreating} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                            {isCreating ? '...' : (language === 'ar' ? 'إنشاء حساب المشرف' : 'Create Admin Account')}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    {language === 'ar' ? 'المشرفون الحاليون' : 'Current Admins'}
                </h2>

                {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-2xl mb-6 text-center font-bold border border-red-500/20">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.map(admin => (
                        <div key={admin.id} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] relative group hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xl">
                                    {admin.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{admin.username}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${admin.role === 'superadmin' ? 'bg-yellow-500 text-black' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                                        {admin.role}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingAdmin(admin)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-xl transition-all border border-white/5"
                                >
                                    {language === 'ar' ? 'تغيير الباسورد' : 'Edit Pass'}
                                </button>
                                {admin.role !== 'superadmin' && (
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="w-10 h-10 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center rounded-xl transition-all border border-red-600/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Password Change */}
            {editingAdmin && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
                    <div className="bg-[#15182b] border border-white/10 w-full max-w-md p-8 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-black text-white mb-6">
                            {language === 'ar' ? `تغيير باسورد ${editingAdmin.username}` : `Edit password for ${editingAdmin.username}`}
                        </h3>
                        <form onSubmit={handleUpdatePass} className="space-y-6">
                            <input
                                type="password"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                                    {language === 'ar' ? 'حفظ' : 'Save'}
                                </button>
                                <button type="button" onClick={() => setEditingAdmin(null)} className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
