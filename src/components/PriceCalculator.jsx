import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';

const PriceCalculator = () => {
    const { language, t } = useLanguage();
    const [service, setService] = useState('motion');
    const [duration, setDuration] = useState(60);
    const [country, setCountry] = useState('egypt');
    const [webType, setWebType] = useState('fullstack');
    const [numPages, setNumPages] = useState(1);
    const [addons, setAddons] = useState({
        voiceover: false,
        script: false,
        fast_delivery: false,
        custom_music: false
    });
    const [total, setTotal] = useState(0);

    const prices = {
        motion: { base: 1000, perSec: 15 },
        montage: { base: 500, perSec: 10 },
        design: { base: 300, perSec: 0 },
        web: { base: 0, perSec: 0 } // Web uses different logic
    };

    const webPrices = {
        frontend: 300,
        backend: 400,
        fullstack: 600
    };

    const pagePrice = 50; // Price per additional page

    const currencyConfig = {
        egypt: { code: 'EGP', rate: 50, symbol: 'ج.م' },
        gcc: { code: 'SAR', rate: 3.75, symbol: 'ر.س' },
        global: { code: 'USD', rate: 1, symbol: '$' }
    };



    const addonsPrices = {
        voiceover: 500,
        script: 300,
        fast_delivery: 1000,
        custom_music: 400
    };

    const [pricingData, setPricingData] = useState([]);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/service-pricing`);
                if (res.ok) {
                    const data = await res.json();
                    setPricingData(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to fetch pricing:", err);
            }
        };
        fetchPricing();
    }, []);

    useEffect(() => {
        let calculated = 0;
        let rate = 1;

        // Find the dynamic service config
        // Mapping 'motion' -> category 'motion' or serviceName 'Motion Graphics'
        // We'll try to match by category first
        const currentServiceConfig = pricingData.find(p => p.category === service);

        // Fallback to hardcoded if not found or if offline
        const useDynamic = !!currentServiceConfig && currentServiceConfig.isActive;

        if (service === 'web') {
            const baseWebPrice = webPrices[webType] || 0;
            rate = currencyConfig[country]?.rate || 1;
            calculated = (baseWebPrice + ((numPages - 1) * pagePrice)) * rate;
        } else {
            if (useDynamic) {
                // Use Dynamic Data
                const base = currentServiceConfig.basePrice || 0;

                // Find matching rule for duration (or closest)
                // Assuming simple linear interpolation or finding exact match
                // For simplicity, let's look for exact rule or default to base + (duration * perSec) logic if rule exists
                // Actually, the user's rule structure is "Duration X = Price Y". 
                // We should find the rule that matches the current duration.
                const rule = currentServiceConfig.pricingRules?.find(r => r.duration === duration);

                if (rule) {
                    calculated = rule.price;
                } else {
                    // Fallback logic if no exact rule: (Base + (Duration * Multiplier?))
                    // Since we don't have a specific "per second" field in the new DB schema (it has rules),
                    // let's try to infer or just use base.
                    // IMPORTANT: To keep it compatible with the previous behavior (slide duration -> price changes),
                    // we should probably just use the OLD logic if no exact rule is found, 
                    // OR assume the base price is for the minimum duration and add proportional cost?
                    // Let's stick to the OLD logic for calculation if no exact rule found, BUT use the Dynamic Base Price.

                    // OLD Logic: base + (perSec * duration)
                    // Let's assume perSec is roughly (Price at 60s - Base) / 60 ??

                    // BETTER APPROACH: Just use the existing valid logic for now but override BASE if dynamic exists
                    const oldPerSec = prices[service]?.perSec || 0;
                    calculated = base + (oldPerSec * duration);
                }

                // If the user defined a rule for this duration, it overrides the calculation
                if (rule) calculated = rule.price;

            } else {
                // OLD Logic
                const base = prices[service]?.base || 0;
                const timePrice = (prices[service]?.perSec || 0) * duration;
                calculated = base + timePrice;
            }
        }

        const addonPrice = Object.keys(addons).reduce((sum, key) => {
            // Dynamic Addons?
            // If we have dynamic addons, we should check against them.
            // But the UI state `addons` uses hardcoded keys (voiceover, script, etc.)
            // We need to map them if we want fully dynamic.
            // For now, let's keep addons static to avoid breaking UI until we refactor the whole UI to be dynamic.
            return sum + (addons[key] ? addonsPrices[key] : 0);
        }, 0);

        setTotal(Math.round(calculated + (service !== 'web' ? addonPrice : 0)));
    }, [service, duration, addons, country, webType, numPages, pricingData]);

    const handleAddonToggle = (key) => {
        setAddons(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-all"></div>

                    <h2 className="text-4xl md:text-5xl font-black text-[var(--text-color)] mb-12 text-center tracking-tighter glow-text">
                        {language === 'ar' ? 'حاسبة التكلفة التقديرية' : 'Estimated Price Calculator'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Configuration */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                                    {language === 'ar' ? 'اختر الخدمة' : 'Choose Service'}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(prices).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setService(s)}
                                            className={`py-4 rounded-2xl font-bold transition-all border ${service === s ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-lg shadow-blue-500/30' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-color)]/60 hover:border-[var(--accent-color)]/40'}`}
                                        >
                                            {language === 'ar' ? (s === 'motion' ? 'موشن جرافيك' : s === 'montage' ? 'مونتاج' : s === 'design' ? 'جرافيك ديزاين' : 'تصميم مواقع') : s.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Configuration Fields */}
                            {(service === 'motion' || service === 'montage') && (
                                <div className="space-y-4 text-start">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {language === 'ar' ? 'المدة (ثانية)' : 'Duration (seconds)'}
                                        </label>
                                        <span className="text-blue-400 font-bold font-mono">{duration}s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="300"
                                        step="15"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full h-2 bg-[var(--glass-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-500 font-bold px-1">
                                        <span>15s</span>
                                        <span>300s</span>
                                    </div>
                                </div>
                            )}

                            {service === 'web' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                    {/* Country Selection */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                                            {language === 'ar' ? 'الدولة / المنطقة' : 'Country / Region'}
                                        </label>
                                        <div className="flex bg-[var(--glass-bg)] p-1 rounded-xl border border-[var(--border-color)]">
                                            {Object.keys(currencyConfig).map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCountry(c)}
                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${country === c ? 'bg-[var(--accent-color)] text-white shadow' : 'text-[var(--text-color)]/60 hover:text-[var(--text-color)]'}`}
                                                >
                                                    {c === 'egypt' ? (language === 'ar' ? 'مصر' : 'Egypt') :
                                                        c === 'gcc' ? (language === 'ar' ? 'الخليج' : 'GCC') :
                                                            (language === 'ar' ? 'عالمي' : 'Global')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Web Type Selection */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                                            {language === 'ar' ? 'نوع المشروع' : 'Project Type'}
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {Object.keys(webPrices).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setWebType(type)}
                                                    className={`w-full py-3 px-4 rounded-xl text-start font-bold border transition-all flex justify-between items-center ${webType === type ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)]' : 'bg-[var(--glass-bg)] border-[var(--border-color)] text-[var(--text-color)]/70 hover:border-[var(--accent-color)]/30'}`}
                                                >
                                                    <span>
                                                        {type === 'frontend' ? (language === 'ar' ? 'واجهة أمامية (Frontend)' : 'Frontend') :
                                                            type === 'backend' ? (language === 'ar' ? 'برمجة خلفية (Backend)' : 'Backend') :
                                                                (language === 'ar' ? 'موقع كامل (Fullstack)' : 'Fullstack')}
                                                    </span>
                                                    {webType === type && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Number of Pages */}
                                    <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-500 delay-100">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                {language === 'ar' ? 'عدد الصفحات' : 'Number of Pages'}
                                            </label>
                                            <span className="text-blue-400 font-bold font-mono">{numPages}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            step="1"
                                            value={numPages}
                                            onChange={(e) => setNumPages(parseInt(e.target.value))}
                                            className="w-full h-2 bg-[var(--glass-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-500 font-bold px-1">
                                            <span>1</span>
                                            <span>20</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {service !== 'web' && (
                                <div className="space-y-4 text-start">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                                        {language === 'ar' ? 'إضافات اختيارية' : 'Optional Add-ons'}
                                    </label>
                                    <div className="space-y-3">
                                        {Object.keys(addons).map(key => (
                                            <div
                                                key={key}
                                                onClick={() => handleAddonToggle(key)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${addons[key] ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)]/50' : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--accent-color)]/30'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${addons[key] ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'border-[var(--border-color)]'}`}>
                                                        {addons[key] && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                                    </div>
                                                    <span className={`text-sm font-bold ${addons[key] ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]/60'}`}>
                                                        {language === 'ar' ? (key === 'voiceover' ? 'تعليق صوتي' : key === 'script' ? 'كتابة سيناريو' : key === 'fast_delivery' ? 'تسليم سريع' : 'موسيقى خاصة') : key.split('_').join(' ').toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-blue-400/80">+{addonsPrices[key]}$</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Result */}
                        <div className="flex flex-col items-center justify-center bg-blue-600/5 rounded-[2.5rem] border border-blue-500/10 p-10 text-center relative overflow-hidden group/box">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/box:opacity-100 transition-opacity"></div>

                            <span className="text-xs font-black text-[var(--accent-color)] uppercase tracking-[0.3em] mb-4">
                                {language === 'ar' ? 'التكلفة المتوقعة تبدأ من' : 'Estimated Price Starts From'}
                            </span>

                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-7xl font-black text-[var(--text-color)] tracking-tighter">
                                    {service === 'web' ? '' : '$'}{total}{service === 'web' ? ` ${currencyConfig[country]?.symbol}` : ''}
                                </span>
                            </div>

                            <p className="text-gray-500 text-xs leading-relaxed mb-10 px-4">
                                {language === 'ar'
                                    ? '* هذا السعر تقديري بناءً على التفاصيل المختارة، السعر النهائي يتم تحديده بعد مناقشة المشروع.'
                                    : '* This price is an estimate based on selected details. Final price will be determined after project discussion.'}
                            </p>

                            <button className="w-full bg-[var(--accent-color)] hover:opacity-90 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest ring-4 ring-blue-500/20">
                                {language === 'ar' ? 'احجز موعداً لمناقشة مشروعك' : 'Book a strategy call'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default PriceCalculator;
