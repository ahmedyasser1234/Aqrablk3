import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import LoadingSpinner from './LoadingSpinner';

const AdminPartnersManagement = ({ token }) => {
    const { t, language } = useLanguage();
    const [partners, setPartners] = useState([]);
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const fetchPartners = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/partners`);
            if (res.ok) {
                const data = await res.json();
                setPartners(data);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name || (!logoUrl && !logoFile)) return;

        setLoading(true);
        try {
            let finalLogoUrl = logoUrl;

            if (logoFile) {
                const formData = new FormData();
                formData.append('file', logoFile);
                const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalLogoUrl = uploadData.url;
                }
            }

            const res = await fetch(`${API_BASE_URL}/partners`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, logoUrl: finalLogoUrl })
            });

            if (res.ok) {
                setName('');
                setLogoUrl('');
                setLogoFile(null);
                setPreviewUrl('');
                fetchPartners();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            await fetch(`${API_BASE_URL}/partners/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPartners();
        } catch (error) {
            console.error(error);
        }
    };

    if (isFetching) return <LoadingSpinner />;

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-2xl shadow-2xl">
            {/* Add New Partner Form */}
            <form onSubmit={handleAdd} className="mb-10 bg-black/20 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    {language === 'ar' ? 'إضافة عميل جديد' : 'Add New Client'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder={language === 'ar' ? 'اسم العميل / الشركة' : 'Client / Brand Name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                        required
                    />
                    <div className="flex flex-col gap-4">
                        <label className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'اللوجو (رفع ملف أو لينك)' : 'Logo (Upload or Link)'}</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="partner-logo-upload"
                            />
                            <label
                                htmlFor="partner-logo-upload"
                                className="flex-1 bg-white/5 border border-dashed border-white/20 rounded-xl p-3 text-center cursor-pointer hover:bg-white/10 transition-all text-sm text-gray-300"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="h-10 mx-auto object-contain" />
                                ) : (
                                    language === 'ar' ? 'اختر ملف' : 'Choose File'
                                )}
                            </label>
                            <span className="text-gray-600">{language === 'ar' ? 'أو' : 'OR'}</span>
                            <input
                                type="text"
                                placeholder={language === 'ar' ? 'رابط اللوجو (URL)' : 'Logo URL'}
                                value={logoUrl}
                                onChange={(e) => {
                                    setLogoUrl(e.target.value);
                                    setLogoFile(null);
                                    setPreviewUrl(e.target.value);
                                }}
                                className="flex-[2] bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {loading ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (language === 'ar' ? 'إضافة' : 'Add Client')}
                </button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partners.map(partner => (
                    <div key={partner.id} className="relative group bg-white/5 rounded-2xl p-4 flex flex-col items-center border border-white/5 hover:border-blue-500/30 transition-all">
                        <img src={partner.logoUrl} alt={partner.name} className="w-20 h-20 object-contain mb-3" />
                        <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                        <button
                            onClick={() => handleDelete(partner.id)}
                            className="absolute top-2 right-2 bg-red-600/20 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
                {partners.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-10">{language === 'ar' ? 'لا يوجد عملاء حالياً' : 'No clients found'}</p>
                )}
            </div>
        </div>
    );
};

export default AdminPartnersManagement;
