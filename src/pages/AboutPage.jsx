import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

// ألوان التوهج (أزرق، بنفسجي، سماوي)
const borderColors = ['#3b82f6', '#a855f7', '#22d3ee'];

const AboutPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-24 md:pt-32 px-6 md:px-10 pb-20 overflow-x-hidden">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2.5rem;
          /* تأثير التوهج الثابت */
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
        }
        .glowing-border-box-small {
          border-radius: 2rem;
        }
      `}</style>
      <section className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal>
            <h1 className="text-4xl md:text-8xl glow-text mb-6 md:mb-8 text-blue-400 font-black">
              {t('page.about.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-base md:text-2xl leading-relaxed max-w-3xl mx-auto font-light">
              {t('page.about.subtitle')}
            </p>
          </ScrollReveal>
        </div>

        {/* Who We Are Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center mb-20 md:mb-32">
          <ScrollReveal direction={language === 'ar' ? 'right' : 'left'} className="order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" 
                alt="Aqrablik Media Logo"
                className="relative rounded-[2.5rem] shadow-2xl w-full h-auto object-contain bg-white/5 p-8 md:p-12 animate-float"
              />
            </div>
          </ScrollReveal>
          <div className={`order-1 lg:order-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <ScrollReveal direction={language === 'ar' ? 'left' : 'right'}>
              <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 text-white glow-text">
                {t('page.about.who_title')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2} direction={language === 'ar' ? 'left' : 'right'}>
              <p className="text-gray-300 text-sm md:text-xl leading-loose mb-6 font-light">
                {t('page.about.who_p1')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4} direction={language === 'ar' ? 'left' : 'right'}>
              <p className="text-gray-300 text-sm md:text-xl leading-loose font-light">
                {t('page.about.who_p2')}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="text-center mb-20 md:mb-32">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-16 text-white glow-text">
              {t('page.about.vision_mission_title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Vision */}
            <ScrollReveal direction="right" className="h-full">
              <div 
                className="glowing-border-box h-full"
                style={{ '--glow-color': borderColors[0] }}
              >
                <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#080911]/80 backdrop-blur-sm border border-white/5 h-full flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all group relative z-10">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🔭</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-400">
                    {t('page.about.vision_title')}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed">
                    {t('page.about.vision_p')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            
            {/* Mission */}
            <ScrollReveal direction="left" className="h-full" delay={0.2}>
              <div 
                className="glowing-border-box h-full"
                style={{ '--glow-color': borderColors[1] }}
              >
                <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#080911]/80 backdrop-blur-sm border border-white/5 h-full flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all group relative z-10">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-purple-400">
                    {t('page.about.mission_title')}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed">
                    {t('page.about.mission_p')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-16 text-white glow-text">
              {t('page.about.why_title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <div 
                className="glowing-border-box glowing-border-box-small h-full"
                style={{ '--glow-color': borderColors[0] }}
              >
                <div className="p-8 md:p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-all text-center h-full relative z-10">
                  <div className="text-5xl mb-6">🎯</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {t('page.about.feat1_title')}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base font-light">
                    {t('page.about.feat1_desc')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div 
                className="glowing-border-box glowing-border-box-small h-full"
                style={{ '--glow-color': borderColors[1] }}
              >
                <div className="p-8 md:p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-all text-center h-full relative z-10">
                  <div className="text-5xl mb-6">💡</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {t('page.about.feat2_title')}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base font-light">
                    {t('page.about.feat2_desc')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <div 
                className="glowing-border-box glowing-border-box-small h-full"
                style={{ '--glow-color': borderColors[2] }}
              >
                <div className="p-8 md:p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-all text-center h-full relative z-10">
                  <div className="text-5xl mb-6">🤝</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {t('page.about.feat3_title')}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base font-light">
                    {t('page.about.feat3_desc')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Background Decor */}
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default AboutPage;