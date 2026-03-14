import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const PhotographyPage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btsVideos, setBtsVideos] = useState([]);
  const [photoSessions, setPhotoSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSessions, setVisibleSessions] = useState(9);
  const [visibleBTS, setVisibleBTS] = useState(9);

  // مصفوفة الألوان للتنويع (أزرق، بنفسجي، تركواز)
  const borderColors = ['#3b82f6', '#a855f7', '#22d3ee'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch BTS Videos
        const btsRes = await fetch(`${API_BASE_URL}/videos?category=photography_bts`);
        const btsData = await btsRes.json();
        if (Array.isArray(btsData)) setBtsVideos(btsData.map(v => v.youtubeId));

        // Fetch Photo Sessions
        const sessionsRes = await fetch(`${API_BASE_URL}/videos?category=photography_session`);
        const sessionsData = await sessionsRes.json();
        if (Array.isArray(sessionsData)) setPhotoSessions(sessionsData.map(v => v.youtubeId));
      } catch (err) {
        console.error('Failed to fetch photography data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="pt-24 px-6 md:px-10 pb-20">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh] md:min-h-[70vh]">
        <div className="w-full lg:w-1/2 order-1">
          <ScrollReveal delay={0.3}>
            <img
              src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768840662/photogr_man_yi1wmp.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686527/Asset_3_2x_wt6qwj.png'}
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] object-contain ${language === 'en' ? 'scale-x-[-1]' : ''}`}
              alt="Photography Astronaut"
            />
          </ScrollReveal>
        </div>

        <div className="w-full lg:w-1/2 text-center lg:text-start order-2">
          <ScrollReveal>
            <h1 className="text-4xl md:text-8xl glow-text mb-6 md:mb-8 text-blue-400 font-black">
              {t('page.photography.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.photography.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-[var(--glass-bg)] border border-blue-500/50 text-blue-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all hover:shadow-lg hover:shadow-blue-500/30 inline-block text-center flex-1 md:flex-none"
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
      </section>

      {/* القسم الأول: معرض الصور */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-blue-300">
            {t('page.photography.inside_studio')}
          </h2>
        </ScrollReveal>
        {isLoading ? (
          <div className="text-center py-20 text-blue-400/50 animate-pulse font-bold">Loading Sessions...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {photoSessions.length === 0 && <p className="col-span-full text-center text-gray-500">No sessions available yet.</p>}
              {photoSessions.slice(0, visibleSessions).map((imgUrl, index) => (
                <ScrollReveal key={`photo-${index}`} delay={index * 0.1}>
                  <div
                    className="glowing-border-box aspect-[3/4] group"
                    style={{ '--glow-color': borderColors[index % borderColors.length] }}
                  >
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                      <img
                        src={imgUrl.startsWith('/uploads') ? `${API_BASE_URL}${imgUrl}` : imgUrl}
                        alt={`Session ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-bold text-xl">{t('page.photography.session')} {index + 1}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {photoSessions.length > visibleSessions && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleSessions(prev => prev + 9)}
                  className="px-8 py-3 rounded-full bg-[var(--glass-bg)] border border-blue-500/50 text-blue-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all"
                >
                  {language === 'ar' ? 'مشاهدة المزيد' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* القسم الثاني: كواليس التصوير (فيديو) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-purple-400">
            {language === 'ar' ? 'كواليس التصوير' : 'Behind The Scenes'}
          </h2>
        </ScrollReveal>
        {isLoading ? (
          <div className="text-center py-20 text-purple-400/50 animate-pulse font-bold">Loading BTS...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {btsVideos.length === 0 && <p className="col-span-full text-center text-gray-500">No BTS videos available yet.</p>}
              {btsVideos.slice(0, visibleBTS).map((id, index) => (
                <ScrollReveal key={`bts-${index}`} delay={index * 0.1}>
                  <div
                    className="glowing-border-box aspect-video"
                    style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
                  >
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                      <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                        title={`BTS Video ${index + 1}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {btsVideos.length > visibleBTS && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleBTS(prev => prev + 9)}
                  className="px-8 py-3 rounded-full bg-[var(--glass-bg)] border border-purple-500/50 text-purple-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all"
                >
                  {language === 'ar' ? 'مشاهدة المزيد' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Background Decor */}
      <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'تصوير' : 'Photography'}
      />
    </div>
  );
};

export default PhotographyPage;
