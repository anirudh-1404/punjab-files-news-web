import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TopMenu from './TopMenu';
import HeaderBreakingTicker from './HeaderBreakingTicker';
import LogoBanner from './LogoBanner';
import MobileNav from './MobileNav';
import FixedNavbar from './FixedNavbar';
import { getSavedUser } from '../../services/api';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(90);
  const stickyRef = useRef(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoggedIn = !!getSavedUser();

  useEffect(() => {
    const updateHeight = () => {
      if (stickyRef.current && !isScrolled) {
        const h = stickyRef.current.offsetHeight;
        if (h && h > 0) setNavHeight(h);
      }
    };

    updateHeight();

    const handleScroll = () => {
      // Stick as soon as user scrolls past TopMenu & LogoBanner (~140px)
      if (window.scrollY > 140) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isScrolled]);

  // When logged into the newsroom dashboard, DashboardLayout renders its own dedicated header
  if (isAdmin && isLoggedIn) {
    return null;
  }

  return (
    <>
      <header id="header" style={{ position: 'relative', zIndex: isScrolled ? 100 : 10005 }}>
        {/* Top Dark Bar */}
        <TopMenu />

        {/* Header Middle: Logo & Live Clock */}
        <div
          className={`header-masthead-wrapper ${isScrolled ? 'masthead-disabled' : ''}`}
          style={{ position: 'relative', zIndex: isScrolled ? 100 : 10006 }}
        >
          <div className="container">
            <LogoBanner />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* STICKY UNIT: Breaking News Ticker + Fixed Navbar - Hidden on /admin login screen */}
      {!isAdmin && (
        <div
          className="sticky-nav-placeholder"
          style={{
            minHeight: isScrolled ? `${navHeight}px` : 'auto'
          }}
        >
          <div
            ref={stickyRef}
            className={`sticky-nav-breaking-container ${isScrolled ? 'is-sticky' : ''}`}
          >
            {/* Row 1: Breaking News Marquee */}
            <HeaderBreakingTicker />

            {/* Row 2: Main Category Navigation */}
            <FixedNavbar />
          </div>
        </div>
      )}
    </>
  );
}


