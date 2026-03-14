import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const borderColors = ['#3b82f6', '#a855f7', '#38bdf8'];

const ContentWritingPage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentVideos, setContentVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/videos?category=content_samples`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setContentVideos(data.map(v => v.youtubeId));
        }
      } catch (err) {
        console.error('Failed to fetch content writing videos', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="pt-24 px-10 pb-12">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          /* تأثير التوهج الثابت */
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[60vh]">
        {/* حاوية الصورة */}
        <div className="w-full lg:w-1/2 order-1">
          <ScrollReveal delay={0.3}>
            <img
              src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768840765/writer_flip_ojbt6q.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686499/Asset_5_2x_vcffi4.png'}
              alt="Content Writing Astronaut"
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] object-contain ${language === 'en' ? 'scale-x-[-1]' : ''}`}
            />
          </ScrollReveal>
        </div>

        {/* حاوية النصوص */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2">
          <ScrollReveal>
            <h1 className="text-6xl md:text-8xl glow-text mb-8 text-blue-400 font-black">{t('page.content.title')}</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-2xl font-light">
              {t('page.content.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 rounded-full bg-[var(--glass-bg)] border border-blue-500/50 text-blue-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_now')}
            </button>
            <a
              href="https://wa.me/201099822822"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-full bg-[var(--glass-bg)] border border-green-500/50 text-green-400 font-bold hover:bg-[var(--glass-bg)]/80 hover:shadow-lg hover:shadow-green-500/20 transition-all inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_whatsapp')}
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* قسم المميزات */}
      <section className="py-12 max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal delay={0.1}>
            <div
              className="glowing-border-box h-full"
              style={{ '--glow-color': borderColors[0] }}
            >
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[var(--glass-bg)] backdrop-blur-sm flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-300">{t('page.content.feat1_title')}</h3>
                <p className="text-gray-400">{t('page.content.feat1_desc')}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div
              className="glowing-border-box h-full"
              style={{ '--glow-color': borderColors[1] }}
            >
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[var(--glass-bg)] backdrop-blur-sm flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-300">{t('page.content.feat2_title')}</h3>
                <p className="text-gray-400">{t('page.content.feat2_desc')}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div
              className="glowing-border-box h-full"
              style={{ '--glow-color': borderColors[2] }}
            >
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[var(--glass-bg)] backdrop-blur-sm flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-300">{t('page.content.feat3_title')}</h3>
                <p className="text-gray-400">{t('page.content.feat3_desc')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* قسم أعمالنا */}
      <section className="py-16 max-w-7xl mx-auto border-t border-white/5 mt-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 font-black text-blue-300">
            {t('common.portfolio')}
          </h2>
        </ScrollReveal>
        {isLoading ? (
          <div className="text-center py-20 text-blue-400/50 animate-pulse font-bold">Loading Content Portfolio...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {contentVideos.length === 0 && <p className="col-span-full text-center text-gray-500">No content writing samples available yet.</p>}
            {contentVideos.map((id, index) => (
              <ScrollReveal key={`content-${index}`} delay={index * 0.1}>
                <div
                  className="glowing-border-box aspect-video"
                  style={{ '--glow-color': borderColors[index % borderColors.length] }}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                    <iframe
                      src={`https://www.youtube.com/embed/${id}`}
                      title={`Content Video ${index + 1}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Background Decor */}
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-10 left-10 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '3s' }}></div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'كتابة محتوي' : 'Content Writing'}
      />
    </div>
  );
};

export default ContentWritingPage;