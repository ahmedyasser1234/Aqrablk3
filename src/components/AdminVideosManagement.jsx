import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const AdminVideosManagement = ({ token }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { serviceType } = useParams();
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(serviceType || null);
    const [categoryInputs, setCategoryInputs] = useState({}); // { categoryId: 'input_value' }
    const [extraInputs, setExtraInputs] = useState({}); // { categoryId: 'extra_input_value' }
    const [status, setStatus] = useState({}); // { categoryId: 'idle' | 'submitting' | 'error' }

    // Update selectedService when URL changes
    useEffect(() => {
        if (serviceType) {
            setSelectedService(serviceType);
        } else {
            setSelectedService(null);
        }
    }, [serviceType]);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/videos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setVideos(data);
                } else {
                    setVideos([]);
                }
            } else {
                setVideos([]);
            }
        } catch (err) {
            console.error('Failed to fetch videos', err);
            setVideos([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleAddVideo = async (categoryId) => {
        const youtubeId = categoryInputs[categoryId];
        const externalLink = extraInputs[categoryId];
        if (!youtubeId) return;

        setStatus(prev => ({ ...prev, [categoryId]: 'submitting' }));
        try {
            const res = await fetch(`${API_BASE_URL}/videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ youtubeId, category: categoryId, externalLink })
            });
            if (res.ok) {
                setCategoryInputs(prev => ({ ...prev, [categoryId]: '' }));
                setExtraInputs(prev => ({ ...prev, [categoryId]: '' }));
                fetchVideos();
                setStatus(prev => ({ ...prev, [categoryId]: 'idle' }));
            } else {
                setStatus(prev => ({ ...prev, [categoryId]: 'error' }));
            }
        } catch (err) {
            setStatus(prev => ({ ...prev, [categoryId]: 'error' }));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            await fetch(`${API_BASE_URL}/videos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v.id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const serviceConfigs = {
        motion: {
            title: 'Motion Graphics',
            ar: 'الموشن جرافيك',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
            categories: [
                { id: 'motion', label: 'Motion Graphics (Standard)', ar: 'موشن جرافيك' },
                { id: 'collage', label: 'Collage (Vertical)', ar: 'كولاج (طولي)' },
                { id: 'whiteboard', label: 'Whiteboard', ar: 'وايت بورد' }
            ]
        },
        montage: {
            title: 'Montage',
            ar: 'المونتاج',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
            categories: [
                { id: 'montage_vertical', label: 'Vertical Montage (Shorts)', ar: 'مونتاج طولي' },
                { id: 'montage_horizontal', label: 'Horizontal Montage (16:9)', ar: 'مونتاج عرضي' }
            ]
        },
        photography: {
            title: 'Photography',
            ar: 'التصوير الاحترافي',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            categories: [
                { id: 'photography_session', label: 'Photo Session (Image Link)', ar: 'جلسات التصوير (صور)' },
                { id: 'photography_bts', label: 'Behind The Scenes (Videos)', ar: 'كواليس التصوير (فيديو)' }
            ]
        },
        design: {
            title: 'Design',
            ar: 'تصميم جرافيك',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
            categories: [
                { id: 'design_branding', label: 'Branding (Image Link)', ar: 'هوية بصرية (صور)' },
                { id: 'design_graphic', label: 'Graphic Design (Image Link)', ar: 'تصميم جرافيك (صور)' }
            ]
        },
        web_design: {
            title: 'Web Design',
            ar: 'تصميم المواقع',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            categories: [
                { id: 'web_portfolio', label: 'Web Portfolio', ar: 'معرض المواقع' },
                { id: 'shopify_portfolio', label: 'Shopify Store', ar: 'متاجر شوبيفاي' }
            ]
        },
        content_writing: {
            title: 'Content Writing',
            ar: 'كتابة المحتوى',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
            categories: [
                { id: 'content_samples', label: 'Samples (YouTube)', ar: 'نماذج أعمال (يوتيوب)' }
            ]
        }
    };

    if (!selectedService) {
        return (
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl lg:text-6xl font-black mb-14 tracking-tighter glow-text text-center">
                    {language === 'ar' ? 'إدارة محتوى الصفحات' : 'Page Content Management'} 📄
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto py-10 px-4">
                    {Object.entries(serviceConfigs).map(([id, config]) => (
                        <button
                            key={id}
                            onClick={() => navigate(`/dashboard/services/${id}`)}
                            className="group relative bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 hover:translate-y-[-5px] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                {config.icon}
                            </div>
                            <div className="relative z-10 text-center">
                                <div className={`w-12 h-12 ${id === 'motion' ? 'bg-blue-500/20 text-blue-400' : id === 'montage' ? 'bg-purple-500/20 text-purple-400' : id === 'photography' ? 'bg-cyan-500/20 text-cyan-400' : id === 'design' ? 'bg-pink-500/20 text-pink-400' : id === 'web_design' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                    {config.icon}
                                </div>
                                <h3 className="text-lg font-black text-white mb-2 tracking-tighter whitespace-nowrap">{config.title}</h3>
                                <p className="text-gray-400 font-medium tracking-wide uppercase text-[7px]">
                                    {language === 'ar' ? `إدارة قسم ${config.ar}` : `Manage ${config.title} section`}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const currentConfig = serviceConfigs[selectedService];

    const isImageCategory = (categoryId) => {
        return ['photography_session', 'design_branding', 'design_graphic', 'web_portfolio', 'shopify_portfolio'].includes(categoryId);
    };

    const isWebCategory = (categoryId) => {
        return ['web_portfolio', 'shopify_portfolio'].includes(categoryId);
    };

    const handleFileUpload = async (categoryId, file) => {
        if (!file) return;

        setStatus(prev => ({ ...prev, [categoryId]: 'submitting' }));
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                // We set the returned URL to the input field
                setCategoryInputs(prev => ({ ...prev, [categoryId]: data.url }));
                setStatus(prev => ({ ...prev, [categoryId]: 'idle' }));
            } else {
                setStatus(prev => ({ ...prev, [categoryId]: 'error' }));
            }
        } catch (err) {
            console.error('Upload failed', err);
            setStatus(prev => ({ ...prev, [categoryId]: 'error' }));
        }
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-16 pb-20 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-14 tracking-tighter glow-text text-center uppercase">
                {language === 'ar' ? `إدارة ${currentConfig.ar}` : `Manage ${currentConfig.title}`} 🎬
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <button
                    onClick={() => {
                        navigate(`/dashboard/services`);
                        setCategoryInputs({});
                    }}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:border-white/10"
                >
                    <svg className={`w-5 h-5 group-hover:${language === 'ar' ? 'translate-x-1' : '-translate-x-1'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                    <span className="font-bold">{language === 'ar' ? 'العودة لاختيار الأقسام' : 'Back to Selection'}</span>
                </button>
                <div className="flex items-center gap-4 bg-[#1a1b26]/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/40">{language === 'ar' ? 'جاري تعديل:' : 'Editing:'}</span>
                    </div>
                    <span className={`bg-gradient-to-r ${selectedService === 'motion' ? 'from-blue-500 to-cyan-500' : selectedService === 'montage' ? 'from-purple-500 to-pink-500' : selectedService === 'photography' ? 'from-cyan-500 to-blue-500' : selectedService === 'design' ? 'from-pink-500 to-purple-500' : selectedService === 'web_design' ? 'from-orange-500 to-red-500' : 'from-emerald-500 to-teal-500'} bg-clip-text text-transparent text-sm font-black uppercase tracking-tight`}>
                        {language === 'ar' ? currentConfig.ar : currentConfig.title}
                    </span>
                </div>
            </div>

            {currentConfig.categories.map((category) => {
                const categoryVideos = videos.filter(v => v.category === category.id);
                const isImg = isImageCategory(category.id);

                return (
                    <div key={category.id} className="space-y-8">
                        {/* Section header & Add Form */}
                        <div className="bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative group">
                            <div className={`absolute top-0 right-0 w-64 h-64 ${isImg ? 'bg-cyan-500/5' : 'bg-blue-500/5'} blur-[100px] pointer-events-none group-hover:bg-opacity-10 transition-colors`}></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                            <span className="text-2xl">{isImg ? '🖼️' : '📽️'}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white tracking-tighter">{language === 'ar' ? category.ar : category.label}</h2>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">{isImg ? 'Photo Section' : 'Video Section'}</p>
                                        </div>
                                    </div>

                                    {/* Add Video/Image Form Inline */}
                                    <div className="flex-1 max-w-2xl">
                                        <div className="flex flex-col gap-3 bg-white/5 p-3 rounded-[2rem] border border-white/5 focus-within:border-blue-500/50 transition-all shadow-inner">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1 flex gap-2 items-center px-4 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="text-blue-500 font-black text-xs uppercase">{isImg ? 'PHOTO' : 'VIDEO'}</span>
                                                    <input
                                                        type="text"
                                                        placeholder={isImg
                                                            ? (language === 'ar' ? 'رابط الصورة...' : 'Image link...')
                                                            : (language === 'ar' ? 'رابط يوتيوب...' : 'YouTube link...')
                                                        }
                                                        className="flex-1 bg-transparent border-none outline-none text-white py-2 font-medium text-sm"
                                                        value={categoryInputs[category.id] || ''}
                                                        onChange={(e) => setCategoryInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                                                    />
                                                    {isImg && (
                                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-all flex items-center justify-center">
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileUpload(category.id, e.target.files[0])}
                                                            />
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                        </label>
                                                    )}
                                                </div>

                                                {isWebCategory(category.id) && (
                                                    <div className="flex-1 flex gap-2 items-center px-4 bg-white/5 rounded-xl border border-white/5">
                                                        <span className="text-orange-500 font-black text-xs uppercase">LINK</span>
                                                        <input
                                                            type="text"
                                                            placeholder={language === 'ar' ? 'رابط الموقع...' : 'Website link...'}
                                                            className="flex-1 bg-transparent border-none outline-none text-white py-2 font-medium text-sm"
                                                            value={extraInputs[category.id] || ''}
                                                            onChange={(e) => setExtraInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddVideo(category.id)}
                                                disabled={status[category.id] === 'submitting' || !categoryInputs[category.id]}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center gap-2 justify-center w-full"
                                            >
                                                {status[category.id] === 'submitting' ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Videos/Images grid within section */}
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {categoryVideos.length === 0 ? (
                                            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                                <p className="text-gray-600 font-bold tracking-tight mb-2">{language === 'ar' ? 'لا توجد عناصر في هذا القسم بعد' : 'No items in this section yet'}</p>
                                                <p className="text-gray-700 text-xs">{language === 'ar' ? 'أضف أول عنصر باستخدام النموذج أعلاه' : 'Add your first item using the form above'}</p>
                                            </div>
                                        ) : (
                                            categoryVideos.map((v) => (
                                                <div key={v.id} className="bg-white/5 border border-white/5 rounded-[1.5rem] overflow-hidden group/item hover:border-blue-500/30 transition-all flex flex-col hover:-translate-y-1">
                                                    <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                                                        {isImg ? (
                                                            <img
                                                                src={v.youtubeId.startsWith('/uploads') ? `${API_BASE_URL}${v.youtubeId}` : v.youtubeId}
                                                                className="w-full h-full object-cover"
                                                                alt="Preview"
                                                            />
                                                        ) : (
                                                            <iframe
                                                                src={`https://www.youtube.com/embed/${v.youtubeId}`}
                                                                className="w-full h-full pointer-events-none"
                                                                frameBorder="0"
                                                            ></iframe>
                                                        )}
                                                        <div className="absolute inset-0 bg-transparent"></div> {/* Overlay to prevent iframe interaction in admin list */}
                                                    </div>
                                                    <div className="p-4 flex items-center justify-between bg-black/20">
                                                        <span className="text-[10px] text-gray-500 font-black tracking-widest">{new Date(v.createdAt).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => handleDelete(v.id)}
                                                            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminVideosManagement;
