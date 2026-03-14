import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminPricingHub = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/service-pricing`);
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (err) {
            console.error('Failed to fetch services:', err);
        } finally {
            setLoading(false);
        }
    };

    const seedDefaults = async () => {
        setLoading(true);
        const defaults = [
            {
                serviceName: 'موشن جرافيك', serviceNameEn: 'Motion Graphics', category: 'motion', currency: 'USD', basePrice: 1000,
                pricingRules: [{ duration: 15, price: 1225 }, { duration: 30, price: 1450 }, { duration: 60, price: 1900 }, { duration: 90, price: 2350 }],
                additionalOptions: [{ name: 'تعليق صوتي', nameEn: 'Voiceover', price: 500 }, { name: 'كتابة سيناريو', nameEn: 'Script Writing', price: 300 }, { name: 'تسليم سريع', nameEn: 'Fast Delivery', price: 1000 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'مونتاج فيديو', serviceNameEn: 'Video Montage', category: 'montage', currency: 'USD', basePrice: 500,
                pricingRules: [{ duration: 15, price: 650 }, { duration: 30, price: 800 }, { duration: 60, price: 1100 }],
                additionalOptions: [{ name: 'تسليم سريع', nameEn: 'Fast Delivery', price: 1000 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'تصميم جرافيك', serviceNameEn: 'Graphic Design', category: 'design', currency: 'USD', basePrice: 300,
                pricingRules: [],
                additionalOptions: [{ name: 'تسليم سريع', nameEn: 'Fast Delivery', price: 1000 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'تطوير مواقع (Frontend)', serviceNameEn: 'Web Dev (Frontend)', category: 'web', currency: 'USD', basePrice: 300,
                pricingRules: [],
                additionalOptions: [{ name: 'صفحة إضافية', nameEn: 'Extra Page', price: 50 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'تطوير مواقع (Backend)', serviceNameEn: 'Web Dev (Backend)', category: 'web', currency: 'USD', basePrice: 400,
                pricingRules: [],
                additionalOptions: [{ name: 'API Endpoint', nameEn: 'API Endpoint', price: 50 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'تطوير مواقع (Fullstack)', serviceNameEn: 'Web Dev (Fullstack)', category: 'web', currency: 'USD', basePrice: 600,
                pricingRules: [],
                additionalOptions: [{ name: 'لوحة تحكم', nameEn: 'Admin Panel', price: 200 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'تصوير فوتوغرافي', serviceNameEn: 'Photography', category: 'photography', currency: 'USD', basePrice: 500,
                pricingRules: [],
                additionalOptions: [{ name: 'إيديت للصور', nameEn: 'Photo Editing', price: 100 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'إيجار استوديو', serviceNameEn: 'Studio Rental', category: 'studio', currency: 'USD', basePrice: 200,
                pricingRules: [],
                additionalOptions: [{ name: 'معدات إضاءة', nameEn: 'Lighting Equipment', price: 50 }],
                isActive: true, calculatorEnabled: true
            },
            {
                serviceName: 'كتابة محتوى', serviceNameEn: 'Content Writing', category: 'content', currency: 'USD', basePrice: 150,
                pricingRules: [],
                additionalOptions: [{ name: 'SEO Optimization', nameEn: 'SEO Optimization', price: 50 }],
                isActive: true, calculatorEnabled: true
            }
        ];

        try {
            const token = localStorage.getItem('auth_token');
            for (const service of defaults) {
                await fetch(`${API_BASE_URL}/service-pricing`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(service)
                });
            }
            alert(language === 'ar' ? 'تم استعادة البيانات الافتراضية بنجاح!' : 'Defaults restored successfully!');
            fetchServices();
        } catch (err) {
            console.error(err);
            alert('Failed to seed data');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (category) => {
        switch (category) {
            case 'motion': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>;
            case 'montage': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
            case 'design': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
            case 'web': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
            case 'photography': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
            case 'studio': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
            case 'content': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
            case 'marketing': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
            default: return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-white glow-text">
                    {language === 'ar' ? 'إدارة أسعار الخدمات' : 'Service Pricing Management'} 💰
                </h1>
                <div className="flex gap-4">
                    {services.length === 0 && (
                        <button
                            onClick={seedDefaults}
                            className="px-6 py-3 bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {language === 'ar' ? 'استعادة الافتراضية' : 'Restore Defaults'}
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/${language}/dashboard/pricing/new`)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        {language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => navigate(`/${language}/dashboard/pricing/${service.id}`)}
                        className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-500/30 hover:shadow-2xl transition-all cursor-pointer min-h-[220px] flex flex-col justify-between"
                    >
                        {/* Top Bar */}
                        <div className="flex justify-between items-start w-full z-10">
                            {/* Active Badge */}
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black ${service.isActive ? 'bg-[#1c3a2f] text-[#34d399]' : 'bg-red-900/20 text-red-400'}`}>
                                {language === 'ar' ? 'نشط' : 'Active'}
                            </span>

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                {getIcon(service.category)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-end text-right z-10 mt-4">
                            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {service.serviceName}
                            </h3>
                            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase font-mono">
                                {service.category === 'web' ? 'WEB DEVELOPMENT' : service.serviceNameEn}
                            </p>
                        </div>

                        {/* Bottom Bar */}
                        <div className="flex items-end justify-between w-full mt-6 pt-6 border-t border-dashed border-white/5 z-10">
                            {/* Edit Button */}
                            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-gray-400 group-hover:border-white/20 group-hover:text-white transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">{language === 'ar' ? 'يبدأ من' : 'STARTS FROM'}</span>
                                <span className="text-xl font-black text-white font-mono flex gap-1">
                                    {service.currency} <span className="tracking-tighter">{service.basePrice}</span>
                                </span>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
                        <p className="text-gray-500 text-lg mb-4">{language === 'ar' ? 'لا توجد خدمات مضافة بعد' : 'No services added yet'}</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={seedDefaults} className="text-blue-400 font-bold hover:underline">
                                {language === 'ar' ? 'استعادة القيم الافتراضية' : 'Restore Defaults'}
                            </button>
                            <span className="text-gray-600">|</span>
                            <button onClick={() => navigate(`/${language}/dashboard/pricing/new`)} className="text-green-400 font-bold hover:underline">
                                {language === 'ar' ? 'إضافة أول خدمة' : 'Add your first service'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPricingHub;
