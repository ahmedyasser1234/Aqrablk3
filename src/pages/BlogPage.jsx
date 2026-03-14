import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import ScrollReveal from '../components/ScrollReveal';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogPage = () => {
    const { language, t } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/blog`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <h1 className="text-4xl md:text-7xl font-black text-center mb-16 glow-text text-[var(--text-color)]">
                        {language === 'ar' ? 'المدونة' : 'Blog'} ✍️
                    </h1>
                </ScrollReveal>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map((blog, index) => (
                            <ScrollReveal key={blog.id} delay={index * 0.1}>
                                <Link to={`/${language}/blog/${blog.slug}`} className="block bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden group hover:border-blue-500/50 transition-all hover:translate-y-[-10px]">
                                    <div className="aspect-video overflow-hidden">
                                        <div className="aspect-video overflow-hidden relative">
                                            {blog.videoId ? (
                                                <>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${blog.videoId}/maxresdefault.jpg`}
                                                        alt={language === 'ar' ? blog.titleAr : blog.titleEn}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : blog.imagePath && (
                                                <img
                                                    src={`${blog.imagePath.startsWith('http') ? '' : API_BASE_URL.replace('/api', '')}${blog.imagePath}`}
                                                    alt={language === 'ar' ? blog.titleAr : blog.titleEn}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                {language === 'ar' ? blog.categoryAr : blog.categoryEn}
                                            </span>
                                            <span className="text-[var(--text-color)]/60 text-xs">
                                                {new Date(blog.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black text-[var(--text-color)] mb-4 line-clamp-2">
                                            {language === 'ar' ? blog.titleAr : blog.titleEn}
                                        </h2>
                                        <p className="text-[var(--text-color)]/60 leading-relaxed line-clamp-3 mb-6">
                                            {stripHtml(language === 'ar' ? blog.contentAr : blog.contentEn)}
                                        </p>
                                        <span className="text-blue-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                            {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={language === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} /></svg>
                                        </span>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
