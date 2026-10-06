import React from 'react';

export default function Copyrights() {
  const currentYear = new Date().getFullYear();

  const socialHandles = [
    { name: 'Facebook', handle: 'Punjab Files HD', icon: 'fa-facebook', color: '#1877f2', href: 'https://www.facebook.com/people/Punjab-Files-HD/61591956357953/' },
    { name: 'Instagram', handle: '@punjabfileshd', icon: 'fa-instagram', color: '#ec4899', href: 'https://www.instagram.com/punjabfileshd?stkn=MW02ZmNwcmNxZ2ky' },
    { name: 'Twitter (X)', handle: '@punjabfileshd', icon: 'fa-twitter', color: '#38bdf8', href: 'https://x.com/punjabfileshd' },
    { name: 'YouTube', handle: '@punjabfileshd', icon: 'fa-youtube-play', color: '#ef4444', href: 'https://www.youtube.com/@punjabfileshd' }
  ];

  return (
    <div id="copyrights" style={{ backgroundColor: '#0a0d14', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px 0 65px' }}>
      <div className="container">
        {/* Social Media Handles Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#ebb10d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ਸਾਡੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ਹੈਂਡਲਜ਼ (Follow Us):
          </span>
          {socialHandles.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '5px 12px',
                borderRadius: '20px',
                color: '#e2e8f0',
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <i className={`fa ${item.icon}`} style={{ color: item.color, fontSize: '13px' }}></i>
              <span style={{ fontWeight: '600' }}>{item.name}:</span>
              <span style={{ color: '#cbd5e1' }}>{item.handle}</span>
            </a>
          ))}
        </div>

        {/* Copyright text */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          <div>
            © {currentYear}, ਕਾਪੀਰਾਈਟ ਪੰਜਾਬ ਫਾਈਲਜ਼ (Punjab Files) | ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।
          </div>
          <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
            ਇਸ਼ਤਿਹਾਰ ਸੰਪਰਕ: <a href="mailto:advt@punjabfiles.com" style={{ color: '#ebb10d', textDecoration: 'none' }}>advt@punjabfiles.com</a> | <a href="tel:+918909396233" style={{ color: '#f87171', textDecoration: 'none' }}>+91 89093 96233</a>
          </div>
        </div>
      </div>
    </div>
  );
}
