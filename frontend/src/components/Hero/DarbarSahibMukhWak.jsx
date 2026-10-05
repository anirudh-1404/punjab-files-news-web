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
  const [showViakhya, setShowViakhya] = useState(false);
  const [data, setData] = useState(DEFAULT_FALLBACK);
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

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

  const gurbaniLines = (data.gurbani || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="darbar-sahib-mukhwak-card mukhwak-portrait-card">
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

        {/* Current Time and Date Display with Hukamnama (Clean 2-row layout with clear spacing) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '6px 10px',
            marginTop: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
            <div style={{ color: '#b71c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa fa-clock-o" style={{ fontSize: '13px' }}></i>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>ਲਾਈਵ ਸਮਾਂ:</span>
              <span style={{ fontWeight: '800', letterSpacing: '0.3px' }}>{liveTime || 'ਲਾਈਵ ਸਮਾਂ'}</span>
            </div>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#1c2d5a', borderTop: '1px dashed #e2e8f0', paddingTop: '4px' }}>
            <i className="fa fa-calendar" style={{ color: '#ebb10d', fontSize: '12px' }}></i>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>ਤਾਰੀਖ਼:</span>
            <span>{liveDate || data.date}</span>
          </div>
        </div>
      </div>

      {/* Visual Portrait Image of Sri Darbar Sahib */}
      <div className="mukhwak-image-container" style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
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
      <div className="mukhwak-content-body">
        <div className="mukhwak-raag-ang">
          <span className="raag-text">{data.raag}</span>
          <span className="ang-pill">ਅੰਗ: {data.ang}</span>
        </div>

        <div className="mukhwak-gurbani-text">
          {gurbaniLines.length > 0 ? (
            gurbaniLines.map((line, idx) => (
              <p
                key={idx}
                className={`gurbani-line ${idx === gurbaniLines.length - 1 ? 'highlight' : ''}`}
              >
                {line}
              </p>
            ))
          ) : (
            <p className="gurbani-line">{data.gurbani}</p>
          )}
        </div>

        {/* Viakhya / Translation Section */}
        {showViakhya && (
          <div className="mukhwak-viakhya-box">
            <h5 className="viakhya-title">ਪੰਜਾਬੀ ਵਿਆਖਿਆ / ਅਰਥ:</h5>
            <p className="viakhya-text" style={{ whiteSpace: 'pre-line' }}>
              {data.viakhya}
            </p>
            {data.englishTranslation && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                <h6 style={{ fontSize: '12px', fontWeight: '700', color: '#1c2d5a', margin: '0 0 4px' }}>
                  English Translation / Essence:
                </h6>
                <p style={{ fontSize: '12.5px', color: '#334155', fontStyle: 'italic', margin: 0 }}>
                  {data.englishTranslation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mukhwak-actions-row">
          <button
            type="button"
            className="btn-mukhwak-toggle"
            onClick={() => setShowViakhya(!showViakhya)}
          >
            <i className={`fa ${showViakhya ? 'fa-angle-up' : 'fa-angle-down'}`}></i>{' '}
            {showViakhya ? 'ਸੰਖੇਪ ਅਰਥ ਛੁਪਾਓ' : 'ਪੰਜਾਬੀ ਅਰਥ ਪੜ੍ਹੋ'}
          </button>

          <a
            href={data.sgpcLink || 'https://sgpc.net/hukamnama/'}
            target="_blank"
            rel="noreferrer"
            className="btn-mukhwak-official"
          >
            <i className="fa fa-external-link"></i> SGPC ਵੇਰਵਾ
          </a>
        </div>
      </div>
    </div>
  );
}
