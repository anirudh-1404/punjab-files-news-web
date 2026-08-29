import React from 'react';

export default function FeaturedAirShowModule() {
  return (
    <section className="module">
      <div className="container">
        <div className="row no-gutter">
          {/* Column 1: Full Block Photo */}
          <div className="full-block-three-columns">
            <div className="container-full bottom-text full-photo">
              <div className="entry-media">
                <div
                  className="image"
                  style={{
                    display: 'block',
                    backgroundImage: 'url(/img/index_875x656.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '380px'
                  }}
                ></div>
              </div>
              <div className="content">
                <h2>
                  <a href="#airshow">International Aviation &amp; Aerospace Expo</a>
                </h2>
                <h4>
                  Spectacular aerobatic maneuvers and next-generation defence technology exhibited at the annual air show.
                </h4>
              </div>
            </div>
          </div>

          {/* Column 2: Half Media + 3 Posts */}
          <div className="full-block-three-columns">
            <div className="container-half">
              <div className="entry-media">
                <div
                  className="image"
                  style={{
                    backgroundImage: 'url(/img/index_800x600.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '200px',
                    position: 'relative'
                  }}
                >
                  <span>
                    <a className="label-1" href="#world">World News</a>
                  </span>
                  <a href="#video">
                    <span className="play-icon"></span>
                  </a>
                </div>
              </div>
              <div className="content">
                <h4>
                  <a href="#world">Global delegates deliberate on technological cooperation...</a>
                </h4>
              </div>
            </div>

            <div className="entry-post">
              {/* Item 1 */}
              <div className="item">
                <div className="item-image">
                  <a className="img-link" href="#news">
                    <img className="img-responsive img-full" src="/img/index_464x232-image01.jpg" alt="" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="entry-meta bg-1">News</div>
                  <p className="ellipsis">
                    <a href="#news">Cyber safety taskforce launches proactive community outreach...</a>
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="item">
                <div className="item-image">
                  <a className="img-link" href="#business">
                    <img className="img-responsive img-full" src="/img/index_464x232-image02.jpg" alt="" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="entry-meta bg-2">Business</div>
                  <p className="ellipsis">
                    <a href="#business">Manufacturing clusters report increased export orders...</a>
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="item">
                <div className="item-image">
                  <a className="img-link" href="#politics">
                    <img className="img-responsive img-full" src="/img/index_464x232-image03.jpg" alt="" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="entry-meta bg-4">Politics</div>
                  <p className="ellipsis">
                    <a href="#politics">Policy discussions foster consensus on infrastructure expansion...</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Banner Ad */}
          <div className="full-block-three-columns">
            <div className="sidebar-add-place">
              <a href="#" target="_blank" rel="noreferrer">
                <img className="img-responsive" src="/img/banner_300x600.jpg" alt="Featured Advertisement" style={{ width: '100%' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
