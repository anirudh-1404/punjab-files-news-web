import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const categoryLinks = [
  { name: 'ਮੁੱਖ ਪੰਨਾ', link: '/' },
  { name: 'ਲਾਈਵ 24/7 ਦੇਖੋ', link: '#watch-live' },
  { name: '24 ਟੀਵੀ ਅਤੇ ਰੇਡੀਓ', link: '#tv-radio' },
  { name: 'ਵੈੱਬ ਸ਼ੋਅ', link: '#web-shows' },
  { name: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਸਟੋਰ', link: '#store' },
  { name: 'ਲਾਈਵ ਟੀਵੀ ਸ਼ਡਿਊਲ', link: '#tv-schedule' },
  { name: 'ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', link: '#news' },
  { name: 'ਰਾਜਨੀਤੀ ਤੇ ਵਪਾਰ', link: '#politics' },
  { name: 'ਵਿਗਿਆਨ ਤੇ ਤਕਨਾਲੋਜੀ', link: '#tech' },
  { name: 'ਜੀਵਨ ਸ਼ੈਲੀ', link: '#lifestyle' },
  { name: 'ਖੇਡਾਂ', link: '#sport' },
  { name: 'ਕਬੱਡੀ', link: '#kabaddi' },
  { name: 'ਕ੍ਰਿਕਟ', link: '#cricket' },
  { name: 'ਫੁੱਟਬਾਲ', link: '#football' },
  { name: 'ਸਿਹਤ ਸੰਭਾਲ', link: '#health' },
  { name: 'ਤੰਦਰੁਸਤੀ ਤੇ ਖ਼ੁਰਾਕ', link: '#health' },
  { name: 'ਦੇਸ਼-ਵਿਦੇਸ਼', link: '#world' },
  { name: 'ਕੈਨੇਡਾ ਤੇ ਅਮਰੀਕਾ', link: '#world' },
  { name: 'ਯੂਕੇ ਤੇ ਯੂਰਪ', link: '#world' },
  { name: 'ਸੈਰ-ਸਪਾਟਾ', link: '#travel' },
  { name: 'ਵਾਤਾਵਰਨ ਤੇ ਮੌਸਮ', link: '#environment' },
  { name: 'ਮਨੋਰੰਜਨ ਤੇ ਸਿਨੇਮਾ', link: '#art' }
];

const defaultLocalNewsItems = [
  {
    title: 'ਪੰਜਾਬ ਵਿੱਚ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧਾਂ ਦਾ ਵਿਸ਼ੇਸ਼ ਜਾਇਜ਼ਾ',
    tag: 'ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼',
    tagClass: 'label-1',
    img: '/img/index_800x400-image09.jpg',
    desc: 'ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਸੁਰੱਖਿਆ ਬਲਾਂ ਵੱਲੋਂ ਸ਼ਾਂਤੀ ਤੇ ਅਮਨ-ਕਾਨੂੰਨ ਦੀ ਸਥਿਤੀ ਨੂੰ ਮਜ਼ਬੂਤ ਰੱਖਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਚੈਕਿੰਗ ਅਭਿਆਨ...',
    btnText: 'ਲਾਈਵ ਦੇਖੋ',
    btnLink: '#watch-live'
  },
  {
    title: "ਰਾਜ ਪੱਧਰੀ ਕਬੱਡੀ ਤੇ ਖੇਡ ਮੇਲੇ ਦਾ ਸ਼ਾਨਦਾਰ ਆਗਾਜ਼",
    tag: 'ਖੇਡਾਂ',
    tagClass: 'label-4',
    img: '/img/index_800x400-image10.jpg',
    desc: 'ਪੰਜਾਬ ਭਰ ਤੋਂ ਨੌਜਵਾਨ ਖਿਡਾਰੀਆਂ ਨੇ ਲਿਆ ਹਿੱਸਾ, ਜੇਤੂ ਟੀਮਾਂ ਨੂੰ ਲੱਖਾਂ ਰੁਪਏ ਦੇ ਨਕਦ ਇਨਾਮ ਦਿੱਤੇ ਜਾਣਗੇ।',
    btnText: 'ਖੇਡਾਂ',
    btnLink: '#sport'
  },
  {
    title: 'ਪੰਜਾਬੀ ਵਿਰਸਾ ਅਤੇ ਸਾਹਿਤ ਸੰਭਾਲ ਮੇਲਾ ਸ਼ੁਰੂ',
    tag: 'ਜੀਵਨ ਸ਼ੈਲੀ',
    tagClass: 'label-9',
    img: '/img/index_800x400-image11.jpg',
    desc: 'ਮਸ਼ਹੂਰ ਵਿਦਵਾਨਾਂ ਅਤੇ ਲੇਖਕਾਂ ਨੇ ਨਵੀਂ ਪੀੜ੍ਹੀ ਨੂੰ ਮਾਂ-ਬੋਲੀ ਪੰਜਾਬੀ ਅਤੇ ਸੱਭਿਆਚਾਰ ਨਾਲ ਜੁੜਨ ਦਾ ਦਿੱਤਾ ਸੁਨੇਹਾ।',
    btnText: 'ਜੀਵਨ ਸ਼ੈਲੀ',
    btnLink: '#lifestyle'
  },
  {
    title: 'ਧਾਰਮਿਕ ਅਤੇ ਇਤਿਹਾਸਕ ਸਥਾਨਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਯਾਤਰਾ ਬੱਸਾਂ',
    tag: 'ਸੈਰ-ਸਪਾਟਾ',
    tagClass: 'label-3',
    img: '/img/index_800x400-image12.jpg',
    desc: 'ਸੰਗਤਾਂ ਦੀ ਸਹੂਲਤ ਲਈ ਨਵੇਂ ਏਅਰ-ਕੰਡੀਸ਼ਨਡ ਬੱਸ ਰੂਟ ਸ਼ੁਰੂ, ਬੁਕਿੰਗ ਆਨਲਾਈਨ ਪੋਰਟਲ ’ਤੇ ਉਪਲਬਧ।',
    btnText: 'ਸੈਰ-ਸਪਾਟਾ',
    btnLink: '#travel'
  },
  {
    title: 'ਜ਼ਮੀਨੀ ਹਕੀਕਤਾਂ ’ਤੇ ਆਧਾਰਿਤ ਵਿਸ਼ੇਸ਼ ਖੋਜੀ ਰਿਪੋਰਟਿੰਗ',
    tag: 'ਵੈੱਬ ਸ਼ੋਅ',
    tagClass: 'label-6',
    img: '/img/index_800x400-image13.jpg',
    desc: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਦੀ ਟੀਮ ਵੱਲੋਂ ਪਿੰਡਾਂ ਅਤੇ ਸ਼ਹਿਰਾਂ ਦੇ ਲੋਕਾਂ ਦੇ ਅਸਲ ਮਸਲਿਆਂ ਨੂੰ ਬੇਬਾਕੀ ਨਾਲ ਉਭਾਰਿਆ ਗਿਆ।',
    btnText: 'ਵੈੱਬ ਸ਼ੋਅ',
    btnLink: '#web-shows'
  }
];

const defaultRecentPosts = [
  {
    time: '1 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਮੌਸਮ ਵਿਭਾਗ ਵੱਲੋਂ ਪੰਜਾਬ ਦੇ ਮੈਦਾਨੀ ਇਲਾਕਿਆਂ ਵਿੱਚ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਪੇਸ਼ੀਨਗੋਈ।',
    img: '/img/index_800x400-image40.jpg'
  },
  {
    time: '2 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਛੋਟੇ ਵਪਾਰੀਆਂ ਅਤੇ ਨੌਜਵਾਨ ਉੱਦਮੀਆਂ ਲਈ ਘੱਟ ਵਿਆਜ ਦਰਾਂ ’ਤੇ ਕਰਜ਼ਾ ਸਕੀਮਾਂ ਸ਼ੁਰੂ।'
  },
  {
    time: '3 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਸੂਬਾ ਖੇਡ ਵਿਭਾਗ ਵੱਲੋਂ ਹੋਣਹਾਰ ਖਿਡਾਰੀਆਂ ਲਈ ਨਵੀਆਂ ਸਕਾਲਰਸ਼ਿਪਾਂ ਦਾ ਐਲਾਨ।'
  },
  {
    time: '4 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਸਿਹਤ ਵਿਭਾਗ ਵੱਲੋਂ ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਜਾਂਚ ਕੈਂਪ ਲਗਾਏ ਗਏ।',
    img: '/img/index_800x400-image41.jpg'
  },
  {
    time: '5 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਸੂਰਜੀ ਊਰਜਾ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਪਾਵਰ ਗਰਿੱਡ ਨਾਲ ਜੋੜਨ ਦਾ ਕੰਮ ਮੁਕੰਮਲ।',
    img: '/img/index_800x400-image42.jpg'
  },
  {
    time: '6 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਮੁੱਖ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਪ੍ਰਦੂਸ਼ਣ ਮੁਕਤ ਇਲੈਕਟ੍ਰਿਕ ਬੱਸਾਂ ਦੀ ਸ਼ੁਰੂਆਤ।'
  },
  {
    time: '8 ਮਿੰਟ ਪਹਿਲਾਂ',
    text: 'ਸਿੰਚਾਈ ਵਿਭਾਗ ਵੱਲੋਂ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਵੰਡ ਲਈ ਸਮਾਰਟ ਮਾਨੀਟਰਿੰਗ ਸਿਸਟਮ ਲਾਗੂ।'
  }
];

export default function LocalNewsModule() {
  const [newsItems, setNewsItems] = useState(defaultLocalNewsItems);
  const [recentList, setRecentList] = useState(defaultRecentPosts);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (!isMounted || !data) return;

      if (data.punjab && data.punjab.length >= 5) {
        const tags = [
          { tag: 'ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼', tagClass: 'label-1', btnText: 'ਲਾਈਵ ਦੇਖੋ' },
          { tag: 'ਪੰਜਾਬ', tagClass: 'label-4', btnText: 'ਪੰਜਾਬ' },
          { tag: 'ਜੀਵਨ ਸ਼ੈਲੀ', tagClass: 'label-9', btnText: 'ਜੀਵਨ ਸ਼ੈਲੀ' },
          { tag: 'ਸੈਰ-ਸਪਾਟਾ', tagClass: 'label-3', btnText: 'ਸੈਰ-ਸਪਾਟਾ' },
          { tag: 'ਵੈੱਬ ਸ਼ੋਅ', tagClass: 'label-6', btnText: 'ਵੈੱਬ ਸ਼ੋਅ' }
        ];

        const mapped = data.punjab.slice(0, 5).map((item, idx) => ({
          title: item.title,
          tag: tags[idx].tag,
          tagClass: tags[idx].tagClass,
          img: item.img || defaultLocalNewsItems[idx].img,
          desc: item.desc || item.title,
          btnText: tags[idx].btnText,
          btnLink: item.link
        }));
        setNewsItems(mapped);
      }

      if (data.all && data.all.length >= 7) {
        const times = ['1 ਮਿੰਟ ਪਹਿਲਾਂ', '2 ਮਿੰਟ ਪਹਿਲਾਂ', '3 ਮਿੰਟ ਪਹਿਲਾਂ', '5 ਮਿੰਟ ਪਹਿਲਾਂ', '7 ਮਿੰਟ ਪਹਿਲਾਂ', '10 ਮਿੰਟ ਪਹਿਲਾਂ', '15 ਮਿੰਟ ਪਹਿਲਾਂ'];
        const mappedRecent = data.all.slice(0, 7).map((item, idx) => ({
          time: times[idx] || 'ਤਾਜ਼ਾ ਅੱਪਡੇਟ',
          text: item.title,
          img: idx % 2 === 0 ? item.img : null,
          link: item.link
        }));
        setRecentList(mappedRecent);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="module highlight">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col Content */}
          <div className="col-md-8">
            <div className="module-title">
              <h3 className="title">
                <span className="bg-1">ਸਥਾਨਕ ਖ਼ਬਰਾਂ</span>
              </h3>
              <h3 className="subtitle">ਪੰਜਾਬ ਦੇ ਹਰ ਕੋਨੇ ਦੀ ਖ਼ਬਰ ਵਿਸਥਾਰ ਨਾਲ</h3>
            </div>

            <div className="row no-gutter">
              {/* Category Links Col-3 */}
              <div className="col-xs-12 col-sm-3 col-md-3">
                <ul className="list list-mark-1">
                  {categoryLinks.map((cat, idx) => (
                    <li key={idx}>
                      <a href={cat.link}>{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* News Items Col-9 */}
              <div className="col-xs-12 col-sm-9 col-md-9">
                <div className="news">
                  {newsItems.map((item, idx) => (
                    <div className="item" key={idx}>
                      <div className="item-image-3">
                        <a className="img-link" href={item.btnLink} target="_blank" rel="noreferrer">
                          <img
                            className="img-responsive img-full"
                            src={item.img}
                            alt={item.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/index_800x400-image09.jpg';
                            }}
                          />
                        </a>
                        <span>
                          <a className={item.tagClass} href={item.btnLink}>{item.tag}</a>
                        </span>
                      </div>
                      <div className="item-content">
                        <div className="title-left title-style04 underline04">
                          <h3>
                            <a href={item.btnLink} target="_blank" rel="noreferrer">
                              {item.title}
                            </a>
                          </h3>
                        </div>
                        <p>
                          <a href={item.btnLink} className="external-link" target="_blank" rel="noreferrer">
                            {item.desc}
                          </a>
                        </p>
                        <div style={{ marginTop: '8px' }}>
                          <a href={item.btnLink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            <span className="read-more">{item.btnText}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 4-col Sidebar */}
          <div className="col-md-4">
            <div className="title-style02">
              <h3>
                <a href="#recent">ਤਾਜ਼ਾ ਅੱਪਡੇਟ</a>
              </h3>
            </div>

            <div className="sidebar-scroll" style={{ maxHeight: '720px', overflowY: 'auto' }}>
              <div className="item">
                <div className="item-image-full">
                  <a className="img-link" href="#recent">
                    <img className="img-responsive img-full" src="/img/index_800x400-image02.jpg" alt="Featured Story" />
                  </a>
                </div>
              </div>
              <div className="item">
                <div className="item-content-1">
                  <h3>ਪੰਜਾਬ ਵਿੱਚ ਡਿਜੀਟਲ ਤਕਨਾਲੋਜੀ ਅਤੇ ਨੌਜਵਾਨ ਉੱਦਮੀਆਂ ਦਾ ਵਿਸ਼ੇਸ਼ ਸੰਮੇਲਨ।</h3>
                </div>
              </div>

              {recentList.map((post, idx) => (
                <div className="scroll-item" key={idx}>
                  <div className="item">
                    {post.img && (
                      <div className="item-image">
                        <a className="img-link" href={post.link || '#recent'} target="_blank" rel="noreferrer">
                          <img
                            className="img-responsive img-full"
                            src={post.img}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/index_800x400-image40.jpg';
                            }}
                          />
                        </a>
                      </div>
                    )}
                    <div className={post.img ? 'item-content' : 'item-content-1'}>
                      <p>
                        <i className="fa fa-clock-o"></i> <span className="day"> {post.time}</span> <br />
                        <a href={post.link || '#recent'} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {post.text}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
