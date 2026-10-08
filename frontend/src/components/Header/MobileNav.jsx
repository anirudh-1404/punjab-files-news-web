import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import brandLogo from '../../assets/logo-updated.png';
import { categoryAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const PUNJAB_SLUG = 'punjab';

export default function MobileNav() {
  const navigate = useNavigate();
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileDrawerSearch, setMobileDrawerSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState('punjab');

  // Listen for global custom event to open/close menu
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

  // Fetch dynamic categories from API (with fallback)
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (isMounted && res && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (e) {}
    };
    loadCategories();
    window.addEventListener('punjab_categories_updated', loadCategories);
    return () => {
      isMounted = false;
      window.removeEventListener('punjab_categories_updated', loadCategories);
    };
  }, []);

  // Lock body scroll when menu is open
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
    setOpenDropdown((prev) => (prev === key ? null : key));
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
      } else {
        navigate(`/category/${targetId}`);
      }
    }
  };

  // Split categories: Punjab (special) vs others
  const punjabCat = categories.find((c) => c.slug === PUNJAB_SLUG);
  const otherCats = categories.filter((c) => c.slug !== PUNJAB_SLUG);

  // Common link styles
  const drawerLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '13px 20px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none'
  };

  return (
    <>
      {/* Portal-Mounted Slide-in Drawer */}
      {createPortal(
        <div
          className={`punjab-mobile-drawer-portal ${isOpen ? 'is-open' : ''}`}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            zIndex: 999999,
            pointerEvents: isOpen ? 'auto' : 'none',
            visibility: isOpen ? 'visible' : 'hidden',
            transition: 'visibility 0.3s ease'
          }}
        >
          {/* Backdrop */}
          <div
            className="drawer-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backdropFilter: 'blur(3px)'
            }}
          />

          {/* Drawer Pane */}
          <div
            className="drawer-pane"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '84%', maxWidth: '320px', height: '100%',
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
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#1a1d24'
              }}
            >
              <a href="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img
                  src={brandLogo}
                  alt="Punjab Files Logo"
                  style={{ height: '48px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '4px', padding: '2px 6px' }}
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
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '16px'
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Drawer Search */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#161922'
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mobileDrawerSearch.trim()) {
                    setIsOpen(false);
                    navigate(`/search?q=${encodeURIComponent(mobileDrawerSearch.trim())}`);
                  }
                }}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: 0 }}
              >
                <input
                  type="text"
                  placeholder="ਖ਼ਬਰਾਂ ਖੋਜੋ... (Search news)"
                  value={mobileDrawerSearch}
                  onChange={(e) => setMobileDrawerSearch(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1f242e', color: '#ffffff',
                    border: '1px solid rgba(235, 177, 13, 0.4)',
                    borderRadius: '20px',
                    padding: '8px 38px 8px 14px',
                    fontSize: '13.5px', outline: 'none',
                    fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                  }}
                />
                <button
                  type="submit"
                  aria-label="ਖੋਜ ਕਰੋ"
                  style={{
                    position: 'absolute', right: '4px',
                    background: '#b71c1c', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff', cursor: 'pointer'
                  }}
                >
                  <i className="fa fa-search" style={{ fontSize: '12px' }}></i>
                </button>
              </form>
            </div>

            {/* Drawer Language Switcher (No country flags) */}
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#1a1d24'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                ਖ਼ਬਰਾਂ ਦੀ ਭਾਸ਼ਾ (Select Language)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {languages.map((l) => {
                  const isActive = language === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '5px',
                        fontSize: '11.5px',
                        fontWeight: isActive ? '800' : '600',
                        backgroundColor: isActive ? '#b71c1c' : 'rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        border: isActive ? '1px solid #ebb10d' : '1px solid rgba(255, 255, 255, 0.15)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation List */}
            <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>

                {/* Home */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a href="/" onClick={() => setIsOpen(false)} style={drawerLinkStyle}>
                    <i className="fa fa-home" style={{ color: '#ebb10d', width: '18px' }}></i>
                    <span>ਮੁੱਖ ਪੰਨਾ</span>
                  </a>
                </li>

                {/* Punjab — Special accordion with sub-regions (only if Punjab exists) */}
                {punjabCat && (
                  <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div
                      onClick={() => toggleDropdown('punjab')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '13px 20px', cursor: 'pointer',
                        backgroundColor: openDropdown === 'punjab' ? 'rgba(183, 28, 28, 0.15)' : 'transparent',
                        borderLeft: openDropdown === 'punjab' ? '4px solid #b71c1c' : '4px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className={`fa ${punjabCat.icon || 'fa-map-marker'}`} style={{ color: '#ebb10d', width: '18px' }}></i>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: openDropdown === 'punjab' ? '#ebb10d' : '#ffffff' }}>
                          {punjabCat.namePa} ({punjabCat.nameEn})
                        </span>
                      </div>
                      <span
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '24px', height: '24px', borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff', fontSize: '12px'
                        }}
                      >
                        <i className={`fa fa-chevron-${openDropdown === 'punjab' ? 'up' : 'down'}`}></i>
                      </span>
                    </div>

                    {/* Punjab Sub-Regions */}
                    {openDropdown === 'punjab' && (
                      <div
                        style={{
                          backgroundColor: '#171920', padding: '6px 0',
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        {[
                          { href: `/category/${PUNJAB_SLUG}`, label: 'ਸਾਰਾ ਪੰਜਾਬ (All Punjab)', icon: 'fa-circle', iconColor: '#b71c1c', size: '7px', bold: true },
                          { href: `/category/${PUNJAB_SLUG}/majha`, label: 'ਮਾਝਾ (Majha)', icon: 'fa-circle-o', iconColor: '#ebb10d', size: '7px', bold: false },
                          { href: `/category/${PUNJAB_SLUG}/malwa`, label: 'ਮਾਲਵਾ (Malwa)', icon: 'fa-circle-o', iconColor: '#ebb10d', size: '7px', bold: false },
                          { href: `/category/${PUNJAB_SLUG}/doaba`, label: 'ਦੋਆਬਾ (Doaba)', icon: 'fa-circle-o', iconColor: '#ebb10d', size: '7px', bold: false }
                        ].map((r) => (
                          <a
                            key={r.href}
                            href={r.href}
                            onClick={() => setIsOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 20px 10px 48px',
                              color: r.bold ? '#e2e8f0' : '#cbd5e1',
                              fontSize: r.bold ? '14px' : '13.5px',
                              fontWeight: r.bold ? '700' : '500',
                              textDecoration: 'none'
                            }}
                          >
                            <i className={`fa ${r.icon}`} style={{ fontSize: r.size, color: r.iconColor }}></i>
                            <span>{r.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                )}

                {/* All other categories — dynamically rendered */}
                {otherCats.map((cat) => (
                  <li key={cat.slug} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <a
                      href={`#${cat.slug}`}
                      onClick={() => handleLinkClick(`#${cat.slug}`)}
                      style={drawerLinkStyle}
                    >
                      <i className={`fa ${cat.icon || 'fa-tag'}`} style={{ color: '#ebb10d', width: '18px' }}></i>
                      <span>{cat.namePa} ({cat.nameEn})</span>
                    </a>
                  </li>
                ))}

                {/* Web TV */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a href="#web-tv" onClick={() => handleLinkClick('#web-tv')} style={drawerLinkStyle}>
                    <i className="fa fa-television" style={{ color: '#ef4444', width: '18px' }}></i>
                    <span>ਵੈੱਬ ਟੀਵੀ (WEB TV 24x7)</span>
                  </a>
                </li>

                {/* Podcasts */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <Link to="/podcasts" onClick={() => setIsOpen(false)} style={drawerLinkStyle}>
                    <i className="fa fa-podcast" style={{ color: '#ebb10d', width: '18px' }}></i>
                    <span>ਪੋਡਕਾਸਟ (Podcasts)</span>
                  </Link>
                </li>

                {/* Photo Gallery */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <Link to="/gallery" onClick={() => setIsOpen(false)} style={drawerLinkStyle}>
                    <i className="fa fa-camera-retro" style={{ color: '#f59e0b', width: '18px' }}></i>
                    <span>ਫ਼ੋਟੋ ਗੈਲਰੀ (Photo Gallery)</span>
                  </Link>
                </li>

                {/* Contact */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a href="/contact" onClick={() => setIsOpen(false)} style={drawerLinkStyle}>
                    <i className="fa fa-envelope-o" style={{ color: '#38bdf8', width: '18px' }}></i>
                    <span>ਸੰਪਰਕ (Contact Us)</span>
                  </a>
                </li>

                {/* Staff Portal */}
                <li style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div
                    onClick={() => toggleDropdown('staff')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 20px', cursor: 'pointer',
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px', borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff', fontSize: '12px'
                      }}
                    >
                      <i className={`fa fa-chevron-${openDropdown === 'staff' ? 'up' : 'down'}`}></i>
                    </span>
                  </div>

                  {openDropdown === 'staff' && (
                    <div style={{ backgroundColor: '#171920', padding: '6px 0' }}>
                      {[
                        { href: '/admin?role=admin', label: 'Login as Admin (ਮੁੱਖ ਐਡਮਿਨ)', icon: 'fa-shield', color: '#b71c1c' },
                        { href: '/admin?role=editor', label: 'Login as Editor (ਸੰਪਾਦਕ)', icon: 'fa-pencil-square-o', color: '#ebb10d' },
                        { href: '/admin?role=reporter', label: 'Login as Reporter (ਪੱਤਰਕਾਰ)', icon: 'fa-newspaper-o', color: '#38bdf8' }
                      ].map((s) => (
                        <a
                          key={s.href}
                          href={s.href}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 20px 10px 48px',
                            color: '#ffffff', fontSize: '13.5px', textDecoration: 'none'
                          }}
                        >
                          <i className={`fa ${s.icon}`} style={{ color: s.color }}></i>
                          <span>{s.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px', color: '#64748b', textAlign: 'center'
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
