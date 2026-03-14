import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import ScrollReveal from '../components/ScrollReveal';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { language, t } = useLanguage();
    const { lang } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState({ blogs: [], services: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const hasResults = results.blogs.length > 0 || results.services.length > 0;

    const getServiceLink = (category) => {
        const map = {
            'motion': '/services/motion-graphics',
            'collage': '/services/motion-graphics',
            'whiteboard': '/services/motion-graphics',
            'montage_vertical': '/services/montage',
            'montage_horizontal': '/services/montage',
            'photography_session': '/services/photography',
            'photography_bts': '/services/photography',
            'design_branding': '/services/design',
            'design_graphic': '/services/design',
            'web_portfolio': '/services/web-design',
            'shopify_portfolio': '/services/web-design',
            'content_samples': '/services/content-writing'
        };
        return map[category] || '/services';
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <h1 className="text-4xl md:text-6xl font-black text-[var(--text-color)] mb-4">
                        {language === 'ar' ? 'نتائج البحث عن:' : 'Search Results for:'}
                        <span className="text-blue-500 ml-4">"{query}"</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        {loading
                            ? (language === 'ar' ? 'جاري البحث...' : 'Searching...')
                            : hasResults
                                ? (language === 'ar' ? `تم العثور على ${results.blogs.length + results.services.length} نتيجة` : `Found ${results.blogs.length + results.services.length} results`)
                                : (language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found')
                        }
                    </p>
                </ScrollReveal>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-20">
                        {/* Blogs Section */}
                        {results.blogs.length > 0 && (
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-8 border-l-4 border-blue-600 pl-4">
                                    {language === 'ar' ? 'المقالات' : 'Blog Posts'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.blogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            onClick={() => navigate(`/${lang}/blog/${blog.slug}`)}
                                            className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer"
                                        >
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={blog.imagePath ? (blog.imagePath.startsWith('http') ? blog.imagePath : `${API_BASE_URL.replace('/api', '')}${blog.imagePath}`) : '/placeholder-blog.jpg'}
                                                    alt={language === 'ar' ? blog.titleAr : blog.titleEn}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-8">
                                                <h3 className="text-xl font-bold text-[var(--text-color)] mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                    {language === 'ar' ? blog.titleAr : blog.titleEn}
                                                </h3>
                                                <button className="text-blue-500 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                                                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                                                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Services Section */}
                        {results.services.length > 0 && (
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-8 border-l-4 border-purple-600 pl-4">
                                    {language === 'ar' ? 'خدماتنا وأعمالنا' : 'Services & Portfolio'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.services.map((video) => (
                                        <div
                                            key={video.id}
                                            onClick={() => navigate(`/${lang}${getServiceLink(video.category)}`)}
                                            className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                                        >
                                            <div className="aspect-video overflow-hidden relative">
                                                <img
                                                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                    alt="Video Thumbnail"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2 block">
                                                    {video.category}
                                                </span>
                                                <h3 className="text-xl font-bold text-[var(--text-color)] group-hover:text-purple-400 transition-colors capitalize">
                                                    {video.category.replace('_', ' ')} Showcase
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!loading && !hasResults && (
                            <div className="text-center py-20 bg-[var(--card-bg)] rounded-[3rem] border border-dashed border-[var(--border-color)]">
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                                    {language === 'ar' ? 'لم نجد ما تبحث عنه' : 'No matches found'}
                                </h3>
                                <p className="text-gray-400 mb-8">
                                    {language === 'ar' ? 'حاول استخدام كلمات مفتاحية أخرى' : 'Try searching with different keywords'}
                                </p>
                                <button
                                    onClick={() => navigate(`/${lang}`)}
                                    className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
