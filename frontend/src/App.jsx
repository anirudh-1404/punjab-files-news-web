import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Lenis from 'lenis';

// Global Header & Footer
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Copyrights from './components/Footer/Copyrights';
import ScrollToTop from './components/Footer/ScrollToTop';
import ScrollProgressBar from './components/Header/ScrollProgressBar';

// Floating Chatbot Assistant
import PunjabiChatbot from './components/Chatbot/PunjabiChatbot';

// Homepage Modules (Strictly ordered to match Navbar sequence)
import ParallaxHero from './components/Hero/ParallaxHero';
import DarbarSahibAndPunjabModule from './components/DarbarSahibAndPunjabModule';
import ReligionModule from './components/Modules/ReligionModule';
import WorldNewsModule from './components/Modules/WorldNewsModule';
import SportsModule from './components/Modules/SportsModule';
import HealthModule from './components/Modules/HealthModule';
import TravelModule from './components/Modules/TravelModule';
import EntertainmentModule from './components/Modules/EntertainmentModule';
import ReadersChoiceModule from './components/Modules/ReadersChoiceModule';
import YouTubeChannelModule from './components/Modules/YouTubeChannelModule';
import HomeGalleryModule from './components/Modules/HomeGalleryModule';

// Inner Pages
import NewsDetailPage from './pages/NewsDetailPage';
import AdminCMS from './pages/AdminCMS';
import ContactPage from './pages/ContactPage';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <section id="main-section">
      {/* 1. ਮੁੱਖ ਪੰਨਾ / ਲਾਈਵ ਟੀਵੀ: Sri Darbar Sahib (Left) + Live TV (Right) Top Hero Section */}
      <ParallaxHero />

      {/* 2. ਪੰਜਾਬ: Dedicated Punjab Tri-Region Hub (#punjab - Majha, Malwa, Doaba) */}
      <DarbarSahibAndPunjabModule />

      {/* 3. ਧਰਮ: Dedicated Religion Section (#religion) */}
      <ReligionModule />

      {/* 4. ਦੇਸ਼-ਵਿਦੇਸ਼: World & National News Module (#world) */}
      <WorldNewsModule />

      {/* 5. ਖੇਡਾਂ: Dedicated Sports Module (#sport) */}
      <SportsModule />

      {/* 6. ਸਿਹਤ: Dedicated Health & Wellness Module (#health) */}
      <HealthModule />

      {/* 7. ਸੈਰ-ਸਪਾਟਾ: Dedicated Travel & Heritage Module (#travel) */}
      <TravelModule />

      {/* 8. ਮਨੋਰੰਜਨ: Dedicated Entertainment & Cinema Module (#art-entertainment) */}
      <EntertainmentModule />

      {/* 9. ਪਾਠਕਾਂ ਦੀ ਪਸੰਦ: Dedicated Readers' Choice Top 10 News */}
      <ReadersChoiceModule />

      {/* 10. ਯੂਟਿਊਬ ਚੈਨਲ: Dedicated YouTube Video Grid */}
      <YouTubeChannelModule />

      {/* 11. ਫ਼ੋਟੋ ਗੈਲਰੀ: Multi-slide Photo & Video Gallery */}
      <HomeGalleryModule />
    </section>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Seamless in-page smooth anchor scrolling
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -90, duration: 1.3 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div id="wrapper" data-color="red">
      <ScrollProgressBar />
      <ScrollToTopOnNavigate />

      {/* Global Header (Clean Masthead, Enlarged Logo, Tagline, Breaking Ticker, Nav) */}
      <Header />

      {/* App Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/admin" element={<AdminCMS />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {/* Global Footer */}
      <Footer />

      {/* Copyrights */}
      <Copyrights />

      {/* Back to Top */}
      <ScrollToTop />

      {/* Discreet Punjabi AI Chatbot Widget */}
      <PunjabiChatbot />
    </div>
  );
}
