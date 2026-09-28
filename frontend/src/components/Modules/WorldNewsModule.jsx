import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';

export default function WorldNewsModule() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const labels = ['label-1', 'label-3', 'label-5', 'label-2'];

    const loadWorldArticles = async () => {
      try {
        const res = await articleAPI.getPublished({ category: 'world' });
        if (isMounted && res && res.data && res.data.length > 0) {
          const fromApi = res.data.map((item, idx) => ({
            title: item.title,
            desc: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : item.title),
            category: item.category === 'world' ? 'ਕੌਮਾਂਤਰੀ' : item.category,
            labelClass: labels[idx % labels.length],
            img: item.featuredImage || '/img/index_800x400-image01.jpg',
            link: `/news/${item.slug || item._id}`
          }));

          setItems(fromApi.slice(0, 4));
          return;
        }
      } catch (err) {
        // Fallback
      }

      const all = getAllArticles({ category: 'world' });
      if (isMounted) {
        if (all && all.length > 0) {
          const mapped = all.slice(0, 4).map((item, idx) => ({
            title: item.title,
            desc: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : item.title),
            category: item.category === 'world' ? 'ਕੌਮਾਂਤਰੀ' : item.category,
            labelClass: labels[idx % labels.length],
            img: item.featuredImage || '/img/index_800x400-image01.jpg',
            link: `/news/${item.slug || item.id}`
          }));
          setItems(mapped);
        } else {
          setItems([]);
        }
      }
    };

    loadWorldArticles();
    window.addEventListener('storage', loadWorldArticles);
    window.addEventListener('punjab_articles_updated', loadWorldArticles);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadWorldArticles);
      window.removeEventListener('punjab_articles_updated', loadWorldArticles);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  const col1 = items.slice(0, 2);
  const col2 = items.slice(2, 4);

  return (
    <section className="module highlight" id="world" style={{ paddingTop: '14px', paddingBottom: '20px' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਦੇਸ਼-ਵਿਦੇਸ਼</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">ਰਾਸ਼ਟਰੀ ਅਤੇ ਕੌਮਾਂਤਰੀ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ (National & World News)</h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1c2d5a', backgroundColor: '#edf2f7', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-globe" style={{ marginRight: '4px' }}></i> ਗਲੋਬਲ ਅੱਪਡੇਟਸ
            </span>
          </div>
        </div>
        <div className="row no-gutter">
          {/* Column 1 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {col1.map((item, idx) => {
                const isExternal = item.link && item.link.startsWith('http');
                return (
                  <div className="item" key={idx}>
                    <div className="item-image-1">
                      <a className="img-link" href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                        <img
                          className="img-responsive img-full"
                          src={item.img}
                          alt={item.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/index_800x400-image01.jpg';
                          }}
                        />
                      </a>
                      <span>
                        <a className={item.labelClass} href={item.link}>{item.category}</a>
                      </span>
                    </div>
                    <div className="item-content">
                      <div className="title-left title-style04 underline04">
                        <h3>
                          <a href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                            <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                          </a>
                        </h3>
                      </div>
                      <p>
                        <a href={item.link} className="external-link" {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                          {item.desc}
                        </a>
                      </p>
                      <div>
                        <a href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                          <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {col2.map((item, idx) => {
                const isExternal = item.link && item.link.startsWith('http');
                return (
                  <div className="item" key={idx}>
                    <div className="item-image-1">
                      <a className="img-link" href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                        <img
                          className="img-responsive img-full"
                          src={item.img}
                          alt={item.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/index_800x400-image02.jpg';
                          }}
                        />
                      </a>
                      <span>
                        <a className={item.labelClass} href={item.link}>{item.category}</a>
                      </span>
                    </div>
                    <div className="item-content">
                      <div className="title-left title-style04 underline04">
                        <h3>
                          <a href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                            <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                          </a>
                        </h3>
                      </div>
                      <p>
                        <a href={item.link} className="external-link" {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                          {item.desc}
                        </a>
                      </p>
                      <div>
                        <a href={item.link} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
                          <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
