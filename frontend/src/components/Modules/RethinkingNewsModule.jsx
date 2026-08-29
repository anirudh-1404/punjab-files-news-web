import React, { useState } from 'react';

const numberedHeadlines = [
  { num: '01', title: "ਗਿਨੀਜ਼ ਬੁੱਕ ਆਫ਼ ਵਰਲਡ ਰਿਕਾਰਡਜ਼ ਵਿੱਚ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਦਾ ਨਾਮ ਦਰਜ।", img: '/img/index_370x185-image07.jpg' },
  { num: '02', title: 'ਕਬੱਡੀ ਚੈਂਪੀਅਨਸ਼ਿਪ: ਨਵੇਂ ਖਿਡਾਰੀਆਂ ਦੀ ਚੋਣ ਲਈ ਟ੍ਰਾਇਲ ਮੁਕੰਮਲ।', img: '/img/index_370x185-image08.jpg' },
  { num: '03', title: 'ਪੰਜਾਬੀ ਵਿਰਸਾ ਅਤੇ ਪ੍ਰੰਪਰਾਗਤ ਲੋਕ ਕਲਾਵਾਂ ਦਾ ਸ਼ਾਨਦਾਰ ਪ੍ਰਦਰਸ਼ਨ।', img: '/img/index_370x185-image09.jpg' },
  { num: '04', title: 'ਇਤਿਹਾਸਕ ਦਸਤਾਵੇਜ਼ਾਂ ਅਤੇ ਪੁਰਾਤਨ ਸਿੱਕਿਆਂ ਦੀ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਦਰਸ਼ਨੀ।', img: '/img/index_370x185-image10.jpg' },
  { num: '05', title: 'ਸੜਕੀ ਆਵਾਜਾਈ ਅਤੇ ਟਰਾਂਸਪੋਰਟ ਨਿਯਮਾਂ ਵਿੱਚ ਲੋਕ ਹਿੱਤ ਸੁਧਾਰ।', img: '/img/index_370x185-image11.jpg' },
  { num: '06', title: 'ਖੇਤੀਬਾੜੀ ਵਿੱਚ ਆਧੁਨਿਕ ਮਸ਼ੀਨਰੀ ਅਤੇ ਡਰੋਨ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ।', img: '/img/index_370x185-image12.jpg' },
  { num: '07', title: 'ਸਿਹਤ ਮਾਹਿਰਾਂ ਵੱਲੋਂ ਮੌਸਮੀ ਤਬਦੀਲੀਆਂ ਦੌਰਾਨ ਸਾਵਧਾਨੀ ਦੇ ਨੁਸਖ਼ੇ।', img: '/img/index_370x185-image13.jpg' },
  { num: '08', title: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਲਾਈਵ ਸਟ੍ਰੀਮਿੰਗ ਰਾਹੀਂ ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੀਆਂ ਖ਼ਬਰਾਂ ਨਾਲ ਜੁੜੋ।', img: '/img/index_370x185-image14.jpg' },
  { num: '09', title: '24 ਘੰਟੇ ਨਿਰਪੱਖ, ਸੱਚੀ ਅਤੇ ਭਰੋਸੇਯੋਗ ਪੱਤਰਕਾਰੀ ਦਾ ਪ੍ਰਮੁੱਖ ਸਰੋਤ।', img: '/img/index_370x185-image15.jpg' }
];

export default function RethinkingNewsModule() {
  const [isCelsius, setIsCelsius] = useState(true);
  const cTemp = 28;
  const fTemp = Math.round((cTemp * 9) / 5 + 32);

  return (
    <section className="module highlight">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col News */}
          <div className="col-md-8">
            <div className="news">
              <div className="module-title">
                <h3 className="title">
                  <span className="bg-1">ਨਵੀਂ ਸੋਚ</span>
                </h3>
                <h3 className="subtitle">ਪੰਜਾਬ ਫਾਈਲਜ਼ ਦਾ ਵਿਸ਼ੇਸ਼ ਅੰਦਾਜ਼</h3>
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
                        <strong>ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼</strong> ਅਤੇ ਖੋਜੀ ਪੱਤਰਕਾਰੀ
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#author">ਸੀਨੀਅਰ ਸੰਪਾਦਕੀ ਡੈਸਕ ਵੱਲੋਂ</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>ਅਕਤੂਬਰ 2026
                    </div>
                  </div>
                  <p>
                    <a href="#breaking" className="external-link">
                      ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ ਅਸੀਂ ਪੱਤਰਕਾਰੀ ਨੂੰ ਸਮਾਜ ਪ੍ਰਤੀ ਅਹਿਮ ਜ਼ਿੰਮੇਵਾਰੀ ਮੰਨਦੇ ਹੋਏ ਹਰ ਵਰਗ ਦੀ ਆਵਾਜ਼ ਨਿਰਪੱਖਤਾ ਨਾਲ ਉਠਾਉਂਦੇ ਹਾਂ...
                    </a>
                  </p>
                  <p>
                    <a href="#breaking" className="external-link">
                      ਸਾਡੇ ਜ਼ਮੀਨੀ ਰਿਪੋਰਟਰ ਸੂਬੇ ਦੇ ਵਿਕਾਸ, ਆਰਥਿਕਤਾ, ਖੇਤੀਬਾੜੀ ਅਤੇ ਸਿੱਖਿਆ ਦੇ ਖੇਤਰ ਵਿੱਚ ਜ਼ਮੀਨੀ ਹਕੀਕਤਾਂ ਸਾਹਮਣੇ ਲਿਆਉਂਦੇ ਹਨ।
                    </a>
                  </p>
                  <div>
                    <a href="#breaking">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
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
                    <span className="day">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</span>
                    <p>
                      <a href="#energy" className="external-link">ਊਰਜਾ ਅਤੇ ਬਿਜਲੀ ਸੁਧਾਰ</a>
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
                    <span className="day">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</span>
                    <p>
                      <a href="#agriculture" className="external-link">ਖੇਤੀਬਾੜੀ ਤੇ ਕਿਸਾਨੀ ਮੁੱਦੇ</a>
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
                    <span className="day">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</span>
                    <p>
                      <a href="#healthcare" className="external-link">ਸਿਹਤ ਸਹੂਲਤਾਂ ਦਾ ਵਿਸਥਾਰ</a>
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
                    <span className="day">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</span>
                    <p>
                      <a href="#infrastructure" className="external-link">ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਤੇ ਮਕਾਨ ਉਸਾਰੀ</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sport Section */}
              <div className="module-title" style={{ marginTop: '30px' }}>
                <h3 className="title">
                  <span className="bg-4">ਖੇਡ ਸਮਾਚਾਰ</span>
                </h3>
                <h3 className="subtitle">ਦੇਖੋ ਤਾਜ਼ਾ ਖੇਡਾਂ ਦੀਆਂ ਖ਼ਬਰਾਂ</h3>
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
                        <strong>ਖੇਡ ਵਿਸ਼ਲੇਸ਼ਣ</strong> ਅਤੇ ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਪ੍ਰਾਪਤੀਆਂ
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#sport">ਸਪੋਰਟਸ ਡੈਸਕ ਵੱਲੋਂ</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>ਅਕਤੂਬਰ 2026
                    </div>
                  </div>
                  <p>
                    <a href="#sport" className="external-link">
                      ਕਬੱਡੀ, ਕ੍ਰਿਕਟ ਅਤੇ ਹਾਕੀ ਦੇ ਮੈਦਾਨਾਂ ਤੋਂ ਤਾਜ਼ਾ ਸਕੋਰ, ਮੈਚ ਸਮੀਖਿਆ ਅਤੇ ਪ੍ਰਮੁੱਖ ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ ਇੰਟਰਵਿਊਆਂ।
                    </a>
                  </p>
                  <div>
                    <a href="#sport">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 8-block Sport Thumbnails */}
              <div className="news-block">
                {[
                  { title: 'ਕ੍ਰਿਕਟ ਲੀਗ ਅੱਪਡੇਟ', time: '1 ਘੰਟਾ ਪਹਿਲਾਂ', img: '/img/index_800x400-image25.jpg' },
                  { title: 'ਫੁੱਟਬਾਲ ਚੈਂਪੀਅਨਸ਼ਿਪ', time: '54 ਮਿੰਟ ਪਹਿਲਾਂ', img: '/img/index_800x400-image26.jpg' },
                  { title: 'ਕਬੱਡੀ ਟੂਰਨਾਮੈਂਟ ਫਾਈਨਲ', time: '6 ਘੰਟੇ ਪਹਿਲਾਂ', img: '/img/index_800x400-image27.jpg' },
                  { title: 'ਸਾਈਕਲਿੰਗ ਮੁਕਾਬਲੇ', time: '1 ਘੰਟਾ ਪਹਿਲਾਂ', img: '/img/index_800x400-image28.jpg' },
                  { title: 'ਹਾਕੀ ਲੀਗ ਹਾਈਲਾਈਟਸ', time: '1 ਘੰਟਾ ਪਹਿਲਾਂ', img: '/img/index_800x400-image29.jpg' },
                  { title: 'ਸੂਬਾਈ ਅਥਲੈਟਿਕਸ ਮੀਟ', time: '54 ਮਿੰਟ ਪਹਿਲਾਂ', img: '/img/index_800x400-image30.jpg' },
                  { title: 'ਬਾਸਕਟਬਾਲ ਪਲੇਆਫਸ', time: '6 ਘੰਟੇ ਪਹਿਲਾਂ', img: '/img/index_800x400-image31.jpg' },
                  { title: 'ਟੈਨਿਸ ਓਪਨ ਮੈਚ', time: '1 ਘੰਟਾ ਪਹਿਲਾਂ', img: '/img/index_800x400-image10.jpg' }
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
                <a href="#headlines">ਮੁੱਖ ਸੁਰਖੀਆਂ</a>
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
                  <h3>ਚੰਡੀਗੜ੍ਹ / ਅੰਮ੍ਰਿਤਸਰ / ਦਿੱਲੀ</h3>
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
                  <div id="type" className="desc-text">ਸਾਫ਼ ਅਸਮਾਨ ਅਤੇ ਖਿੜੀ ਧੁੱਪ</div>
                  <i className="wi wi-humidity"></i>
                  <div id="humidity" className="desc-text">ਨਮੀ: 48%</div>
                  <i className="wi wi-strong-wind"></i>
                  <div id="wind" className="desc-text">ਹਵਾ: 9 ਕਿਲੋਮੀਟਰ/ਘੰਟਾ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 24h News On-Air Banner Ticker */}
        <div className="outer" style={{ marginTop: '25px' }}>
          <div className="breaking-ribbon">
            <h5>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਆਨ-ਏਅਰ</h5>
          </div>
          <div className="news-on-air">
            <ul>
              <li>
                <h4>
                  <i className="fa fa-video-camera" aria-hidden="true" style={{ marginRight: '8px', color: '#e52d27' }}></i>
                  <a href="#live-stream">ਪੰਜਾਬ ਫਾਈਲਜ਼ 24/7 ਐਚ.ਡੀ. ਕੁਆਲਿਟੀ ਵਿੱਚ ਲਾਈਵ ਆਨਲਾਈਨ ਦੇਖੋ</a>
                </h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
