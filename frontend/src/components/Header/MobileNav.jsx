import React, { useState } from 'react';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <nav className="navbar navbar-default" id="mobile-nav">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <div className="sidenav-header-logo">
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={whiteLogo}
              alt="Punjab Files Logo"
              style={{ maxHeight: '40px', width: 'auto', marginRight: '8px', objectFit: 'contain' }}
            />
          </a>
        </div>
      </div>

      {/* Sidenav Overlay & Menu */}
      <div
        className={`sidenav ${isOpen ? 'active show' : ''}`}
        style={{
          display: isOpen ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          zIndex: 99999,
          overflowY: 'auto',
          backgroundColor: '#1f2024',
          transition: 'all 0.3s ease'
        }}
      >
        <button
          type="button"
          className="navbar-toggle active"
          onClick={() => setIsOpen(false)}
          style={{ float: 'right', margin: '15px', color: '#fff' }}
        >
          <i className="fa fa-times" style={{ fontSize: '22px' }}></i>
        </button>

        <div className="sidenav-brand" style={{ padding: '15px' }}>
          <div className="sidenav-header-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src={whiteLogo}
                alt="Punjab Files Logo"
                style={{ maxHeight: '45px', width: 'auto' }}
              />
            </a>
          </div>
        </div>

        <ul className="sidenav-menu">
          <li>
            <a href="/" className="active">ਮੁੱਖ ਪੰਨਾ</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('home')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'home' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'home' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="#watch-live">ਲਾਈਵ 24/7</a></li>
                <li><a href="#tv-radio">ਰੇਡੀਓ ਤੇ ਟੀਵੀ</a></li>
                <li><a href="#web-shows">ਵੈੱਬ ਸ਼ੋਅ</a></li>
                <li><a href="#store">ਸਟੋਰ</a></li>
              </ul>
            )}
          </li>

          <li>
            <a href="#world">ਦੇਸ਼-ਵਿਦੇਸ਼</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('world')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'world' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'world' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="#punjab">ਪੰਜਾਬ</a></li>
                <li><a href="#india">ਭਾਰਤ</a></li>
                <li><a href="#canada">ਕੈਨੇਡਾ</a></li>
                <li><a href="#usa">ਅਮਰੀਕਾ</a></li>
                <li><a href="#world-all">ਸੰਸਾਰ</a></li>
              </ul>
            )}
          </li>

          <li>
            <a href="#news">ਖ਼ਬਰਾਂ</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('news')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'news' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'news' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="#politics">ਰਾਜਨੀਤੀ</a></li>
                <li><a href="#business">ਵਪਾਰ</a></li>
                <li><a href="#crime">ਕ੍ਰਾਈਮ</a></li>
                <li><a href="#farmers">ਕਿਸਾਨੀ ਮੁੱਦੇ</a></li>
              </ul>
            )}
          </li>

          <li>
            <a href="#sport">ਖੇਡਾਂ</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('sport')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'sport' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'sport' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="#kabaddi">ਕਬੱਡੀ</a></li>
                <li><a href="#cricket">ਕ੍ਰਿਕਟ</a></li>
                <li><a href="#football">ਫੁੱਟਬਾਲ</a></li>
              </ul>
            )}
          </li>

          <li>
            <a href="#health">ਸਿਹਤ</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('health')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'health' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'health' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="#fitness">ਤੰਦਰੁਸਤੀ</a></li>
                <li><a href="#ayurveda">ਦੇਸੀ ਨੁਸਖ਼ੇ</a></li>
                <li><a href="#nutrition">ਖ਼ੁਰਾਕ</a></li>
              </ul>
            )}
          </li>

          <li><a href="#travel">ਸੈਰ-ਸਪਾਟਾ</a></li>
          <li><a href="#art-entertainment">ਮਨੋਰੰਜਨ</a></li>
          <li><a href="#tv-schedule">ਲਾਈਵ ਟੀਵੀ</a></li>
          <li><a href="#about-us">ਸਾਡੇ ਬਾਰੇ</a></li>
          <li><a href="#contact">ਸੰਪਰਕ</a></li>
        </ul>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99998
          }}
        />
      )}
    </nav>
  );
}
