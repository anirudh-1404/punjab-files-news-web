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
  image: '/img/darbar-sahib-mukhwak.jpg',
  sgpcLink: 'https://sgpc.net/hukamnama/'
};

export default function DarbarSahibMukhWak() {
  const [showViakhya, setShowViakhya] = useState(false);
  const [data, setData] = useState(DEFAULT_FALLBACK);

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
    <div className="darbar-sahib-mukhwak-card">
      {/* Sacred Top Header */}
      <div className="mukhwak-card-topbar" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mukhwak-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="ik-onkar" style={{ fontSize: '20px' }}>ੴ</span>
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#000000' }}>
            {data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ'}
          </span>
          <span style={{ fontSize: '11px', color: '#b71c1c', fontWeight: '700', marginLeft: '4px' }}>
            • ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ
          </span>
        </div>
        <div className="mukhwak-date-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
          <span>{data.date}</span>
        </div>
      </div>

      {/* Visual Image of Sri Darbar Sahib */}
      <div className="mukhwak-image-container">
        <img
          src={data.image || '/img/darbar-sahib-mukhwak.jpg'}
          alt={data.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ'}
          className="mukhwak-golden-temple-img"
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
