import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TermsPage = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-white">
                <h1 className="text-4xl md:text-6xl font-black text-center mb-16 glow-text">
                    {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'} 📜
                </h1>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-8 text-gray-300 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '1. قبول الشروط' : '1. Acceptance of Terms'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'باستخدامك لموقعنا أو طلب خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.'
                                : 'By using our website or requesting our services, you agree to be bound by these terms and conditions.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '2. حقوق الملكية الفكرية' : '2. Intellectual Property'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'جميع المحتويات المعروضة على الموقع هي ملك لشركة أقربلك ميديا ولا يجوز نسخها أو استخدامها دون إذن كتابي.'
                                : 'All content displayed on the site is the property of Aqrablk Media and may not be copied or used without written permission.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '3. المدفوعات والاسترداد' : '3. Payments & Refunds'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'العربون المدفوع لبدء العمل غير قابل للاسترداد بعد مرور 24 ساعة من تاريخ الدفع.'
                                : 'The deposit paid to commence work is non-refundable after 24 hours from the date of payment.'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
