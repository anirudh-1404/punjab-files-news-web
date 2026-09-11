import React from 'react';

const entertainmentArticles = [
  {
    id: 'ent-1',
    title: 'ਨਵੀਂ ਪੰਜਾਬੀ ਫ਼ਿਲਮ ਦਾ ਧਮਾਕੇਦਾਰ ਟਰੇਲਰ ਰਿਲੀਜ਼: ਦਰਸ਼ਕਾਂ ਵੱਲੋਂ ਜ਼ਬਰਦਸਤ ਹੁੰਗਾਰਾ, ਯੂਟਿਊਬ ’ਤੇ ਨੰਬਰ 1 ਟਰੈਂਡਿੰਗ',
    category: 'ਪੰਜਾਬੀ ਸਿਨੇਮਾ',
    time: '15 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/art-entertainment_370x185-image04.jpg',
    desc: 'ਪਰਿਵਾਰਕ ਡਰਾਮਾ ਅਤੇ ਕਾਮੇਡੀ ਨਾਲ ਭਰਪੂਰ ਇਸ ਫ਼ਿਲਮ ਵਿੱਚ ਮੁੱਖ ਕਿਰਦਾਰਾਂ ਦੀ ਅਦਾਕਾਰੀ ਨੇ ਦਰਸ਼ਕਾਂ ਦੇ ਦਿਲ ਜਿੱਤੇ।'
  },
  {
    id: 'ent-2',
    title: 'ਸੂਫ਼ੀ ਤੇ ਲੋਕ ਸੰਗੀਤ ਸੰਮੇਲਨ: ਪੰਜਾਬ ਦੇ ਨੌਜਵਾਨ ਗਾਇਕਾਂ ਨੇ ਤੂੰਬੀ, ਅਲਗੋਜ਼ੇ ਅਤੇ ਢੱਡ-ਸਾਰੰਗੀ ਨਾਲ ਬੰਨ੍ਹਿਆ ਸਮਾਂ',
    category: 'ਲੋਕ ਸੰਗੀਤ',
    time: '1 ਘੰਟਾ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image16.jpg',
    desc: 'ਸੱਭਿਆਚਾਰਕ ਮੰਚ ਵੱਲੋਂ ਪੁਰਾਤਨ ਲੋਕ ਗੀਤਾਂ ਅਤੇ ਸੂਫ਼ੀਆਨਾ ਕਲਾਮ ਨੂੰ ਸੰਭਾਲਣ ਲਈ ਕਰਵਾਇਆ ਗਿਆ ਵਿਸ਼ੇਸ਼ ਪ੍ਰੋਗਰਾਮ।'
  },
  {
    id: 'ent-3',
    title: 'ਪੰਜਾਬ ਨਾਟਸ਼ਾਲਾ ਵਿਖੇ ਨਵੇਂ ਨਾਟਕ ਦਾ ਮੰਚਨ: ਸਮਾਜਿਕ ਮੁੱਦਿਆਂ ਤੇ ਨਸ਼ਿਆਂ ਖ਼ਿਲਾਫ਼ ਕਲਾਕਾਰਾਂ ਵੱਲੋਂ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਪੇਸ਼ਕਾਰੀ',
    category: 'ਥੀਏਟਰ ਤੇ ਰੰਗਮੰਚ',
    time: '2 ਘੰਟੇ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image17.jpg',
    desc: 'ਨਾਟਕ ਦੇਖਣ ਪੁੱਜੇ ਦਰਸ਼ਕਾਂ ਨੇ ਕਲਾਕਾਰਾਂ ਦੀ ਸ਼ਲਾਘਾ ਕੀਤੀ; ਡਾਇਰੈਕਟਰ ਨੇ ਕਿਹਾ ਕਿ ਰੰਗਮੰਚ ਸਮਾਜ ਦਾ ਸ਼ੀਸ਼ਾ ਹੈ।'
  },
  {
    id: 'ent-4',
    title: 'ਸਲਾਨਾ ਵਿਰਾਸਤੀ ਮੇਲਾ: ਗਿੱਧੇ ਅਤੇ ਭੰਗੜੇ ਦੀਆਂ ਧਮਾਲਾਂ, ਪਰਵਾਸੀ ਪੰਜਾਬੀਆਂ ਨੇ ਮਾਣਿਆ ਅਮੀਰ ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ',
    category: 'ਸੱਭਿਆਚਾਰਕ ਮੇਲਾ',
    time: '3 ਘੰਟੇ ਪਹਿਲਾਂ',
    img: '/img/index_800x400-image21.jpg',
    desc: 'ਚਰਖ਼ਾ ਕੱਤਣਾ, ਫੁਲਕਾਰੀ ਅਤੇ ਪੁਰਾਤਨ ਪੇਂਡੂ ਘਰੇਲੂ ਵਸਤਾਂ ਦੀ ਪ੍ਰਦਰਸ਼ਨੀ ਵਿਸ਼ੇਸ਼ ਖਿੱਚ ਦਾ ਕੇਂਦਰ ਰਹੀ।'
  }
];

export default function EntertainmentModule() {
  return (
    <section className="module" id="art-entertainment" style={{ backgroundColor: '#fcfdfe', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਮਨੋਰੰਜਨ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਪੰਜਾਬੀ ਸਿਨੇਮਾ, ਲੋਕ ਸੰਗੀਤ, ਥੀਏਟਰ ਅਤੇ ਵਿਰਸਾ (Cinema & Entertainment)
            </h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#b71c1c', backgroundColor: 'rgba(183, 28, 28, 0.08)', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-film" style={{ marginRight: '4px' }}></i> ਸਿਨੇਮਾ ਤੇ ਕਲਾ
            </span>
          </div>
        </div>

        {/* 4-Column Entertainment News Cards */}
        <div className="row">
          {entertainmentArticles.map((item) => (
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
                        e.target.src = '/img/index_800x400-image16.jpg';
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
