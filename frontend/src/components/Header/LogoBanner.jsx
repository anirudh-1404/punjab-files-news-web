import React, { useState, useEffect } from 'react';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

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
        padding: '8px 0',
        flex: 1
      }}
    >
      {/* Left: Prominent Brand Logo (No Tagline) */}
      <div className="header-brand-block">
        <a href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <img
            src={whiteLogo}
            alt="Punjab Files"
            className="brand-logo-img"
            style={{
              height: '115px',
              maxHeight: '125px',
              maxWidth: '440px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </a>
      </div>

      {/* Right: Live Punjabi Time & Date Clock */}
      <div
        className="header-live-clock hidden-xs"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
        }}
      >
        <div
          style={{
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            padding: '7px 16px',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(183, 28, 28, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa fa-clock-o"></i>
          <span>{timeStr}</span>
        </div>
        <div
          style={{
            color: '#1c2d5a',
            fontSize: '14.5px',
            fontWeight: '700',
            borderLeft: '2px solid #e2e8f0',
            paddingLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="fa fa-calendar" style={{ color: '#b71c1c' }}></i>
          <span>{dateStr}</span>
        </div>
      </div>
    </div>
  );
}
