import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';

export default function EntertainmentModule() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadEntertainmentArticles = async () => {
      try {
        const res = await articleAPI.getPublished({ category: 'art-entertainment' });
        if (isMounted && res && res.data && res.data.length > 0) {
          const fromApi = res.data.map((item) => ({
            id: item.slug || item._id,
            slug: item.slug,
            title: item.title,
            category: item.category === 'art-entertainment' || item.category === 'entertainment' ? 'ਮਨੋਰੰਜਨ' : item.category,
            time: item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString('pa-IN', { hour: '2-digit', minute: '2-digit' }) : 'ਤਾਜ਼ਾ',
            img: item.featuredImage || '/img/art-entertainment_370x185-image04.jpg',
            desc: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : '')
          }));
          setArticles(fromApi.slice(0, 4));
          return;
        }
      } catch (err) {}

      const all = getAllArticles({ category: 'art-entertainment' });
      if (isMounted) {
        if (all && all.length > 0) {
          const mapped = all.slice(0, 4).map((item) => ({
            id: item.slug || item.id,
            slug: item.slug,
            title: item.title,
            category: 'ਮਨੋਰੰਜਨ',
            time: item.publicationTime || 'ਤਾਜ਼ਾ',
            img: item.featuredImage || '/img/art-entertainment_370x185-image04.jpg',
            desc: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : '')
          }));
          setArticles(mapped);
        } else {
          setArticles([]);
        }
      }
    };

    loadEntertainmentArticles();
    window.addEventListener('storage', loadEntertainmentArticles);
    window.addEventListener('punjab_articles_updated', loadEntertainmentArticles);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadEntertainmentArticles);
      window.removeEventListener('punjab_articles_updated', loadEntertainmentArticles);
    };
  }, []);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="module" id="art-entertainment" style={{ backgroundColor: '#fcfdfe', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਮਨੋਰੰਜਨ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਪੰਜਾਬੀ ਸਿਨੇਮਾ, ਲੋਕ ਸੰਗੀਤ, ਥੀਏਟਰ ਅਤੇ ਵਿਰਸਾ (Cinema & Entertainment)
            </h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#b71c1c', backgroundColor: 'rgba(183, 28, 28, 0.08)', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-film" style={{ marginRight: '4px' }}></i> ਸਿਨੇਮਾ ਤੇ ਕਲਾ
            </span>
          </div>
        </div>

        {/* 4-Column Entertainment News Cards */}
        <div className="row">
          {articles.map((item) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={item.id} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#edf2f7' }}>
                  <a href={`/news/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/art-entertainment_370x185-image04.jpg';
                      }}
                    />
                  </a>
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#b71c1c',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '3px'
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600' }}>
                      <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                      {item.time}
                    </span>
                  </div>

                  {/* Solid Bold Black Headline */}
                  <h4
                    style={{
                      margin: '2px 0 6px 0',
                      fontSize: '14px',
                      fontWeight: '800',
                      lineHeight: '1.35',
                      color: '#000000'
                    }}
                  >
                    <a href={`/news/${item.id}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}>
                      {item.title}
                    </a>
                  </h4>

                  {/* Summary */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      lineHeight: '1.55',
                      color: '#111111',
                      fontWeight: '500',
                      marginTop: 'auto'
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
