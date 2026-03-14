import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminRequestsPanel = ({ token }) => {
    const { t, language } = useLanguage();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [token]);

    const updateStatus = async (id, status) => {
        try {
            const user = JSON.parse(localStorage.getItem('auth_user'));
            const handledBy = user?.username || 'admin';

            const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, handledBy })
            });

            if (res.ok) {
                fetchRequests(); // Refresh list to ensure sync
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRequest = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-2xl shadow-2xl">
            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">{language === 'ar' ? 'لا توجد طلبات جديدة' : 'No requests found'}</p>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-black/20 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{req.service}</h3>
                                    <p className="text-sm text-blue-400 font-mono">{req.name}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : req.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {req.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-4 bg-white/5 p-4 rounded-xl">
                                <p><span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Email</span> <span className="text-white select-all">{req.email}</span></p>
                                <p><span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Phone</span> <span className="text-white select-all">{req.phone}</span></p>
                                {req.description && (
                                    <p className="md:col-span-2"><span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Details</span> <span className="text-white">{req.description}</span></p>
                                )}
                                {req.handledBy && (
                                    <p className="md:col-span-2"><span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Accepted By</span> <span className="text-green-400 font-bold">{req.handledBy}</span></p>
                                )}
                                <p className="md:col-span-2 text-xs text-gray-600 mt-2">{new Date(req.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                            </div>

                            <div className="flex gap-2 justify-end">
                                {req.status === 'pending' && (
                                    <button onClick={() => updateStatus(req.id, 'completed')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all">
                                        {language === 'ar' ? 'تم التنفيذ' : 'Mark Completed'}
                                    </button>
                                )}
                                <button onClick={() => deleteRequest(req.id)} className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all">
                                    {language === 'ar' ? 'حذف' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminRequestsPanel;
