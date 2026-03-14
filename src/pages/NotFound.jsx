import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <h1 className="text-9xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">404</h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
                {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h2>
            <p className="text-gray-400 max-w-md mb-10 text-lg">
                {language === 'ar'
                    ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
                    : 'Sorry, the page you are looking for does not exist or has been moved.'}
            </p>

            <Link
                to={`/${language === 'ar' ? 'ar' : 'en'}`}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
        </div>
    );
};

export default NotFound;
