import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';

const AdminMarketingManagement = ({ token }) => {
    const { language } = useLanguage();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('solution'); // 'solution' or 'step'
    const [newItem, setNewItem] = useState({ title: '', description: '', icon: '', order: 0 });

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/marketing`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/marketing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...newItem, category: selectedTab })
            });
            if (res.ok) {
                setNewItem({ title: '', description: '', icon: '', order: 0 });
                fetchItems();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await fetch(`${API_BASE_URL}/marketing/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const tabItems = items.filter(i => i.category === selectedTab);

    return (
        <div className="bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">{language === 'ar' ? 'إدارة محتوى التسويق' : 'Marketing Content CMS'} 📈</h2>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setSelectedTab('solution')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedTab === 'solution' ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'}`}
                >
                    {language === 'ar' ? 'الحلول التسويقية' : 'Marketing Solutions'}
                </button>
                <button
                    onClick={() => setSelectedTab('step')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedTab === 'step' ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'}`}
                >
                    {language === 'ar' ? 'خطوات العمل' : 'Methodology Steps'}
                </button>
            </div>

            <form onSubmit={handleAdd} className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newItem.title}
                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
                        required
                    />
                    {selectedTab === 'solution' && (
                        <input
                            type="text"
                            placeholder="Icon (SVG path or Emoji)"
                            value={newItem.icon}
                            onChange={e => setNewItem({ ...newItem, icon: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
                        />
                    )}
                </div>
                <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 h-24"
                    required
                />
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all">
                    Add Item
                </button>
            </form>

            <div className="space-y-4">
                {tabItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-pink-500/30 transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {item.icon && <span className="text-2xl">{item.icon}</span>}
                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMarketingManagement;
