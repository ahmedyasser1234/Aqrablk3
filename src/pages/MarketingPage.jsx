import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // تأكد من المسار
import ScrollReveal from '../components/ScrollReveal';

const MarketingPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-24 px-6 md:px-10 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh]">
        
        {/* حاوية النصوص: أصبحت lg:order-1 لتظهر يميناً في العربي ويساراً في الإنجليزي */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2 lg:order-1">
          <ScrollReveal>
            <h1 className="text-5xl md:text-[6rem] glow-text mb-6 md:mb-8 text-pink-500 font-black leading-[1.1]">
              {t('page.marketing.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.marketing.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex gap-4 justify-center lg:justify-start">
            <button className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all shadow-[0_0_20px_rgba(219,39,119,0.4)]">
              {t('common.free_consultation')}
            </button>
          </ScrollReveal>
        </div>

        {/* حاوية الصورة: أصبحت lg:order-2 لتظهر يساراً في العربي ويميناً في الإنجليزي */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <ScrollReveal delay={0.3}>
            <img 
              // تغيير رابط الصورة بناءً على اللغة
              src={language === 'en' 
                ? 'رابط_صورة_الانجليزي_هنا' 
                : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686481/Asset_6_2x_wo2ndl.png'
              } 
              alt="Marketing Astronaut" 
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(236,72,153,0.3)] object-contain transition-transform duration-500 ${
                // في العربي (يسار) يقلب لينظر لليمين، وفي الإنجليزي (يمين) يرجع لأصله لينظر لليسار
                language === 'ar' ? 'scale-x-[-1]' : 'scale-x-[1]'
              }`} 
            />
          </ScrollReveal>
        </div>

      </section>

      {/* منهجية العمل (Methodology) */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto">
        <ScrollReveal className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center backdrop-blur-sm relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-10 md:mb-16 glow-text text-white">
            {t('page.marketing.methodology')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[1, 2, 3].map((step) => (
              <ScrollReveal key={step} delay={step * 0.1}>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-black text-pink-500/30 group-hover:text-pink-500 transition-colors mb-4 duration-500">
                    0{step}
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {t(`page.marketing.step${step}_title`)}
                  </h4>
                  <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
                    {t(`page.marketing.step${step}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* الخلفية الديكورية */}
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default MarketingPage;