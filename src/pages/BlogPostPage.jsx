import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import ScrollReveal from '../components/ScrollReveal';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogPostPage = () => {
    const { slug } = useParams();
    const { language } = useLanguage();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/blog/${slug}`)
            .then(res => res.json())
            .then(data => setBlog(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingSpinner fullPage />;

    if (!blog) return (
        <div className="min-h-screen pt-40 px-6 text-center text-[var(--text-color)]">
            <h1 className="text-4xl font-black mb-4">404</h1>
            <p className="text-[var(--text-color)]/60">Post not found</p>
        </div>
    );

    const title = language === 'ar' ? blog.titleAr : blog.titleEn;
    const content = language === 'ar' ? blog.contentAr : blog.contentEn;
    const category = language === 'ar' ? blog.categoryAr : blog.categoryEn;

    return (
        <div className="min-h-screen pt-32 md:pt-48 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-4 mb-8">
                        <Link to={`/${language}/blog`} className="text-blue-500 flex items-center gap-2 hover:gap-4 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} /></svg>
                            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {category}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {new Date(blog.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-[var(--text-color)] mb-12 glow-text leading-tight">
                        {title}
                    </h1>

                    {blog.videoId ? (
                        <div className="rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] mb-12 aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${blog.videoId}`}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : blog.imagePath && (
                        <div className="rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] mb-12 aspect-[21/9]">
                            <img
                                src={`${blog.imagePath.startsWith('http') ? '' : API_BASE_URL.replace('/api', '')}${blog.imagePath}`}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[3rem] p-8 md:p-12 backdrop-blur-sm mb-12">
                        <div
                            className="prose prose-invert prose-lg max-w-none text-[var(--text-color)]/80 leading-loose"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Social Sharing */}
                    <div className="flex flex-wrap items-center gap-4 mb-16 p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl">
                        <span className="text-[var(--text-color)]/60 font-bold uppercase tracking-wider text-sm">
                            {language === 'ar' ? 'شارك المقال:' : 'Share Post:'}
                        </span>
                        <div className="flex gap-3">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(title + " " + window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-12">
                        <h3 className="text-3xl font-black text-[var(--text-color)] flex items-center gap-3">
                            {language === 'ar' ? 'التعليقات' : 'Comments'} 💬
                        </h3>

                        {/* Comment Form */}
                        <CommentForm blogId={blog.id} language={language} />

                        {/* Comments List */}
                        <div className="space-y-6">
                            {blog.comments && blog.comments.length > 0 ? (
                                blog.comments.map((comment) => (
                                    <div key={comment.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[2rem] animate-in slide-in-from-bottom-5 duration-500">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                                                {comment.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-[var(--text-color)] font-bold">{comment.name}</h4>
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(comment.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[var(--text-color)]/70 leading-relaxed pl-14">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[var(--text-color)]/50 text-center py-10 bg-[var(--card-bg)] rounded-[2rem] border border-dashed border-[var(--border-color)]">
                                    {language === 'ar' ? 'لا توجد تعليقات بعد .. كن أول المعلقين' : 'No comments yet. Be the first to comment!'}
                                </p>
                            )}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

const CommentForm = ({ blogId, language }) => {
    const [formData, setFormData] = useState({ name: '', content: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    content: formData.content,
                    blog: { id: blogId }
                })
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', content: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[var(--text-color)]/60 text-sm mb-2 px-2">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-color)] focus:border-blue-500 outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-[var(--text-color)]/60 text-sm mb-2 px-2">{language === 'ar' ? 'التعليق' : 'Comment'}</label>
                <textarea
                    required
                    className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-color)] focus:border-blue-500 outline-none transition-all h-32 resize-none"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
            </div>
            <button
                disabled={status === 'submitting'}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
                {status === 'submitting' ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </div>
                ) : status === 'success' ? (
                    language === 'ar' ? 'تم الإرسال (في انتظار المراجعة) ✅' : 'Sent (Awaiting Moderation) ✅'
                ) : (
                    language === 'ar' ? 'إرسال التعليق' : 'Post Comment'
                )}
            </button>
        </form>
    );
};

export default BlogPostPage;
