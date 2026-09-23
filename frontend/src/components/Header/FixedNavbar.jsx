import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function FixedNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [punjabDropdownOpen, setPunjabDropdownOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.punjab-nav-item')) {
        setPunjabDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    // 1. If on /contact page
    if (location.pathname === '/contact') {
      setActiveSection('contact');
      return;
    }

    // 2. If on category page
    if (location.pathname.startsWith('/category/punjab')) {
      setActiveSection('punjab');
      return;
    }
    if (location.pathname.startsWith('/category/religion')) {
      setActiveSection('religion');
      return;
    }
    if (location.pathname.startsWith('/category/world')) {
      setActiveSection('world');
      return;
    }
    if (location.pathname.startsWith('/category/sport')) {
      setActiveSection('sport');
      return;
    }
    if (location.pathname.startsWith('/category/health')) {
      setActiveSection('health');
      return;
    }
    if (location.pathname.startsWith('/category/travel')) {
      setActiveSection('travel');
      return;
    }
    if (location.pathname.startsWith('/category/art-entertainment')) {
      setActiveSection('art-entertainment');
      return;
    }

    // 3. If on any other inner page (e.g. /news/...)
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    // 3. On homepage (/), track scroll spy
    const sectionIds = [
      'punjab',
      'religion',
      'world',
      'sport',
      'health',
      'travel',
      'art-entertainment',
      'live-tv'
    ];

    const handleScroll = () => {
      // Top of page / Hero banner
      if (window.scrollY < 260) {
        setActiveSection('home');
        return;
      }

      const scrollPosition = window.scrollY + 180;
      let currentSection = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
            break;
          } else if (scrollPosition >= top) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, targetId, subRegion = null) => {
    e.preventDefault();
    setActiveSection(targetId);

    if (subRegion) {
      window.dispatchEvent(new CustomEvent('punjab_region_select', { detail: subRegion }));
    }

    if (targetId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (targetId === 'contact') {
      navigate('/contact');
      return;
    }

    // In-page section navigation
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        scrollToSection(targetId);
      }, 150);
    } else {
      scrollToSection(targetId);
    }
  };

  return (
    <div className="navbar" id="fixed-navbar" style={{ position: 'relative' }}>
      {/* Main Red Navbar Menu with Punjabi Categories */}
      <div className="main-menu" id="fixed-navbar-toggle">
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div
            className="nav-scroll-container"
            style={{
              flex: '1 1 auto'
            }}
          >
            <ul className="nav navbar-nav horizontal-category-nav">
            {/* Interactive Mobile Menu Chip */}
            <li className="category-indicator-chip visible-xs visible-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open_mobile_menu'))}
                aria-label="ਸਾਰੇ ਮੀਨੂ ਖੋਲ੍ਹੋ"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1c2d5a',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(235, 177, 13, 0.6)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
              >
                <i className="fa fa-bars" style={{ color: '#ebb10d' }}></i>
                <span>ਸਾਰੇ ਮੀਨੂ</span>
              </button>
            </li>

            {/* Interactive Mobile Search Chip */}
            <li className="category-indicator-chip visible-xs visible-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                aria-label="ਖ਼ਬਰਾਂ ਖੋਜੋ"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: mobileSearchOpen ? '#b71c1c' : '#ffffff',
                  color: mobileSearchOpen ? '#ffffff' : '#1c2d5a',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: mobileSearchOpen ? '1px solid #b71c1c' : '1px solid rgba(28, 45, 90, 0.4)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
              >
                <i className={`fa fa-${mobileSearchOpen ? 'times' : 'search'}`} style={{ color: mobileSearchOpen ? '#ffffff' : '#b71c1c' }}></i>
                <span>{mobileSearchOpen ? 'ਬੰਦ ਕਰੋ' : 'ਖੋਜ'}</span>
              </button>
            </li>

            {/* 1. Home */}
            <li className={activeSection === 'home' ? 'active' : ''}>
              <a
                href="/"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                ਮੁੱਖ ਪੰਨਾ
              </a>
            </li>

            {/* 2. Punjab with Single-Arrow Interactive Tri-Region Dropdown */}
            <li
              className={`dropdown punjab-nav-item ${activeSection === 'punjab' ? 'active' : ''} ${punjabDropdownOpen ? 'open' : ''}`}
              onMouseEnter={() => setPunjabDropdownOpen(true)}
              onMouseLeave={() => setPunjabDropdownOpen(false)}
              style={{ position: 'relative' }}
            >
              <a
                href="/category/punjab"
                onClick={(e) => {
                  e.preventDefault();
                  setPunjabDropdownOpen((prev) => !prev);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <span>ਪੰਜਾਬ</span>
                <i className={`fa fa-chevron-${punjabDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '11px', marginLeft: '3px' }}></i>
              </a>

              {/* Desktop Dropdown */}
              <ul
                className="dropdown-menu hidden-xs hidden-sm"
                style={{
                  display: punjabDropdownOpen ? 'block' : 'none',
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: '220px',
                  backgroundColor: '#1c2d5a',
                  border: '2px solid #ebb10d',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                  padding: '6px 0',
                  margin: 0,
                  zIndex: 999999,
                  listStyle: 'none'
                }}
              >
                <li>
                  <Link
                    to="/category/punjab"
                    onClick={() => {
                      setActiveSection('punjab');
                      setPunjabDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b71c1c';
                      e.currentTarget.style.paddingLeft = '22px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '18px';
                    }}
                  >
                    <i className="fa fa-globe" style={{ color: '#ebb10d' }}></i>
                    <span>ਸਾਰਾ ਪੰਜਾਬ (All Punjab)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/majha"
                    onClick={() => {
                      setActiveSection('punjab');
                      setPunjabDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b71c1c';
                      e.currentTarget.style.paddingLeft = '22px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '18px';
                    }}
                  >
                    <i className="fa fa-compass" style={{ color: '#ebb10d' }}></i>
                    <span>ਮਾਝਾ (Majha)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/malwa"
                    onClick={() => {
                      setActiveSection('punjab');
                      setPunjabDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b71c1c';
                      e.currentTarget.style.paddingLeft = '22px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '18px';
                    }}
                  >
                    <i className="fa fa-compass" style={{ color: '#ebb10d' }}></i>
                    <span>ਮਾਲਵਾ (Malwa)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/doaba"
                    onClick={() => {
                      setActiveSection('punjab');
                      setPunjabDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b71c1c';
                      e.currentTarget.style.paddingLeft = '22px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.paddingLeft = '18px';
                    }}
                  >
                    <i className="fa fa-compass" style={{ color: '#ebb10d' }}></i>
                    <span>ਦੋਆਬਾ (Doaba)</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* 3. Religion */}
            <li className={activeSection === 'religion' ? 'active' : ''}>
              <a
                href="#religion"
                onClick={(e) => handleNavClick(e, 'religion')}
              >
                ਧਰਮ
              </a>
            </li>

            {/* 4. World */}
            <li className={activeSection === 'world' ? 'active' : ''}>
              <a
                href="#world"
                onClick={(e) => handleNavClick(e, 'world')}
              >
                ਦੇਸ਼-ਵਿਦੇਸ਼
              </a>
            </li>

            {/* 5. Sports */}
            <li className={activeSection === 'sport' ? 'active' : ''}>
              <a
                href="#sport"
                onClick={(e) => handleNavClick(e, 'sport')}
              >
                ਖੇਡਾਂ
              </a>
            </li>

            {/* 6. Health */}
            <li className={activeSection === 'health' ? 'active' : ''}>
              <a
                href="#health"
                onClick={(e) => handleNavClick(e, 'health')}
              >
                ਸਿਹਤ
              </a>
            </li>

            {/* 7. Travel */}
            <li className={activeSection === 'travel' ? 'active' : ''}>
              <a
                href="#travel"
                onClick={(e) => handleNavClick(e, 'travel')}
              >
                ਸੈਰ-ਸਪਾਟਾ
              </a>
            </li>

            {/* 8. Entertainment */}
            <li className={activeSection === 'art-entertainment' ? 'active' : ''}>
              <a
                href="#art-entertainment"
                onClick={(e) => handleNavClick(e, 'art-entertainment')}
              >
                ਮਨੋਰੰਜਨ
              </a>
            </li>

            {/* 9. Live TV */}
            <li className={activeSection === 'live-tv' ? 'active' : ''}>
              <a
                href="#live-tv"
                onClick={(e) => handleNavClick(e, 'live-tv')}
              >
                ਲਾਈਵ ਟੀਵੀ
              </a>
            </li>

            {/* 10. Contact */}
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                ਸੰਪਰਕ
              </a>
            </li>
          </ul>
        </div>

        {/* Right: High-End Desktop Search Bar (Aligned to Far Right) */}
        <div
          className="navbar-search-desktop-wrapper hidden-xs hidden-sm"
          style={{
            flexShrink: 0,
            marginLeft: '20px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (navSearchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(navSearchQuery.trim())}`);
              }
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              margin: 0
            }}
          >
            <input
              type="text"
              placeholder="ਖ਼ਬਰਾਂ ਖੋਜੋ... (Search news)"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid rgba(28, 45, 90, 0.45)',
                borderRadius: '24px',
                padding: '7px 40px 7px 16px',
                fontSize: '13px',
                fontWeight: '600',
                width: '210px',
                height: '35px',
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.25s ease',
                fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.width = '270px';
                e.target.style.borderColor = '#1c2d5a';
                e.target.style.boxShadow = '0 0 0 3px rgba(28, 45, 90, 0.2)';
              }}
              onBlur={(e) => {
                if (!navSearchQuery) e.target.style.width = '210px';
                e.target.style.borderColor = 'rgba(28, 45, 90, 0.45)';
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                position: 'absolute',
                right: '3px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#1c2d5a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '29px',
                height: '29px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1c2d5a')}
            >
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </div>

      {/* Mobile Expandable Search Bar Panel */}
      {mobileSearchOpen && (
        <div
          className="visible-xs visible-sm"
          style={{
            padding: '10px 14px',
            backgroundColor: '#12141a',
            borderTop: '2px solid #ebb10d',
            borderBottom: '2px solid #b71c1c',
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            zIndex: 9999
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (navSearchQuery.trim()) {
                setMobileSearchOpen(false);
                navigate(`/search?q=${encodeURIComponent(navSearchQuery.trim())}`);
              }
            }}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="ਕੋਈ ਵੀ ਖ਼ਬਰ ਖੋਜੋ... (e.g. ਅੰਮ੍ਰਿਤਸਰ, ਖੇਡਾਂ)"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '6px',
                border: '1.5px solid #ebb10d',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '13.5px',
                outline: 'none',
                fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(183,28,28,0.4)',
                whiteSpace: 'nowrap',
                fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
              }}
            >
              <i className="fa fa-search"></i>
              <span>ਲੱਭੋ</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. Mobile Floating Region Dropdown (Rendered OUTSIDE scroll-container so overflow-x never clips it!) */}
      {punjabDropdownOpen && (
        <div className="visible-xs visible-sm">
          {/* Backdrop to detect click-outside */}
          <div
            onClick={() => setPunjabDropdownOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 99998,
              backgroundColor: 'rgba(0, 0, 0, 0.45)'
            }}
          />

          {/* Floating High-Contrast Region Card */}
          <div
            className="punjab-mobile-floating-card"
            style={{
              position: 'absolute',
              top: 'calc(100% + 2px)',
              left: '14px',
              right: '14px',
              maxWidth: '340px',
              backgroundColor: '#161922',
              border: '2px solid #ebb10d',
              borderRadius: '10px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
              zIndex: 99999,
              padding: '6px 0',
              fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px 6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ebb10d',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '0.4px'
              }}
            >
              <span><i className="fa fa-map-marker" style={{ marginRight: '6px' }}></i> ਪੰਜਾਬ ਦੇ ਖੇਤਰ ਚੁਣੋ:</span>
              <button
                type="button"
                onClick={() => setPunjabDropdownOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <Link
              to="/category/punjab"
              onClick={() => {
                setActiveSection('punjab');
                setPunjabDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 18px',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: '700',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <i className="fa fa-globe" style={{ color: '#b71c1c', fontSize: '15px' }}></i>
              <span>ਸਾਰਾ ਪੰਜਾਬ (All Punjab)</span>
            </Link>

            <Link
              to="/category/punjab/majha"
              onClick={() => {
                setActiveSection('punjab');
                setPunjabDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                color: '#e2e8f0',
                fontSize: '14px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <i className="fa fa-compass" style={{ color: '#ebb10d', fontSize: '14px' }}></i>
              <span>ਮਾਝਾ (Majha)</span>
            </Link>

            <Link
              to="/category/punjab/malwa"
              onClick={() => {
                setActiveSection('punjab');
                setPunjabDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                color: '#e2e8f0',
                fontSize: '14px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <i className="fa fa-compass" style={{ color: '#ebb10d', fontSize: '14px' }}></i>
              <span>ਮਾਲਵਾ (Malwa)</span>
            </Link>

            <Link
              to="/category/punjab/doaba"
              onClick={() => {
                setActiveSection('punjab');
                setPunjabDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                color: '#e2e8f0',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              <i className="fa fa-compass" style={{ color: '#ebb10d', fontSize: '14px' }}></i>
              <span>ਦੋਆਬਾ (Doaba)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
