import React from 'react';
import { Link } from 'react-router-dom';
import blackLogo from '../../assets/punjab-files-black-logo.jpeg';

export default function Footer() {
  const newsPosts = [
    { title: 'ਪੰਜਾਬ ਵਿੱਚ ਨਵੇਂ ਪ੍ਰਾਜੈਕਟਾਂ ਅਤੇ ਵਿਕਾਸ ਯੋਜਨਾਵਾਂ ਦਾ ਰੋਡਮੈਪ ਤਿਆਰ।', img: '/img/index_370x185-image01.jpg' },
    { title: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨੀ ਭਲਾਈ ਨੀਤੀਆਂ ਬਾਰੇ ਵਿਸ਼ੇਸ਼ ਜ਼ਮੀਨੀ ਰਿਪੋਰਟ।', img: '/img/index_370x185-image14.jpg' },
    { title: 'ਸਿਹਤ ਸੰਭਾਲ ਅਤੇ ਪੇਂਡੂ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਨਵੀਆਂ ਸਹੂਲਤਾਂ ਸ਼ੁਰੂ।', img: '/img/food_370x185-image05.jpg' },
    { title: 'ਪੰਜਾਬੀ ਸਾਹਿਤ, ਨਾਟਕ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਮੇਲਿਆਂ ਦੀਆਂ ਰੌਣਕਾਂ।', img: '/img/index_370x185-image03.jpg' }
  ];

  const watchListenPosts = [
    { title: 'ਪੰਜਾਬੀ ਵਿਰਸਾ ਅਤੇ ਸੰਗੀਤ ਲੜੀ: ਪ੍ਰੰਪਰਾਗਤ ਲੋਕ ਧੁਨਾਂ।', img: '/img/art-entertainment_370x185-image04.jpg' },
    { title: 'ਲਾਈਵ ਸਟ੍ਰੀਮਿੰਗ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਇੰਟਰਵਿਊ ਹੁਣ ਉਪਲਬਧ ਹਨ।', img: '/img/index_370x185-image15.jpg' },
    { title: 'ਹਫ਼ਤਾਵਾਰੀ ਪੋਡਕਾਸਟ: ਸਮਾਜਿਕ ਤੇ ਆਰਥਿਕ ਮੁੱਦਿਆਂ ਤੇ ਚਰਚਾ।', img: '/img/index_370x185-image08.jpg' },
    { title: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਲਾਈਵ ਨਿਊਜ਼ ਬੁਲੇਟਿਨ ਹਰ ਪਲ ਤੁਹਾਡੇ ਨਾਲ।', img: '/img/index_370x185-image16.jpg' }
  ];

  // Tags matching the Navbar categories and dropdown sections
  const tags = [
    { name: 'ਮੁੱਖ ਪੰਨਾ', href: '/' },
    { name: 'ਪੰਜਾਬ', href: '#punjab' },
    { name: 'ਧਰਮ', href: '#religion' },
    { name: 'ਦੇਸ਼-ਵਿਦੇਸ਼', href: '#world' },
    { name: 'ਖੇਡਾਂ', href: '#sport' },
    { name: 'ਸਿਹਤ', href: '#health' },
    { name: 'ਸੈਰ-ਸਪਾਟਾ', href: '#travel' },
    { name: 'ਮਨੋਰੰਜਨ', href: '#art-entertainment' },
    { name: 'ਲਾਈਵ ਟੀਵੀ', href: '#live-tv' },
    { name: 'ਹੋਰ', href: '#more' },
    { name: 'ਪੰਨੇ', href: '#pages' },
    { name: 'ਸੰਪਰਕ', href: '/contact' },
    { name: 'ਮੇਗਾ ਮੇਨੂ', href: '#mega' },
    { name: 'ਮਾਝਾ', href: '#punjab' },
    { name: 'ਮਾਲਵਾ', href: '#punjab' },
    { name: 'ਦੋਆਬਾ', href: '#punjab' },
    { name: 'ਆਟੋ / ਗੱਡੀਆਂ', href: '#autos' },
    { name: 'ਵਪਾਰ ਤੇ ਆਫਰ', href: '#deals' },
    { name: 'ਵਾਤਾਵਰਨ', href: '#environment' }
  ];

  return (
    <footer id="footer" style={{ backgroundColor: '#000000', background: '#000000' }}>
      <div id="parallax-section2" style={{ backgroundColor: '#000000', background: '#000000', backgroundImage: 'none' }}>
        <div className="bg overlay" style={{ backgroundColor: '#000000', background: '#000000', backgroundImage: 'none' }}>
          <div className="container" style={{ paddingTop: '50px', paddingBottom: '40px' }}>
            <div className="row no-gutter">
              {/* Column 1: About Us with Punjab Files Black Logo */}
              <div className="col-sm-6 col-md-3">
                <h3 className="title-left title-style03 underline03">ਸਾਡੇ ਬਾਰੇ</h3>
                <p className="about-us">
                  ਪੰਜਾਬ ਫਾਈਲਜ਼ 24 ਘੰਟੇ ਨਿਰਪੱਖ, ਸੱਚੀਆਂ ਅਤੇ ਭਰੋਸੇਯੋਗ ਖ਼ਬਰਾਂ ਪਹੁੰਚਾਉਣ ਲਈ ਵਚਨਬੱਧ ਹੈ। ਅਸੀਂ ਤੁਹਾਨੂੰ ਜ਼ਮੀਨੀ ਹਕੀਕਤਾਂ, ਤਾਜ਼ਾ ਸਮਾਚਾਰ ਅਤੇ ਸਾਰਥਕ ਵਿਸ਼ਲੇਸ਼ਣ ਮੁਹੱਈਆ ਕਰਵਾਉਂਦੇ ਹਾਂ।
                </p>
                <div className="site-logo" style={{ marginTop: '18px' }}>
                  <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <img
                      src={blackLogo}
                      alt="Punjab Files Logo"
                      style={{
                        height: '115px',
                        maxHeight: '125px',
                        maxWidth: '280px',
                        width: 'auto',
                        objectFit: 'contain',
                        borderRadius: '6px',
                        display: 'block',
                        marginBottom: '10px'
                      }}
                    />
                  </Link>
                </div>
              </div>

              {/* Column 2: News Posts */}
              <div className="col-sm-6 col-md-3">
                <h3 className="title-left title-style03 underline03">ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ</h3>
                <div className="footer-post">
                  <ul>
                    {newsPosts.map((post, idx) => (
                      <li key={idx}>
                        <div className="item">
                          <div className="item-image">
                            <a className="img-link" href="#news">
                              <img className="img-responsive img-full" src={post.img} alt="" />
                            </a>
                          </div>
                          <div className="item-content">
                            <p className="ellipsis">
                              <a href="#news">{post.title}</a>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: Watch + Listen */}
              <div className="col-sm-6 col-md-3">
                <h3 className="title-left title-style03 underline03">ਦੇਖੋ ਅਤੇ ਸੁਣੋ</h3>
                <div className="footer-post">
                  <ul>
                    {watchListenPosts.map((post, idx) => (
                      <li key={idx}>
                        <div className="item">
                          <div className="item-image">
                            <a className="img-link" href="#watch">
                              <img className="img-responsive img-full" src={post.img} alt="" />
                            </a>
                          </div>
                          <div className="item-content">
                            <p className="ellipsis">
                              <a href="#watch">{post.title}</a>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 4: Tags Cloud matching Navbar */}
              <div className="col-sm-6 col-md-3">
                <h3 className="title-left title-style03 underline03">ਟੈਗਸ</h3>
                <div className="tagcloud">
                  {tags.map((tag, idx) => (
                    tag.href.startsWith('/') ? (
                      <Link to={tag.href} key={idx}>
                        {tag.name}
                      </Link>
                    ) : (
                      <a href={tag.href} key={idx}>
                        {tag.name}
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
