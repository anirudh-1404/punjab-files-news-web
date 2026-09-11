import React from 'react';

export default function TVScheduleBanner() {
  return (
    <section className="module dark" id="tv-schedule" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <div className="container">
        <div className="show-info">
          <h4 className="schedule-logo bg-1">
            <a href="#tv-schedule">ਲਾਈਵ ਟੀਵੀ ਸ਼ਡਿਊਲ</a>
          </h4>
          <div className="show-title">
            <h2>ਪੰਜਾਬ ਇਨਸਾਈਟ</h2>
            <h3>ਸੀਨੀਅਰ ਸੰਪਾਦਕਾਂ ਨਾਲ ਖ਼ਾਸ ਵਿਚਾਰ-ਵਟਾਂਦਰਾ</h3>
          </div>
          <h4>
            <a className="show-info-button bg-1" href="#watch">
              ਪ੍ਰਾਈਮ ਟਾਈਮ ਸਿਆਸੀ ਬਹਿਸ ਅਤੇ ਜ਼ਮੀਨੀ ਇੰਟਰਵਿਊ ਦੇਖੋ — ਅੱਜ ਰਾਤ 9:00 ਵਜੇ
            </a>
          </h4>
          <div className="figure">
            <img src="/img/schedule_figure.png" alt="Show Host" />
          </div>
        </div>
        <div className="schedule-squares">
          <span className="square2"></span>
          <span className="square3"></span>
          <span className="square4"></span>
          <span className="square5"></span>
          <span className="square6"></span>
          <span className="square7"></span>
          <span className="square8"></span>
          <span className="square9"></span>
          <span className="square10"></span>
          <span className="square11"></span>
        </div>
      </div>
    </section>
  );
}
