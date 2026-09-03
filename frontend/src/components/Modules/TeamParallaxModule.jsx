import React from 'react';

export default function TeamParallaxModule() {
  return (
    <>
      <div id="parallax-section1">
        <div className="image3 img-overlay1">
          <div className="container">
            <div className="caption text-center">
              <h2 className="color-white weight-300 small-caption" style={{ fontSize: '26px', lineHeight: 1.4 }}>
                ਮਿਲੋ ਸਾਡੀ ਸਮਰਪਿਤ <strong>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ</strong> ਨਾਲ! ਸਾਡੇ ਬਾਰੇ ਹੋਰ ਜਾਣਕਾਰੀ ਇੱਥੇ ਪ੍ਰਾਪਤ ਕਰੋ!
              </h2>
              <a href="#about-us" className="btn btn-default" style={{ marginTop: '15px', fontWeight: 700, padding: '10px 24px', backgroundColor: '#ebb10d', color: '#111317', border: '1px solid #c89508', borderRadius: '4px' }}>
                ਸਾਡੇ ਬਾਰੇ ਜਾਣੋ
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="add-place" style={{ textAlign: 'center', margin: '20px 0' }}>
        <a href="#" target="_blank" rel="noreferrer">
          <img src="/img/banner_820x100.jpg" alt="Advertisement Banner" style={{ maxWidth: '100%', height: 'auto' }} />
        </a>
      </div>
    </>
  );
}
