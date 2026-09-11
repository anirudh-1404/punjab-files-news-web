import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FixedNavbar() {
  const [megaSlide, setMegaSlide] = useState(0);

  const megaSlides = [
    { img: '/img/menu_slide-image01.jpg', title: 'ਤਸਵੀਰਾਂ ਵਿੱਚ ਖ਼ਬਰਾਂ 1' },
    { img: '/img/menu_slide-image02.jpg', title: 'ਤਸਵੀਰਾਂ ਵਿੱਚ ਖ਼ਬਰਾਂ 2' },
    { img: '/img/menu_slide-image03.jpg', title: 'ਤਸਵੀਰਾਂ ਵਿੱਚ ਖ਼ਬਰਾਂ 3' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMegaSlide((prev) => (prev + 1) % megaSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [megaSlides.length]);

  return (
    <div className="navbar" id="fixed-navbar">
      {/* Main Red Navbar Menu with Punjabi Categories */}
      <div className="main-menu nav navbar-collapse collapse in" id="fixed-navbar-toggle">
        <div className="container">
          <ul className="nav navbar-nav">
            <li className="active">
              <Link to="/">ਮੁੱਖ ਪੰਨਾ</Link>
            </li>

            {/* Dedicated Punjab Section with 3 Regions */}
            <li className="dropdown">
              <a href="#punjab" className="dropdown-toggle" data-toggle="dropdown">
                ਪੰਜਾਬ
              </a>
              <ul className="dropdown-menu">
                <li><a href="#punjab">ਮਾਝਾ (Majha)</a></li>
                <li><a href="#punjab">ਮਾਲਵਾ (Malwa)</a></li>
                <li><a href="#punjab">ਦੋਆਬਾ (Doaba)</a></li>
              </ul>
            </li>

            {/* Dedicated Religion Section */}
            <li>
              <a href="#religion">ਧਰਮ</a>
            </li>

            <li>
              <a href="#world">ਦੇਸ਼-ਵਿਦੇਸ਼</a>
            </li>
            <li>
              <a href="#sport">ਖੇਡਾਂ</a>
            </li>
            <li>
              <a href="#health">ਸਿਹਤ</a>
            </li>
            <li>
              <a href="#travel">ਸੈਰ-ਸਪਾਟਾ</a>
            </li>
            <li>
              <a href="#art-entertainment">ਮਨੋਰੰਜਨ</a>
            </li>
            <li>
              <a href="#live-tv">ਲਾਈਵ ਟੀਵੀ</a>
            </li>

            {/* More Dropdown */}
            <li className="dropdown">
              <a href="#more" className="dropdown-toggle" data-toggle="dropdown">
                ਹੋਰ
              </a>
              <ul className="dropdown-menu">
                <li><a href="#coming-soon">ਜਲਦ ਆ ਰਿਹਾ ਹੈ</a></li>
                <li><a href="#autos">ਆਟੋ / ਗੱਡੀਆਂ</a></li>
                <li><a href="#deals">ਵਪਾਰ ਤੇ ਆਫਰ</a></li>
                <li><a href="#environment">ਵਾਤਾਵਰਨ</a></li>
                <li><a href="#about-us">ਸਾਡੇ ਬਾਰੇ</a></li>
              </ul>
            </li>

            {/* Pages Dropdown */}
            <li className="dropdown">
              <a href="#pages" className="dropdown-toggle" data-toggle="dropdown">
                ਪੰਨੇ
              </a>
              <ul className="dropdown-menu">
                <li><a href="#single-post">ਸਿੰਗਲ ਪੋਸਟ</a></li>
                <li><a href="#404">404 ਗ਼ਲਤੀ ਪੰਨਾ</a></li>
                <li><a href="#shortcodes">ਸ਼ਾਰਟਕੋਡ</a></li>
                <li><a href="#video">ਵੀਡੀਓ</a></li>
                <li><a href="#video-full">ਫੁੱਲ ਸਕ੍ਰੀਨ ਵੀਡੀਓ</a></li>
              </ul>
            </li>

            {/* Contact Dropdown */}
            <li className="dropdown">
              <Link to="/contact" className="dropdown-toggle" data-toggle="dropdown">
                ਸੰਪਰਕ
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/contact">ਸੰਪਰਕ ਕਰੋ (Contact Us)</Link></li>
                <li><Link to="/admin">ਨਿਊਜ਼ ਪਬਲਿਸ਼ਰ CMS (Admin)</Link></li>
              </ul>
            </li>

            {/* Mega Dropdown */}
            <li className="dropdown mega-dropdown">
              <a href="#mega" className="dropdown-toggle" data-toggle="dropdown">
                ਮੈਗਾ ਮੇਨੂ
              </a>
              <ul className="dropdown-menu mega-dropdown-menu">
                {/* Column 1: Carousel Slider */}
                <li className="col-sm-4">
                  <h3 className="title">ਤਸਵੀਰਾਂ ਵਿੱਚ ਪੰਜਾਬ ਫਾਈਲਜ਼</h3>
                  <div className="nav-slider carousel slide slide-carousel" style={{ position: 'relative' }}>
                    <ol className="carousel-indicators">
                      {megaSlides.map((_, i) => (
                        <li
                          key={i}
                          className={megaSlide === i ? 'active' : ''}
                          onClick={() => setMegaSlide(i)}
                          style={{ cursor: 'pointer' }}
                        ></li>
                      ))}
                    </ol>
                    <div className="carousel-inner">
                      <div className="item active">
                        <a href="#picture">
                          <img
                            src={megaSlides[megaSlide].img}
                            alt={megaSlides[megaSlide].title}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                        </a>
                      </div>
                    </div>
                    <a
                      className="left carousel-control"
                      href="#prev"
                      onClick={(e) => {
                        e.preventDefault();
                        setMegaSlide((prev) => (prev === 0 ? megaSlides.length - 1 : prev - 1));
                      }}
                    >
                      <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    </a>
                    <a
                      className="right carousel-control"
                      href="#next"
                      onClick={(e) => {
                        e.preventDefault();
                        setMegaSlide((prev) => (prev + 1) % megaSlides.length);
                      }}
                    >
                      <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    </a>
                  </div>
                </li>

                {/* Column 2: Latest News Media List */}
                <li className="col-sm-4">
                  <h3 className="title">ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ</h3>
                  <ul className="media-list">
                    <li className="media">
                      <a className="pull-right" href="#news">
                        <img className="img-responsive" alt="" src="/img/menu_small-image01.jpg" />
                      </a>
                      <div className="media-body">
                        <p>
                          <a href="#news">
                            <span className="bg-1">ਖ਼ਬਰਾਂ</span>
                          </a>
                          <a href="#news">ਪੰਜਾਬ ਸਰਕਾਰ ਵੱਲੋਂ ਨਵੀਆਂ ਵਿਕਾਸ ਯੋਜਨਾਵਾਂ ਦਾ ਐਲਾਨ...</a>
                        </p>
                      </div>
                    </li>
                    <li className="media">
                      <a className="pull-right" href="#sport">
                        <img src="/img/menu_small-image02.jpg" alt="" className="img-image media-object" />
                      </a>
                      <div className="media-body">
                        <p>
                          <a href="#sport">
                            <span className="bg-4">ਖੇਡਾਂ</span>
                          </a>
                          <a href="#sport">ਕਬੱਡੀ ਅਤੇ ਕ੍ਰਿਕਟ ਟੂਰਨਾਮੈਂਟ ਦੀਆਂ ਤਿਆਰੀਆਂ ਮੁਕੰਮਲ...</a>
                        </p>
                      </div>
                    </li>
                    <li className="media">
                      <a className="pull-right" href="#health">
                        <img src="/img/menu_small-image03.jpg" alt="" className="img-image media-object" />
                      </a>
                      <div className="media-body">
                        <p>
                          <a href="#health">
                            <span className="bg-2">ਸਿਹਤ</span>
                          </a>
                          <a href="#health">ਸਿਹਤਮੰਦ ਜੀਵਨ ਸ਼ੈਲੀ ਲਈ ਮਾਹਿਰ ਡਾਕਟਰਾਂ ਦੇ ਅਹਿਮ ਸੁਝਾਅ...</a>
                        </p>
                      </div>
                    </li>
                    <li className="media">
                      <a className="pull-right" href="#lifestyle">
                        <img src="/img/menu_small-image04.jpg" alt="" className="img-image media-object" />
                      </a>
                      <div className="media-body">
                        <p>
                          <a href="#lifestyle">
                            <span className="bg-9">ਜੀਵਨ ਸ਼ੈਲੀ</span>
                          </a>
                          <a href="#lifestyle">ਪੰਜਾਬੀ ਵਿਰਸਾ ਅਤੇ ਸੱਭਿਆਚਾਰ ਦੀ ਵਿਸ਼ੇਸ਼ ਪੇਸ਼ਕਸ਼...</a>
                        </p>
                      </div>
                    </li>
                  </ul>
                </li>

                {/* Column 3: Video */}
                <li className="col-sm-4">
                  <h3 className="title">ਖ਼ਾਸ ਵੀਡੀਓ</h3>
                  <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src="https://player.vimeo.com/video/100192146?title=0&byline=0&portrait=0"
                      className="video"
                      title="Featured Video"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    ></iframe>
                  </div>
                </li>

                {/* Bottom Row: About Us & Follow Us */}
                <li className="col-sm-8">
                  <h3 className="title">ਸਾਡੇ ਬਾਰੇ</h3>
                  <p>
                    <a href="#about-us">
                      <strong>ਪੰਜਾਬ ਫਾਈਲਜ਼ (Punjab Files)</strong> 24 ਘੰਟੇ ਨਿਰਪੱਖ, ਭਰੋਸੇਯੋਗ ਅਤੇ ਨਵੀਨਤਮ ਖ਼ਬਰਾਂ ਪ੍ਰਦਾਨ ਕਰਨ ਵਾਲਾ ਪ੍ਰਮੁੱਖ ਡਿਜੀਟਲ ਨਿਊਜ਼ ਪਲੇਟਫਾਰਮ ਹੈ।
                    </a>
                  </p>
                </li>

                <li className="col-sm-4">
                  <h3 className="title">ਸਾਡੇ ਨਾਲ ਜੁੜੋ</h3>
                  <div className="menu-social-icons">
                    <ul>
                      <li><a href="#" className="facebook"><i className="fa fa-facebook"></i></a></li>
                      <li><a href="#" className="youtube"><i className="fa fa-youtube"></i></a></li>
                      <li><a href="#" className="twitter"><i className="fa fa-twitter"></i></a></li>
                      <li><a href="#" className="linkedin"><i className="fa fa-linkedin"></i></a></li>
                      <li><a href="#" className="pinterest"><i className="fa fa-pinterest"></i></a></li>
                      <li><a href="#" className="google-plus"><i className="fa fa-google-plus"></i></a></li>
                      <li><a href="#" className="rss"><i className="fa fa-rss"></i></a></li>
                      <li><a href="#" className="tumblr"><i className="fa fa-tumblr"></i></a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
