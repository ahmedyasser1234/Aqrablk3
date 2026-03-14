import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminChatbotManagement = ({ token }) => {
    const { language } = useLanguage();
    const { showAlert, showConfirm } = useModal();
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ keyword: '', answer: '', category: 'prices', language: 'ar' });
    const [editingId, setEditingId] = useState(null);

    const fetchKnowledge = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/chatbot/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setKnowledge(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PATCH' : 'POST';
        const url = editingId ? `${API_BASE_URL}/chatbot/${editingId}` : `${API_BASE_URL}/chatbot`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showAlert(
                    language === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Knowledge saved successfully',
                    'Success',
                    'success'
                );
                setFormData({ keyword: '', answer: '', category: 'prices', language: 'ar' });
                setEditingId(null);
                fetchKnowledge();
            }
        } catch (err) {
            showAlert(err.message, 'Error', 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm(
            language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this?',
            async () => {
                try {
                    await fetch(`${API_BASE_URL}/chatbot/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    fetchKnowledge();
                } catch (err) {
                    showAlert(err.message, 'Error', 'error');
                }
            }
        );
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    {language === 'ar' ? 'إدارة ردود البوت الذكي' : 'Manage AI Bot Answers'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase px-2">{language === 'ar' ? 'الكلمة المفتاحية' : 'Keyword'}</label>
                        <input
                            type="text"
                            value={formData.keyword}
                            onChange={e => setFormData({ ...formData, keyword: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                            placeholder={language === 'ar' ? 'مثلاً: سعر، أسعار، موشن' : 'e.g. Price, Motion, Time'}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase px-2">{language === 'ar' ? 'اللغة' : 'Language'}</label>
                        <select
                            value={formData.language}
                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium"
                        >
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-500 uppercase px-2">{language === 'ar' ? 'الرد الذكي' : 'AI Answer'}</label>
                        <textarea
                            value={formData.answer}
                            onChange={e => setFormData({ ...formData, answer: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all h-32"
                            placeholder={language === 'ar' ? 'اكتب الرد الذي سيقوم البوت بإرساله...' : 'Write the answer the bot will send...'}
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                            {editingId ? (language === 'ar' ? 'تحديث' : 'Update') : (language === 'ar' ? 'إضافة رد جديد' : 'Add New Answer')}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ keyword: '', answer: '', category: 'prices', language: 'ar' }); }} className="bg-white/5 text-white font-bold py-4 px-8 rounded-2xl border border-white/10">
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {knowledge.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-4 group hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start">
                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase px-2 py-1 rounded-full">{item.language}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingId(item.id); setFormData(item); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-white text-lg mb-2">{item.keyword}</h4>
                            <p className="text-gray-400 text-sm line-clamp-3">{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminChatbotManagement;
