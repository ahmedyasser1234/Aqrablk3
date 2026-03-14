import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import LoadingSpinner from './LoadingSpinner';

const AdminBlogManagement = ({ token }) => {
    const { showAlert, showConfirm } = useModal();
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
    const [formData, setFormData] = useState({
        titleAr: '', titleEn: '',
        contentAr: '', contentEn: '',
        categoryAr: 'General', categoryEn: 'General',
        slug: '', image: null, imageUrl: '', videoId: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/blog`);
            if (res.ok) setBlogs(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image') {
                if (uploadMode === 'file' && formData.image) {
                    data.append('image', formData.image);
                }
            } else if (key === 'imageUrl') {
                if (uploadMode === 'url' && formData.imageUrl) {
                    data.append('imagePath', formData.imageUrl);
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        const url = editingId ? `${API_BASE_URL}/blog/${editingId}` : `${API_BASE_URL}/blog`;
        const method = editingId ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                fetchBlogs();
                resetForm();
                showAlert(
                    language === 'ar' ? 'تم حفظ المقال بنجاح' : 'Post saved successfully',
                    language === 'ar' ? 'نجاح' : 'Success',
                    'success'
                );
            }
        } catch (err) {
            showAlert(err.message, language === 'ar' ? 'خطأ' : 'Error', 'error');
        }
    };

    const handleDelete = async (id) => {
        showConfirm(
            language === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this post?',
            async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        fetchBlogs();
                        showAlert(
                            language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully',
                            language === 'ar' ? 'نجاح' : 'Success',
                            'success'
                        );
                    }
                } catch (err) { showAlert(err.message, 'Error', 'error'); }
            },
            null,
            language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
            { type: 'error' }
        );
    };

    const handleEdit = (blog) => {
        setEditingId(blog.id);
        setFormData({
            titleAr: blog.titleAr, titleEn: blog.titleEn,
            contentAr: blog.contentAr, contentEn: blog.contentEn,
            categoryAr: blog.categoryAr, categoryEn: blog.categoryEn,
            slug: blog.slug, image: null, imageUrl: blog.imagePath || '', videoId: blog.videoId || ''
        });
        if (blog.imagePath && blog.imagePath.startsWith('http')) {
            setUploadMode('url');
        } else {
            setUploadMode('file');
        }
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            titleAr: '', titleEn: '',
            contentAr: '', contentEn: '',
            categoryAr: 'General', categoryEn: 'General',
            slug: '', image: null, imageUrl: '', videoId: ''
        });
        setUploadMode('file');
        setEditingId(null);
        setShowForm(false);
    };

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">إدارة المدونة (Blog) ✍️</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all"
                >
                    {showForm ? 'إلغاء' : 'إضافة مقال جديد'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSumbit} className="bg-[var(--glass-bg)] backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4 animate-in zoom-in-95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="العنوان بالعربي" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white" value={formData.titleAr} onChange={e => {
                            const val = e.target.value;
                            setFormData({ ...formData, titleAr: val, slug: generateSlug(val) });
                        }} />
                        <input required placeholder="Title (English)" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white text-end" dir="ltr" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea required placeholder="المحتوى بالعربي" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white h-40" value={formData.contentAr} onChange={e => setFormData({ ...formData, contentAr: e.target.value })} />
                        <textarea required placeholder="Content (English)" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white h-40 text-end" dir="ltr" value={formData.contentEn} onChange={e => setFormData({ ...formData, contentEn: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input required placeholder="الرابط (Slug)" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                        <input placeholder="التصنيف بالعربي" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white" value={formData.categoryAr} onChange={e => setFormData({ ...formData, categoryAr: e.target.value })} />
                        <input placeholder="Category (EN)" className="bg-black/40 p-4 rounded-xl border border-white/10 text-white" value={formData.categoryEn} onChange={e => setFormData({ ...formData, categoryEn: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1">
                        <input
                            placeholder="رابط فيديو يوتيوب (اختياري) - YouTube Video URL (Optional)"
                            className="bg-black/40 p-4 rounded-xl border border-white/10 text-white font-mono text-sm"
                            dir="ltr"
                            value={formData.videoId || ''}
                            onChange={e => {
                                const val = e.target.value;
                                // Simple extraction for common YouTube formats
                                let id = val;
                                try {
                                    if (val.includes('youtube.com/watch')) {
                                        id = new URL(val).searchParams.get('v');
                                    } else if (val.includes('youtu.be/')) {
                                        id = val.split('youtu.be/')[1].split('?')[0];
                                    }
                                } catch (e) { }
                                setFormData({ ...formData, videoId: id });
                            }}
                        />
                        {formData.videoId && (
                            <div className="mt-2 text-xs text-green-400">
                                Detected Video ID: {formData.videoId}
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 rounded-xl p-4 bg-white/5 user-select-none">
                        <label className="block text-gray-400 mb-4">{language === 'ar' ? 'صورة المقال' : 'Post Image'}</label>
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`flex-1 py-2 rounded-lg transition-all ${uploadMode === 'file' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
                            >
                                {language === 'ar' ? 'رفع ملف' : 'Upload File'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('url')}
                                className={`flex-1 py-2 rounded-lg transition-all ${uploadMode === 'url' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
                            >
                                {language === 'ar' ? 'رابط خارجي' : 'External URL'}
                            </button>
                        </div>

                        {uploadMode === 'file' ? (
                            <input
                                type="file"
                                onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                                className="w-full text-gray-400 file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer"
                            />
                        ) : (
                            <input
                                placeholder={language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                                className="w-full bg-black/40 p-4 rounded-xl border border-white/10 text-white text-end"
                                dir="ltr"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        )}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold hover:bg-blue-700 transition-all">
                        {editingId ? 'تحديث المقال' : 'نشر المقال'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
                        {blog.imagePath && (
                            <img src={`${blog.imagePath.startsWith('http') ? '' : API_BASE_URL.replace('/api', '')}${blog.imagePath}`} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{blog.titleAr}</h3>
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">{blog.contentAr}</p>
                            <div className="flex justify-between gap-2">
                                <button onClick={() => handleEdit(blog)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl transition-all">تعديل</button>
                                <button onClick={() => handleDelete(blog)} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded-xl transition-all">حذف</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBlogManagement;
