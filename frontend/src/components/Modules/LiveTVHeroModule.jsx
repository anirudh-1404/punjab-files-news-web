import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';
import { getCardImageUrl } from '../../services/imageUtils';

const defaultFourItems = [
  {
    title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ',
    desc: 'ਸੂਬੇ ਦੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਨਵੇਂ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਬਜਟ ਅਲਾਟ ਕੀਤਾ ਗਿਆ।',
    category: 'ਰਾਜਨੀਤੀ',
    labelClass: 'bg-1',
    img: '/img/index_800x400-image01.jpg',
    link: '#top-news'
  },
  {
    title: 'ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਤਹਿਤ ਪੰਜਾਬ ਵਿੱਚ ਰੁਜ਼ਗਾਰ ਦੇ ਹਜ਼ਾਰਾਂ ਨਵੇਂ ਮੌਕੇ ਹੋਣਗੇ ਪੈਦਾ',
    desc: 'ਨਿਵੇਸ਼ਕਾਂ ਨੂੰ ਵਿਸ਼ੇਸ਼ ਸਹੂਲਤਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇ ਕੇ ਸੂਬੇ ਵਿੱਚ ਵੱਡੇ ਉਦਯੋਗ ਸਥਾਪਤ ਕਰਨ ਦੀ ਯੋਜਨਾ।',
    category: 'ਆਰਥਿਕਤਾ',
    labelClass: 'bg-3',
    img: '/img/index_800x400-image02.jpg',
    link: '#top-news'
  },
  {
    title: 'ਪੰਜਾਬੀ ਖਿਡਾਰੀਆਂ ਨੇ ਕੌਮੀ ਪੱਧਰ ’ਤੇ ਜਿੱਤੇ ਸੋਨ ਤਗਮੇ, ਪਿੰਡਾਂ ਵਿੱਚ ਖੁਸ਼ੀ ਦਾ ਮਾਹੌਲ',
    desc: 'ਕਬੱਡੀ ਅਤੇ ਐਥਲੈਟਿਕਸ ਮੁਕਾਬਲਿਆਂ ਵਿੱਚ ਸ਼ਾਨਦਾਰ ਪ੍ਰਦਰਸ਼ਨ ਕਰਕੇ ਪੰਜਾਬ ਦਾ ਨਾਂਅ ਰੌਸ਼ਨ ਕੀਤਾ।',
    category: 'ਖੇਡਾਂ',
    labelClass: 'bg-5',
    img: '/img/index_800x400-image03.jpg',
    link: '#top-news'
  },
  {
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਕੈਂਪ ਅਤੇ ਦਵਾਈਆਂ ਦੀ ਸਹੂਲਤ',
    desc: 'ਸਿਹਤ ਵਿਭਾਗ ਵੱਲੋਂ ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਮਰੀਜ਼ਾਂ ਦੀ ਮੁਫ਼ਤ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।',
    category: 'ਸਿਹਤ',
    labelClass: 'bg-2',
    img: '/img/index_800x400-image04.jpg',
    link: '#top-news'
  }
];

const defaultLiveFeed = [
  {
    title: '‘ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ’ ਦਾ ਚੌਥਾ ਸੀਜ਼ਨ 5 ਸਤੰਬਰ ਤੋਂ ਹੋਵੇਗਾ ਸ਼ੁਰੂ: CM ਮਾਨ',
    category: 'PUNJAB',
    img: '/img/index_370x185-image01.jpg',
    link: '#feed'
  },
  {
    title: 'ਪੰਜਾਬ-ਚੰਡੀਗੜ੍ਹ ’ਚ ਅਗਲੇ 4 ਦਿਨ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ, ਯੈਲੋ ਅਲਰਟ ਜਾਰੀ',
    category: 'WEATHER',
    img: '/img/index_370x185-image02.jpg',
    link: '#feed'
  },
  {
    title: 'ਮੋਹਾਲੀ ਵਿੱਚ ਨਵੀਂ ਸਨਅਤੀ ਨੀਤੀ ਤਹਿਤ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਵਿਸ਼ੇਸ਼ ਮੌਕੇ',
    category: 'BUSINESS',
    img: '/img/index_370x185-image03.jpg',
    link: '#feed'
  }
];

export default function LiveTVHeroModule() {
  const [gridItems, setGridItems] = useState(defaultFourItems);
  const [liveFeedItems, setLiveFeedItems] = useState(defaultLiveFeed);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (!isMounted || !data) return;

      if (data.punjab && data.punjab.length >= 4) {
        const categories = ['ਰਾਜਨੀਤੀ', 'ਆਰਥਿਕਤਾ', 'ਖੇਡਾਂ', 'ਸਿਹਤ'];
        const labelClasses = ['bg-1', 'bg-3', 'bg-5', 'bg-2'];

        const mappedGrid = data.punjab.slice(0, 4).map((item, idx) => ({
          title: item.title,
          desc: item.desc || item.title,
          category: categories[idx] || item.category,
          labelClass: labelClasses[idx] || 'bg-1',
          img: item.img || defaultFourItems[idx].img,
          link: item.link
        }));
        setGridItems(mappedGrid);
      }

      if (data.all && data.all.length >= 3) {
        const categories = ['PUNJAB', 'POLITICS', 'WEATHER'];
        const mapped = data.all.slice(4, 7).map((item, idx) => ({
          title: item.title,
          category: categories[idx] || 'PUNJAB',
          img: item.img || defaultLiveFeed[idx % defaultLiveFeed.length].img,
          link: item.link
        }));
        setLiveFeedItems(mapped);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="module live-hero-section" style={{ paddingTop: '10px', paddingBottom: '25px' }}>
      <div className="container">
        <div className="row live-hero-row">
          {/* Right Column: News18 LIVE TV Widget */}
          <div className="col-xs-12 col-md-5 pull-right live-tv-col">
            <div
              className="live-tv-widget-box"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                padding: '14px',
                marginBottom: '20px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  borderBottom: '2px solid #e52d27',
                  paddingBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="live-pulse-dot"
                    style={{
                      width: '9px',
                      height: '9px',
                      backgroundColor: '#e52d27',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1f2937',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    WEB TV
                  </h3>
                </div>

                <a
                  href="#channels"
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  More Channels <i className="fa fa-television" style={{ color: '#e52d27' }}></i>
                </a>
              </div>

              {/* Autoplay Video Player */}
              <div
                className="live-video-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '4px',
                  backgroundColor: '#000000',
                  marginBottom: '12px'
                }}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/KMWcefrAKLg?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0"
                  title="Punjab Files Live TV Stream"
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

              {/* News Items Under Video */}
              <div className="live-tv-under-feed">
                {liveFeedItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '8px 0',
                      borderBottom: idx < liveFeedItems.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#e52d27',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '2px',
                          letterSpacing: '0.4px'
                        }}
                      >
                        {item.category}
                      </span>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '1.35',
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
                          style={{ color: '#1f2937', textDecoration: 'none' }}
                        >
                          {item.title}
                        </a>
                      </h4>
                    </div>

                    <div
                      style={{
                        width: '65px',
                        minWidth: '65px',
                        height: '52px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#f3f4f6'
                      }}
                    >
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                          src={getCardImageUrl(item.img, 200)}
                          alt={item.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', imageRendering: '-webkit-optimize-contrast' }}
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

          {/* Left Column: Equal 2x2 Grid (4 News Cards) */}
          <div className="col-xs-12 col-md-7 top-stories-col">
            <div className="module-title" style={{ marginBottom: '14px' }}>
              <h3 className="title">
                <span className="bg-1">ਤਾਜ਼ਾ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ</span>
              </h3>
              <h3 className="subtitle">ਪੰਜਾਬ ਅਤੇ ਦੇਸ਼ ਦੇ ਪ੍ਰਮੁੱਖ ਸਮਾਚਾਰ</h3>
            </div>

            <div className="row" style={{ marginLeft: '-8px', marginRight: '-8px' }}>
              {gridItems.map((item, idx) => (
                <div className="col-xs-12 col-sm-6" key={idx} style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '16px' }}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {/* Card Image */}
                    <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden', backgroundColor: '#111' }}>
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                          src={getCardImageUrl(item.img, 360)}
                          alt={item.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', imageRendering: '-webkit-optimize-contrast' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/index_800x400-image01.jpg';
                          }}
                        />
                      </a>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          backgroundColor: '#e52d27',
                          color: '#ffffff',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          borderRadius: '3px',
                          letterSpacing: '0.3px'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4
                        style={{
                          margin: '0 0 6px',
                          fontSize: '14px',
                          fontWeight: '700',
                          lineHeight: '1.35',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        <a href={item.link} target="_blank" rel="noreferrer" style={{ color: '#111827', textDecoration: 'none' }}>
                          {item.title}
                        </a>
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          lineHeight: '1.4',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
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
        </div>
      </div>
    </section>
  );
}
