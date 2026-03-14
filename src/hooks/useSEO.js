import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';

const useSEO = () => {
    const location = useLocation();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchSEO = async () => {
            try {
                // Normalize path: Remove /ar or /en prefix to match DB path
                let path = location.pathname;
                if (path.startsWith('/ar')) path = path.replace('/ar', '') || '/';
                else if (path.startsWith('/en')) path = path.replace('/en', '') || '/';

                // Ensure it starts with /
                if (!path.startsWith('/')) path = '/' + path;

                const res = await fetch(`${API_BASE_URL}/seo`);
                if (res.ok) {
                    const allSeo = await res.json();
                    const seo = allSeo.find(s => s.pagePath === path);

                    if (seo) {
                        const title = language === 'ar' ? seo.titleAr : seo.titleEn;
                        const desc = language === 'ar' ? seo.descriptionAr : seo.descriptionEn;

                        document.title = title;

                        const metaDesc = document.querySelector('meta[name="description"]');
                        if (metaDesc) {
                            metaDesc.setAttribute('content', desc);
                        } else {
                            const newMeta = document.createElement('meta');
                            newMeta.name = 'description';
                            newMeta.content = desc;
                            document.head.appendChild(newMeta);
                        }
                    } else {
                        // Default fallback if no specific SEO found
                        document.title = language === 'ar' ? 'أقرب ليك - للخدمات الرقمية' : 'AqrabLk - Digital Services';
                    }
                }
            } catch (err) {
                console.error('SEO Hook Error:', err);
            }
        };

        fetchSEO();
    }, [location.pathname, language]);
};

export default useSEO;
