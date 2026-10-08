import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

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
import DynamicCategoryModule from './components/Modules/DynamicCategoryModule';
import AdBanner from './components/Common/AdBanner';

// Inner Pages
import NewsDetailPage from './pages/NewsDetailPage';
import AdminCMS from './pages/AdminCMS';
import ContactPage from './pages/ContactPage';
import CategoryNewsPage from './pages/CategoryNewsPage';
import SearchPage from './pages/SearchPage';
import PodcastsPage from './pages/PodcastsPage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';

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
      {/* 1. ਮੁੱਖ ਪੰਨਾ: Sri Darbar Sahib Hukamnama + Main Headline + Web TV & Podcasts Top Hero Section */}
      <ParallaxHero />

      {/* 2. ਪੰਜਾਬ: Dedicated Punjab Tri-Region Hub (#punjab - Majha, Malwa, Doaba) */}
      <DarbarSahibAndPunjabModule />

      {/* 3. ਦੇਸ਼-ਵਿਦੇਸ਼: World & National News Module (#world) */}
      <WorldNewsModule />

      {/* 4. Homepage Horizontal Sponsor Ad Banner (970x90 / 820x100) */}
      <AdBanner
        slot="home_middle_banner"
        containerClassName="container"
        containerStyle={{ margin: '24px auto' }}
      />

      {/* 5. ਖੇਡਾਂ: Dedicated Sports Module (#sport) */}
      <SportsModule />

      {/* 5. ਸਿਹਤ: Dedicated Health & Wellness Module (#health) */}
      <HealthModule />

      {/* 6. ਸੈਰ-ਸਪਾਟਾ: Dedicated Travel & Heritage Module (#travel) */}
      <TravelModule />

      {/* 7. ਮਨੋਰੰਜਨ: Dedicated Entertainment & Cinema Module (#art-entertainment) */}
      <EntertainmentModule />

      {/* 8. ਧਰਮ ਤੇ ਵਿਰਾਸਤ: Dedicated Religion & Heritage Module (#religion) - Moved after ਮਨੋਰੰਜਨ */}
      <ReligionModule />

      {/* 9. ਗਤੀਸ਼ੀਲ ਕੈਟੇਗਰੀਆਂ (Dynamic Categories created from Admin e.g. Exclusive, Crime, etc.) */}
      <DynamicCategoryModule />

      {/* 10. ਪਾਠਕਾਂ ਦੀ ਪਸੰਦ: Dedicated Readers' Choice Top 10 News */}
      <ReadersChoiceModule />

      {/* 11. ਯੂਟਿਊਬ ਚੈਨਲ: Dedicated YouTube Video Grid */}
      <YouTubeChannelModule />

    </section>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Ensure document and body are never scroll-locked
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Seamless in-page smooth anchor scrolling
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
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
        <Route path="/article/:id" element={<NewsDetailPage />} />
        <Route path="/admin" element={<AdminCMS />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:category" element={<CategoryNewsPage />} />
        <Route path="/category/:category/:subRegion" element={<CategoryNewsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Footer - Hidden on /admin */}
      {!isAdmin && <Footer />}

      {/* Copyrights - Hidden on /admin */}
      {!isAdmin && <Copyrights />}

      {/* Back to Top - Hidden on /admin */}
      {!isAdmin && <ScrollToTop />}

      {/* Discreet Punjabi AI Chatbot Widget - Hidden on /admin */}
      {!isAdmin && <PunjabiChatbot />}
    </div>
  );
}
