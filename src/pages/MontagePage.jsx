import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

// مصفوفة الألوان للتنويع (بنفسجي، أزرق، وردي)
const borderColors = ['#a855f7', '#3b82f6', '#ec4899'];

const MontagePage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verticalVideos, setVerticalVideos] = useState([]);
  const [horizontalVideos, setHorizontalVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Vertical Montage Videos
    const p1 = fetch(`${API_BASE_URL}/videos?category=montage_vertical`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVerticalVideos(data.map(v => v.youtubeId));
      })
      .catch(err => console.error('Failed to fetch vertical videos', err));

    // Fetch Horizontal Montage Videos
    const p2 = fetch(`${API_BASE_URL}/videos?category=montage_horizontal`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHorizontalVideos(data.map(v => v.youtubeId));
      })
      .catch(err => console.error('Failed to fetch horizontal videos', err));

    Promise.all([p1, p2]).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="pt-24 px-6 md:px-10 pb-20">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          /* استبدال الأنيميشن بـ Glow ثابت */
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
        }
        .glowing-border-box.vertical {
           border-radius: 2.5rem;
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh] md:min-h-[70vh]">
        <div className="w-full lg:w-1/2 text-center lg:text-start">
          <ScrollReveal>
            <h1 className="text-5xl md:text-8xl glow-text mb-6 md:mb-8 text-purple-400 font-black">
              {t('page.montage.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.montage.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-[var(--glass-bg)] border border-purple-500/50 text-purple-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all hover:shadow-lg hover:shadow-purple-500/30 inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_now')}
            </button>
            <a
              href="https://wa.me/201099822822"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-[var(--glass-bg)] border border-green-500/50 text-green-400 font-bold hover:bg-[var(--glass-bg)]/80 hover:shadow-lg hover:shadow-green-500/20 transition-all inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_whatsapp')}
            </a>
          </ScrollReveal>
        </div>
        <div className="w-full lg:w-1/2">
          <ScrollReveal delay={0.3}>
            <img
              src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768840850/montir_flip_1_hjqsju.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686469/xxx_yv639q.png'}
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(168,85,247,0.3)] object-contain ${language === 'en' ? 'scale-x-[-1]' : ''}`}
              alt="Montage Astronaut"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* القسم الأول: مونتاج طولي */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-purple-300">
            {t('page.montage.gallery_vertical')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {verticalVideos.map((id, index) => (
            <ScrollReveal key={`vertical-${index}`} delay={index * 0.1}>
              <div
                className="glowing-border-box vertical aspect-[9/16]"
                style={{ '--glow-color': borderColors[index % borderColors.length] }}
              >
                {/* تم تعديل الريديوس هنا من 2.5rem إلى 1.5rem */}
                <div className="inner-content w-full h-full rounded-[1.5rem] overflow-hidden relative z-10">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`Vertical Montage ${index + 1}`}
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
      </section>

      {/* القسم الثاني: مونتاج عرضي */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-blue-400">
            {t('page.montage.gallery_horizontal')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {horizontalVideos.map((id, index) => (
            <ScrollReveal key={`horizontal-${index}`} delay={index * 0.1}>
              <div
                className="glowing-border-box aspect-video"
                style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
              >
                <div className="inner-content w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`Horizontal Montage ${index + 1}`}
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
      </section>

      {/* Background Decor */}
      <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'مونتاج' : 'Montage'}
      />
    </div>
  );
};

export default MontagePage;