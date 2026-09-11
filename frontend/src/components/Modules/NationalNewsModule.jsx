import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultNewsfeedItems = [
  {
    title: 'ਪੰਜਾਬੀ ਕਲਾ ਅਤੇ ਸੱਭਿਆਚਾਰ',
    desc: 'ਪੰਜਾਬੀ ਨਾਟਕਾਂ ਅਤੇ ਲੋਕ ਕਲਾ ਦਾ ਕੌਮਾਂਤਰੀ ਪੱਧਰ ’ਤੇ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਦਰਸ਼ਨ',
    img: '/img/index_370x185-image01.jpg',
    link: '#feed'
  },
  {
    title: 'ਸੂਰਜੀ ਊਰਜਾ ਅਤੇ ਖੇਤੀਬਾੜੀ',
    desc: 'ਨਵੇਂ ਸੋਲਰ ਪ੍ਰੋਜੈਕਟਾਂ ਨਾਲ ਕਿਸਾਨਾਂ ਦੀ ਬਿਜਲੀ ਲਾਗਤ ਵਿੱਚ ਵੱਡੀ ਕਮੀ',
    img: '/img/index_370x185-image02.jpg',
    link: '#feed'
  },
  {
    title: 'ਨੌਜਵਾਨ ਅਤੇ ਉੱਚ ਸਿੱਖਿਆ',
    desc: 'ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਮੁਫ਼ਤ ਹੁਨਰ ਵਿਕਾਸ ਅਤੇ ਕੰਪਿਊਟਰ ਸਿਖਲਾਈ ਕੇਂਦਰ',
    img: '/img/index_370x185-image03.jpg',
    link: '#feed'
  },
  {
    title: 'ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਅਤੇ ਸੜਕਾਂ',
    desc: 'ਨਵੇਂ ਐਕਸਪ੍ਰੈਸਵੇਅ ਅਤੇ ਹਾਈਵੇਅ ਪ੍ਰਾਜੈਕਟਾਂ ਨਾਲ ਵਪਾਰ ਵਿੱਚ ਤੇਜ਼ੀ',
    img: '/img/index_370x185-image04.jpg',
    link: '#feed'
  },
  {
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾਵਾਂ',
    desc: 'ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਮੁਫ਼ਤ ਦਵਾਈਆਂ ਅਤੇ ਲੈਬ ਟੈਸਟ',
    img: '/img/index_370x185-image05.jpg',
    link: '#feed'
  }
];

const defaultMainItems = [
  {
    title: 'ਵਿਧਾਨ ਸਭਾ ਦੇ ਅਹਿਮ ਫ਼ੈਸਲੇ',
    desc: 'ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੇ ਵਿਸਥਾਰ ਅਤੇ ਨਿਰਵਿਘਨ ਬਿਜਲੀ ਸਪਲਾਈ ਲਈ ਵੱਡਾ ਬਜਟ ਮਨਜ਼ੂਰ।',
    category: 'ਰਾਜਨੀਤੀ',
    labelClass: 'label-2',
    img: '/img/index_800x400-image05.jpg',
    link: '#politics'
  },
  {
    title: 'ਪੇਂਡੂ ਵਿਕਾਸ ਅਤੇ ਸੁਧਾਰ ਯੋਜਨਾਵਾਂ',
    desc: 'ਪਿੰਡਾਂ ਵਿੱਚ ਸਾਫ਼ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਅਤੇ ਸੋਲਰ ਸਟਰੀਟ ਲਾਈਟਾਂ ਲਗਾਉਣ ਦਾ ਕੰਮ ਤੇਜ਼ੀ ਨਾਲ ਸ਼ੁਰੂ।',
    category: 'ਖ਼ਬਰਾਂ',
    labelClass: 'label-1',
    img: '/img/index_800x400-image06.jpg',
    link: '#news'
  },
  {
    title: 'ਕਾਰੋਬਾਰ ਅਤੇ ਨਵੇਂ ਉਦਯੋਗਿਕ ਮੌਕੇ',
    desc: 'ਪੰਜਾਬ ਵਿੱਚ ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ ਅਤੇ ਟੈਕਸਟਾਈਲ ਉਦਯੋਗਾਂ ਨੂੰ ਮਿਲੇਗਾ ਵਿਸ਼ੇਸ਼ ਉਤਸ਼ਾਹ।',
    category: 'ਆਰਥਿਕਤਾ',
    labelClass: 'label-5',
    img: '/img/index_800x400-image07.jpg',
    link: '#business'
  },
  {
    title: 'ਡਿਜੀਟਲ ਤਕਨਾਲੋਜੀ ਅਤੇ ਆਨਲਾਈਨ ਵਪਾਰ',
    desc: 'ਛੋਟੇ ਦੁਕਾਨਦਾਰਾਂ ਅਤੇ ਕਿਸਾਨਾਂ ਲਈ ਆਨਲਾਈਨ ਮੰਡੀ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਸਿੱਧੀ ਵਿਕਰੀ ਦੀ ਸਹੂਲਤ।',
    category: 'ਵਪਾਰ',
    labelClass: 'label-6',
    img: '/img/index_800x400-image08.jpg',
    link: '#business'
  }
];

export default function NationalNewsModule() {
  const [mainItems, setMainItems] = useState(defaultMainItems);
  const [feedItems, setFeedItems] = useState(defaultNewsfeedItems);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (!isMounted || !data) return;

      if (data.punjab && data.punjab.length >= 4) {
        const labels = ['label-2', 'label-1', 'label-5', 'label-6'];
        const cats = ['ਰਾਜਨੀਤੀ', 'ਖ਼ਬਰਾਂ', 'ਆਰਥਿਕਤਾ', 'ਵਪਾਰ'];
        
        const mappedMain = data.punjab.slice(0, 4).map((item, idx) => ({
          title: item.title,
          desc: item.desc || item.title,
          category: cats[idx] || item.category,
          labelClass: labels[idx] || 'label-1',
          img: item.img || defaultMainItems[idx].img,
          link: item.link
        }));
        setMainItems(mappedMain);
      }

      if (data.all && data.all.length >= 5) {
        const mappedFeed = data.all.slice(6, 11).map((item, idx) => ({
          title: item.title,
          desc: item.desc || item.title,
          img: item.img || defaultNewsfeedItems[idx % defaultNewsfeedItems.length].img,
          link: item.link
        }));
        setFeedItems(mappedFeed);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="module" style={{ paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਦੇਸ਼-ਵਿਦੇਸ਼</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਰਾਸ਼ਟਰੀ ਤੇ ਸੂਬਾਈ ਖ਼ਬਰਾਂ (National & Regional In-depth News)
            </h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e3a8a', backgroundColor: '#dbeafe', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-newspaper-o" style={{ marginRight: '4px' }}></i> ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ
            </span>
          </div>
        </div>

        <div className="row no-gutter">
          {/* Main 8-column content */}
          <div className="col-md-8">
            <div className="news">

              {mainItems.map((item, idx) => (
                <div className="item" key={idx}>
                  <div className="item-image-2">
                    <a className="img-link" href={item.link} target="_blank" rel="noreferrer">
                      <img
                        className="img-responsive img-full"
                        src={item.img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/index_800x400-image05.jpg';
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
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                        </a>
                      </h3>
                    </div>
                    <p>
                      <a href={item.link} target="_blank" rel="noreferrer">
                        {item.desc}
                      </a>
                    </p>
                    <div>
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <span className="read-more">{item.category}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4-column sidebar */}
          <div className="col-md-4">
            <div className="sidebar-add-place">
              <a href="#" target="_blank" rel="noreferrer">
                <img src="/img/banner_400x270.jpg" alt="Sidebar Ad" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
              </a>
            </div>

            <div className="block-title-1">
              <h3>
                <a href="#feed">
                  <strong>ਪੰਜਾਬ ਫਾਈਲਜ਼</strong> ਫੀਡ
                </a>
              </h3>
            </div>

            <div className="sidebar-newsfeed">
              <div className="newsfeed-3">
                <ul>
                  {feedItems.map((item, idx) => (
                    <li key={idx}>
                      <div className="item">
                        <div className="item-image">
                          <a className="img-link" href={item.link} target="_blank" rel="noreferrer">
                            <img
                              className="img-responsive img-full"
                              src={item.img}
                              alt={item.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/img/index_370x185-image01.jpg';
                              }}
                            />
                          </a>
                        </div>
                        <div className="item-content">
                          <h4 className="ellipsis">
                            <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
                          </h4>
                          <p className="ellipsis">
                            <a href={item.link} target="_blank" rel="noreferrer">{item.desc}</a>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
