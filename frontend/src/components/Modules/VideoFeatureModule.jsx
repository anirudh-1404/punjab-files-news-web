import React from 'react';

export default function VideoFeatureModule() {
  return (
    <section className="module dark">
      <div className="container">
        <div className="row no-gutter">
          {/* Main Video Col-9 */}
          <div className="col-sm-9 col-md-9">
            <div className="video-full">
              <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://player.vimeo.com/video/97744717?title=0&byline=0&portrait=0"
                  className="video"
                  title="Feature Video Documentary"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Related Videos Col-3 */}
          <div className="col-xs-12 col-sm-3 col-md-3">
            <div className="title-left title-style03 underline03">
              <h4>ਸਬੰਧਤ ਵੀਡੀਓਜ਼</h4>
            </div>
            <div className="module-media" style={{ marginBottom: '15px', position: 'relative' }}>
              <div className="image">
                <img className="img-responsive" src="/img/index_620x465-image04.jpg" alt="Related Video 1" />
              </div>
              <a href="#video">
                <span className="play-icon"></span>
              </a>
            </div>
            <div className="module-media" style={{ position: 'relative' }}>
              <div className="image">
                <img className="img-responsive" src="/img/index_620x465-image02.jpg" alt="Related Video 2" />
              </div>
              <a href="#video">
                <span className="play-icon"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
