import React, { useState, useEffect } from 'react';
import brandLogo from '../../assets/logo-updated.png';
import LanguageFilterDropdown from './LanguageFilterDropdown';

export default function LogoBanner() {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const weekdayNames = [
        'ਐਤਵਾਰ',
        'ਸੋਮਵਾਰ',
        'ਮੰਗਲਵਾਰ',
        'ਬੁੱਧਵਾਰ',
        'ਵੀਰਵਾਰ',
        'ਸ਼ੁੱਕਰਵਾਰ',
        'ਸ਼ਨਿੱਚਰਵਾਰ'
      ];
      const monthNames = [
        'ਜਨਵਰੀ',
        'ਫ਼ਰਵਰੀ',
        'ਮਾਰਚ',
        'ਅਪ੍ਰੈਲ',
        'ਮਈ',
        'ਜੂਨ',
        'ਜੁਲਾਈ',
        'ਅਗਸਤ',
        'ਸਤੰਬਰ',
        'ਅਕਤੂਬਰ',
        'ਨਵੰਬਰ',
        'ਦਸੰਬਰ'
      ];

      const weekday = weekdayNames[now.getDay()];
      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();

      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'ਸ਼ਾਮ' : 'ਸਵੇਰੇ';

      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = hours < 10 ? '0' + hours : hours;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

      setDateStr(`${weekday}, ${day} ${month} ${year}`);
      setTimeStr(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="header-branding-masthead"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        gap: '16px',
        width: '100%'
      }}
    >
      {/* Left: Brand Logo + Desktop Language Dropdown */}
      <div className="header-brand-block" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={brandLogo}
            alt="Punjab Files"
            className="brand-logo-img"
            style={{
              height: 'auto',
              maxHeight: '118px',
              maxWidth: '450px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </a>

        {/* Desktop Language Filter Dropdown (Next to Logo) */}
        <div className="hidden-xs hidden-sm">
          <LanguageFilterDropdown isCompact={false} />
        </div>
      </div>

      {/* Mobile-Only Language Filter Dropdown (Shifted to Top-Right where Menu button was) */}
      <div className="visible-xs visible-sm" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <LanguageFilterDropdown isCompact={true} />
      </div>

      {/* Right: Permanent Static Advertisement Inquiries & Booking Provision (Desktop) */}
      <div className="header-ad-provision-wrapper hidden-xs hidden-sm" style={{ flex: 1, maxWidth: '640px', marginLeft: 'auto' }}>
        <div
          className="header-top-ad-slot"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '6px',
            padding: '10px 16px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            minHeight: '85px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Ad Tag */}
          <span
            style={{
              position: 'absolute',
              top: '-9px',
              right: '14px',
              backgroundColor: '#94a3b8',
              color: '#ffffff',
              fontSize: '9.5px',
              fontWeight: '800',
              padding: '1px 7px',
              borderRadius: '3px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}
          >
            ਇਸ਼ਤਿਹਾਰ / Advertisement Slot
          </span>

          {/* Ad Content / Inquiries Banner */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '3px' }}>
                <i className="fa fa-bullhorn" style={{ marginRight: '4px' }}></i> ਬੁਕਿੰਗ ਖੁੱਲ੍ਹੀ ਹੈ
              </span>
              <strong style={{ fontSize: '13px', color: '#1c2d5a', fontWeight: '800' }}>
                Call for Advertisement queries
              </strong>
            </div>

            <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
              <div>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>Mobile: </span>
                <a href="tel:+918909396233" style={{ color: '#b71c1c', fontWeight: '800', textDecoration: 'none' }}>
                  +91 89093 96233
                </a>
              </div>
              <div style={{ marginTop: '2px' }}>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>Email: </span>
                <a href="mailto:advt@punjabfiles.com" style={{ color: '#1c2d5a', fontWeight: '700', textDecoration: 'none' }}>
                  advt@punjabfiles.com
                </a>
                <span style={{ margin: '0 5px', color: '#94a3b8' }}>|</span>
                <a href="mailto:info@punjabfiles.com" style={{ color: '#1c2d5a', fontWeight: '700', textDecoration: 'none' }}>
                  info@punjabfiles.com
                </a>
              </div>
            </div>
          </div>

          {/* CTA Book Ad Button */}
          <div style={{ flexShrink: 0 }}>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#1c2d5a',
                color: '#ebb10d',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: '800',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(28, 45, 90, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>ਇਸ਼ਤਿਹਾਰ ਦਿਓ</span>
              <i className="fa fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
