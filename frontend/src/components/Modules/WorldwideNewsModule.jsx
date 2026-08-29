import React, { useState, useEffect } from 'react';

const scheduleSlides = [
  {
    time: '18:00',
    title: 'Around the World',
    desc: "Global financial transparency and economic consensus urged by economists.",
    img: '/img/sidebar-schedule_slider-image01.jpg'
  },
  {
    time: '18:45',
    title: 'Sport Headlines',
    desc: 'All the latest sports news, match highlights, and athlete interviews.',
    img: '/img/sidebar-schedule_slider-image02.jpg'
  },
  {
    time: '22:00',
    title: 'Happening Now',
    desc: 'Senior anchors take you live to breaking reports wherever news happens.',
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
                  <span className="bg-11">Worldwide 24h News</span>
                </h3>
                <h3 className="subtitle">News in other languages</h3>
              </div>

              {/* Item 1 (French) */}
              <div className="item">
                <div className="item-image-3">
                  <a className="img-link" href="#world">
                    <img className="img-responsive img-full" src="/img/index_800x400-image14.jpg" alt="Space Probe" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3 lang="fr">
                      <a href="#world">
                        <strong>Nouvelle sonde</strong> autour de Jupiter.
                      </a>
                    </h3>
                  </div>
                  <p lang="fr">
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong> 5 October 2026</strong></span>
                    </a>
                  </p>
                  <p lang="fr">
                    <a href="#world">
                      Des signaux transmis par l'engin spatial ont confirmé que la manœuvre s’était déroulée avec succès.
                    </a>
                  </p>
                  <p lang="fr">
                    <a href="#world">
                      L’intensité des ceintures de radiation et l'exploration planétaire révèlent de nouvelles données.
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span lang="fr" className="read-more">Lire la suite</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 2 (Spanish) */}
              <div className="item">
                <div className="item-image-3">
                  <a className="img-link" href="#world">
                    <img className="img-responsive img-full" src="/img/index_800x400-image15.jpg" alt="Community Dialogue" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3 lang="es">
                      <a href="#world">
                        <strong>Diálogo cívico</strong> y avances en políticas públicas.
                      </a>
                    </h3>
                  </div>
                  <p lang="es">
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong>1 hora</strong></span>
                    </a>
                  </p>
                  <p lang="es">
                    <a href="#world">
                      Organizaciones comunitarias presentan propuestas integrales para el desarrollo socioeconómico regional.
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span lang="es" className="read-more">Lee mas</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 3 (International) */}
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
                        <strong>Global Satellite</strong> &amp; Orbital Mapping.
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#world">
                      <i className="fa fa-clock-o"></i> <span className="day"><strong>1 hour ago</strong></span>
                    </a>
                  </p>
                  <p>
                    <a href="#world">
                      International science observatories deploy next-generation monitoring equipment for environmental analysis.
                    </a>
                  </p>
                  <div>
                    <a href="#world">
                      <span className="read-more">Read More</span>
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
                    <strong>TV</strong> Schedule
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
                <strong>Video</strong> News
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
                <p>Punjab Files Digital Studios presents original short documentaries and ground investigative reports.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
