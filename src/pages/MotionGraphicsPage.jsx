import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // تأكد من المسار الصحيح
import ScrollReveal from '../components/ScrollReveal';

// قائمة فيديوهات الموشن جرافيك
const motionVideos = [
  "0NgXkHQTt4U"
];

// قائمة فيديوهات الوايت بورد
const whiteboardVideos = [
  "k9M60YJJ3iE",
  "jX8rBu-4Z2U"
];

// مصفوفة الألوان للتنويع (أزرق، بنفسجي، تركواز)
const borderColors = ['#3b82f6', '#a855f7', '#22d3ee'];

const MotionGraphicsPage = () => {
  const { t, language } = useLanguage();

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
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh] md:min-h-[70vh]">
        {/* حاوية الصورة - تظهر في اليمين للعربية واليسار للإنجليزية بسبب الترتيب واتجاه الصفحة */}
        <div className="w-full lg:w-1/2 order-1">
          <ScrollReveal delay={0.3}>
            <img 
              src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768840371/flip_motion_lotmin.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686487/Asset_2_2x_qaiojz.png'} 
              alt="Motion Astronaut" 
              className={`w-full h-auto animate-float drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] ${language === 'en' ? 'scale-x-[-1]' : ''}`} 
            />
          </ScrollReveal>
        </div>
      
        {/* حاوية النصوص */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2">
          <ScrollReveal>
            <h1 className="text-4xl md:text-8xl glow-text mb-6 md:mb-8 text-blue-400 font-black">
              {t('page.motion.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.motion.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex gap-4 justify-center lg:justify-start">
            <a 
              href="https://wa.me/201099822822" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-block text-center"
            >
              {t('common.order_now')}
            </a>
            <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all">
              {t('common.view_work')}
            </button>
          </ScrollReveal>
        </div>
        
      </section>
      
      {/* القسم الأول: معرض الموشن جرافيك */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black">
            {t('page.motion.gallery_motion')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {motionVideos.map((id, index) => (
            <ScrollReveal key={`motion-${index}`} delay={index * 0.1}>
              <div 
                className="glowing-border-box aspect-video"
                style={{ '--glow-color': borderColors[index % borderColors.length] }}
              >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <iframe 
                     src={`https://www.youtube.com/embed/${id}`} 
                     title={`Motion Video ${index + 1}`}
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

      {/* القسم الثاني: معرض الوايت بورد */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-purple-400">
            {t('page.motion.gallery_whiteboard')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {whiteboardVideos.map((id, index) => (
            <ScrollReveal key={`whiteboard-${index}`} delay={index * 0.1}>
              <div 
                className="glowing-border-box aspect-video"
                style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
              >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <iframe 
                     src={`https://www.youtube.com/embed/${id}`} 
                     title={`Whiteboard Video ${index + 1}`}
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
      <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default MotionGraphicsPage;