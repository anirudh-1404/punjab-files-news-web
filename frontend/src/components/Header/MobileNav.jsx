import React, { useState } from 'react';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <nav className="navbar navbar-default visible-xs visible-sm hidden-md hidden-lg" id="mobile-nav">
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
        <div className="sidenav-header-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', backgroundColor: '#b71c1c', padding: '2px 8px', borderRadius: '3px' }}>
            ਮੀਨੂ (Menu)
          </span>
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
                style={{ maxHeight: '65px', width: 'auto' }}
              />
            </a>
          </div>
        </div>

        <ul className="sidenav-menu">
          <li>
            <a href="/" onClick={() => setIsOpen(false)}>ਮੁੱਖ ਪੰਨਾ</a>
          </li>

          {/* Punjab Tri-Region in Mobile Nav */}
          <li>
            <a href="#punjab" onClick={() => setIsOpen(false)}>ਪੰਜਾਬ</a>
            <div className="icon-sub-menu" onClick={() => toggleDropdown('punjab')}>
              <span className={`sidenav-dropdown-icon ${openDropdown === 'punjab' ? 'up-icon' : 'show'}`}></span>
            </div>
            {openDropdown === 'punjab' && (
              <ul className="sidenav-dropdown" style={{ display: 'block' }}>
                <li><a href="/category/punjab" onClick={() => setIsOpen(false)}>ਸਾਰਾ ਪੰਜਾਬ (All Punjab)</a></li>
                <li><a href="/category/punjab/majha" onClick={() => setIsOpen(false)}>ਮਾਝਾ (Majha)</a></li>
                <li><a href="/category/punjab/malwa" onClick={() => setIsOpen(false)}>ਮਾਲਵਾ (Malwa)</a></li>
                <li><a href="/category/punjab/doaba" onClick={() => setIsOpen(false)}>ਦੋਆਬਾ (Doaba)</a></li>
              </ul>
            )}
          </li>

          {/* Religion Section in Mobile Nav */}
          <li>
            <a href="#religion" onClick={() => setIsOpen(false)}>ਧਰਮ</a>
          </li>

          <li>
            <a href="#world" onClick={() => setIsOpen(false)}>ਦੇਸ਼-ਵਿਦੇਸ਼</a>
          </li>

          <li>
            <a href="#sport" onClick={() => setIsOpen(false)}>ਖੇਡਾਂ</a>
          </li>

          <li>
            <a href="#health" onClick={() => setIsOpen(false)}>ਸਿਹਤ</a>
          </li>

          <li><a href="#travel" onClick={() => setIsOpen(false)}>ਸੈਰ-ਸਪਾਟਾ</a></li>
          <li><a href="#art-entertainment" onClick={() => setIsOpen(false)}>ਮਨੋਰੰਜਨ</a></li>
          <li><a href="#live-tv" onClick={() => setIsOpen(false)}>ਲਾਈਵ ਟੀਵੀ</a></li>
          <li><a href="/contact" onClick={() => setIsOpen(false)}>ਸੰਪਰਕ</a></li>
          <li>
            <a
              href="#staff"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('staff');
              }}
              style={{ color: '#ebb10d', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span><i className="fa fa-user-circle" style={{ marginRight: '6px' }}></i> ਸਟਾਫ਼ ਲੌਗਇਨ (Staff Login)</span>
              <i className={`fa fa-angle-${openDropdown === 'staff' ? 'up' : 'down'}`} style={{ color: '#ebb10d' }}></i>
            </a>
            {openDropdown === 'staff' && (
              <ul className="sidenav-dropdown" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 0' }}>
                <li>
                  <a href="/admin?role=admin" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', color: '#ffffff' }}>
                    <i className="fa fa-shield" style={{ color: '#b71c1c' }}></i>
                    <span>Login as Admin (ਮੁੱਖ ਐਡਮਿਨ)</span>
                  </a>
                </li>
                <li>
                  <a href="/admin?role=editor" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', color: '#ffffff' }}>
                    <i className="fa fa-pencil-square-o" style={{ color: '#ebb10d' }}></i>
                    <span>Login as Editor (ਸੰਪਾਦਕ)</span>
                  </a>
                </li>
                <li>
                  <a href="/admin?role=reporter" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', color: '#ffffff' }}>
                    <i className="fa fa-newspaper-o" style={{ color: '#38bdf8' }}></i>
                    <span>Login as Reporter (ਪੱਤਰਕਾਰ)</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
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
