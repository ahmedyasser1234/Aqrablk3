import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminChatbotConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [welcomeMessageEn, setWelcomeMessageEn] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState({ keyword: '', response: '', responseEn: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/chatbot-config`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setConfig(data);
            setWelcomeMessage(data.welcomeMessage || '');
            setWelcomeMessageEn(data.welcomeMessageEn || '');
            setKeywords(data.keywords || []);
        } catch (err) {
            console.error('Failed to fetch config:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_BASE_URL}/chatbot-config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    welcomeMessage,
                    welcomeMessageEn,
                    keywords
                })
            });
            alert('تم الحفظ بنجاح!');
            fetchConfig();
        } catch (err) {
            console.error('Failed to save config:', err);
            alert('فشل الحفظ!');
        } finally {
            setSaving(false);
        }
    };

    const handleAddKeyword = async () => {
        if (!newKeyword.keyword || !newKeyword.response) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_BASE_URL}/chatbot-config/keywords`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newKeyword)
            });
            setNewKeyword({ keyword: '', response: '', responseEn: '' });
            fetchConfig();
        } catch (err) {
            console.error('Failed to add keyword:', err);
        }
    };

    const handleRemoveKeyword = async (keyword) => {
        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_BASE_URL}/chatbot-config/keywords/${encodeURIComponent(keyword)}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchConfig();
        } catch (err) {
            console.error('Failed to remove keyword:', err);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-[var(--text-color)]">إدارة البوت الذكي 🤖</h2>
                <button
                    onClick={handleSaveConfig}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>

            {/* Welcome Messages */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">رسالة الترحيب</h3>

                <div>
                    <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">الرسالة بالعربية</label>
                    <textarea
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-color)] focus:border-blue-500 outline-none h-24"
                        placeholder="مرحباً! كيف يمكنني مساعدتك؟"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">الرسالة بالإنجليزية</label>
                    <textarea
                        value={welcomeMessageEn}
                        onChange={(e) => setWelcomeMessageEn(e.target.value)}
                        className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-color)] focus:border-blue-500 outline-none h-24"
                        placeholder="Hello! How can I help you?"
                    />
                </div>
            </div>

            {/* Keywords */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">الكلمات المفتاحية والردود</h3>

                {/* Add New Keyword */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[var(--bg-color)]/30 rounded-2xl border border-dashed border-[var(--border-color)]">
                    <input
                        type="text"
                        placeholder="الكلمة المفتاحية (مثال: سعر موشن)"
                        value={newKeyword.keyword}
                        onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                        className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="الرد بالعربية"
                        value={newKeyword.response}
                        onChange={(e) => setNewKeyword({ ...newKeyword, response: e.target.value })}
                        className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="الرد بالإنجليزية"
                        value={newKeyword.responseEn}
                        onChange={(e) => setNewKeyword({ ...newKeyword, responseEn: e.target.value })}
                        className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                    />
                    <button
                        onClick={handleAddKeyword}
                        className="md:col-span-3 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                    >
                        إضافة كلمة مفتاحية جديدة +
                    </button>
                </div>

                {/* Keywords List */}
                <div className="space-y-4">
                    {keywords.map((kw, index) => (
                        <div key={index} className="bg-[var(--bg-color)]/30 border border-[var(--border-color)] rounded-2xl p-6 flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-bold">
                                        {kw.keyword}
                                    </span>
                                </div>
                                <p className="text-[var(--text-color)]/80 text-sm">
                                    <strong>عربي:</strong> {kw.response}
                                </p>
                                <p className="text-[var(--text-color)]/80 text-sm">
                                    <strong>English:</strong> {kw.responseEn}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemoveKeyword(kw.keyword)}
                                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl font-bold hover:bg-red-600/30 transition-all"
                            >
                                حذف
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminChatbotConfig;
