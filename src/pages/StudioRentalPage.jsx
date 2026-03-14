import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext'; // تأكد من المسار الصحيح
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';

// مصفوفة الألوان للتنويع (أزرق، بنفسجي، تركواز)
const borderColors = ['#3b82f6', '#a855f7', '#22d3ee'];

const features = [
  { icon: '🎥', titleKey: 'page.studio.feat1_title', descKey: 'page.studio.feat1_desc' },
  { icon: '🎙️', titleKey: 'page.studio.feat2_title', descKey: 'page.studio.feat2_desc' },
  { icon: '🎨', titleKey: 'page.studio.feat3_title', descKey: 'page.studio.feat3_desc' },
  { icon: '☕', titleKey: 'page.studio.feat4_title', descKey: 'page.studio.feat4_desc' },
];

const StudioRentalPage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-24 px-6 md:px-10 pb-20 overflow-hidden">
      <style>{`
  .glowing-border-box {
  position: relative;
  overflow: hidden;
  z-index: 0;
  border-radius: 2rem;
  /* تأثير التوهج الثابت */
  box-shadow: 0 0 30px -5px var(--glow-color);
  border: 1px solid var(--glow-color);
  transition: all 0.3s ease;
}
        .glowing-border-box:hover {
  box-shadow: 0 0 45px -2px var(--glow-color);
  transform: translateY(-5px);
}
`}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh] md:min-h-[70vh]">

        {/* النصوص */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2 lg:order-1">
          <ScrollReveal>
            <h1 className="text-5xl md:text-8xl glow-text mb-6 md:mb-8 text-white font-black leading-tight">
              {t('page.studio.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.studio.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-[var(--glass-bg)] border border-white/20 hover:bg-[var(--glass-bg)]/80 text-white font-bold transition-all inline-block text-center backdrop-blur-sm flex-1 md:flex-none"
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

        {/* حاوية الصورة */}
        <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
          <ScrollReveal delay={0.3}>
            <div className="rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
              <img
                src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686452/bbb_k3mvpy.png"
                alt="Studio Interior"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* تأثيرات الإضاءة خلف الصورة */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/20 blur-[80px] pointer-events-none"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/10 blur-[80px] pointer-events-none"></div>
          </ScrollReveal>
        </div>
      </section>

      {/* سكشن المميزات بتصميم الـ Glowing Boxes */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={0.1 * (index + 1)}>
              <div
                className="glowing-border-box h-full"
                style={{ '--glow-color': borderColors[index % borderColors.length] }}
              >
                <div className="relative z-10 h-full p-8 rounded-[2rem] bg-[var(--glass-bg)] backdrop-blur-sm text-center flex flex-col items-center justify-center">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--text-color)]">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* زينة الخلفية */}
      <div className="fixed top-1/4 -left-20 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'تأجير استوديو' : 'Studio Rental'}
      />
    </div>
  );
};

export default StudioRentalPage;