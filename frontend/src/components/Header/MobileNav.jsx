import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('punjab'); // Expanded by default so user immediately sees Punjab sub-regions

  // Listen for global custom event to open menu from anywhere (e.g. sticky category bar)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    window.addEventListener('open_mobile_menu', handleOpen);
    window.addEventListener('close_mobile_menu', handleClose);
    return () => {
      window.removeEventListener('open_mobile_menu', handleOpen);
      window.removeEventListener('close_mobile_menu', handleClose);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  const handleLinkClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -95;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* 1. Visible Hamburger Button in Masthead */}
      <div className="mobile-nav-trigger-wrap visible-xs visible-sm" style={{ display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-label="ਮੀਨੂ ਖੋਲ੍ਹੋ"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: '1px solid #ebb10d',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(183, 28, 28, 0.35)',
            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
          }}
        >
          <i className="fa fa-bars" style={{ fontSize: '15px' }}></i>
          <span>ਮੀਨੂ (Menu)</span>
        </button>
      </div>

      {/* 2. Portal-Mounted Sidenav Drawer (Completely Immune to Header Transform/Overflow Clipping) */}
      {createPortal(
        <div
          className={`punjab-mobile-drawer-portal ${isOpen ? 'is-open' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            pointerEvents: isOpen ? 'auto' : 'none',
            visibility: isOpen ? 'visible' : 'hidden',
            transition: 'visibility 0.3s ease'
          }}
        >
          {/* Backdrop Shadow Overlay */}
          <div
            className="drawer-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backdropFilter: 'blur(3px)'
            }}
          />

          {/* Sliding Side Menu Content */}
          <div
            className="drawer-pane"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '84%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: '#12141a',
              color: '#ffffff',
              boxShadow: '4px 0 25px rgba(0, 0, 0, 0.6)',
              transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
            }}
          >
            {/* Drawer Header with Brand Logo & Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#1a1d24'
              }}
            >
              <a href="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={whiteLogo}
                  alt="Punjab Files Logo"
                  style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
                />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="ਮੀਨੂ ਬੰਦ ਕਰੋ"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {/* 1. Home */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="/"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-home" style={{ color: '#ebb10d', width: '18px' }}></i>
                    <span>ਮੁੱਖ ਪੰਨਾ</span>
                  </a>
                </li>

                {/* 2. Punjab with Expandable Sub-Regions Accordion */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div
                    onClick={() => toggleDropdown('punjab')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '13px 20px',
                      cursor: 'pointer',
                      backgroundColor: openDropdown === 'punjab' ? 'rgba(183, 28, 28, 0.15)' : 'transparent',
                      borderLeft: openDropdown === 'punjab' ? '4px solid #b71c1c' : '4px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className="fa fa-map-marker" style={{ color: '#ebb10d', width: '18px' }}></i>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: openDropdown === 'punjab' ? '#ebb10d' : '#ffffff' }}>
                        ਪੰਜਾਬ (Punjab)
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    >
                      <i className={`fa fa-chevron-${openDropdown === 'punjab' ? 'up' : 'down'}`}></i>
                    </span>
                  </div>

                  {/* Sub-Regions Dropdown Menu */}
                  {openDropdown === 'punjab' && (
                    <div
                      style={{
                        backgroundColor: '#171920',
                        padding: '6px 0',
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                      }}
                    >
                      <a
                        href="/category/punjab"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#e2e8f0',
                          fontSize: '14px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-circle" style={{ fontSize: '7px', color: '#b71c1c' }}></i>
                        <span>ਸਾਰਾ ਪੰਜਾਬ (All Punjab)</span>
                      </a>
                      <a
                        href="/category/punjab/majha"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#cbd5e1',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-circle-o" style={{ fontSize: '7px', color: '#ebb10d' }}></i>
                        <span>ਮਾਝਾ (Majha)</span>
                      </a>
                      <a
                        href="/category/punjab/malwa"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#cbd5e1',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-circle-o" style={{ fontSize: '7px', color: '#ebb10d' }}></i>
                        <span>ਮਾਲਵਾ (Malwa)</span>
                      </a>
                      <a
                        href="/category/punjab/doaba"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#cbd5e1',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-circle-o" style={{ fontSize: '7px', color: '#ebb10d' }}></i>
                        <span>ਦੋਆਬਾ (Doaba)</span>
                      </a>
                    </div>
                  )}
                </li>

                {/* 3. Religion */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#religion"
                    onClick={() => handleLinkClick('#religion')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-sun-o" style={{ color: '#ebb10d', width: '18px' }}></i>
                    <span>ਧਰਮ (Religion)</span>
                  </a>
                </li>

                {/* 4. World */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#world"
                    onClick={() => handleLinkClick('#world')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-globe" style={{ color: '#38bdf8', width: '18px' }}></i>
                    <span>ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)</span>
                  </a>
                </li>

                {/* 5. Sports */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#sport"
                    onClick={() => handleLinkClick('#sport')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-futbol-o" style={{ color: '#4ade80', width: '18px' }}></i>
                    <span>ਖੇਡਾਂ (Sports)</span>
                  </a>
                </li>

                {/* 6. Health */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#health"
                    onClick={() => handleLinkClick('#health')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-heartbeat" style={{ color: '#f87171', width: '18px' }}></i>
                    <span>ਸਿਹਤ (Health)</span>
                  </a>
                </li>

                {/* 7. Travel */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#travel"
                    onClick={() => handleLinkClick('#travel')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-plane" style={{ color: '#a78bfa', width: '18px' }}></i>
                    <span>ਸੈਰ-ਸਪਾਟਾ (Travel)</span>
                  </a>
                </li>

                {/* 8. Entertainment */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#art-entertainment"
                    onClick={() => handleLinkClick('#art-entertainment')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-film" style={{ color: '#fb923c', width: '18px' }}></i>
                    <span>ਮਨੋਰੰਜਨ (Entertainment)</span>
                  </a>
                </li>

                {/* 9. Live TV */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="#live-tv"
                    onClick={() => handleLinkClick('#live-tv')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-television" style={{ color: '#ef4444', width: '18px' }}></i>
                    <span>ਲਾਈਵ ਟੀਵੀ (Live 24x7)</span>
                  </a>
                </li>

                {/* 10. Contact */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '13px 20px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="fa fa-envelope-o" style={{ color: '#38bdf8', width: '18px' }}></i>
                    <span>ਸੰਪਰਕ (Contact Us)</span>
                  </a>
                </li>

                {/* 11. Staff Portal Accordion */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div
                    onClick={() => toggleDropdown('staff')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '13px 20px',
                      cursor: 'pointer',
                      backgroundColor: openDropdown === 'staff' ? 'rgba(235, 177, 13, 0.1)' : 'transparent',
                      borderLeft: openDropdown === 'staff' ? '4px solid #ebb10d' : '4px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className="fa fa-shield" style={{ color: '#ebb10d', width: '18px' }}></i>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#ebb10d' }}>
                        ਸਟਾਫ਼ ਲੌਗਇਨ (Staff Portal)
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    >
                      <i className={`fa fa-chevron-${openDropdown === 'staff' ? 'up' : 'down'}`}></i>
                    </span>
                  </div>

                  {openDropdown === 'staff' && (
                    <div style={{ backgroundColor: '#171920', padding: '6px 0' }}>
                      <a
                        href="/admin?role=admin"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#ffffff',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-shield" style={{ color: '#b71c1c' }}></i>
                        <span>Login as Admin (ਮੁੱਖ ਐਡਮਿਨ)</span>
                      </a>
                      <a
                        href="/admin?role=editor"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#ffffff',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-pencil-square-o" style={{ color: '#ebb10d' }}></i>
                        <span>Login as Editor (ਸੰਪਾਦਕ)</span>
                      </a>
                      <a
                        href="/admin?role=reporter"
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 20px 10px 48px',
                          color: '#ffffff',
                          fontSize: '13.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa fa-newspaper-o" style={{ color: '#38bdf8' }}></i>
                        <span>Login as Reporter (ਪੱਤਰਕਾਰ)</span>
                      </a>
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Drawer Footer Notice */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
                color: '#64748b',
                textAlign: 'center'
              }}
            >
              © {new Date().getFullYear()} Punjab Files • 24x7 News
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

