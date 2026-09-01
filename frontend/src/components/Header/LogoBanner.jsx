import React from 'react';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

export default function LogoBanner() {
  return (
    <div
      className="logo-banner-wrapper"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 0'
      }}
    >
      {/* Left: Punjab Files Logo */}
      <div className="header-logo" style={{ float: 'none', margin: 0, flexShrink: 0 }}>
        <a href="/" style={{ display: 'inline-block' }}>
          <img
            src={whiteLogo}
            alt="Punjab Files"
            style={{
              height: '84px',
              maxHeight: '88px',
              maxWidth: '260px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </a>
      </div>

      {/* Middle: Watch LIVE TV Button (Compact Square with Subtle Radius & No Shadow) */}
      <div className="header-live-tv-center" style={{ margin: '0 15px', textAlign: 'center', flexShrink: 0 }}>
        <a
          href="#watch-live"
          className="live-tv-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: '#e52d27',
            color: '#ffffff',
            padding: '7px 14px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '13px',
            textDecoration: 'none',
            letterSpacing: '0.3px',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            boxShadow: 'none',
            border: 'none'
          }}
        >
          <span className="live-pulse-dot"></span>
          <span>Watch LIVE TV</span>
          <i className="fa fa-television" style={{ fontSize: '13px', marginLeft: '2px' }}></i>
        </a>
      </div>

      {/* Right: 728x90 Banner Ad */}
      <div className="header-add-place" style={{ float: 'none', margin: 0 }}>
        <div className="desktop-add">
          <a href="#" target="_blank" rel="noreferrer">
            <img src="/img/banner_728x90.jpg" alt="Banner Ad" style={{ maxHeight: '88px', maxWidth: '100%', height: 'auto' }} />
          </a>
        </div>
      </div>
    </div>
  );
}
