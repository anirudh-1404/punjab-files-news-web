import React, { useState, useEffect } from 'react';
import TopMenu from './TopMenu';
import HeaderBreakingTicker from './HeaderBreakingTicker';
import LogoBanner from './LogoBanner';
import MobileNav from './MobileNav';
import FixedNavbar from './FixedNavbar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <>
      <header id="header">
        {/* Top Dark Bar */}
        <TopMenu />

        {/* Header Middle: Logo & Live Clock (Smoothly disables as user scrolls past it) */}
        <div className={`header-masthead-wrapper ${isScrolled ? 'masthead-disabled' : ''}`}>
          <div className="container">
            <LogoBanner />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* STICKY UNIT: Breaking News Ticker + Fixed Navbar Together (Parent is #wrapper) */}
      <div className={`sticky-nav-breaking-container ${isScrolled ? 'is-sticky' : ''}`}>
        {/* Row 1: Breaking News Marquee */}
        <HeaderBreakingTicker />

        {/* Row 2: Main Category Navigation */}
        <FixedNavbar />
      </div>
    </>
  );
}

