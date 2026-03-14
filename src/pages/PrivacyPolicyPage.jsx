import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicyPage = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-white">
                <h1 className="text-4xl md:text-6xl font-black text-center mb-16 glow-text">
                    {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'} 🔒
                </h1>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-8 text-gray-300 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '1. جمع المعلومات' : '1. Information Collection'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'نقوم بجمع المعلومات التي تقدمها لنا طوعاً عند طلب خدمة أو التواصل معنا، مثل الاسم، البريد الإلكتروني، ورقم الهاتف.'
                                : 'We collect information you provide voluntarily when requesting a service or contacting us, such as name, email, and phone number.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '2. استخدام المعلومات' : '2. Use of Information'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'نستخدم هذه المعلومات فقط للتواصل معك بخصوص طلبك وتحسين خدماتنا. لا نشارك بياناتك مع أي طرف ثالث.'
                                : 'We use this information solely to communicate with you regarding your request and to improve our services. We do not share your data with any third parties.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? '3. أمن البيانات' : '3. Data Security'}</h2>
                        <p>
                            {language === 'ar'
                                ? 'نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح.'
                                : 'We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure.'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
