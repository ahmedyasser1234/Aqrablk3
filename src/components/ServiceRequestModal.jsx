import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';

const ServiceRequestModal = ({ isOpen, onClose, serviceName }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, service: serviceName })
            });
            if (!res.ok) throw new Error('Failed');
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '', description: '' });
            }, 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 backdrop-blur-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-color)]/50 hover:text-[var(--text-color)] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Request Received!'}</h3>
                        <p className="text-gray-400">{language === 'ar' ? 'سنتواصل معك في أقرب وقت.' : 'We will contact you shortly.'}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-black text-[var(--text-color)] mb-2">{language === 'ar' ? 'طلب خدمة' : 'Request Service'}</h2>
                        <p className="text-[var(--accent-color)] font-bold mb-6">{language === 'ar' ? serviceName : serviceName}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                    <input
                                        type="email"
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none transition-colors"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none transition-colors"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{language === 'ar' ? 'تفاصيل الطلب' : 'Details'}</label>
                                <textarea
                                    className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-color)] focus:border-blue-500 outline-none transition-colors h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-400 text-sm text-center">{language === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Error. Please try again.'}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال الطلب' : 'Submit Request')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ServiceRequestModal;
