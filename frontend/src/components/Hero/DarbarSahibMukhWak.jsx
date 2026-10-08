import React, { useState, useEffect } from 'react';
import { mukhwakAPI } from '../../services/api';

const DEFAULT_FALLBACK = {
  date: '20 ਸਤੰਬਰ 2026',
  title: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
  location: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
  raag: 'ਰਾਗੁ ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ',
  ang: '੬੫੪',
  gurbani: `ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥\nਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥\nਅਪਨੇ ਸੇਵਕ ਕੀ ਆਪੇ ਰਾਖੈ ਨਿਮਖ ਨ ਬਿਸਰੈ ਸਾਸਾ ॥\nਹਰਿ ਕਾ ਨਾਮੁ ਜਪਹੁ ਮੇਰੇ ਮੀਤਾ ਨਾਨਕ ਕੀ ਅਰਦਾਸਾ ॥੨॥`,
  viakhya: 'ਹੇ ਭਾਈ! ਜਿਸ ਮਨੁੱਖ ਨੂੰ ਵੱਡੇ ਭਾਗਾਂ ਨਾਲ ਪੂਰਾ ਗੁਰੂ ਮਿਲ ਪੈਂਦਾ ਹੈ, ਉਸ ਦੇ ਮਨ ਵਿੱਚ ਆਤਮਕ ਜੀਵਨ ਦਾ ਚਾਨਣ ਹੋ ਜਾਂਦਾ ਹੈ। ਉਸ ਨੂੰ ਆਪਣੇ ਮਾਲਕ-ਪ੍ਰਭੂ ਦਾ ਪੱਕਾ ਆਸਰਾ ਬਣ ਜਾਂਦਾ ਹੈ। ਪਰਮਾਤਮਾ ਆਪਣੇ ਭਗਤਾਂ ਤੇ ਸੇਵਕਾਂ ਦੀ ਹਰ ਪਲ ਰਾਖੀ ਕਰਦਾ ਹੈ।',
  image: '/img/darbar-sahib-portrait.jpg',
  sgpcLink: 'https://sgpc.net/hukamnama/'
};

export default function DarbarSahibMukhWak() {
  const [data, setData] = useState(DEFAULT_FALLBACK);
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Live real-time Punjabi clock & date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const weekdayNames = ['ਐਤਵਾਰ', 'ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨਿੱਚਰਵਾਰ'];
      const monthNames = ['ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'];

      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'ਸ਼ਾਮ' : 'ਸਵੇਰੇ';
      hours = hours % 12 || 12;
      const hStr = hours < 10 ? '0' + hours : hours;
      const mStr = minutes < 10 ? '0' + minutes : minutes;
      const sStr = seconds < 10 ? '0' + seconds : seconds;

      setLiveTime(`${hStr}:${mStr}:${sStr} ${ampm}`);
      setLiveDate(`${weekdayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lock body scroll when modal is open + handle Escape key
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setShowModal(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [showModal]);

  useEffect(() => {
    let isMounted = true;
    async function loadActiveMukhwak() {
      try {
        const liveMukhwak = await mukhwakAPI.getActive();
        if (isMounted && liveMukhwak && liveMukhwak.raag) {
          setData(liveMukhwak);
        }
      } catch (err) {
        console.warn('Using fallback Mukhwak due to API fetch notice:', err);
      }
    }
    loadActiveMukhwak();
    return () => {
      isMounted = false;
    };
  }, []);

  const rawGurbani = data.gurbani || '';
  const gurbaniLines = rawGurbani.includes('॥')
    ? rawGurbani
        .split('॥')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l + ' ॥')
    : rawGurbani
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

  // Preview limit: keep card height balanced to match Column 3 podcast bottom
  const PREVIEW_LIMIT = 4;
  const previewLines = gurbaniLines.slice(0, PREVIEW_LIMIT);
  const hasMoreContent = gurbaniLines.length > PREVIEW_LIMIT || Boolean(data.viakhya);

  return (
    <>
      <div className="darbar-sahib-mukhwak-card mukhwak-portrait-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Sacred Top Header with Live Real-time Clock and Date */}
        <div className="mukhwak-card-topbar" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="mukhwak-title-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="ik-onkar" style={{ fontSize: '20px', color: '#b71c1c' }}>ੴ</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#000000' }}>
                {data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ'}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: '#b71c1c', fontWeight: '800', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '3px' }}>
              ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ
            </span>
          </div>

          {/* Current Time and Date Display */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '5px',
              padding: '5px 9px',
              marginTop: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700' }}>
              <div style={{ color: '#b71c1c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa fa-clock-o" style={{ fontSize: '12px' }}></i>
                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>ਲਾਈਵ ਸਮਾਂ:</span>
                <span style={{ fontWeight: '800', letterSpacing: '0.2px' }}>{liveTime || 'ਲਾਈਵ ਸਮਾਂ'}</span>
              </div>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: '700', color: '#1c2d5a', borderTop: '1px dashed #e2e8f0', paddingTop: '3px' }}>
              <i className="fa fa-calendar" style={{ color: '#ebb10d', fontSize: '11.5px' }}></i>
              <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>ਤਾਰੀਖ਼:</span>
              <span>{liveDate || data.date}</span>
            </div>
          </div>
        </div>

        {/* Visual Portrait Image of Sri Darbar Sahib (Matched height 210px with headline image) */}
        <div className="mukhwak-image-container" style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
          <img
            src={data.image || '/img/darbar-sahib-portrait.jpg'}
            alt={data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ'}
            className="mukhwak-golden-temple-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => { e.target.src = '/img/darbar-sahib-mukhwak.jpg'; }}
          />
          <div className="mukhwak-image-overlay">
            <span className="sacred-location-tag">
              <i className="fa fa-map-marker"></i> {data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ'}
            </span>
          </div>
        </div>

        {/* Mukh Wak Body Content */}
        <div className="mukhwak-content-body" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <div className="mukhwak-raag-ang" style={{ marginBottom: '6px', paddingBottom: '4px' }}>
              <span className="raag-text" style={{ fontSize: '12px' }}>{data.raag}</span>
              <span className="ang-pill">ਅੰਗ: {data.ang}</span>
            </div>

            {/* Flowing Preview Gurbani Text filling available height */}
            <div
              className="mukhwak-gurbani-text"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '10px 12px',
                marginBottom: '8px',
                overflow: 'hidden',
                minHeight: 0
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                <p
                  className="gurbani-line"
                  style={{
                    margin: 0,
                    fontSize: '12.5px',
                    lineHeight: '1.6',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient: 'vertical',
                    maxHeight: '160px'
                  }}
                >
                  {rawGurbani}
                </p>
              </div>

              {/* Read More button to open Popup Modal */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b71c1c',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '4px 0 0 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                <span>ਹੋਰ ਪੜ੍ਹੋ (Read More)...</span>
                <i className="fa fa-angle-right" style={{ fontSize: '12px', fontWeight: '900' }}></i>
              </button>
            </div>
          </div>

          {/* Action Buttons: Opens Modal or Official SGPC Site */}
          <div className="mukhwak-actions-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '4px', marginTop: 'auto' }}>
            <button
              type="button"
              className="btn-mukhwak-toggle"
              onClick={() => setShowModal(true)}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '11.5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <i className="fa fa-book-open" style={{ marginRight: '2px' }}></i>
              <span>ਸੰਪੂਰਨ ਮੁੱਖ ਵਾਕ ਤੇ ਅਰਥ</span>
            </button>

            <a
              href={data.sgpcLink || 'https://sgpc.net/hukamnama/'}
              target="_blank"
              rel="noreferrer"
              className="btn-mukhwak-official"
              style={{
                padding: '6px 10px',
                fontSize: '11.5px',
                whiteSpace: 'nowrap'
              }}
            >
              <i className="fa fa-external-link"></i> SGPC
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL MUKHWAK & VIAKHYA SACRED POPUP MODAL
      ======================================================== */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              border: '2px solid #ebb10d',
              overflow: 'hidden',
              fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
            }}
          >
            {/* Modal Header */}
            <div
              className="mukhwak-modal-header"
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #1c2d5a 0%, #0f172a 100%)',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '24px', color: '#ebb10d', fontWeight: '900', lineHeight: 1 }}>ੴ</span>
                <div>
                  <div
                    className="mukhwak-modal-title"
                    style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.2px' }}
                  >
                    {data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#e2e8f0', marginTop: '2px' }}>
                    <span>ਰੋਜ਼ਾਨਾ ਮੁੱਖ ਵਾਕ (Hukamnama Sahib)</span>
                    <span style={{ margin: '0 5px' }}>•</span>
                    <span>{liveDate || data.date}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="ਬੰਦ ਕਰੋ"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b71c1c';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div
              style={{
                padding: '20px 24px',
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(92vh - 130px)',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Raag & Ang Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-book" style={{ color: '#b45309' }}></i>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#92400e' }}>
                    {data.raag}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  ਅੰਗ: {data.ang}
                </span>
              </div>

              {/* Sri Harmandir Sahib Sacred Image Banner (Full uncropped image display) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '18px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={data.image || '/img/darbar-sahib-portrait.jpg'}
                  alt={data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '360px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => { e.target.src = '/img/darbar-sahib-mukhwak.jpg'; }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ebb10d',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: '800'
                  }}
                >
                  <i className="fa fa-map-marker" style={{ marginRight: '5px' }}></i>
                  {data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ'}
                </div>
              </div>

              {/* Complete Gurbani Hukamnama Text */}
              <div
                style={{
                  backgroundColor: '#fffdf5',
                  border: '1.5px solid #fde68a',
                  borderLeft: '5px solid #ebb10d',
                  borderRadius: '6px',
                  padding: '16px 20px',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px dashed #fde68a', paddingBottom: '8px' }}>
                  <i className="fa fa-quote-left" style={{ color: '#d97706', fontSize: '14px' }}></i>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#92400e' }}>
                    ਮੁੱਖ ਵਾਕ (Hukamnama Sahib)
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {gurbaniLines.map((line, idx) => (
                    <p
                      key={idx}
                      style={{
                        margin: 0,
                        fontSize: '14.5px',
                        lineHeight: '1.75',
                        fontWeight: '700',
                        color: idx === gurbaniLines.length - 1 ? '#92400e' : '#0f172a'
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Full Punjabi Viakhya / Arth */}
              {data.viakhya && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: '5px solid #b71c1c',
                    borderRadius: '6px',
                    padding: '14px 18px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="fa fa-info-circle" style={{ color: '#b71c1c', fontSize: '14px' }}></i>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '900', color: '#b71c1c' }}>
                      ਪੰਜਾਬੀ ਵਿਆਖਿਆ / ਅਰਥ:
                    </h4>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13.5px',
                      lineHeight: '1.75',
                      color: '#1e293b',
                      whiteSpace: 'pre-line',
                      fontWeight: '500'
                    }}
                  >
                    {data.viakhya}
                  </p>
                </div>
              )}

              {/* English Translation (if available) */}
              {data.englishTranslation && (
                <div
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '12px 16px'
                  }}
                >
                  <h5 style={{ margin: '0 0 6px', fontSize: '12.5px', fontWeight: '800', color: '#1c2d5a' }}>
                    English Translation / Essence:
                  </h5>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.65', color: '#334155', fontStyle: 'italic' }}>
                    {data.englishTranslation}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਬੰਦ ਕਰੋ (Close)
              </button>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href={data.sgpcLink || 'https://sgpc.net/hukamnama/'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: '#ebb10d',
                    color: '#0f172a',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa fa-external-link"></i>
                  <span>SGPC ਅਧਿਕਾਰਤ ਵੈੱਬਸਾਈਟ</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
