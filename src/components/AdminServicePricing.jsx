import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminServicePricing = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        serviceName: '',
        serviceNameEn: '',
        category: '',
        pricingRules: [],
        specifications: [],
        additionalOptions: [],
        currency: 'EGP',
        basePrice: 0,
        isActive: true,
        calculatorEnabled: true
    });

    const [newPricingRule, setNewPricingRule] = useState({ duration: 60, price: 0 });
    const [newSpec, setNewSpec] = useState({ name: '', nameEn: '', included: true });
    const [newOption, setNewOption] = useState({ name: '', nameEn: '', price: 0 });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/service-pricing`);
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error('Failed to fetch services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveService = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const url = editingService
                ? `${API_BASE_URL}/service-pricing/${editingService.id}`
                : `${API_BASE_URL}/service-pricing`;

            const method = editingService ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            alert('تم الحفظ بنجاح!');
            setShowForm(false);
            setEditingService(null);
            resetForm();
            fetchServices();
        } catch (err) {
            console.error('Failed to save service:', err);
            alert('فشل الحفظ!');
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setFormData(service);
        setShowForm(true);
    };

    const handleDeleteService = async (id) => {
        if (!confirm('هل أنت متأكد من الحذف؟')) return;

        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_BASE_URL}/service-pricing/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchServices();
        } catch (err) {
            console.error('Failed to delete service:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            serviceName: '',
            serviceNameEn: '',
            category: '',
            pricingRules: [],
            specifications: [],
            additionalOptions: [],
            currency: 'EGP',
            basePrice: 0,
            isActive: true,
            calculatorEnabled: true
        });
    };

    const addPricingRule = () => {
        if (newPricingRule.duration && newPricingRule.price) {
            setFormData({
                ...formData,
                pricingRules: [...formData.pricingRules, newPricingRule]
            });
            setNewPricingRule({ duration: 60, price: 0 });
        }
    };

    const removePricingRule = (index) => {
        setFormData({
            ...formData,
            pricingRules: formData.pricingRules.filter((_, i) => i !== index)
        });
    };

    const addSpecification = () => {
        if (newSpec.name) {
            setFormData({
                ...formData,
                specifications: [...formData.specifications, newSpec]
            });
            setNewSpec({ name: '', nameEn: '', included: true });
        }
    };

    const removeSpecification = (index) => {
        setFormData({
            ...formData,
            specifications: formData.specifications.filter((_, i) => i !== index)
        });
    };

    const addOption = () => {
        if (newOption.name && newOption.price) {
            setFormData({
                ...formData,
                additionalOptions: [...formData.additionalOptions, newOption]
            });
            setNewOption({ name: '', nameEn: '', price: 0 });
        }
    };

    const removeOption = (index) => {
        setFormData({
            ...formData,
            additionalOptions: formData.additionalOptions.filter((_, i) => i !== index)
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-[var(--text-color)]">إدارة أسعار الخدمات 💰</h2>
                <button
                    onClick={() => { setShowForm(true); setEditingService(null); resetForm(); }}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all"
                >
                    إضافة خدمة جديدة +
                </button>
            </div>

            {/* Services List */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--text-color)]">{service.serviceName}</h3>
                                    <p className="text-sm text-[var(--text-color)]/60">{service.serviceNameEn}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold">
                                        {service.category}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditService(service)}
                                        className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl font-bold hover:bg-blue-600/30 transition-all"
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl font-bold hover:bg-red-600/30 transition-all"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p className="text-[var(--text-color)]/80">
                                    <strong>العملة:</strong> {service.currency}
                                </p>
                                <p className="text-[var(--text-color)]/80">
                                    <strong>السعر الأساسي:</strong> {service.basePrice} {service.currency}
                                </p>
                                <p className="text-[var(--text-color)]/80">
                                    <strong>قواعد التسعير:</strong> {service.pricingRules.length} قاعدة
                                </p>
                                <p className="text-[var(--text-color)]/80">
                                    <strong>متاح في الحاسبة:</strong> {service.calculatorEnabled ? 'نعم ✅' : 'لا ❌'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Service Form */}
            {showForm && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[var(--text-color)]">
                            {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                        </h3>
                        <button
                            onClick={() => { setShowForm(false); setEditingService(null); }}
                            className="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-xl font-bold hover:bg-gray-600/30 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">اسم الخدمة (عربي)</label>
                            <input
                                type="text"
                                value={formData.serviceName}
                                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">اسم الخدمة (English)</label>
                            <input
                                type="text"
                                value={formData.serviceNameEn}
                                onChange={(e) => setFormData({ ...formData, serviceNameEn: e.target.value })}
                                className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">الفئة (Category)</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                                placeholder="motion, montage, photography, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">العملة</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            >
                                <option value="EGP">EGP</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--text-color)]/60 mb-2">السعر الأساسي</label>
                            <input
                                type="number"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                                className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.calculatorEnabled}
                                    onChange={(e) => setFormData({ ...formData, calculatorEnabled: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <span className="text-sm font-bold text-[var(--text-color)]/80">متاح في الحاسبة</span>
                            </label>
                        </div>
                    </div>

                    {/* Pricing Rules */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-[var(--text-color)]">قواعد التسعير حسب المدة</h4>
                        <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--bg-color)]/30 rounded-2xl border border-dashed border-[var(--border-color)]">
                            <input
                                type="number"
                                placeholder="المدة (ثانية)"
                                value={newPricingRule.duration}
                                onChange={(e) => setNewPricingRule({ ...newPricingRule, duration: parseInt(e.target.value) })}
                                className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="السعر"
                                value={newPricingRule.price}
                                onChange={(e) => setNewPricingRule({ ...newPricingRule, price: parseFloat(e.target.value) })}
                                className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                            <button
                                onClick={addPricingRule}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                            >
                                إضافة
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.pricingRules.map((rule, index) => (
                                <div key={index} className="flex items-center justify-between bg-[var(--bg-color)]/30 border border-[var(--border-color)] rounded-xl p-3">
                                    <span className="text-[var(--text-color)]">{rule.duration} ثانية = {rule.price} {formData.currency}</span>
                                    <button
                                        onClick={() => removePricingRule(index)}
                                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-600/30"
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-[var(--text-color)]">خيارات إضافية</h4>
                        <div className="grid grid-cols-4 gap-4 p-4 bg-[var(--bg-color)]/30 rounded-2xl border border-dashed border-[var(--border-color)]">
                            <input
                                type="text"
                                placeholder="الاسم (عربي)"
                                value={newOption.name}
                                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                                className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                            <input
                                type="text"
                                placeholder="الاسم (English)"
                                value={newOption.nameEn}
                                onChange={(e) => setNewOption({ ...newOption, nameEn: e.target.value })}
                                className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="السعر"
                                value={newOption.price}
                                onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) })}
                                className="bg-[var(--bg-color)]/50 border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none"
                            />
                            <button
                                onClick={addOption}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                            >
                                إضافة
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.additionalOptions.map((option, index) => (
                                <div key={index} className="flex items-center justify-between bg-[var(--bg-color)]/30 border border-[var(--border-color)] rounded-xl p-3">
                                    <span className="text-[var(--text-color)]">{option.name} ({option.nameEn}) = +{option.price} {formData.currency}</span>
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-600/30"
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveService}
                        className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg"
                    >
                        حفظ الخدمة
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminServicePricing;
