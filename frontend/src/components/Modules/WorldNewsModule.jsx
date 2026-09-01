import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultWorldItems = [
  {
    title: 'ਵਿਸ਼ਵ ਸੰਮੇਲਨ',
    desc1: 'ਕੌਮਾਂਤਰੀ ਪੱਧਰ ’ਤੇ ਆਰਥਿਕ ਸਹਿਯੋਗ ਅਤੇ ਵਪਾਰਕ ਸਾਂਝ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ ਲਈ ਅਹਿਮ ਸਮਝੌਤਾ।',
    desc2: 'ਵੱਖ-ਵੱਖ ਦੇਸ਼ਾਂ ਦੇ ਡੈਲੀਗੇਟਾਂ ਨੇ ਟਿਕਾਊ ਵਿਕਾਸ ਅਤੇ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਨੀਤੀਆਂ ’ਤੇ ਦਿੱਤਾ ਜ਼ੋਰ।',
    category: 'ਖ਼ਬਰਾਂ',
    labelClass: 'label-1',
    img: '/img/index_800x400-image01.jpg',
    link: '#news'
  },
  {
    title: 'ਸਿਆਸੀ ਸਰਗਰਮੀਆਂ',
    desc1: 'ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ ਦੌਰਾਨ ਜਨਤਕ ਮੁੱਦਿਆਂ ਅਤੇ ਬਜਟ ਅਲਾਟਮੈਂਟ ’ਤੇ ਵਿਸਥਾਰਪੂਰਵਕ ਚਰਚਾ।',
    desc2: 'ਲੋਕ ਨੁਮਾਇੰਦਿਆਂ ਨੇ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਨੂੰ ਤੇਜ਼ ਕਰਨ ਦੀ ਮੰਗ ਕੀਤੀ।',
    category: 'ਰਾਜਨੀਤੀ',
    labelClass: 'label-3',
    img: '/img/index_800x400-image02.jpg',
    link: '#politics'
  },
  {
    title: 'ਪੁਲਾੜ ਅਤੇ ਤਕਨਾਲੋਜੀ',
    desc1: 'ਵਿਗਿਆਨੀਆਂ ਵੱਲੋਂ ਨਵੇਂ ਪੁਲਾੜ ਮਿਸ਼ਨ ਦੀ ਸਫ਼ਲ ਸ਼ੁਰੂਆਤ, ਖਗੋਲ ਵਿਗਿਆਨ ਵਿੱਚ ਨਵਾਂ ਇਤਿਹਾਸ।',
    desc2: 'ਆਧੁਨਿਕ ਸੈਟੇਲਾਈਟ ਰਾਹੀਂ ਮੌਸਮ ਅਤੇ ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ ਦੀ ਅਗਾਊਂ ਜਾਣਕਾਰੀ ਮਿਲਣਾ ਹੋਵੇਗਾ ਆਸਾਨ।',
    category: 'ਵਿਗਿਆਨ',
    labelClass: 'label-5',
    img: '/img/index_800x400-image03.jpg',
    link: '#tech'
  },
  {
    title: 'ਸਿਹਤ ਸੰਭਾਲ ਪ੍ਰੋਗਰਾਮ',
    desc1: 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮੈਡੀਕਲ ਸਹੂਲਤਾਂ ਦਾ ਵਿਸਥਾਰ, ਮਾਹਿਰ ਡਾਕਟਰਾਂ ਵੱਲੋਂ ਮੁਫ਼ਤ ਜਾਂਚ ਕੈਂਪ।',
    desc2: 'ਸਿਹਤ ਮਾਹਿਰਾਂ ਨੇ ਚੰਗੀ ਖ਼ੁਰਾਕ ਅਤੇ ਰੋਜ਼ਾਨਾ ਕਸਰਤ ਨੂੰ ਰੋਗਾਂ ਤੋਂ ਬਚਾਅ ਲਈ ਜ਼ਰੂਰੀ ਦੱਸਿਆ।',
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
    getLivePunjabiNews().then((data) => {
      if (isMounted && data && data.world && data.world.length >= 4) {
        const labels = ['label-1', 'label-3', 'label-5', 'label-2'];
        const cats = ['ਖ਼ਬਰਾਂ', 'ਰਾਜਨੀਤੀ', 'ਵਿਗਿਆਨ', 'ਸਿਹਤ'];
        
        const mapped = data.world.slice(0, 4).map((item, idx) => ({
          title: item.title,
          desc1: item.desc || item.title,
          desc2: `ਸਰੋਤ: ${item.source || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'} | ਤਾਜ਼ਾ ਲਾਈਵ ਅੱਪਡੇਟ`,
          category: cats[idx] || item.category,
          labelClass: labels[idx] || 'label-1',
          img: item.img || defaultWorldItems[idx].img,
          link: item.link
        }));
        setItems(mapped);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const col1 = items.slice(0, 2);
  const col2 = items.slice(2, 4);

  return (
    <section className="module highlight">
      <div className="container">
        <div className="module-title">
          <h3 className="title">
            <span className="bg-1">ਦੇਸ਼-ਵਿਦੇਸ਼</span>
          </h3>
          <h3 className="subtitle">ਦੇਖੋ ਤਾਜ਼ਾ ਅਤੇ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ</h3>
        </div>
        <div className="row no-gutter">
          {/* Column 1 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {col1.map((item, idx) => (
                <div className="item" key={idx}>
                  <div className="item-image-1">
                    <a className="img-link" href={item.link} target="_blank" rel="noreferrer">
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
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                        </a>
                      </h3>
                    </div>
                    <p>
                      <a href={item.link} className="external-link" target="_blank" rel="noreferrer">
                        {item.desc1}
                      </a>
                    </p>
                    <p>
                      <a href={item.link} className="external-link" target="_blank" rel="noreferrer">
                        {item.desc2}
                      </a>
                    </p>
                    <div>
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {col2.map((item, idx) => (
                <div className="item" key={idx}>
                  <div className="item-image-1">
                    <a className="img-link" href={item.link} target="_blank" rel="noreferrer">
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
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                        </a>
                      </h3>
                    </div>
                    <p>
                      <a href={item.link} className="external-link" target="_blank" rel="noreferrer">
                        {item.desc1}
                      </a>
                    </p>
                    <p>
                      <a href={item.link} className="external-link" target="_blank" rel="noreferrer">
                        {item.desc2}
                      </a>
                    </p>
                    <div>
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                      </a>
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
