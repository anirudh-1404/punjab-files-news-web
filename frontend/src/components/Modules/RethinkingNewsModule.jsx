import React, { useState } from 'react';

const numberedHeadlines = [
  { num: '01', title: "Survivor is world's oldest man - Guinness World Records.", img: '/img/index_370x185-image07.jpg' },
  { num: '02', title: 'East Kilbride: Manager Billy O. to lead upcoming championship fixtures.', img: '/img/index_370x185-image08.jpg' },
  { num: '03', title: 'Heritage and contemporary arts celebrated in annual retrospective.', img: '/img/index_370x185-image09.jpg' },
  { num: '04', title: 'Postal history and rare stamp archives valued in national exhibitions.', img: '/img/index_370x185-image10.jpg' },
  { num: '05', title: 'Logistics innovations modernize transport across commercial corridors.', img: '/img/index_370x185-image11.jpg' },
  { num: '06', title: "Global maritime engineering showcases world's advanced hybrid vessels.", img: '/img/index_370x185-image12.jpg' },
  { num: '07', title: 'Public health leaders convene to discuss seasonal wellness guidelines.', img: '/img/index_370x185-image13.jpg' },
  { num: '08', title: 'Why do you need digital streaming access for premium broadcast features?', img: '/img/index_370x185-image14.jpg' },
  { num: '09', title: 'Your digital subscription is your key to uninterrupted live broadcast coverage.', img: '/img/index_370x185-image15.jpg' }
];

export default function RethinkingNewsModule() {
  const [isCelsius, setIsCelsius] = useState(false);
  const fTemp = 74;
  const cTemp = Math.round(((fTemp - 32) * 5) / 9);

  return (
    <section className="module highlight">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col News */}
          <div className="col-md-8">
            <div className="news">
              <div className="module-title">
                <h3 className="title">
                  <span className="bg-1">Rethinking</span>
                </h3>
                <h3 className="subtitle">the Punjab Files Experience</h3>
              </div>

              {/* Featured Item */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#breaking">
                    <img className="img-responsive img-full" src="/img/index_800x400-image17.jpg" alt="Breaking News Stories" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#breaking">
                        <strong>Breaking</strong> News Stories
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#author">By Senior Editorial Desk</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>October 2026
                    </div>
                  </div>
                  <p>
                    <a href="#breaking" className="external-link">
                      At Punjab Files we view journalism as an essential public trust, delivering verified, accurate, and fearless coverage...
                    </a>
                  </p>
                  <p>
                    <a href="#breaking" className="external-link">
                      Our correspondents on the ground provide real-time perspectives on policy, economy, and society.
                    </a>
                  </p>
                  <div>
                    <a href="#breaking">
                      <span className="read-more">Continue reading</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Block Grid */}
              <div className="news-block">
                <div className="item-block">
                  <div className="item-image">
                    <a className="img-link" href="#energy">
                      <img className="img-responsive img-full" src="/img/index_800x400-image21.jpg" alt="Energy" />
                    </a>
                  </div>
                  <div className="item-content">
                    <span className="day">Latest Updates</span>
                    <p>
                      <a href="#energy" className="external-link">The Energy Choices</a>
                    </p>
                  </div>
                </div>

                <div className="item-block">
                  <div className="item-image">
                    <a className="img-link" href="#agriculture">
                      <img className="img-responsive img-full" src="/img/index_800x400-image22.jpg" alt="Agriculture" />
                    </a>
                  </div>
                  <div className="item-content">
                    <span className="day">Latest Updates</span>
                    <p>
                      <a href="#agriculture" className="external-link">Food &amp; Agriculture</a>
                    </p>
                  </div>
                </div>

                <div className="item-block">
                  <div className="item-image">
                    <a className="img-link" href="#healthcare">
                      <img className="img-responsive img-full" src="/img/index_800x400-image23.jpg" alt="Healthcare" />
                    </a>
                  </div>
                  <div className="item-content">
                    <span className="day">Latest Updates</span>
                    <p>
                      <a href="#healthcare" className="external-link">Healthcare Horizons</a>
                    </p>
                  </div>
                </div>

                <div className="item-block">
                  <div className="item-image">
                    <a className="img-link" href="#infrastructure">
                      <img className="img-responsive img-full" src="/img/index_800x400-image24.jpg" alt="Infrastructure" />
                    </a>
                  </div>
                  <div className="item-content">
                    <span className="day">Latest Updates</span>
                    <p>
                      <a href="#infrastructure" className="external-link">Housing &amp; Construction</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sport Section */}
              <div className="module-title" style={{ marginTop: '30px' }}>
                <h3 className="title">
                  <span className="bg-4">Sport News</span>
                </h3>
                <h3 className="subtitle">Watch the latest sport news</h3>
              </div>

              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#sport">
                    <img className="img-responsive img-full" src="/img/index_800x400-image18.jpg" alt="Sports Analysis" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#sport">
                        <strong>Features</strong> &amp; In-depth Sports Analysis
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#sport">By Sports Desk</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>October 2026
                    </div>
                  </div>
                  <p>
                    <a href="#sport" className="external-link">
                      Tactical breakdowns, player interviews, and comprehensive season previews across all major sports leagues.
                    </a>
                  </p>
                  <div>
                    <a href="#sport">
                      <span className="read-more">Continue reading</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 8-block Sport Thumbnails */}
              <div className="news-block">
                {[
                  { title: 'Cricket League Updates', time: '1h ago', img: '/img/index_800x400-image25.jpg' },
                  { title: 'Football Championship', time: '54min ago', img: '/img/index_800x400-image26.jpg' },
                  { title: 'Rugby Tournament', time: '6h ago', img: '/img/index_800x400-image27.jpg' },
                  { title: 'Cycling Grand Prix', time: '1h ago', img: '/img/index_800x400-image28.jpg' },
                  { title: 'Soccer Highlights', time: '1h ago', img: '/img/index_800x400-image29.jpg' },
                  { title: 'Regional Athletics', time: '54min ago', img: '/img/index_800x400-image30.jpg' },
                  { title: 'Basketball Playoffs', time: '6h ago', img: '/img/index_800x400-image31.jpg' },
                  { title: 'Tennis Open Matches', time: '1h ago', img: '/img/index_800x400-image10.jpg' }
                ].map((sp, idx) => (
                  <div className="item-block" key={idx}>
                    <div className="item-image">
                      <a className="img-link" href="#sport">
                        <img className="img-responsive img-full" src={sp.img} alt={sp.title} />
                      </a>
                    </div>
                    <div className="item-content">
                      <i className="fa fa-clock-o"></i> <span className="day">{sp.time}</span>
                      <a href="#sport"> {sp.title}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4-col Sidebar */}
          <div className="col-md-4">
            {/* Headlines */}
            <div className="title-style02">
              <h3>
                <a href="#headlines">Headlines</a>
              </h3>
            </div>
            <div className="sidebar-post">
              <ul>
                {numberedHeadlines.map((h, idx) => (
                  <li key={idx}>
                    <div className="item">
                      <div className="item-image">
                        <a className="img-link" href="#headlines">
                          <img className="img-responsive img-full" src={h.img} alt="" />
                        </a>
                      </div>
                      <div className="item-content">
                        <h3>{h.num}</h3>
                        <p className="ellipsis">
                          <a href="#headlines">{h.title}</a>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weather Widget */}
            <div id="weather" className="sidebar-weather" style={{ marginTop: '20px' }}>
              <div className="block-title-1">
                <div className="weather-city-text">
                  <h3>Chandigarh / New Delhi</h3>
                </div>
              </div>
              <div className="weather-card">
                <div className="temp">
                  <i className="weather-icon wi wi-day-sunny"></i>
                  <div className="temperature" style={{ display: 'inline-block', fontSize: '32px', margin: '0 10px', fontWeight: 'bold' }}>
                    {isCelsius ? `${cTemp}°C` : `${fTemp}°F`}
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setIsCelsius(!isCelsius)}
                    style={{ padding: '3px 10px', fontSize: '12px' }}
                  >
                    <span className="switch">{isCelsius ? 'F' : 'C'}</span>
                  </button>
                </div>
                <div id="description">
                  <div id="type" className="desc-text">Sunny &amp; Clear Sky</div>
                  <i className="wi wi-humidity"></i>
                  <div id="humidity" className="desc-text">Humidity: 48%</div>
                  <i className="wi wi-strong-wind"></i>
                  <div id="wind" className="desc-text">Wind: 9 km/h NW</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 24h News On-Air Banner Ticker */}
        <div className="outer" style={{ marginTop: '25px' }}>
          <div className="breaking-ribbon">
            <h5>Punjab Files On-Air</h5>
          </div>
          <div className="news-on-air">
            <ul>
              <li>
                <h4>
                  <i className="fa fa-video-camera" aria-hidden="true" style={{ marginRight: '8px', color: '#e52d27' }}></i>
                  <a href="#live-stream">Watch Punjab Files 24/7 Streaming Live Online in HD Quality</a>
                </h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
