import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LanguageWrapper = ({ children }) => {
    const { lang } = useParams();
    const { setLanguage, language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        // Validate language param
        if (lang && (lang === 'ar' || lang === 'en')) {
            if (lang !== language) {
                setLanguage(lang);
            }
        } else if (!lang) {
            // No lang param, redirect (should be handled by pure Routes, but just in case)
            navigate(`/${language}`, { replace: true });
        } else {
            // Invalid lang param, redirect to default
            navigate(`/ar`, { replace: true });
        }
    }, [lang, language, setLanguage, navigate]);

    return children;
};

export default LanguageWrapper;
