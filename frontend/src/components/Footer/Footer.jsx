import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blackLogo from '../../assets/punjab-files-black-logo.jpeg';
import { articleAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';

export default function Footer() {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadFooterPosts = async () => {
      try {
        const res = await articleAPI.getPublished({ limit: 4 });
        if (isMounted && res && res.data && res.data.length > 0) {
          setLatestPosts(res.data.slice(0, 4));
          return;
        }
      } catch (e) {}

      const local = getAllArticles();
      if (isMounted) {
        setLatestPosts(local.slice(0, 4));
      }
    };

    loadFooterPosts();
    window.addEventListener('storage', loadFooterPosts);
    window.addEventListener('punjab_articles_updated', loadFooterPosts);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadFooterPosts);
      window.removeEventListener('punjab_articles_updated', loadFooterPosts);
    };
  }, []);

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
    { name: 'ਸੰਪਰਕ', href: '/contact' },
    { name: 'ਮਾਝਾ', href: '#punjab' },
    { name: 'ਮਾਲਵਾ', href: '#punjab' },
    { name: 'ਦੋਆਬਾ', href: '#punjab' }
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
                  {latestPosts.length > 0 ? (
                    <ul>
                      {latestPosts.map((post, idx) => (
                        <li key={post.slug || post.id || post._id || idx}>
                          <div className="item">
                            {post.featuredImage && (
                              <div className="item-image">
                                <Link className="img-link" to={`/news/${post.slug || post.id || post._id}`}>
                                  <img className="img-responsive img-full" src={post.featuredImage} alt={post.title} />
                                </Link>
                              </div>
                            )}
                            <div className="item-content">
                              <p className="ellipsis">
                                <Link to={`/news/${post.slug || post.id || post._id}`}>{post.title}</Link>
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                      ਸਾਡੀ ਸੰਪਾਦਕੀ ਟੀਮ ਵੱਲੋਂ ਨਵੀਆਂ ਖ਼ਬਰਾਂ ਜਲਦ ਹੀ ਅੱਪਡੇਟ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ।
                    </p>
                  )}
                </div>
              </div>

              {/* Column 3: Watch + Listen */}
              <div className="col-sm-6 col-md-3">
                <h3 className="title-left title-style03 underline03">ਦੇਖੋ ਅਤੇ ਸੁਣੋ</h3>
                <div className="footer-post">
                  <ul>
                    <li>
                      <div className="item">
                        <div className="item-content" style={{ marginLeft: 0 }}>
                          <p style={{ margin: '0 0 6px' }}>
                            <a href="#live-tv" style={{ color: '#ffffff', fontWeight: '700' }}>
                              <span style={{ color: '#ef4444', marginRight: '6px' }}>●</span> 24x7 ਲਾਈਵ ਟੀਵੀ ਪ੍ਰਸਾਰਣ
                            </a>
                          </p>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਲਾਈਵ ਸਟੂਡੀਓ</span>
                        </div>
                      </div>
                    </li>
                    <li style={{ marginTop: '12px' }}>
                      <div className="item">
                        <div className="item-content" style={{ marginLeft: 0 }}>
                          <p style={{ margin: '0 0 6px' }}>
                            <a href="#main-section" style={{ color: '#ffffff', fontWeight: '700' }}>
                              <i className="fa fa-book" style={{ color: '#f59e0b', marginRight: '6px' }}></i> ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਮੁੱਖ ਵਾਕ
                            </a>
                          </p>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਅੰਮ੍ਰਿਤਸਰ</span>
                        </div>
                      </div>
                    </li>
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
