import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SocialSidebar = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Hide on Dashboard
  if (location.pathname.includes('/dashboard')) return null;

  // Define position: AR -> Left, EN -> Right
  const sideClass = language === 'ar' ? 'left-6' : 'right-6';
  const mobileSideClass = language === 'ar' ? 'left-2' : 'right-2';
  const animDirection = language === 'ar' ? 'slide-in-from-left-4' : 'slide-in-from-right-4';

  const socialLinks = [
    { id: 'facebook', name: 'Facebook', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685537/Asset_15_lzcgst.png', url: 'https://www.facebook.com/profile.php?id=61575001066937' },
    { id: 'tiktok', name: 'TikTok', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685642/Asset_16_oexox9.png', url: 'https://www.tiktok.com/@aqrablaak' },
    { id: 'instagram', name: 'Instagram', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685753/insta_kgp3t4.png', url: 'https://www.instagram.com/aqrablaak/' },
    { id: 'X', name: 'X', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685753/Asset_17_ivb4u9.png', url: 'https://x.com/aqrablaak' },
    { id: 'youtyube', name: 'youtube', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685753/Asset_18_kehltv.png', url: 'https://www.youtube.com/@aqrablaak' },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685752/Asset_14_r8nlkf.png', url: 'https://wa.me/201099822822' },
    { id: 'phone', name: 'Phone', icon: 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685753/phon_rgoezo.png', url: 'tel:+201099822822' },
  ];

  const alwaysVisibleIds = ['facebook', 'whatsapp', 'phone'];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const isBottom = scrollTop + windowHeight >= documentHeight - 50;
      setIsAtBottom(isBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderLink = (social, index) => (
    <a
      key={social.id}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <img
        src={social.icon}
        alt={social.name}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:rotate-12"
      />
    </a>
  );

  return (
    <>
      {/* Desktop Version */}
      <div className={`hidden md:flex fixed ${sideClass} top-1/2 -translate-y-1/2 flex-col gap-4 z-[100] pointer-events-auto`}>
        {socialLinks.map((social, index) => renderLink(social, index))}
      </div>

      {/* Mobile Version */}
      <div className={`flex md:hidden fixed ${mobileSideClass} top-1/2 -translate-y-1/2 flex-col gap-3 z-[100] pointer-events-auto transition-all duration-700 ${isAtBottom ? 'bg-black/20 backdrop-blur-lg rounded-full py-4 px-1 shadow-2xl' : 'bg-transparent'}`}>
        {socialLinks.map((social, index) => {
          const isPrimary = alwaysVisibleIds.includes(social.id);
          if (isPrimary || isAtBottom) {
            return (
              <div key={social.id} className={`animate-in fade-in ${animDirection} duration-500`}>
                {renderLink(social, index)}
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default SocialSidebar;