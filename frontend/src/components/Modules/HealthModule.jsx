import React from 'react';

const healthArticles = [
  {
    id: 'health-1',
    title: 'ਸੰਤੁਲਿਤ ਖ਼ੁਰਾਕ ਤੇ ਦੇਸੀ ਨੁਸਖ਼ੇ: ਮੌਸਮੀ ਬਿਮਾਰੀਆਂ ਤੋਂ ਬਚਾਅ ਲਈ ਆਯੁਰਵੈਦਿਕ ਡਾਕਟਰਾਂ ਦੇ ਅਹਿਮ ਸੁਝਾਅ',
    category: 'ਪੌਸ਼ਟਿਕ ਖ਼ੁਰਾਕ',
    time: '25 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image19.jpg',
    desc: 'ਘਿਓ, ਮੱਖਣ ਅਤੇ ਮੌਸਮੀ ਸਬਜ਼ੀਆਂ ਦੇ ਸੰਤੁਲਿਤ ਉਪਯੋਗ ਨਾਲ ਇਮਿਊਨਿਟੀ ਵਧਾਉਣ ਅਤੇ ਤੰਦਰੁਸਤ ਰਹਿਣ ਦੇ ਤਰੀਕੇ।'
  },
  {
    id: 'health-2',
    title: 'ਮਾਨਸਿਕ ਤਣਾਅ ਅਤੇ ਨੀਂਦ ਦੀ ਸਮੱਸਿਆ: ਰੋਜ਼ਾਨਾ 30 ਮਿੰਟ ਯੋਗਾ ਤੇ ਧਿਆਨ ਨਾਲ ਮਨ ਨੂੰ ਮਿਲਦੀ ਹੈ ਸ਼ਾਂਤੀ',
    category: 'ਮਾਨਸਿਕ ਸਿਹਤ',
    time: '1 ਘੰਟਾ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image32.jpg',
    desc: 'ਡਾਕਟਰਾਂ ਅਨੁਸਾਰ ਡਿਜੀਟਲ ਸਕ੍ਰੀਨ ਸਮਾਂ ਘਟਾ ਕੇ ਅਤੇ ਕੁਦਰਤ ਦੇ ਨੇੜੇ ਰਹਿ ਕੇ ਦਿਮਾਗੀ ਥਕਾਵਟ ਤੋਂ ਰਾਹਤ ਪਾਈ ਜਾ ਸਕਦੀ ਹੈ।'
  },
  {
    id: 'health-3',
    title: 'ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਂ ਮੈਡੀਕਲ ਤਕਨਾਲੋਜੀ: ਦਿਲ ਅਤੇ ਸ਼ੂਗਰ ਦੇ ਮਰੀਜ਼ਾਂ ਲਈ ਆਧੁਨਿਕ ਜਾਂਚ ਸਹੂਲਤਾਂ ਦੀ ਸ਼ੁਰੂਆਤ',
    category: 'ਮੈਡੀਕਲ ਰਿਪੋਰਟ',
    time: '2 ਘੰਟੇ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image34.jpg',
    desc: 'ਜ਼ਿਲ੍ਹਾ ਪੱਧਰੀ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਵਿਸ਼ਵ ਪੱਧਰੀ ਲੈਬਾਂ ਅਤੇ ਮੁਫ਼ਤ ਜਾਂਚ ਕੈਂਪਾਂ ਰਾਹੀਂ ਲੋਕਾਂ ਨੂੰ ਮਿਲ ਰਹੀ ਹੈ ਰਾਹਤ।'
  },
  {
    id: 'health-4',
    title: 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮੁਫ਼ਤ ਸਿਹਤ ਕੈਂਪ: 500 ਤੋਂ ਵੱਧ ਬਜ਼ੁਰਗਾਂ ਅਤੇ ਬੱਚਿਆਂ ਦੀਆਂ ਅੱਖਾਂ ਦੀ ਹੋਈ ਜਾਂਚ',
    category: 'ਸਿਹਤ ਕੈਂਪ',
    time: '3 ਘੰਟੇ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image35.jpg',
    desc: 'ਸਮਾਜ ਸੇਵੀ ਸੰਸਥਾਵਾਂ ਅਤੇ ਡਾਕਟਰਾਂ ਦੀ ਟੀਮ ਵੱਲੋਂ ਲੋੜਵੰਦਾਂ ਨੂੰ ਐਨਕਾਂ ਅਤੇ ਦਵਾਈਆਂ ਮੁਫ਼ਤ ਵੰਡੀਆਂ ਗਈਆਂ।'
  }
];

export default function HealthModule() {
  return (
    <section className="module" id="health" style={{ backgroundColor: '#fcfdfe', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਸਿਹਤ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਤੰਦਰੁਸਤੀ, ਸੰਤੁਲਿਤ ਖ਼ੁਰਾਕ, ਯੋਗਾ ਅਤੇ ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ (Health & Wellness)
            </h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#b71c1c', backgroundColor: 'rgba(183, 28, 28, 0.08)', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-heartbeat" style={{ marginRight: '4px' }}></i> ਤੰਦਰੁਸਤ ਪੰਜਾਬ
            </span>
          </div>
        </div>

        {/* 4-Column Health News Cards */}
        <div className="row">
          {healthArticles.map((item) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={item.id} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#edf2f7' }}>
                  <a href={`#${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/index_800x400-image19.jpg';
                      }}
                    />
                  </a>
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#b71c1c',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '3px'
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600' }}>
                      <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                      {item.time}
                    </span>
                  </div>

                  {/* Solid Bold Black Headline */}
                  <h4
                    style={{
                      margin: '2px 0 6px 0',
                      fontSize: '14px',
                      fontWeight: '800',
                      lineHeight: '1.35',
                      color: '#000000'
                    }}
                  >
                    <a href={`#${item.id}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}>
                      {item.title}
                    </a>
                  </h4>

                  {/* Summary */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      lineHeight: '1.55',
                      color: '#111111',
                      fontWeight: '500',
                      marginTop: 'auto'
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
