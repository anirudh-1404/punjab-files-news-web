import React, { useState, useEffect } from 'react';

const scheduleSlides = [
  {
    time: '18:00',
    title: 'ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੀਆਂ ਖ਼ਬਰਾਂ',
    desc: 'ਕੌਮਾਂਤਰੀ ਪੱਧਰ ’ਤੇ ਵਿਸ਼ਵ ਅਰਥਵਿਵਸਥਾ ਅਤੇ ਸਿਆਸੀ ਹਾਲਾਤ ਬਾਰੇ ਵਿਸ਼ੇਸ਼ ਵਿਸ਼ਲੇਸ਼ਣ।',
    img: '/img/sidebar-schedule_slider-image01.jpg'
  },
  {
    time: '18:45',
    title: 'ਖੇਡਾਂ ਦੀ ਦੁਨੀਆ',
    desc: 'ਕ੍ਰਿਕਟ, ਕਬੱਡੀ ਅਤੇ ਫੁੱਟਬਾਲ ਦੇ ਤਾਜ਼ਾ ਮੈਚਾਂ ਦੇ ਨਤੀਜੇ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਇੰਟਰਵਿਊ।',
    img: '/img/sidebar-schedule_slider-image02.jpg'
  },
  {
    time: '22:00',
    title: 'ਅੱਜ ਦੀ ਵੱਡੀ ਬਹਿਸ',
    desc: 'ਪੰਜਾਬ ਦੇ ਭਖਦੇ ਮੁੱਦਿਆਂ ’ਤੇ ਸੀਨੀਅਰ ਐਡੀਟਰਾਂ ਨਾਲ ਸਿੱਧੀ ਅਤੇ ਬੇਬਾਕ ਚਰਚਾ।',
    img: '/img/sidebar-schedule_slider-image03.jpg'
  }
];

export default function WorldwideNewsModule() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % scheduleSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = scheduleSlides[currentSlide];

  return (
    <section className="module highlight">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col Content */}
          <div className="col-md-8">
            <div className="news">
              <div className="module-title">
                <h3 className="title">
                  <span className="bg-11">ਵਿਸ਼ਵ ਪੱਧਰੀ ਖ਼ਬਰਾਂ</span>
                </h3>
                <h3 className="subtitle">ਕੌਮਾਂਤਰੀ ਮਾਮਲੇ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟਾਂ</h3>
              </div>

              {/* Item 1 */}
              <div className="item">
                <div className="item-image-3">
                  <a className="img-link" href="#world">
                    <img className="img-responsive img-full" src="/img/index_800x400-image14.jpg" alt="Space Probe" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#world">
                        <strong>ਪੁਲਾੜ ਖੋਜ</strong> ਵਿੱਚ ਨਵਾਂ ਮੀਲ ਪੱਥਰ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong> 5 ਅਕਤੂਬਰ 2026</strong></span>
                    </a>
                  </p>
                  <p>
                    <a href="#world">
                      ਵਿਗਿਆਨੀਆਂ ਨੇ ਜੁਪੀਟਰ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਨਵੇਂ ਉਪਗ੍ਰਹਿ ਦੀ ਸਫ਼ਲ ਪਲੇਸਮੈਂਟ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਹੈ।
                    </a>
                  </p>
                  <p>
                    <a href="#world">
                      ਨਵੇਂ ਡੇਟਾ ਰਾਹੀਂ ਬ੍ਰਹਿਮੰਡ ਅਤੇ ਗ੍ਰਹਿਆਂ ਦੇ ਰਹੱਸਾਂ ਬਾਰੇ ਅਹਿਮ ਜਾਣਕਾਰੀਆਂ ਸਾਹਮਣੇ ਆਈਆਂ ਹਨ।
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="item">
                <div className="item-image-3">
                  <a className="img-link" href="#world">
                    <img className="img-responsive img-full" src="/img/index_800x400-image15.jpg" alt="Community Dialogue" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#world">
                        <strong>ਕੌਮਾਂਤਰੀ ਸੰਵਾਦ</strong> ਅਤੇ ਲੋਕਤੰਤਰੀ ਨੀਤੀਆਂ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong>1 ਘੰਟਾ ਪਹਿਲਾਂ</strong></span>
                    </a>
                  </p>
                  <p>
                    <a href="#world">
                      ਸਮਾਜਿਕ ਸੰਗਠਨਾਂ ਅਤੇ ਵਿਸ਼ਵ ਆਗੂਆਂ ਵੱਲੋਂ ਆਰਥਿਕ ਸਮਾਨਤਾ ਤੇ ਟਿਕਾਊ ਵਿਕਾਸ ਲਈ ਸਾਂਝੇ ਯਤਨ।
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="item">
                <div className="item-image-3">
                  <a className="img-link" href="#world">
                    <img className="img-responsive img-full" src="/img/index_800x400-image16.jpg" alt="Orbital Research" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#world">
                        <strong>ਗਲੋਬਲ ਸੈਟੇਲਾਈਟ</strong> ਅਤੇ ਮੌਸਮ ਨਿਗਰਾਨੀ ਸਿਸਟਮ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong>1 ਘੰਟਾ ਪਹਿਲਾਂ</strong></span>
                    </a>
                  </p>
                  <p>
                    <a href="#world">
                      ਵਾਤਾਵਰਨ ਵਿੱਚ ਆ ਰਹੇ ਬਦਲਾਵਾਂ ਅਤੇ ਤਾਪਮਾਨ 'ਤੇ ਨਜ਼ਰ ਰੱਖਣ ਲਈ ਅਤਿ-ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ।
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4-col Sidebar */}
          <div className="col-md-4">
            {/* TV Schedule */}
            <div className="sidebar-schedule">
              <div className="block-title-2">
                <h3>
                  <a href="#tv-schedule">
                    <strong>ਲਾਈਵ ਟੀਵੀ</strong> ਸ਼ਡਿਊਲ
                  </a>
                </h3>
              </div>
              <div id="sidebar-schedule-slider" className="owl-carousel" style={{ display: 'block', opacity: 1 }}>
                <div className="sidebar-schedule-slide">
                  <div className="sidebar-schedule-slider-layer full">
                    <a href="#tv-schedule">
                      <div className="content">
                        <h3 className="hour-tag">{slide.time}</h3>
                        <h4 className="sidebar-show-title bg-1">{slide.title}</h4>
                        <p>{slide.desc}</p>
                      </div>
                      <img src={slide.img} alt={slide.title} style={{ width: '100%', height: 'auto' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Video News */}
            <div className="title-style01">
              <h3>
                <strong>ਵੀਡੀਓ</strong> ਖ਼ਬਰਾਂ
              </h3>
            </div>
            <div className="sidebar-block">
              <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://player.vimeo.com/video/66388105?title=0&byline=0&portrait=0"
                  className="video"
                  title="Sidebar Video News"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                ></iframe>
              </div>
              <div className="sidebar-content">
                <p>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡਿਜੀਟਲ ਸਟੂਡੀਓ ਵੱਲੋਂ ਤਿਆਰ ਕੀਤੀਆਂ ਵਿਸ਼ੇਸ਼ ਵੀਡੀਓ ਰਿਪੋਰਟਾਂ ਅਤੇ ਖੋਜੀ ਡਾਕੂਮੈਂਟਰੀਆਂ।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
