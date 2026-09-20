import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopMenu from './TopMenu';
import HeaderBreakingTicker from './HeaderBreakingTicker';
import LogoBanner from './LogoBanner';
import MobileNav from './MobileNav';
import FixedNavbar from './FixedNavbar';
import { getSavedUser } from '../../services/api';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoggedIn = !!getSavedUser();

  useEffect(() => {
    const handleScroll = () => {
      // When scrolled past TopMenu & LogoBanner (~145px)
      if (window.scrollY > 135) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When logged into the newsroom dashboard, DashboardLayout renders its own dedicated header
  if (isAdmin && isLoggedIn) {
    return null;
  }

  return (
    <>
      <header id="header">
        {/* Top Dark Bar */}
        <TopMenu />

        {/* Header Middle: Logo & Live Clock */}
        <div className={`header-masthead-wrapper ${isScrolled ? 'masthead-disabled' : ''}`}>
          <div className="container">
            <LogoBanner />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* STICKY UNIT: Breaking News Ticker + Fixed Navbar - Hidden on /admin login screen */}
      {!isAdmin && (
        <div className={`sticky-nav-breaking-container ${isScrolled ? 'is-sticky' : ''}`}>
          {/* Row 1: Breaking News Marquee */}
          <HeaderBreakingTicker />

          {/* Row 2: Main Category Navigation */}
          <FixedNavbar />
        </div>
      )}
    </>
  );
}


