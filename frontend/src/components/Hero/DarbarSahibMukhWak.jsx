import React, { useState } from 'react';

export default function DarbarSahibMukhWak() {
  const [showViakhya, setShowViakhya] = useState(false);

  return (
    <div className="darbar-sahib-mukhwak-card">
      {/* Sacred Top Header */}
      <div className="mukhwak-card-topbar" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mukhwak-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="ik-onkar" style={{ fontSize: '20px' }}>ੴ</span>
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#000000' }}>
            ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ
          </span>
          <span style={{ fontSize: '11px', color: '#b71c1c', fontWeight: '700', marginLeft: '4px' }}>
            • ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ
          </span>
        </div>
        <div className="mukhwak-date-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
          <span>10 ਸਤੰਬਰ 2026</span>
        </div>
      </div>

      {/* Visual Image of Sri Darbar Sahib */}
      <div className="mukhwak-image-container">
        <img
          src="/img/darbar-sahib-mukhwak.jpg"
          alt="ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ"
          className="mukhwak-golden-temple-img"
        />
        <div className="mukhwak-image-overlay">
          <span className="sacred-location-tag">
            <i className="fa fa-map-marker"></i> ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ
          </span>
        </div>
      </div>

      {/* Mukh Wak Body Content */}
      <div className="mukhwak-content-body">
        <div className="mukhwak-raag-ang">
          <span className="raag-text">ਰਾਗੁ ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ</span>
          <span className="ang-pill">ਅੰਗ: ੬੫੪</span>
        </div>

        <div className="mukhwak-gurbani-text">
          <p className="gurbani-line">ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥</p>
          <p className="gurbani-line">ਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥</p>
          <p className="gurbani-line">ਅਪਨੇ ਸੇਵਕ ਕੀ ਆਪੇ ਰਾਖੈ ਨਿਮਖ ਨ ਬਿਸਰੈ ਸਾਸਾ ॥</p>
          <p className="gurbani-line highlight">ਹਰਿ ਕਾ ਨਾਮੁ ਜਪਹੁ ਮੇਰੇ ਮੀਤਾ ਨਾਨਕ ਕੀ ਅਰਦਾਸਾ ॥੨॥</p>
        </div>

        {/* Viakhya / Translation Section */}
        {showViakhya && (
          <div className="mukhwak-viakhya-box">
            <h5 className="viakhya-title">ਪੰਜਾਬੀ ਵਿਆਖਿਆ / ਅਰਥ:</h5>
            <p className="viakhya-text">
              ਹੇ ਭਾਈ! ਜਿਸ ਮਨੁੱਖ ਨੂੰ ਵੱਡੇ ਭਾਗਾਂ ਨਾਲ ਪੂਰਾ ਗੁਰੂ ਮਿਲ ਪੈਂਦਾ ਹੈ, ਉਸ ਦੇ ਮਨ ਵਿੱਚ ਆਤਮਕ ਜੀਵਨ ਦਾ ਚਾਨਣ ਹੋ ਜਾਂਦਾ ਹੈ। ਉਸ ਨੂੰ ਆਪਣੇ ਮਾਲਕ-ਪ੍ਰਭੂ ਦਾ ਪੱਕਾ ਆਸਰਾ ਬਣ ਜਾਂਦਾ ਹੈ। ਪਰਮਾਤਮਾ ਆਪਣੇ ਭਗਤਾਂ ਤੇ ਸੇਵਕਾਂ ਦੀ ਹਰ ਪਲ ਰਾਖੀ ਕਰਦਾ ਹੈ।
            </p>
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
            href="https://sgpc.net/hukamnama/"
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
