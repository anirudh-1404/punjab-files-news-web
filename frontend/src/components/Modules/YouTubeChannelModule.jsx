import React, { useState } from 'react';

const defaultVideos = [
  {
    id: 'vid-1',
    title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਵਿੱਚ ਕਿਸਾਨੀ ਮੁੱਦਿਆਂ ’ਤੇ ਗਰਮਾ-ਗਰਮ ਬਹਿਸ | Exclusive Ground Report',
    duration: '14:28',
    views: '45K views',
    time: '1 ਦਿਨ ਪਹਿਲਾਂ',
    thumbnail: '/img/index_800x400-image07.jpg',
    youtubeId: 'KMWcefrAKLg'
  },
  {
    id: 'vid-2',
    title: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦੇ ਅਲੌਕਿਕ ਦਰਸ਼ਨ ਦੀਦਾਰੇ | ਧਾਰਮਿਕ ਪ੍ਰੋਗਰਾਮ',
    duration: '22:15',
    views: '88K views',
    time: '2 ਦਿਨ ਪਹਿਲਾਂ',
    thumbnail: '/img/darbar-sahib-mukhwak.jpg',
    youtubeId: 'KMWcefrAKLg'
  },
  {
    id: 'vid-3',
    title: 'ਕਬੱਡੀ ਵਿਸ਼ਵ ਕੱਪ 2026: ਪੰਜਾਬ ਦੇ ਜਾਫੀਆਂ ਤੇ ਧਾਵੀਆਂ ਦਾ ਸ਼ਾਨਦਾਰ ਪ੍ਰਦਰਸ਼ਨ | Sports Highlights',
    duration: '18:40',
    views: '62K views',
    time: '3 ਦਿਨ ਪਹਿਲਾਂ',
    thumbnail: '/img/index_800x400-image06.jpg',
    youtubeId: 'KMWcefrAKLg'
  },
  {
    id: 'vid-4',
    title: 'ਸਰਹੱਦੀ ਪਿੰਡਾਂ ਦੀ ਦਾਸਤਾਨ: ਨਹਿਰੀ ਪਾਣੀ ਪਹੁੰਚਣ ਮਗਰੋਂ ਕਿਸਾਨਾਂ ਦੇ ਚਿਹਰਿਆਂ ’ਤੇ ਖੁਸ਼ੀ | Special Report',
    duration: '11:05',
    views: '31K views',
    time: '4 ਦਿਨ ਪਹਿਲਾਂ',
    thumbnail: '/img/index_800x400-image08.jpg',
    youtubeId: 'KMWcefrAKLg'
  }
];

export default function YouTubeChannelModule() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="module" id="youtube-section" style={{ backgroundColor: '#f8fafc', paddingTop: '14px', paddingBottom: '22px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">
              <i className="fa fa-youtube-play" style={{ marginRight: '6px' }}></i> ਪੰਜਾਬ ਫਾਈਲਜ਼ ਵੀਡੀਓਜ਼
            </span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">YouTube ਚੈਨਲ ਤੋਂ ਵਿਸ਼ੇਸ਼ ਗਰਾਊਂਡ ਰਿਪੋਰਟਾਂ ਅਤੇ ਵੀਡੀਓਜ਼</h3>
          </div>

          <div className="module-header-right">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '5px 12px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 5px rgba(183, 28, 28, 0.3)'
              }}
            >
              <i className="fa fa-youtube"></i> ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ
            </a>
          </div>
        </div>

        {/* Video Player Modal (if active) */}
        {activeVideo && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setActiveVideo(null)}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '850px',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px'
                }}
              >
                ×
              </button>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Video Cards Grid */}
        <div className="row">
          {defaultVideos.map((video) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={video.id} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail with Play Icon & Duration */}
                <div style={{ position: 'relative', width: '100%', height: '160px', backgroundColor: '#111', overflow: 'hidden' }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Dark Vignette Overlay */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.25)' }}></div>
                  
                  {/* Center Play Button */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '44px',
                      height: '44px',
                      backgroundColor: 'rgba(183, 28, 28, 0.9)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                  >
                    <i className="fa fa-play" style={{ fontSize: '16px', marginLeft: '3px' }}></i>
                  </div>

                  {/* Duration Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}
                  >
                    {video.duration}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '11px', color: '#1e293b', marginBottom: '4px', fontWeight: '600' }}>
                    {video.views} • {video.time}
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '13.5px',
                      fontWeight: '800',
                      lineHeight: '1.4',
                      color: '#000000',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {video.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
