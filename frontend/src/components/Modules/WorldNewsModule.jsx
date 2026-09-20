import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultWorldItems = [
  {
    title: 'ਵਿਸ਼ਵ ਸੰਮੇਲਨ',
    desc: 'ਕੌਮਾਂਤਰੀ ਪੱਧਰ ’ਤੇ ਆਰਥਿਕ ਸਹਿਯੋਗ ਅਤੇ ਵਪਾਰਕ ਸਾਂਝ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ ਲਈ ਅਹਿਮ ਸਮਝੌਤਾ।',
    category: 'ਖ਼ਬਰਾਂ',
    labelClass: 'label-1',
    img: '/img/index_800x400-image01.jpg',
    link: '#news'
  },
  {
    title: 'ਸਿਆਸੀ ਸਰਗਰਮੀਆਂ',
    desc: 'ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ ਦੌਰਾਨ ਜਨਤਕ ਮੁੱਦਿਆਂ ਅਤੇ ਬਜਟ ਅਲਾਟਮੈਂਟ ’ਤੇ ਵਿਸਥਾਰਪੂਰਵਕ ਚਰਚਾ।',
    category: 'ਰਾਜਨੀਤੀ',
    labelClass: 'label-3',
    img: '/img/index_800x400-image02.jpg',
    link: '#politics'
  },
  {
    title: 'ਪੁਲਾੜ ਅਤੇ ਤਕਨਾਲੋਜੀ',
    desc: 'ਵਿਗਿਆਨੀਆਂ ਵੱਲੋਂ ਨਵੇਂ ਪੁਲਾੜ ਮਿਸ਼ਨ ਦੀ ਸਫ਼ਲ ਸ਼ੁਰੂਆਤ, ਖਗੋਲ ਵਿਗਿਆਨ ਵਿੱਚ ਨਵਾਂ ਇਤਿਹਾਸ।',
    category: 'ਵਿਗਿਆਨ',
    labelClass: 'label-5',
    img: '/img/index_800x400-image03.jpg',
    link: '#tech'
  },
  {
    title: 'ਸਿਹਤ ਸੰਭਾਲ ਪ੍ਰੋਗਰਾਮ',
    desc: 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮੈਡੀਕਲ ਸਹੂਲਤਾਂ ਦਾ ਵਿਸਥਾਰ, ਮਾਹਿਰ ਡਾਕਟਰਾਂ ਵੱਲੋਂ ਮੁਫ਼ਤ ਜਾਂਚ ਕੈਂਪ।',
    category: 'ਸਿਹਤ',
    labelClass: 'label-2',
    img: '/img/index_800x400-image04.jpg',
    link: '#health'
  }
];

export default function WorldNewsModule() {
  const [items, setItems] = useState(defaultWorldItems);

  useEffect(() => {
    let isMounted = true;
    const labels = ['label-1', 'label-3', 'label-5', 'label-2'];
    const cats = ['ਖ਼ਬਰਾਂ', 'ਰਾਜਨੀਤੀ', 'ਵਿਗਿਆਨ', 'ਸਿਹਤ'];

    const loadWorldArticles = async () => {
      try {
        const res = await articleAPI.getPublished({ category: 'world' });
        if (isMounted && res && res.data && res.data.length > 0) {
          const fromApi = res.data.map((item, idx) => ({
            title: item.title,
            desc: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : item.title),
            category: item.category === 'world' ? 'ਕੌਮਾਂਤਰੀ' : item.category,
            labelClass: labels[idx % labels.length],
            img: item.featuredImage || defaultWorldItems[idx % defaultWorldItems.length].img,
            link: `/news/${item.slug || item._id}`
          }));

          const combined = [...fromApi, ...defaultWorldItems.slice(fromApi.length)].slice(0, 4);
          setItems(combined);
          return;
        }
      } catch (err) {
        // Fallback
      }

      getLivePunjabiNews().then((data) => {
        if (isMounted && data && data.world && data.world.length >= 4) {
          const mapped = data.world.slice(0, 4).map((item, idx) => ({
            title: item.title,
            desc: item.desc || item.title,
            category: cats[idx] || item.category,
            labelClass: labels[idx] || 'label-1',
            img: item.img || defaultWorldItems[idx].img,
            link: item.link
          }));
          setItems(mapped);
        }
      });
    };

    loadWorldArticles();
    return () => { isMounted = false; };
  }, []);

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
