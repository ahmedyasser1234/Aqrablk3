import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminPricingEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(id !== 'new');
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        serviceName: '',
        serviceNameEn: '',
        category: 'other',
        currency: 'USD',
        basePrice: 0,
        isActive: true,
        calculatorEnabled: true,
        pricingRules: [],
        specifications: [],
        additionalOptions: []
    });

    const [newPricingRule, setNewPricingRule] = useState({ duration: 60, price: 0 });
    const [newOption, setNewOption] = useState({ name: '', nameEn: '', price: 0 });

    useEffect(() => {
        if (id && id !== 'new') {
            fetchServiceDetails();
        }
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/service-pricing/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const url = id === 'new'
                ? `${API_BASE_URL}/service-pricing`
                : `${API_BASE_URL}/service-pricing/${id}`;
            const method = id === 'new' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate(`/${language}/dashboard/pricing`); // Go back to hub
            } else {
                alert('Error saving service');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving service');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this service?')) return;

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_BASE_URL}/service-pricing/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) navigate(`/${language}/dashboard/pricing`);
        } catch (err) {
            console.error(err);
        }
    };

    const addPricingRule = () => {
        if (newPricingRule.duration && newPricingRule.price) {
            setFormData(prev => ({
                ...prev,
                pricingRules: [...prev.pricingRules, newPricingRule]
            }));
            setNewPricingRule({ duration: 60, price: 0 });
        }
    };

    const removePricingRule = (index) => {
        setFormData(prev => ({
            ...prev,
            pricingRules: prev.pricingRules.filter((_, i) => i !== index)
        }));
    };

    const addOption = () => {
        if (newOption.name && newOption.price) {
            setFormData(prev => ({
                ...prev,
                additionalOptions: [...prev.additionalOptions, newOption]
            }));
            setNewOption({ name: '', nameEn: '', price: 0 });
        }
    };

    const removeOption = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalOptions: prev.additionalOptions.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/${language}/dashboard/pricing`)}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
                    >
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            {id === 'new'
                                ? (language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service')
                                : (language === 'ar' ? `تعديل: ${formData.serviceName}` : `Edit: ${formData.serviceNameEn}`)}
                        </h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {language === 'ar' ? 'لوحة تحكم الأسعار' : 'Pricing Control Panel'}
                        </p>
                    </div>
                </div>

                {id !== 'new' && (
                    <button
                        onClick={handleDelete}
                        className="px-6 py-3 bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all text-sm"
                    >
                        {language === 'ar' ? 'حذف الخدمة' : 'Delete Service'}
                    </button>
                )}
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Info Card */}
                <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl hover:border-blue-500/30 transition-colors group">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {language === 'ar' ? 'معلومات الخدمة' : 'Basic Info'}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'ar' ? 'اسم الخدمة (عربي)' : 'Service Name (Arabic)'}</label>
                            <input
                                type="text"
                                value={formData.serviceName}
                                onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-gray-700"
                                placeholder="مثال: موشن جرافيك"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'ar' ? 'اسم الخدمة (إنجليزي)' : 'Service Name (English)'}</label>
                            <input
                                type="text"
                                value={formData.serviceNameEn}
                                onChange={e => setFormData({ ...formData, serviceNameEn: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-gray-700"
                                placeholder="e.g. Motion Graphics"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'ar' ? 'الفئة (Code)' : 'Category Code'}</label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <option value="motion">Motion Graphics</option>
                                        <option value="montage">Video Montage</option>
                                        <option value="photography">Photography</option>
                                        <option value="design">Graphic Design</option>
                                        <option value="web">Web Development</option>
                                        <option value="studio">Studio Rental</option>
                                        <option value="content">Content Writing</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'ar' ? 'العملة' : 'Currency'}</label>
                                <div className="relative">
                                    <select
                                        value={formData.currency}
                                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EGP">EGP (ج.م)</option>
                                        <option value="SAR">SAR (ر.س)</option>
                                    </select>
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'ar' ? 'السعر الأساسي' : 'Base Price'}</label>
                            <div className="relative group/price">
                                <div className="absolute left-0 top-0 bottom-0 w-16 bg-white/5 border-r border-white/10 rounded-l-2xl flex items-center justify-center text-gray-400 font-bold group-focus-within/price:bg-blue-500/20 group-focus-within/price:text-blue-400 group-focus-within/price:border-blue-500/30 transition-all">
                                    {formData.currency === 'USD' ? '$' : formData.currency}
                                </div>
                                <input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-20 pr-4 text-white font-mono text-xl focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5 mt-4">
                            <label className={`flex-1 flex items-center justify-between cursor-pointer px-4 py-3 rounded-2xl border transition-all ${formData.isActive ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.isActive ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className={`font-bold ${formData.isActive ? 'text-green-400' : 'text-gray-400'}`}>{language === 'ar' ? 'الخدمة نشطة' : 'Active Service'}</span>
                                </div>
                                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="hidden" />
                            </label>

                            <label className={`flex-1 flex items-center justify-between cursor-pointer px-4 py-3 rounded-2xl border transition-all ${formData.calculatorEnabled ? 'bg-blue-500/10 border-blue-500/50' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.calculatorEnabled ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className={`font-bold ${formData.calculatorEnabled ? 'text-blue-400' : 'text-gray-400'}`}>{language === 'ar' ? 'متاح بالحاسبة' : 'In Calculator'}</span>
                                </div>
                                <input type="checkbox" checked={formData.calculatorEnabled} onChange={e => setFormData({ ...formData, calculatorEnabled: e.target.checked })} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Pricing Rules & Options */}
                <div className="space-y-8">
                    {/* Rules */}
                    <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl hover:border-purple-500/30 transition-colors group">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {language === 'ar' ? 'قواعد التسعير' : 'Pricing Rules'}
                                </h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{language === 'ar' ? 'تخصيص السعر حسب المدة' : 'Price per Duration'}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-3 items-end">
                                <div className="w-1/3">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{language === 'ar' ? 'المدة (ثواني)' : 'Duration (sec)'}</label>
                                    <input
                                        type="number"
                                        placeholder="60"
                                        value={newPricingRule.duration}
                                        onChange={e => setNewPricingRule({ ...newPricingRule, duration: parseInt(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm text-center font-mono focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{language === 'ar' ? 'السعر' : 'Price'}</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newPricingRule.price}
                                        onChange={e => setNewPricingRule({ ...newPricingRule, price: parseFloat(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm text-center font-mono focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <button onClick={addPricingRule} className="h-[46px] w-[46px] flex items-center justify-center bg-purple-600 rounded-xl text-white hover:bg-purple-500 transition-colors shadow-lg active:scale-95">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {formData.pricingRules.map((rule, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-xs font-mono text-gray-400">
                                                {idx + 1}
                                            </div>
                                            <span className="text-gray-300 font-medium">
                                                <span className="text-white font-bold text-lg mr-1">{rule.duration}</span>
                                                <span className="text-xs uppercase text-gray-500">sec</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-purple-400 font-black font-mono text-lg">{rule.price} <span className="text-xs text-purple-500/50">{formData.currency}</span></span>
                                            <button onClick={() => removePricingRule(idx)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.pricingRules.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{language === 'ar' ? 'لا توجد قواعد' : 'No rules added yet'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl hover:border-green-500/30 transition-colors group">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {language === 'ar' ? 'إضافات واختيارات' : 'Add-ons & Options'}
                                </h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{language === 'ar' ? 'خدمات إضافية اختيارية' : 'Optional Extras'}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-[1fr_1fr_80px_auto] gap-3 items-end">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block truncate">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Ar)'}</label>
                                    <input
                                        type="text"
                                        placeholder="تعليق.."
                                        value={newOption.name}
                                        onChange={e => setNewOption({ ...newOption, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block truncate">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (En)'}</label>
                                    <input
                                        type="text"
                                        placeholder="Voice.."
                                        value={newOption.nameEn}
                                        onChange={e => setNewOption({ ...newOption, nameEn: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block truncate">{language === 'ar' ? 'السعر' : 'Price'}</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newOption.price}
                                        onChange={e => setNewOption({ ...newOption, price: parseFloat(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs text-center font-mono focus:border-green-500 outline-none"
                                    />
                                </div>
                                <button onClick={addOption} className="h-[42px] w-[42px] flex items-center justify-center bg-green-600 rounded-xl text-white hover:bg-green-500 transition-colors shadow-lg active:scale-95 mb-[1px]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {formData.additionalOptions.map((opt, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm">{opt.nameEn}</span>
                                            <span className="text-xs text-gray-500">{opt.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-400 font-bold font-mono">+{opt.price}</span>
                                            <button onClick={() => removeOption(idx)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.additionalOptions.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{language === 'ar' ? 'لا توجد إضافات' : 'No options added yet'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40 pointer-events-none">
                <div className="max-w-5xl mx-auto flex justify-end gap-4 pointer-events-auto">
                    <button
                        onClick={() => navigate(`/${language}/dashboard/pricing`)}
                        className="px-8 py-4 bg-[#1a1a1a] border border-white/10 text-gray-400 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all shadow-lg backdrop-blur-md"
                    >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                    >
                        {saving ? <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto" /> : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPricingEditor;
