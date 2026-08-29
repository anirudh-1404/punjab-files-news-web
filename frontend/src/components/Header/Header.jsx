import React from 'react';
import TopMenu from './TopMenu';
import LogoBanner from './LogoBanner';
import MobileNav from './MobileNav';
import FixedNavbar from './FixedNavbar';

export default function Header() {
  return (
    <header id="header">
      {/* Top Dark Bar */}
      <TopMenu />

      {/* Header Middle: Logo & 728x90 Banner + Mobile Nav */}
      <div className="container">
        <LogoBanner />
        <MobileNav />
      </div>

      {/* Red Navigation Bar + Sub Menu with Clock */}
      <FixedNavbar />
    </header>
  );
}
