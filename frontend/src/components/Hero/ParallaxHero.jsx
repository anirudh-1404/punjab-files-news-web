import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultSideHeadlines = [
  {
    title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ',
    desc: 'ਸੂਬੇ ਦੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਨਵੇਂ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਬਜਟ ਅਲਾਟ ਕੀਤਾ ਗਿਆ।',
    category: 'ਰਾਜਨੀਤੀ',
    time: '2 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image01.jpg',
    link: '#news'
  },
  {
    title: 'ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਤਹਿਤ ਪੰਜਾਬ ਵਿੱਚ ਰੁਜ਼ਗਾਰ ਦੇ ਹਜ਼ਾਰਾਂ ਨਵੇਂ ਮੌਕੇ ਹੋਣਗੇ ਪੈਦਾ',
    desc: 'ਨਿਵੇਸ਼ਕਾਂ ਨੂੰ ਵਿਸ਼ੇਸ਼ ਸਹੂਲਤਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇ ਕੇ ਸੂਬੇ ਵਿੱਚ ਵੱਡੇ ਉਦਯੋਗ ਸਥਾਪਤ ਕਰਨ ਦੀ ਯੋਜਨਾ।',
    category: 'ਆਰਥਿਕਤਾ',
    time: '5 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image02.jpg',
    link: '#news'
  },
  {
    title: 'ਪੰਜਾਬੀ ਖਿਡਾਰੀਆਂ ਨੇ ਕੌਮੀ ਪੱਧਰ ’ਤੇ ਜਿੱਤੇ ਸੋਨ ਤਗਮੇ, ਪਿੰਡਾਂ ਵਿੱਚ ਖੁਸ਼ੀ ਦਾ ਮਾਹੌਲ',
    desc: 'ਕਬੱਡੀ ਅਤੇ ਐਥਲੈਟਿਕਸ ਮੁਕਾਬਲਿਆਂ ਵਿੱਚ ਸ਼ਾਨਦਾਰ ਪ੍ਰਦਰਸ਼ਨ ਕਰਕੇ ਪੰਜਾਬ ਦਾ ਨਾਂਅ ਰੌਸ਼ਨ ਕੀਤਾ।',
    category: 'ਖੇਡਾਂ',
    time: '8 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image03.jpg',
    link: '#news'
  },
  {
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਕੈਂਪ ਅਤੇ ਦਵਾਈਆਂ ਦੀ ਸਹੂਲਤ',
    desc: 'ਸਿਹਤ ਵਿਭਾਗ ਵੱਲੋਂ ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਮਰੀਜ਼ਾਂ ਦੀ ਮੁਫ਼ਤ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।',
    category: 'ਸਿਹਤ',
    time: '12 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image04.jpg',
    link: '#news'
  },
  {
    title: 'ਮੌਸਮ ਚੇਤਾਵਨੀ: ਪੰਜਾਬ ਅਤੇ ਚੰਡੀਗੜ੍ਹ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ, ਯੈਲੋ ਅਲਰਟ ਜਾਰੀ',
    desc: 'ਮੌਸਮ ਵਿਭਾਗ ਨੇ ਆਉਣ ਵਾਲੇ 48 ਘੰਟਿਆਂ ਦੌਰਾਨ ਤੇਜ਼ ਹਵਾਵਾਂ ਅਤੇ ਗਰਜ-ਚਮਕ ਨਾਲ ਮੀਂਹ ਦੀ ਪੇਸ਼ੀਨਗੋਈ ਕੀਤੀ ਹੈ।',
    category: 'ਮੌਸਮ',
    time: '15 ਮਿੰਟ ਪਹਿਲਾਂ',
    img: '/img/index_370x185-image05.jpg',
    link: '#news'
  }
];

export default function ParallaxHero() {
  const [headlines, setHeadlines] = useState(defaultSideHeadlines);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (!isMounted || !data) return;

      const itemsPool = (data.all && data.all.length > 0)
        ? data.all
        : (data.punjab && data.punjab.length > 0)
          ? data.punjab
          : [];

      if (itemsPool.length > 0) {
        const times = ['2 ਮਿੰਟ ਪਹਿਲਾਂ', '5 ਮਿੰਟ ਪਹਿਲਾਂ', '8 ਮਿੰਟ ਪਹਿਲਾਂ', '12 ਮਿੰਟ ਪਹਿਲਾਂ', '15 ਮਿੰਟ ਪਹਿਲਾਂ'];
        const categories = ['ਰਾਜਨੀਤੀ', 'ਪੰਜਾਬ', 'ਸੂਬਾਈ', 'ਕੌਮਾਂਤਰੀ', 'ਮੌਸਮ'];

        const mapped = [0, 1, 2, 3, 4].map((idx) => {
          const item = itemsPool[idx % itemsPool.length];
          return {
            title: item?.title || defaultSideHeadlines[idx].title,
            desc: item?.desc || defaultSideHeadlines[idx].desc,
            category: categories[idx] || item?.category || 'ਖ਼ਬਰਾਂ',
            time: times[idx] || 'ਤਾਜ਼ਾ',
            img: item?.img || defaultSideHeadlines[idx].img,
            link: item?.link || '#news'
          };
        });
        setHeadlines(mapped);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="tv-studio-hero-section" style={{ backgroundColor: '#111317', padding: '20px 0 16px', borderBottom: '1px solid #1c2d5a' }}>
      <div className="container">
        <div className="tv-studio-flex-row" style={{ display: 'flex', alignItems: 'stretch', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* ========================================================
              60% LEFT COLUMN: REALISTIC SMART LED TV FRAME
          ======================================================== */}
          <div className="tv-screen-col" style={{ flex: '0 0 60%', maxWidth: '60%', display: 'flex', flexDirection: 'column' }}>
            {/* TV Outer Titanium Bezel */}
            <div
              className="realistic-tv-bezel"
              style={{
                backgroundColor: '#1b1c20',
                border: '3px solid #2d2f36',
                borderRadius: '8px',
                padding: '8px 8px 10px 8px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
                position: 'relative',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
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
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
                  flex: 1
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
              40% RIGHT COLUMN: EXACTLY 5 GUARANTEED NEWS STORIES
          ======================================================== */}
          <div className="tv-feed-col" style={{ flex: '0 0 calc(40% - 20px)', maxWidth: 'calc(40% - 20px)', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                backgroundColor: '#191b20',
                border: '1px solid #282a32',
                borderRadius: '8px',
                padding: '10px 14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                boxSizing: 'border-box',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Studio Feed Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #ebb10d',
                  paddingBottom: '6px',
                  marginBottom: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#ebb10d',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.4px' }}>
                    ਤਾਜ਼ਾ ਸੁਰਖੀਆਂ
                  </h3>
                </div>

                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: '700',
                    color: '#ffffff',
                    backgroundColor: '#b71c1c',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 4px rgba(183, 28, 28, 0.4)'
                  }}
                >
                  24x7 ON AIR
                </span>
              </div>

              {/* GUARANTEED 5 NEWS STORIES: Items 1, 2, 3, 4, 5 */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const item = headlines[idx] || defaultSideHeadlines[idx];
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '4px 0',
                        borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Category Badge & Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: '700',
                              color: '#ebb10d',
                              backgroundColor: 'rgba(235, 177, 13, 0.12)',
                              padding: '1px 5px',
                              borderRadius: '2px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}
                          >
                            {item.category}
                          </span>
                          <span style={{ fontSize: '9.5px', color: '#888e9b' }}>{item.time}</span>
                        </div>

                        {/* Headline */}
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            fontWeight: '700',
                            lineHeight: '1.3',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#ffffff', textDecoration: 'none' }}
                          >
                            {item.title}
                          </a>
                        </h4>

                        {/* Description Lines Under Headline */}
                        <p
                          style={{
                            margin: '2px 0 0',
                            fontSize: '11px',
                            lineHeight: '1.35',
                            color: '#b0b8c4',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {item.desc || 'ਸੂਬੇ ਅਤੇ ਦੇਸ਼ ਭਰ ਦੀਆਂ ਤਾਜ਼ਾ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ, ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਲੋਕ ਹਿੱਤ ਮੁੱਦਿਆਂ ਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ...'}
                        </p>
                      </div>

                      {/* Thumbnail Image */}
                      <div
                        style={{
                          width: '66px',
                          minWidth: '66px',
                          height: '50px',
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
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
