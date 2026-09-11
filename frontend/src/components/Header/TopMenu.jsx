import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TopMenu() {
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('punjab_active_lang') || 'pa');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const changeLanguage = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('punjab_active_lang', lang);
    window.dispatchEvent(new CustomEvent('punjab_language_changed', { detail: lang }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/#search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="top-menu">
      <div className="container">
        {/* Left Social & Contact Links */}
        <ul className="left-top-menu">
          <li>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="facebook">
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="twitter">
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="youtube">
              <i className="fa fa-youtube"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="instagram">
              <i className="fa fa-instagram"></i>
            </a>
          </li>
          <li className="address">
            <a href="mailto:info@punjabfiles.com">
              <i className="fa fa-envelope-o"></i> info@punjabfiles.com
            </a>
          </li>
        </ul>

        {/* Right Nav: Language Switcher + Admin + Contact + Search */}
        <ul className="right-top-menu pull-right" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          {/* 3-Language Switcher */}
          <li className="lang-switcher-item" style={{ marginRight: '14px' }}>
            <div className="language-selector" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
              <i className="fa fa-globe" style={{ color: '#ebb10d', fontSize: '13px', marginRight: '3px' }}></i>
              <button
                type="button"
                className={`lang-btn ${selectedLang === 'pa' ? 'active' : ''}`}
                onClick={() => changeLanguage('pa')}
                style={{
                  background: selectedLang === 'pa' ? '#b71c1c' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਪੰਜਾਬੀ
              </button>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>|</span>
              <button
                type="button"
                className={`lang-btn ${selectedLang === 'hi' ? 'active' : ''}`}
                onClick={() => changeLanguage('hi')}
                style={{
                  background: selectedLang === 'hi' ? '#b71c1c' : 'transparent',
                  color: selectedLang === 'hi' ? '#ffffff' : '#cfd5e1',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                हिंदी
              </button>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>|</span>
              <button
                type="button"
                className={`lang-btn ${selectedLang === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                style={{
                  background: selectedLang === 'en' ? '#b71c1c' : 'transparent',
                  color: selectedLang === 'en' ? '#ffffff' : '#cfd5e1',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
            </div>
          </li>

          {/* Contact link */}
          <li className="contact">
            <Link to="/contact" title="ਸੰਪਰਕ ਕਰੋ (Contact Us)">
              <i className="fa fa-map-marker fa-i"></i>
            </Link>
          </li>

          {/* Admin / Publisher Portal link */}
          <li className="admin-portal">
            <Link to="/admin" title="ਨਿਊਜ਼ ਪ੍ਰਕਾਸ਼ਕ ਪੋਰਟਲ (Publisher / Admin CMS)" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <i className="fa fa-user fa-i"></i>
              <span className="hidden-xs" style={{ fontSize: '11px', fontWeight: '700', color: '#ebb10d' }}>ਪ੍ਰਕਾਸ਼ਕ</span>
            </Link>
          </li>

          {/* Search container */}
          <li>
            <div className="search-container">
              <div className="search-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                <span style={{ cursor: 'pointer' }}>
                  <i className="fa fa-search"></i>
                </span>
              </div>
              <div className="search-input" style={{ display: searchOpen ? 'block' : 'none' }}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    className="search-bar"
                    placeholder="ਖ਼ਬਰਾਂ ਖੋਜੋ..."
                    title="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
