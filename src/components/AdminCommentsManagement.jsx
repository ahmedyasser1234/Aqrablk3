import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import LoadingSpinner from './LoadingSpinner';

const AdminCommentsManagement = ({ token }) => {
    const { language } = useLanguage();
    const { showAlert, showConfirm } = useModal();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/comments/${id}/approve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                showAlert(language === 'ar' ? 'تمت الموافقة على التعليق ✅' : 'Comment approved ✅', 'success');
                fetchComments();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (id) => {
        showConfirm(
            language === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Are you sure you want to delete this comment?',
            async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        showAlert(language === 'ar' ? 'تم حذف التعليق' : 'Comment deleted', 'success');
                        fetchComments();
                    }
                } catch (err) {
                    console.error(err);
                    showAlert(language === 'ar' ? 'فشل حذف التعليق' : 'Failed to delete comment', 'error');
                }
            },
            null,
            language === 'ar' ? 'تنبيه' : 'Warning',
            { type: 'warning' }
        );
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <h2 className="text-3xl font-black text-white mb-8">
                {language === 'ar' ? 'إدارة التعليقات' : 'Comments Moderation'} 🛡️
            </h2>

            <div className="grid grid-cols-1 gap-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${comment.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {comment.isApproved ? (language === 'ar' ? 'معتمد' : 'Approved') : (language === 'ar' ? 'معلق' : 'Pending')}
                                    </span>
                                    <h4 className="text-white font-bold">{comment.name}</h4>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(comment.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">
                                    {language === 'ar' ? 'على مقال:' : 'On Post:'} <span className="text-blue-400 italic">"{language === 'ar' ? comment.blog?.titleAr : comment.blog?.titleEn}"</span>
                                </p>
                                <p className="text-gray-300 leading-relaxed italic">
                                    "{comment.content}"
                                </p>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                {!comment.isApproved && (
                                    <button
                                        onClick={() => handleApprove(comment.id)}
                                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 text-sm"
                                    >
                                        {language === 'ar' ? 'موافقة' : 'Approve'}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="flex-1 md:flex-none bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 text-sm border border-red-500/20"
                                >
                                    {language === 'ar' ? 'حذف' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-500">
                            {language === 'ar' ? 'لا توجد تعليقات حالياً' : 'No comments found'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCommentsManagement;
