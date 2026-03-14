import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useSEO from './hooks/useSEO';
import NotFound from './pages/NotFound';
import { LanguageProvider } from './context/LanguageContext';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';
import CursorEffect from './components/CursorEffect';
import ScrollToTop from './components/ScrollToTop';
import SocialSidebar from './components/SocialSidebar';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ContentWritingPage from './pages/ContentWritingPage';
import MarketingPage from './pages/MarketingPage';
import MontagePage from './pages/MontagePage';
import MotionGraphicsPage from './pages/MotionGraphicsPage';
import PhotographyPage from './pages/PhotographyPage';
import StudioRentalPage from './pages/StudioRentalPage';
import WebDesignPage from './pages/WebDesignPage';
import DesignPage from './pages/DesignPage';
import DashboardPage from './pages/DashboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SearchPage from './pages/SearchPage';
import { useAnalytics } from './hooks/useAnalytics';
import ChatWidget from './components/ChatWidget';
import InternalSystem from './internal/InternalSystem';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentCatch(error, errorInfo) {
    console.error("🚀 App Crash Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] p-10 z-[99999] relative">
          <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-3xl max-w-2xl">
            <h1 className="text-3xl font-black mb-4">Oops! Something went wrong.</h1>
            <p className="text-red-300 font-mono text-sm overflow-auto mb-4">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-white text-black font-black rounded-full">Restart App</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Layout = () => {
  useAnalytics();
  useSEO();
  const location = useLocation();

  // Marketing Integration (GA4 & Facebook Pixel)
  useEffect(() => {
    const GA_ID = 'G-XXXXXXXXXX'; // Replace with real ID
    const FB_PIXEL_ID = 'XXXXXXXXXXXXXXX'; // Replace with real ID

    // GA4 initialization
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);

    // Facebook Pixel initialization
    if (FB_PIXEL_ID && FB_PIXEL_ID !== 'XXXXXXXXXXXXXXX') {
      const script3 = document.createElement('script');
      script3.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script3);
      window._fbScript = script3;
    }

    return () => {
      // Cleanup
      try {
        if (script1.parentNode) document.head.removeChild(script1);
        if (script2.parentNode) document.head.removeChild(script2);
        if (window._fbScript && window._fbScript.parentNode) document.head.removeChild(window._fbScript);
      } catch (e) { }
    };
  }, []);

  // Track page changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search
      });
    }
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <CursorEffect />
        <ChatWidget />
        <BackgroundEffects />
        <ScrollToTop />
        <SocialSidebar />
        <Navbar />
        <main className="relative z-10">
          <Outlet />
        </main>
        {!location.pathname.includes('/dashboard') && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/content-writing" element={<ContentWritingPage />} />
        <Route path="services/marketing" element={<MarketingPage />} />
        <Route path="services/montage" element={<MontagePage />} />
        <Route path="services/motion-graphics" element={<MotionGraphicsPage />} />
        <Route path="services/photography" element={<PhotographyPage />} />
        <Route path="services/studio-rental" element={<StudioRentalPage />} />
        <Route path="services/web-design" element={<WebDesignPage />} />
        <Route path="services/design" element={<DesignPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="dashboard" element={<DashboardPage />}>
          <Route path="stats" element={<div className="animate-in fade-in" />} />
          <Route path="messages" element={<div className="animate-in fade-in" />} />
          <Route path="requests" element={<div className="animate-in fade-in" />} />
          <Route path="admins" element={<div className="animate-in fade-in" />} />
          <Route path="support-emails" element={<div className="animate-in fade-in" />} />
          <Route path="support-desk" element={<div className="animate-in fade-in" />} />
          <Route path="settings" element={<div className="animate-in fade-in" />} />
          <Route path="partners" element={<div className="animate-in fade-in" />} />
          <Route path="testimonials" element={<div className="animate-in fade-in" />} />
          <Route path="seo" element={<div className="animate-in fade-in" />} />
          <Route path="blog" element={<div className="animate-in fade-in" />} />
          <Route path="blog-comments" element={<div className="animate-in fade-in" />} />
          <Route path="chatbot" element={<div className="animate-in fade-in" />} />
          <Route path="pricing" element={<div className="animate-in fade-in" />}>
            <Route path=":id" element={<div />} />
          </Route>
          <Route path="services" element={<div className="animate-in fade-in" />}>
            <Route path=":serviceType" element={<div />} />
          </Route>
        </Route>
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Internal system */}
      <Route path="internal" element={<InternalSystem />} />
      <Route path="internal/:tab" element={<InternalSystem />} />
      <Route path="internal/:tab/:subParam" element={<InternalSystem />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;