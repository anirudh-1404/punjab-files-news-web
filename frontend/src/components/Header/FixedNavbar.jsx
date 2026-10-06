import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { categoryAPI } from '../../services/api';

// Max categories to show directly in the main navbar (before "More" dropdown)
const MAX_MAIN_NAV = 7;

// Punjab slug is special — it gets Majha/Malwa/Doaba sub-regions dropdown
const PUNJAB_SLUG = 'punjab';

export default function FixedNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [punjabDropdownOpen, setPunjabDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.punjab-nav-item')) {
        setPunjabDropdownOpen(false);
      }
      if (!e.target.closest('.more-nav-item')) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
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

  // Scroll spy + route tracking for active nav item
  useEffect(() => {
    if (location.pathname === '/contact') {
      setActiveSection('contact');
      return;
    }

    if (location.pathname === '/podcasts') {
      setActiveSection('podcasts');
      return;
    }

    if (location.pathname.startsWith('/category/')) {
      const slug = location.pathname.split('/')[2];
      setActiveSection(slug || '');
      return;
    }

    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    // On homepage (/), scroll spy using dynamic category slugs
    const sectionIds = [...categories.map((c) => c.slug), 'web-tv', 'live-tv'];

    const handleScroll = () => {
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
  }, [location.pathname, categories]);

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

    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        scrollToSection(targetId);
      }, 150);
    } else {
      scrollToSection(targetId);
    }
  };

  // Split categories: Punjab (special), first MAX_MAIN_NAV in main bar, rest in More
  const punjabCat = categories.find((c) => c.slug === PUNJAB_SLUG);
  const nonPunjabCats = categories.filter((c) => c.slug !== PUNJAB_SLUG);
  const mainNavCats = nonPunjabCats.slice(0, MAX_MAIN_NAV);
  const moreCats = nonPunjabCats.slice(MAX_MAIN_NAV);

  // Dropdown link style helpers
  const dropdownLinkStyle = {
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
  };

  const dropdownMenuStyle = (open) => ({
    display: open ? 'block' : 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: '220px',
    backgroundColor: '#1c2d5a',
    background: '#1c2d5a',
    border: '2px solid #ebb10d',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
    padding: '6px 0',
    margin: 0,
    zIndex: 999999,
    listStyle: 'none'
  });

  return (
    <div className="navbar" id="fixed-navbar" style={{ position: 'relative' }}>
      {/* Main Red Navbar Menu with Dynamic Categories */}
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
          <div className="nav-scroll-container" style={{ flex: '1 1 auto' }}>
            <ul className="nav navbar-nav horizontal-category-nav">

              {/* Mobile: Menu Button Chip */}
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

              {/* Mobile: Search Button Chip */}
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

              {/* Home */}
              <li className={activeSection === 'home' ? 'active' : ''}>
                <a href="/" onClick={(e) => handleNavClick(e, 'home')}>
                  ਮੁੱਖ ਪੰਨਾ
                </a>
              </li>

              {/* Punjab — Special with Majha/Malwa/Doaba dropdown (only if Punjab category exists) */}
              {punjabCat && (
                <li
                  className={`dropdown punjab-nav-item ${activeSection === PUNJAB_SLUG ? 'active' : ''} ${punjabDropdownOpen ? 'open' : ''}`}
                  onMouseEnter={() => setPunjabDropdownOpen(true)}
                  onMouseLeave={() => setPunjabDropdownOpen(false)}
                  style={{ position: 'relative' }}
                >
                  <a
                    href={`/category/${PUNJAB_SLUG}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setPunjabDropdownOpen((prev) => !prev);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>{punjabCat.namePa}</span>
                    <i className={`fa fa-chevron-${punjabDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '11px', marginLeft: '3px' }}></i>
                  </a>

                  {/* Desktop Punjab Dropdown */}
                  <ul className="dropdown-menu punjab-dropdown-list hidden-xs hidden-sm" style={dropdownMenuStyle(punjabDropdownOpen)}>
                    <li>
                      <Link
                        to={`/category/${PUNJAB_SLUG}`}
                        onClick={() => { setActiveSection(PUNJAB_SLUG); setPunjabDropdownOpen(false); }}
                        style={dropdownLinkStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b71c1c'; e.currentTarget.style.paddingLeft = '22px'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.paddingLeft = '18px'; }}
                      >
                        <i className="fa fa-globe" style={{ color: '#ebb10d', fontSize: '14px', width: '16px', textAlign: 'center' }}></i>
                        <span>ਸਾਰਾ ਪੰਜਾਬ (All Punjab)</span>
                      </Link>
                    </li>
                    {[
                      { slug: 'majha', label: 'ਮਾਝਾ (Majha)' },
                      { slug: 'malwa', label: 'ਮਾਲਵਾ (Malwa)' },
                      { slug: 'doaba', label: 'ਦੋਆਬਾ (Doaba)' }
                    ].map((region) => (
                      <li key={region.slug}>
                        <Link
                          to={`/category/${PUNJAB_SLUG}/${region.slug}`}
                          onClick={() => { setActiveSection(PUNJAB_SLUG); setPunjabDropdownOpen(false); }}
                          style={dropdownLinkStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b71c1c'; e.currentTarget.style.paddingLeft = '22px'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.paddingLeft = '18px'; }}
                        >
                          <i className="fa fa-compass" style={{ color: '#ebb10d', fontSize: '14px', width: '16px', textAlign: 'center' }}></i>
                          <span>{region.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Main Nav Categories (non-Punjab, up to MAX_MAIN_NAV) */}
              {mainNavCats.map((cat) => (
                <li key={cat.slug} className={activeSection === cat.slug ? 'active' : ''}>
                  <a
                    href={`#${cat.slug}`}
                    onClick={(e) => handleNavClick(e, cat.slug)}
                  >
                    {cat.namePa}
                  </a>
                </li>
              ))}

              {/* More Dropdown (overflow categories beyond MAX_MAIN_NAV) */}
              {moreCats.length > 0 && (
                <li
                  className={`dropdown more-nav-item ${moreCats.some((c) => activeSection === c.slug) ? 'active' : ''} ${moreDropdownOpen ? 'open' : ''}`}
                  onMouseEnter={() => setMoreDropdownOpen(true)}
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                  style={{ position: 'relative' }}
                >
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMoreDropdownOpen((prev) => !prev); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>ਹੋਰ (More)</span>
                    <i className={`fa fa-chevron-${moreDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '11px', marginLeft: '3px' }}></i>
                  </a>

                  <ul className="dropdown-menu more-dropdown-list hidden-xs hidden-sm" style={dropdownMenuStyle(moreDropdownOpen)}>
                    {moreCats.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => { setActiveSection(cat.slug); setMoreDropdownOpen(false); }}
                          style={dropdownLinkStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b71c1c'; e.currentTarget.style.paddingLeft = '22px'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.paddingLeft = '18px'; }}
                        >
                          <i className={`fa ${cat.icon || 'fa-tag'}`} style={{ color: '#ebb10d', fontSize: '13px', width: '16px', textAlign: 'center' }}></i>
                          <span>{cat.namePa} ({cat.nameEn})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Web TV */}
              <li className={activeSection === 'web-tv' || activeSection === 'live-tv' ? 'active' : ''}>
                <a href="#web-tv" onClick={(e) => handleNavClick(e, 'web-tv')}>
                  ਵੈੱਬ ਟੀਵੀ
                </a>
              </li>

              {/* Podcasts */}
              <li className={activeSection === 'podcasts' ? 'active' : ''}>
                <Link
                  to="/podcasts"
                  onClick={() => setActiveSection('podcasts')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="fa fa-podcast" style={{ fontSize: '11px', color: '#b71c1c' }}></i>
                  <span>ਪੋਡਕਾਸਟ</span>
                </Link>
              </li>

              {/* Photo Gallery */}
              <li className={activeSection === 'gallery' ? 'active' : ''}>
                <Link
                  to="/gallery"
                  onClick={() => setActiveSection('gallery')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="fa fa-camera-retro" style={{ fontSize: '11px', color: '#b71c1c' }}></i>
                  <span>ਗੈਲਰੀ</span>
                </Link>
              </li>

              {/* Contact */}
              <li className={activeSection === 'contact' ? 'active' : ''}>
                <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')}>
                  ਸੰਪਰਕ
                </a>
              </li>
            </ul>
          </div>

          {/* Desktop Search Bar */}
          <div
            className="navbar-search-desktop-wrapper hidden-xs hidden-sm"
            style={{ flexShrink: 0, marginLeft: '20px', display: 'flex', alignItems: 'center' }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (navSearchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(navSearchQuery.trim())}`);
                }
              }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: 0 }}
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

      {/* Mobile Expandable Search Panel */}
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

      {/* Mobile: Punjab Floating Region Card (shown outside scroll container to avoid clipping) */}
      {punjabDropdownOpen && punjabCat && (
        <div className="visible-xs visible-sm">
          <div
            onClick={() => setPunjabDropdownOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100vw', height: '100vh',
              zIndex: 99998,
              backgroundColor: 'rgba(0, 0, 0, 0.45)'
            }}
          />

          <div
            className="punjab-mobile-floating-card"
            style={{
              position: 'absolute',
              top: 'calc(100% + 2px)',
              left: '14px', right: '14px',
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
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px 6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ebb10d', fontSize: '12px', fontWeight: '800', letterSpacing: '0.4px'
              }}
            >
              <span><i className="fa fa-map-marker" style={{ marginRight: '6px' }}></i> ਪੰਜਾਬ ਦੇ ਖੇਤਰ ਚੁਣੋ:</span>
              <button
                type="button"
                onClick={() => setPunjabDropdownOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '15px', cursor: 'pointer', padding: 0 }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {[
              { to: `/category/${PUNJAB_SLUG}`, label: 'ਸਾਰਾ ਪੰਜਾਬ (All Punjab)', icon: 'fa-globe', bold: true },
              { to: `/category/${PUNJAB_SLUG}/majha`, label: 'ਮਾਝਾ (Majha)', icon: 'fa-compass', bold: false },
              { to: `/category/${PUNJAB_SLUG}/malwa`, label: 'ਮਾਲਵਾ (Malwa)', icon: 'fa-compass', bold: false },
              { to: `/category/${PUNJAB_SLUG}/doaba`, label: 'ਦੋਆਬਾ (Doaba)', icon: 'fa-compass', bold: false }
            ].map((item, i, arr) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => { setActiveSection(PUNJAB_SLUG); setPunjabDropdownOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 18px',
                  color: '#ffffff', fontSize: item.bold ? '14px' : '13.5px',
                  fontWeight: item.bold ? '700' : '600',
                  textDecoration: 'none',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                }}
              >
                <i className={`fa ${item.icon}`} style={{ color: '#ebb10d', fontSize: '15px', width: '18px', textAlign: 'center' }}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
