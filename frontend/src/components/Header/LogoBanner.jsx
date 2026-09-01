import React from 'react';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

export default function LogoBanner() {
  return (
    <>
      {/* Begin .header-logo */}
      <div className="header-logo" style={{ width: 'auto', maxWidth: '340px', marginTop: '20px', marginBottom: '15px' }}>
        <a href="/" style={{ display: 'inline-block' }}>
          <img
            src={whiteLogo}
            alt="Punjab Files"
            style={{
              height: '86px',
              maxHeight: '90px',
              maxWidth: '320px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0'
            }}
          />
        </a>
      </div>
      {/* End .header-logo */}

      {/* Begin .header-add-place */}
      <div className="header-add-place">
        <div className="desktop-add">
          <a href="#" target="_blank" rel="noreferrer">
            <img src="/img/banner_728x90.jpg" alt="Banner Ad" />
          </a>
        </div>
      </div>
      {/* End .header-add-place */}
    </>
  );
}
