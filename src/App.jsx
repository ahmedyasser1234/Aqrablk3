// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';
import CursorEffect from './components/CursorEffect';
import ScrollToTop from './components/ScrollToTop';
import SocialSidebar from './components/SocialSidebar';
import LanguageWrapper from './components/LanguageWrapper';

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

import { useAnalytics } from './hooks/useAnalytics';
import ChatWidget from './components/ChatWidget';

const Layout = () => {
  useAnalytics();
  const location = useLocation();
  return (
    <LanguageWrapper>
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
    </LanguageWrapper>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/ar" replace />} />
        <Route path="/:lang" element={<Layout />}>
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
          <Route path="dashboard" element={<DashboardPage />}>
            <Route path="stats" element={<div className="animate-in fade-in" />} />
            <Route path="messages" element={<div className="animate-in fade-in" />} />
            <Route path="settings" element={<div className="animate-in fade-in" />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/ar" replace />} />
      </Routes>
    </Router>
  );
}

export default App;