import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import LoadingSpinner from './LoadingSpinner';

const AdminSEOManagement = ({ token }) => {
    const { language } = useLanguage();
    const { showAlert, showConfirm } = useModal();
    const [seoData, setSeoData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPath, setEditingPath] = useState(null);
    const [formData, setFormData] = useState({
        titleAr: '', titleEn: '',
        descriptionAr: '', descriptionEn: '',
        keywordsAr: '', keywordsEn: ''
    });

    const preDefinedPages = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services Main' },
        { path: '/services/motion-graphics', label: 'Motion Graphics' },
        { path: '/services/web-design', label: 'Web Design' },
        { path: '/services/content-writing', label: 'Content Writing' },
        { path: '/services/photography', label: 'Photography' },
        { path: '/services/design', label: 'Design' },
        { path: '/services/marketing', label: 'Marketing' },
        { path: '/services/studio-rental', label: 'Studio Rental' },
        { path: '/services/montage', label: 'Montage' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
        { path: '/blog', label: 'Blog' },
        { path: '/search', label: 'Search' },
        { path: '/privacy-policy', label: 'Privacy Policy' },
        { path: '/terms', label: 'Terms' },
    ];

    const fetchSeo = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/seo`);
            if (res.ok) {
                const data = await res.json();
                setSeoData(data);
            }
        } catch (err) {
            console.error('Failed to fetch SEO data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSeo();
    }, []);

    const handleEdit = (path) => {
        const existing = seoData.find(s => s.pagePath === path);
        setEditingPath(path);
        setFormData({
            titleAr: existing?.titleAr || '',
            titleEn: existing?.titleEn || '',
            descriptionAr: existing?.descriptionAr || '',
            descriptionEn: existing?.descriptionEn || '',
            keywordsAr: existing?.keywordsAr || '',
            keywordsEn: existing?.keywordsEn || ''
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/seo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pagePath: editingPath, ...formData })
            });
            if (res.ok) {
                setEditingPath(null);
                fetchSeo();
                showAlert(language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully', 'Success', 'success');
            }
        } catch (err) {
            console.error('Failed to save SEO', err);
            showAlert('Failed to save', 'Error', 'error');
        }
    };

    const handleRestoreDefaults = () => {
        showConfirm(
            language === 'ar'
                ? 'هل أنت متأكد؟ سيتم استعادة إعدادات تحسين محركات البحث الافتراضية لجميع الصفحات.'
                : 'Are you sure? This will restore default SEO settings for all pages.',
            async () => {
                setIsLoading(true);
                const defaults = [
                    {
                        path: '/',
                        titleAr: 'أقرب ليك - شريكك الرقمي المتكامل | تسويق، تصميم، وبرمجة',
                        titleEn: 'AqrabLk - Your Full Digital Partner | Marketing, Design & Dev',
                        descriptionAr: 'أقرب ليك هي وكالة رقمية رائدة تقدم حلولاً شاملة في التسويق الإلكتروني، تصميم الجرافيك، تطوير المواقع، والموشن جرافيك. نساعدك على تحقيق أهدافك الرقمية.',
                        descriptionEn: 'AqrabLk is a leading digital agency providing comprehensive solutions in digital marketing, graphic design, web development, and motion graphics. We help you achieve your digital goals.'
                    },
                    {
                        path: '/services',
                        titleAr: 'خدماتنا - حلول رقمية مبتكرة لنمو أعمالك',
                        titleEn: 'Our Services - Innovative Digital Solutions for Business Growth',
                        descriptionAr: 'اكتشف مجموعة خدماتنا المتنوعة: من التسويق الإلكتروني وتصميم الهوية البصرية إلى برمجة التطبيقات والمواقع. جودة عالية وأسعار تنافسية.',
                        descriptionEn: 'Discover our diverse range of services: from digital marketing and branding to app and web development. High quality and competitive prices.'
                    },
                    {
                        path: '/contact',
                        titleAr: 'اتصل بنا - ابدأ مشروعك الرقمي اليوم',
                        titleEn: 'Contact Us - Start Your Digital Project Today',
                        descriptionAr: 'تواصل مع فريق أقرب ليك لمناقشة مشروعك القادم. نحن هنا للإجابة على استفساراتك وتقديم الاستشارات اللازمة لنجاحك.',
                        descriptionEn: 'Get in touch with the AqrabLk team to discuss your next project. We are here to answer your questions and provide the consultation needed for your success.'
                    },
                    {
                        path: '/about',
                        titleAr: 'من نحن - قصة شغفنا بالابتكار الرقمي',
                        titleEn: 'About Us - Our Passion for Digital Innovation',
                        descriptionAr: 'تعرف على فريق وكالة أقرب ليك ورؤيتنا في تحويل الأفكار إلى واقع رقمي ملموس. نحن نؤمن بقوة الإبداع والتكنولوجيا.',
                        descriptionEn: 'Meet the AqrabLk agency team and learn about our vision to turn ideas into tangible digital reality. We believe in the power of creativity and technology.'
                    },
                    {
                        path: '/services/motion-graphics',
                        titleAr: 'موشن جرافيك احترافي - حرك علامتك التجارية',
                        titleEn: 'Professional Motion Graphics - Animate Your Brand',
                        descriptionAr: 'خدمات إنتاج فيديو موشن جرافيك إبداعية توصل رسالتك بفعالية وتجذب جمهورك. نستخدم أحدث التقنيات لإنشاء محتوى بصري مذهل.',
                        descriptionEn: 'Creative motion graphics video production services that effectively convey your message and engage your audience. We use the latest technologies to create stunning visual content.'
                    },
                    {
                        path: '/services/web-design',
                        titleAr: 'تصميم وتطوير مواقع الويب - واجهة تمثلك',
                        titleEn: 'Web Design & Development - An Interface That Represents You',
                        descriptionAr: 'تصميم مواقع عصرية، سريعة، ومتجاوبة مع جميع الأجهزة. نحول زوار موقعك إلى عملاء دائمين بتجربة مستخدم استثنائية.',
                        descriptionEn: 'Modern, fast, and responsive web design for all devices. We turn your site visitors into loyal customers with an exceptional user experience.'
                    },
                    {
                        path: '/services/marketing',
                        titleAr: 'التسويق الإلكتروني - نتائج حقيقية وملموسة',
                        titleEn: 'Digital Marketing - Real and Tangible Results',
                        descriptionAr: 'استراتيجيات تسويق مدروسة، إدارة حسابات سوشيال ميديا، وإعلانات ممولة تستهدف جمهورك بدقة لزيادة المبيعات والانتشار.',
                        descriptionEn: 'Well-planned marketing strategies, social media management, and paid ads targeted precisely to your audience to increase sales and reach.'
                    },
                    {
                        path: '/services/design',
                        titleAr: 'تصميم الجرافيك والهوية البصرية - تميز عن منافسيك',
                        titleEn: 'Graphic Design & Branding - Stand Out From Competitors',
                        descriptionAr: 'نصمم شعارات وهويات بصرية تعكس قيم علامتك التجارية وتترك انطباعاً قوياً لدى عملائك. تصاميم إبداعية وفريدة.',
                        descriptionEn: 'We design logos and visual identities that reflect your brand values and leave a strong impression on your customers. Creative and unique designs.'
                    },
                    {
                        path: '/services/photography',
                        titleAr: 'خدمات التصوير الفوتوغرافي - توثيق لحظاتك ومنتجاتك',
                        titleEn: 'Photography Services - Documenting Your Moments & Products',
                        descriptionAr: 'جلسات تصوير احترافية للمنتجات والفعاليات. صور عالية الجودة تبرز جمال التفاصيل وتدعم حملاتك التسويقية.',
                        descriptionEn: 'Professional photography sessions for products and events. High-quality images that highlight details and support your marketing campaigns.'
                    },
                    {
                        path: '/services/content-writing',
                        titleAr: 'كتابة المحتوى - كلمات تبيع وتؤثر',
                        titleEn: 'Content Writing - Words That Sell & Influence',
                        descriptionAr: 'محتوى تسويقي، مقالات متوافقة مع SEO، وسيناريوهات إعلانية. نكتب بلغة تخاطب جمهورك وتحقق أهدافك.',
                        descriptionEn: 'Marketing content, SEO-friendly articles, and ad scripts. We write in a language that speaks to your audience and achieves your goals.'
                    },
                    {
                        path: '/services/studio-rental',
                        titleAr: 'تأجير استوديو - مساحتك للإبداع',
                        titleEn: 'Studio Rental - Your Space for Creativity',
                        descriptionAr: 'استوديو مجهز بالكامل للتصوير الفوتوغرافي والفيديو. إضاءة احترافية، خلفيات متنوعة، ومعدات متطورة لخدمة مشروعك.',
                        descriptionEn: 'Fully equipped studio for photography and video. Professional lighting, diverse backgrounds, and advanced equipment to serve your project.'
                    },
                    {
                        path: '/services/montage',
                        titleAr: 'المونتاج وتحرير الفيديو - قصتك بأسلوب سينمائي',
                        titleEn: 'Video Editing & Montage - Your Story in Cinematic Style',
                        descriptionAr: 'خدمات مونتاج احترافية تحول اللقطات الخام إلى أعمال فنية متكاملة. مؤثرات بصرية وصوتية تعزز جودة الفيديو.',
                        descriptionEn: 'Professional editing services that turn raw footage into complete works of art. Visual and sound effects that enhance video quality.'
                    },
                    {
                        path: '/blog',
                        titleAr: 'المدونة - مقالات ونصائح في العالم الرقمي',
                        titleEn: 'Our Blog - Articles & Tips in the Digital World',
                        descriptionAr: 'تابع أحدث المقالات والنصائح في مجالات التسويق، التصميم، والبرمجة. مصكرك للمعرفة والإلهام.',
                        descriptionEn: 'Follow the latest articles and tips in marketing, design, and programming. Your source for knowledge and inspiration.'
                    },
                    {
                        path: '/search',
                        titleAr: 'نتائج البحث - أقرب ليك',
                        titleEn: 'Search Results - AqrabLk',
                        descriptionAr: 'نتائج البحث في موقع أقرب ليك. اعثر على الخدمة أو المقالة التي تبحث عنها بسهولة.',
                        descriptionEn: 'Search results on AqrabLk website. Find the service or article you are looking for easily.'
                    },
                    {
                        path: '/privacy-policy',
                        titleAr: 'سياسة الخصوصية - أقرب ليك',
                        titleEn: 'Privacy Policy - AqrabLk',
                        descriptionAr: 'تعرف على سياسة الخصوصية وكيفية حماية بياناتك عند استخدام موقعنا.',
                        descriptionEn: 'Learn about our privacy policy and how we protect your data when using our website.'
                    },
                    {
                        path: '/terms',
                        titleAr: 'الشروط والأحكام - أقرب ليك',
                        titleEn: 'Terms & Conditions - AqrabLk',
                        descriptionAr: 'يرجى قراءة الشروط والأحكام الخاصة باستخدام خدماتنا وموقعنا.',
                        descriptionEn: 'Please read the terms and conditions for using our services and website.'
                    }
                ];

                try {
                    let successCount = 0;
                    let failCount = 0;

                    for (const page of defaults) {
                        try {
                            const res = await fetch(`${API_BASE_URL}/seo`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    pagePath: page.path,
                                    titleAr: page.titleAr,
                                    titleEn: page.titleEn,
                                    descriptionAr: page.descriptionAr,
                                    descriptionEn: page.descriptionEn,
                                    keywordsAr: 'marketing, design, development, aqrab, agency',
                                    keywordsEn: 'marketing, design, development, aqrab, agency'
                                })
                            });

                            if (res.ok) successCount++;
                            else {
                                console.error(`Failed to restore ${page.path}:`, await res.text());
                                failCount++;
                            }
                        } catch (innerErr) {
                            console.error(`Network error for ${page.path}:`, innerErr);
                            failCount++;
                        }
                    }

                    await fetchSeo(); // Refresh local list

                    if (failCount === 0) {
                        showAlert(language === 'ar' ? 'تم استعادة الإعدادات الافتراضية بنجاح' : 'Defaults restored successfully', 'Success', 'success');
                    } else if (successCount > 0) {
                        showAlert(language === 'ar' ? `تم استعادة ${successCount} صفحة، وفشل ${failCount}` : `Restored ${successCount} pages, failed ${failCount}`, 'Warning', 'warning');
                    } else {
                        throw new Error('All requests failed');
                    }

                } catch (err) {
                    console.error('Failed to restore defaults', err);
                    showAlert('Failed to restore defaults. Check console.', 'Error', 'error');
                } finally {
                    setIsLoading(false);
                }
            }
        );
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [newPath, setNewPath] = useState('');

    const handleDelete = async (path) => {
        showConfirm(
            language === 'ar' ? `هل أنت متأكد من حذف إعدادات ${path}؟` : `Delete SEO for ${path}?`,
            async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/seo?path=${encodeURIComponent(path)}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) fetchSeo();
                } catch (err) { console.error(err); }
            }
        );
    };

    const handleAddPath = async (e) => {
        e.preventDefault();
        if (!newPath) return;
        try {
            const res = await fetch(`${API_BASE_URL}/seo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pagePath: newPath,
                    titleAr: 'New Page', titleEn: 'New Page',
                    descriptionAr: '', descriptionEn: ''
                })
            });
            if (res.ok) {
                setNewPath('');
                setShowAddForm(false);
                fetchSeo();
            }
        } catch (err) { console.error(err); }
    };

    // Merge pre-defined with dynamic records
    const allPaths = [...preDefinedPages];
    seoData.forEach(record => {
        if (!allPaths.find(p => p.path === record.pagePath)) {
            allPaths.push({ path: record.pagePath, label: record.pagePath === '/' ? 'Home' : record.pagePath.split('/').pop(), isCustom: true });
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-white">{language === 'ar' ? 'إدارة محركات البحث (SEO)' : 'SEO Management'} 🔍</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleRestoreDefaults}
                        className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/50 px-6 py-2 rounded-xl font-bold transition-all text-sm"
                    >
                        {language === 'ar' ? 'استعادة الافتراضي ⚡' : 'Restore Defaults ⚡'}
                    </button>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 text-sm"
                    >
                        {language === 'ar' ? '+ إضافة مسار جديد' : '+ Add New Path'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddPath} className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="/example-path"
                            value={newPath}
                            onChange={e => setNewPath(e.target.value)}
                            className="flex-1 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] outline-none focus:border-blue-500"
                            required
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition-all">
                            {language === 'ar' ? 'إضافة' : 'Add'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {allPaths.map(page => {
                    const data = seoData.find(s => s.pagePath === page.path);
                    const isEditing = editingPath === page.path;

                    return (
                        <div key={page.path} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-blue-400 font-black uppercase tracking-widest">{page.label}</span>
                                    <h3 className="text-lg font-bold text-white mt-1">{page.path}</h3>
                                </div>
                                <div className="flex gap-2">
                                    {!isEditing && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(page.path)}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-bold bg-blue-500/10 px-4 py-2 rounded-xl transition-all"
                                            >
                                                {language === 'ar' ? 'تعديل' : 'Edit'}
                                            </button>
                                            {page.isCustom && (
                                                <button
                                                    onClick={() => handleDelete(page.path)}
                                                    className="text-red-400 hover:text-red-300 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-xl transition-all"
                                                >
                                                    {language === 'ar' ? 'حذف' : 'Delete'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-6 animate-in fade-in zoom-in-95">
                                    {/* Arabic Section */}
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                                        <span className="absolute -top-3 right-4 bg-gray-800 text-xs px-2 py-1 rounded border border-white/10 text-gray-400">العربية (AR)</span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">العنوان (Title)</label>
                                                <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500" value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">الكلمات المفتاحية (Keywords)</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500" value={formData.keywordsAr} onChange={e => setFormData({ ...formData, keywordsAr: e.target.value })} />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">الوصف (Description)</label>
                                                <textarea required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 h-20" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* English Section */}
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative" dir="ltr">
                                        <span className="absolute -top-3 left-4 bg-gray-800 text-xs px-2 py-1 rounded border border-white/10 text-gray-400">English (EN)</span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">Title</label>
                                                <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">Keywords</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500" value={formData.keywordsEn} onChange={e => setFormData({ ...formData, keywordsEn: e.target.value })} />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs text-gray-400 font-bold">Description</label>
                                                <textarea required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 h-20" value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={() => setEditingPath(null)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-xl font-bold transition-all">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">Save Changes</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="space-y-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block tracking-widest border-b border-white/5 pb-1 mb-2">Arabic SEO</span>
                                        <p className="text-sm text-gray-200 font-bold line-clamp-1">{data?.titleAr || 'Not Set'}</p>
                                        <p className="text-xs text-gray-400 line-clamp-2">{data?.descriptionAr || 'No description'}</p>
                                    </div>
                                    <div className="space-y-2" dir="ltr">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block tracking-widest border-b border-white/5 pb-1 mb-2">English SEO</span>
                                        <p className="text-sm text-gray-200 font-bold line-clamp-1">{data?.titleEn || 'Not Set'}</p>
                                        <p className="text-xs text-gray-400 line-clamp-2">{data?.descriptionEn || 'No description'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminSEOManagement;
