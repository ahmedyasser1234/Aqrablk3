import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

// ألوان التوهج (أزرق، بنفسجي، أخضر، أصفر)
const borderColors = ['#3b82f6', '#a855f7', '#22c55e', '#eab308'];

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('page.contact.success_msg'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const services = [
    t('service.motion'),
    t('service.montage'),
    t('service.photography'),
    t('service.studio'),
    t('service.web'),
    t('service.content'),
    t('service.marketing')
  ];

  return (
    <div className="pt-24 md:pt-32 px-6 md:px-10 pb-20 overflow-x-hidden">
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
      <section className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal>
            <h1 className="text-4xl md:text-8xl glow-text mb-6 md:mb-8 text-blue-400 font-black">
              {t('page.contact.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-base md:text-2xl leading-relaxed max-w-3xl mx-auto font-light">
              {t('page.contact.subtitle')}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          
          {/* Contact Information */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <ScrollReveal direction={language === 'ar' ? 'right' : 'left'}>
              <h2 className="text-3xl md:text-4xl font-black mb-8 md:mb-12 text-white glow-text">
                {t('page.contact.info_title')}
              </h2>
            </ScrollReveal>
            
            <div className="space-y-6 md:space-y-8">
              {/* Phone */}
              <ScrollReveal delay={0.1} direction={language === 'ar' ? 'right' : 'left'}>
                <div 
                  className="glowing-border-box"
                  style={{ '--glow-color': borderColors[0] }}
                >
                  <div className={`relative z-10 flex items-center gap-4 md:gap-6 bg-[#080911]/80 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className={`flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">{t('page.contact.phone')}</p>
                      <p className="text-xl md:text-2xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer" dir="ltr">01099822822</p>
                      <p className="text-xl md:text-2xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer" dir="ltr">01014700317</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Email */}
              <ScrollReveal delay={0.2} direction={language === 'ar' ? 'right' : 'left'}>
                <div 
                  className="glowing-border-box"
                  style={{ '--glow-color': borderColors[1] }}
                >
                  <div className={`relative z-10 flex items-center gap-4 md:gap-6 bg-[#080911]/80 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className={`flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">{t('page.contact.email')}</p>
                      <p className="text-xl md:text-2xl font-bold text-white break-all hover:text-purple-400 transition-colors cursor-pointer">info@aqrablk.com</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Address */}
              <ScrollReveal delay={0.3} direction={language === 'ar' ? 'right' : 'left'}>
                <div 
                  className="glowing-border-box"
                  style={{ '--glow-color': borderColors[2] }}
                >
                  <div className={`relative z-10 flex items-center gap-4 md:gap-6 bg-[#080911]/80 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className={`flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">{t('page.contact.address')}</p>
                      <p className="text-xl md:text-2xl font-bold text-white">{t('page.contact.address_val')}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Working Hours */}
              <ScrollReveal delay={0.4} direction={language === 'ar' ? 'right' : 'left'}>
                <div 
                  className="glowing-border-box"
                  style={{ '--glow-color': borderColors[3] }}
                >
                  <div className={`relative z-10 flex items-center gap-4 md:gap-6 bg-[#080911]/80 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className={`flex-grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">{t('page.contact.hours')}</p>
                      <p className="text-xl font-bold text-white">{t('page.contact.hours_days')}</p>
                      <p className="text-gray-400 text-base">{t('page.contact.hours_val')}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Contact Form */}
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <ScrollReveal direction={language === 'ar' ? 'left' : 'right'}>
              <h2 className="text-3xl md:text-4xl font-black mb-8 md:mb-12 text-white glow-text">
                {t('page.contact.form_title')}
              </h2>
            </ScrollReveal>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <ScrollReveal delay={0.1} direction={language === 'ar' ? 'left' : 'right'}>
                <input
                  type="text"
                  name="name"
                  placeholder={t('page.contact.form_name')}
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <ScrollReveal delay={0.2} direction={language === 'ar' ? 'left' : 'right'}>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('page.contact.form_email')}
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    required
                  />
                </ScrollReveal>

                <ScrollReveal delay={0.3} direction={language === 'ar' ? 'left' : 'right'}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('page.contact.form_phone')}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    required
                  />
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.4} direction={language === 'ar' ? 'left' : 'right'}>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer ${language === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  <option value="" className="bg-[#080911]">{t('page.contact.form_service')}</option>
                  {services.map((service, index) => (
                    <option key={index} value={service} className="bg-[#080911]">{service}</option>
                  ))}
                </select>
              </ScrollReveal>

              <ScrollReveal delay={0.5} direction={language === 'ar' ? 'left' : 'right'}>
                <textarea
                  name="message"
                  placeholder={t('page.contact.form_message')}
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </ScrollReveal>

              <ScrollReveal delay={0.6} direction={language === 'ar' ? 'left' : 'right'}>
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black hover:shadow-lg hover:shadow-blue-500/30 transition-all text-xl"
                >
                  {t('page.contact.form_submit')}
                </button>
              </ScrollReveal>
            </form>
          </div>
        </div>
      </section>
      
      {/* Background Decor */}
      <div className="fixed top-1/3 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default ContactPage;