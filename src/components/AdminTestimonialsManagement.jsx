import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminTestimonialsManagement = ({ token }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTestimonials(data);
        } catch (err) {
            console.error('Failed to fetch testimonials', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
        // Mark all as read when admin opens the panel
        fetch(`${API_BASE_URL}/testimonials/mark-all-read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error('Failed to mark all as read', err));
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await fetch(`${API_BASE_URL}/testimonials/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchTestimonials();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await fetch(`${API_BASE_URL}/testimonials/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTestimonials(testimonials.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    return (
        <div className="bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Manage Reviews</h2>
                <button onClick={fetchTestimonials} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-4">
                    {testimonials.length === 0 && <p className="text-center text-gray-500 py-10">No reviews found.</p>}
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {t.imagePath ? (
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                            <img src={`${API_BASE_URL}${t.imagePath}`} alt={t.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-none">{t.name}</h3>
                                        {t.role && <span className="text-xs text-blue-400">{t.role}</span>}
                                    </div>
                                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${t.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {t.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 italic mb-2">"{t.content}"</p>
                                <div className="flex gap-1 text-yellow-500 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < t.rating ? "text-yellow-500" : "text-gray-700"}>★</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {t.status === 'pending' && (
                                    <button onClick={() => handleStatusUpdate(t.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                        Approve
                                    </button>
                                )}
                                {t.status === 'approved' && (
                                    <button onClick={() => handleStatusUpdate(t.id, 'pending')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                        Hide
                                    </button>
                                )}
                                <button onClick={() => handleDelete(t.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTestimonialsManagement;
