import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

// فيديوهات نماذج أعمال كتابة المحتوى (سكريبتات، إعلانات، إلخ)
const contentVideos = [
  "jX8rBu-4Z2U",
  "k9M60YJJ3iE",
  "3PFLbXvWNF4",
  "UTOu0NEx4yE",
  "ZF1a40JkekQ",
  "NMe42TEOdoc",
  "JxiqxiCEk-g"
];

// ألوان التوهج (أزرق، بنفسجي، سماوي)
const borderColors = ['#3b82f6', '#a855f7', '#38bdf8'];

const ContentWritingPage = () => {
  const { t, language } = useLanguage();

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
          <ScrollReveal delay={0.4} className="flex gap-4 justify-center lg:justify-start">
            <a
              href="https://wa.me/201099822822"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-block text-center"
            >
              {t('common.request_sample')}
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
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm flex flex-col justify-center">
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
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm flex flex-col justify-center">
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
              <div className="relative z-10 h-full p-10 rounded-[2rem] bg-[#080911]/80 backdrop-blur-sm flex flex-col justify-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {contentVideos.map((id, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
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
      </section>

      {/* Background Decor */}
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-10 left-10 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default ContentWritingPage;