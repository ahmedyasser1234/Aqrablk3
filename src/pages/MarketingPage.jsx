import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const MarketingPage = () => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p1 = fetch(`${API_BASE_URL}/marketing/category/solution`).then(res => res.json()).then(data => setSolutions(data));
    const p2 = fetch(`${API_BASE_URL}/marketing/category/step`).then(res => res.json()).then(data => setSteps(data));
    Promise.all([p1, p2]).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

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
          <ScrollReveal delay={0.4} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-[var(--glass-bg)] border border-pink-500/50 text-pink-400 font-bold hover:bg-[var(--glass-bg)]/80 transition-all shadow-[0_0_20px_rgba(219,39,119,0.4)] flex-1 md:flex-none"
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
          {(solutions.length > 0 ? solutions : [1, 2, 3, 4, 5, 6].map(n => ({ id: n, title: t(`page.marketing.sol${n}_title`), description: t(`page.marketing.sol${n}_desc`), icon: n }))).map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 0.1}>
              <div className="group bg-[var(--glass-bg)] border border-white/10 p-8 rounded-[2.5rem] hover:bg-pink-600/10 hover:border-pink-500/50 transition-all duration-500 h-full relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-pink-500/20 transition-all"></div>

                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <div className="text-pink-500 group-hover:text-pink-400 text-3xl">
                    {typeof item.icon === 'number' ? (
                      item.icon === 1 ? '📊' : item.icon === 2 ? '🔍' : item.icon === 3 ? '📅' : item.icon === 4 ? '📝' : item.icon === 5 ? '📈' : '📢'
                    ) : item.icon}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-color)] group-hover:text-pink-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed font-light text-lg">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* منهجية العمل (Methodology) */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto">
        <ScrollReveal className="bg-[var(--glass-bg)] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center backdrop-blur-sm relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-10 md:mb-16 glow-text text-white">
            {t('page.marketing.methodology')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {(steps.length > 0 ? steps : [1, 2, 3].map(n => ({ id: n, title: t(`page.marketing.step${n}_title`), description: t(`page.marketing.step${n}_desc`) }))).map((step, idx) => (
              <ScrollReveal key={step.id} delay={idx * 0.1}>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-black text-pink-500/30 group-hover:text-pink-500 transition-colors mb-4 duration-500">
                    0{idx + 1}
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-3 text-[var(--text-color)]">
                    {step.title}
                  </h4>
                  <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
                    {step.description}
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

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={language === 'ar' ? 'تسويق الكترونى' : 'Marketing'}
      />
    </div>
  );
};

export default MarketingPage;