import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultSideHeadlines = [
  {
    title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ',
    category: 'ਰਾਜਨੀਤੀ',
    time: '2 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image01.jpg',
    link: '#news'
  },
  {
    title: 'ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਤਹਿਤ ਪੰਜਾਬ ਵਿੱਚ ਰੁਜ਼ਗਾਰ ਦੇ ਹਜ਼ਾਰਾਂ ਨਵੇਂ ਮੌਕੇ ਹੋਣਗੇ ਪੈਦਾ',
    category: 'ਆਰਥਿਕਤਾ',
    time: '5 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image02.jpg',
    link: '#news'
  },
  {
    title: 'ਪੰਜਾਬੀ ਖਿਡਾਰੀਆਂ ਨੇ ਕੌਮੀ ਪੱਧਰ ’ਤੇ ਜਿੱਤੇ ਸੋਨ ਤਗਮੇ, ਪਿੰਡਾਂ ਵਿੱਚ ਖੁਸ਼ੀ ਦਾ ਮਾਹੌਲ',
    category: 'ਖੇਡਾਂ',
    time: '8 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image03.jpg',
    link: '#news'
  },
  {
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਕੈਂਪ ਅਤੇ ਦਵਾਈਆਂ ਦੀ ਸਹੂਲਤ',
    category: 'ਸਿਹਤ',
    time: '12 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image04.jpg',
    link: '#news'
  }
];

export default function ParallaxHero() {
  const [headlines, setHeadlines] = useState(defaultSideHeadlines);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (!isMounted || !data) return;

      if (data.all && data.all.length >= 4) {
        const times = ['2 ਮਿੰਟ ਪਹਿਲਾਂ', '5 ਮਿੰਟ ਪਹਿਲਾਂ', '8 ਮਿੰਟ ਪਹਿਲਾਂ', '12 ਮਿੰਟ ਪਹਿਲਾਂ'];
        const categories = ['ਰਾਜਨੀਤੀ', 'ਪੰਜਾਬ', 'ਸੂਬਾਈ', 'ਕੌਮਾਂਤਰੀ'];
        
        const mapped = data.all.slice(0, 4).map((item, idx) => ({
          title: item.title,
          category: categories[idx] || item.category,
          time: times[idx] || 'ਤਾਜ਼ਾ',
          img: item.img || defaultSideHeadlines[idx % defaultSideHeadlines.length].img,
          link: item.link
        }));
        setHeadlines(mapped);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="tv-studio-hero-section" style={{ backgroundColor: '#111317', padding: '24px 0 20px', borderBottom: '1px solid #1c2d5a' }}>
      <div className="container">
        <div className="tv-studio-flex-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* ========================================================
              60% LEFT COLUMN: REALISTIC SMART LED TV FRAME
          ======================================================== */}
          <div className="tv-screen-col" style={{ flex: '0 0 60%', maxWidth: '60%' }}>
            {/* TV Outer Titanium Bezel */}
            <div
              className="realistic-tv-bezel"
              style={{
                backgroundColor: '#1b1c20',
                border: '3px solid #2d2f36',
                borderRadius: '8px',
                padding: '8px 8px 10px 8px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
                position: 'relative'
              }}
            >
              {/* TV Top Bar: Only Clean LIVE ON AIR */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px 6px 6px 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#b71c1c',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'livePulse 1.5s infinite'
                    }}
                  ></span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.6px' }}>
                    LIVE ON AIR
                  </span>
                </div>
              </div>

              {/* Real 16:9 Screen */}
              <div
                className="tv-inner-display"
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  borderRadius: '3px',
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)'
                }}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/KMWcefrAKLg?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0"
                  title="Punjab Files Live TV"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                ></iframe>
              </div>
            </div>

            {/* Realistic Minimalist TV Center Stand Base */}
            <div style={{ width: '80px', height: '6px', backgroundColor: '#2a2b30', margin: '0 auto', borderBottomLeftRadius: '2px', borderBottomRightRadius: '2px', border: '1px solid #333' }}></div>
            <div
              style={{
                width: '170px',
                height: '4px',
                background: 'linear-gradient(to right, #222, #444, #555, #444, #222)',
                margin: '0 auto',
                borderRadius: '2px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.5)'
              }}
            ></div>
          </div>

          {/* ========================================================
              40% RIGHT COLUMN: PERFECTLY SYMMETRIC LIVE FEED
          ======================================================== */}
          <div className="tv-feed-col" style={{ flex: '0 0 calc(40% - 24px)', maxWidth: 'calc(40% - 24px)', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                backgroundColor: '#191b20',
                border: '1px solid #282a32',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
              }}
            >
              {/* Studio Feed Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #b71c1c',
                  paddingBottom: '8px',
                  marginBottom: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#b71c1c',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.4px' }}>
                    ਤਾਜ਼ਾ ਸੁਰਖੀਆਂ <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400' }}>(Live Feed)</span>
                  </h3>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#ebb10d',
                    backgroundColor: 'rgba(235, 177, 13, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    border: '1px solid rgba(235, 177, 13, 0.4)',
                    letterSpacing: '0.5px'
                  }}
                >
                  24x7 ON AIR
                </span>
              </div>

              {/* Feed Items List with Symmetrical Balance */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {headlines.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: idx < headlines.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: '#ebb10d',
                            backgroundColor: 'rgba(235, 177, 13, 0.12)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px'
                          }}
                        >
                          {item.category}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#888e9b' }}>{item.time}</span>
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#f3f4f6', textDecoration: 'none' }}
                        >
                          {item.title}
                        </a>
                      </h4>
                    </div>

                    <div
                      style={{
                        width: '72px',
                        minWidth: '72px',
                        height: '52px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#111',
                        flexShrink: 0
                      }}
                    >
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/index_370x185-image01.jpg';
                          }}
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
