import React from 'react';
import DarbarSahibMukhWak from './DarbarSahibMukhWak';

export default function ParallaxHero() {
  return (
    <section
      className="tv-studio-hero-section"
      style={{
        paddingTop: '8px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div className="container">
        <div
          className="tv-studio-flex-row"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          {/* ========================================================
              LEFT COLUMN (50%): MUKH WAK SECTION (Transparent / White BG)
          ======================================================== */}
          <div className="hero-darbar-col">
            {/* Mukh Wak Section Heading - Pixel-Perfect Single Row */}
            <div className="hero-col-header">
              <span className="hero-col-badge badge-mukhwak">
                <i className="fa fa-book" style={{ marginRight: '6px' }}></i> ਮੁੱਖ ਵਾਕ
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title">ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ</h3>
              <span className="hero-col-sub hidden-xs">ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ</span>
            </div>

            {/* Mukh Wak Sacred Card with Transparent / Clean BG */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <DarbarSahibMukhWak />
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (50%): LIVE TV (Dark Studio BG - Separate Section)
          ======================================================== */}
          <div className="hero-tv-col" id="live-tv">
            {/* Live TV Section Heading - Pixel-Perfect Single Row */}
            <div className="hero-col-header">
              <span className="hero-col-badge badge-livetv">
                <span className="live-red-dot"></span> ਲਾਈਵ ਟੀਵੀ
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title">ਪੰਜਾਬ ਫਾਈਲਜ਼ 24x7 HD ਪ੍ਰਸਾਰਣ</h3>
              <span className="hero-col-sub hidden-xs">24x7 ਲਾਈਵ ਸਟੂਡੀਓ</span>
            </div>

            {/* Dark Studio Wrapper (Distinct Dark Studio BG) */}
            <div
              style={{
                backgroundColor: '#111317',
                borderRadius: '6px',
                padding: '12px 14px 14px',
                border: '1px solid #1c2d5a',
                boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
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
                {/* TV Top Bar: Live indicator + Channel Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#ebb10d', letterSpacing: '0.4px' }}>
                      ਪੰਜਾਬ ਫਾਈਲਜ਼ 24x7 HD ਲਾਈਵ
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

                {/* Live News Ticker Strip inside TV frame */}
                <div
                  style={{
                    marginTop: '8px',
                    backgroundColor: '#16171d',
                    borderRadius: '4px',
                    padding: '7px 10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                      ਲਾਈਵ ਬੁਲੇਟਿਨ
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#cbd5e1', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      ਪੰਜਾਬ, ਦੇਸ਼ ਅਤੇ ਦੁਨੀਆ ਦੀਆਂ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ ਦਾ ਸਿੱਧਾ ਪ੍ਰਸਾਰਣ
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#ebb10d', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    1080p HD
                  </span>
                </div>
              </div>

              {/* Minimalist TV Center Stand Base */}
              <div
                style={{
                  width: '70px',
                  height: '5px',
                  backgroundColor: '#2a2b30',
                  margin: '0 auto',
                  borderBottomLeftRadius: '2px',
                  borderBottomRightRadius: '2px',
                  border: '1px solid #333'
                }}
              ></div>
              <div
                style={{
                  width: '150px',
                  height: '3px',
                  background: 'linear-gradient(to right, #222, #444, #555, #444, #222)',
                  margin: '0 auto',
                  borderRadius: '2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
