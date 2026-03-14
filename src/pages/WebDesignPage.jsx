import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';


const borderColors = ['#a855f7', '#6366f1', '#a855f7'];

const WebDesignPage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webProjects, setWebProjects] = useState([]);
  const [shopifyProjects, setShopifyProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const [webRes, shopifyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/videos?category=web_portfolio`),
          fetch(`${API_BASE_URL}/videos?category=shopify_portfolio`)
        ]);

        const webData = await webRes.json();
        const shopifyData = await shopifyRes.json();

        if (Array.isArray(webData)) setWebProjects(webData);
        if (Array.isArray(shopifyData)) setShopifyProjects(shopifyData);
      } catch (err) {
        console.error('Failed to fetch web portfolio', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="pt-24 px-6 md:px-10 pb-20 overflow-hidden">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
          transition: all 0.3s ease;
        }
        .glowing-border-box:hover {
          box-shadow: 0 0 45px -2px var(--glow-color);
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh]">

        {/* حاوية النصوص: lg:order-1 تظهر يميناً في العربي ويساراً في الإنجليزي */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2 lg:order-1">
          <ScrollReveal>
            <h1 className="text-5xl md:text-8xl glow-text mb-6 md:mb-8 text-purple-400 font-black leading-tight">
              {t('page.web.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.web.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-[var(--glass-bg)] border border-purple-500/50 text-purple-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_now')}
            </button>
            <a
              href="https://wa.me/201099822822"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-[var(--glass-bg)] border border-green-500/50 text-green-400 font-bold hover:bg-[var(--glass-bg)]/80 hover:shadow-lg hover:shadow-green-500/20 transition-all inline-block text-center flex-1 md:flex-none"
            >
              {t('common.order_whatsapp')}
            </a>
          </ScrollReveal>
        </div>

        {/* حاوية الصورة: lg:order-2 تظهر يساراً في العربي ويميناً في الإنجليزي */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <ScrollReveal delay={0.3}>
            <img
              src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768838352/programmer_flip_bzbmw0.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686522/Asset_4_2x_vu9c2h.png'}
              alt="Web Design Astronaut"
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(168,85,247,0.2)] object-contain transition-transform duration-500 ${language === 'en' ? 'scale-x-[-1]' : 'scale-x-[1]'
                }`}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* قسم المميزات بتصميم الـ Glowing Box */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black">
            {t('page.web.why_us')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i, index) => (
            <ScrollReveal key={i} delay={index * 0.1}>
              <div
                className="glowing-border-box h-full"
                style={{ '--glow-color': borderColors[index] }}
              >
                <div className="relative z-10 h-full p-8 md:p-10 rounded-[2rem] bg-[var(--glass-bg)] backdrop-blur-sm flex flex-col justify-center text-center lg:text-start">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">
                    {t(`page.web.feat${i}_title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                    {t(`page.web.feat${i}_desc`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* قسم أعمالنا (Web Design Portfolio) */}
      <section className="py-16 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 font-black text-purple-300">
            {t('common.portfolio')}
          </h2>
        </ScrollReveal>
        {isLoading ? (
          <div className="text-center py-20 text-purple-400/50 animate-pulse font-bold">Loading Web Projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webProjects.length === 0 && <p className="col-span-full text-center text-gray-500">No web projects available yet.</p>}
            {webProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glowing-border-box block aspect-video group"
                  style={{ '--glow-color': borderColors[index % borderColors.length] }}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                    <img
                      src={project.youtubeId.startsWith('/uploads') ? `${API_BASE_URL}${project.youtubeId}` : project.youtubeId}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-6 py-2 border border-white/50 rounded-full backdrop-blur-md">
                        {t('common.view_work')}
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* قسم أعمال شوبيفاي */}
      <section className="py-16 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 font-black text-blue-300">
            {t('page.web.shopify_portfolio')}
          </h2>
        </ScrollReveal>
        {isLoading ? (
          <div className="text-center py-20 text-blue-400/50 animate-pulse font-bold">Loading Shopify Stores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shopifyProjects.length === 0 && <p className="col-span-full text-center text-gray-500">No shopify stores available yet.</p>}
            {shopifyProjects.map((project, index) => (
              <ScrollReveal key={`shopify-${project.id}`} delay={index * 0.1}>
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glowing-border-box block aspect-video group"
                  style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                    <img
                      src={project.youtubeId.startsWith('/uploads') ? `${API_BASE_URL}${project.youtubeId}` : project.youtubeId}
                      alt={`Shopify Project ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-6 py-2 border border-white/50 rounded-full backdrop-blur-md">
                        {t('common.view_work')}
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* زينة الخلفية */}
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'تصميم مواقع' : 'Web Design'}
      />
    </div>
  );
};

export default WebDesignPage;
