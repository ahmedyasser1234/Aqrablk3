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
                ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768840822/markting_flip_1_tlehvk.png'
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

      {/* Marketing Solutions Section */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-0">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-black mb-16 glow-text text-white text-center">
            {t('page.marketing.solutions_title')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <ScrollReveal key={num} delay={num * 0.1}>
              <div className="group bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-pink-600/10 hover:border-pink-500/50 transition-all duration-500 h-full relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-pink-500/20 transition-all"></div>

                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <div className="text-pink-500 group-hover:text-pink-400">
                    {num === 1 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>}
                    {num === 2 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
                    {num === 3 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                    {num === 4 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
                    {num === 5 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
                    {num === 6 && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-1.657 1.657M7 10.586l3 3 6.6-6.6"></path></svg>}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-pink-400 transition-colors">
                  {t(`page.marketing.sol${num}_title`)}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed font-light text-lg">
                  {t(`page.marketing.sol${num}_desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
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