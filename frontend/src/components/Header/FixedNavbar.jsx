import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function FixedNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

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
    <div className="navbar" id="fixed-navbar">
      {/* Main Red Navbar Menu with Punjabi Categories */}
      <div className="main-menu nav navbar-collapse collapse in" id="fixed-navbar-toggle">
        <div className="container">
          <ul className="nav navbar-nav">
            {/* 1. Home */}
            <li className={activeSection === 'home' ? 'active' : ''}>
              <a
                href="/"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                ਮੁੱਖ ਪੰਨਾ
              </a>
            </li>

            {/* 2. Punjab with Tri-Region Dropdown */}
            <li className={`dropdown ${activeSection === 'punjab' ? 'active' : ''}`}>
              <a
                href="/category/punjab"
                className="dropdown-toggle"
                data-toggle="dropdown"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    handleNavClick(e, 'punjab');
                  }
                }}
              >
                ਪੰਜਾਬ
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/category/punjab"
                    onClick={() => setActiveSection('punjab')}
                  >
                    ਸਾਰਾ ਪੰਜਾਬ (All Punjab)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/majha"
                    onClick={() => setActiveSection('punjab')}
                  >
                    ਮਾਝਾ (Majha)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/malwa"
                    onClick={() => setActiveSection('punjab')}
                  >
                    ਮਾਲਵਾ (Malwa)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/punjab/doaba"
                    onClick={() => setActiveSection('punjab')}
                  >
                    ਦੋਆਬਾ (Doaba)
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
      </div>
    </div>
  );
}
