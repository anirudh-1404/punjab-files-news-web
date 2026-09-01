import React, { useState, useEffect } from 'react';
import { getLivePunjabiNews } from '../../services/newsService';

const defaultNewsItems = [
  { category: 'ਖ਼ਬਰਾਂ:', text: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ 24 ਘੰਟੇ ਲਾਈਵ ਅੱਪਡੇਟ ਅਤੇ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਦਾ ਸਿਲਸਿਲਾ ਜਾਰੀ।', link: '#breaking' },
  { category: 'ਸੈਰ-ਸਪਾਟਾ:', text: 'ਪੰਜਾਬ ਤੋਂ ਕੈਨੇਡਾ, ਯੂਕੇ ਅਤੇ ਯੂਰਪ ਲਈ ਨਵੀਆਂ ਸਿੱਧੀਆਂ ਉਡਾਣਾਂ ਸ਼ੁਰੂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ।', link: '#breaking' },
  { category: 'ਰਾਜਨੀਤੀ:', text: 'ਸੂਬਾ ਸਰਕਾਰ ਵੱਲੋਂ ਕਿਸਾਨਾਂ, ਵਪਾਰੀਆਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਨਵੀਆਂ ਭਲਾਈ ਸਕੀਮਾਂ ਮਨਜ਼ੂਰ।', link: '#breaking' },
  { category: 'ਸਿਹਤ:', text: 'ਪੰਜਾਬ ਭਰ ਦੇ ਸਿਹਤ ਕੇਂਦਰਾਂ ਵਿੱਚ ਅਤਿ-ਆਧੁਨਿਕ ਟੈਸਟਿੰਗ ਸਹੂਲਤਾਂ ਅਤੇ ਦਵਾਈਆਂ ਉਪਲਬਧ।', link: '#breaking' },
  { category: 'ਦੇਸ਼-ਵਿਦੇਸ਼:', text: 'ਕੈਨੇਡਾ ਅਤੇ ਅਮਰੀਕਾ ਵਿੱਚ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਨੇ ਵੱਡੀਆਂ ਪ੍ਰਾਪਤੀਆਂ ਨਾਲ ਨਾਮ ਚਮਕਾਇਆ।', link: '#breaking' },
  { category: 'ਆਰਥਿਕਤਾ:', text: 'ਸੂਬੇ ਵਿੱਚ ਨਵੇਂ ਉਦਯੋਗਿਕ ਪ੍ਰਾਜੈਕਟਾਂ ਨਾਲ ਹਜ਼ਾਰਾਂ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਮੌਕੇ ਪੈਦਾ ਹੋਣਗੇ।', link: '#breaking' }
];

export default function BreakingNews() {
  const [items, setItems] = useState(defaultNewsItems);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getLivePunjabiNews().then((data) => {
      if (isMounted && data && data.breaking && data.breaking.length > 0) {
        const liveList = data.breaking.map((item) => ({
          category: `${item.source || 'ਖ਼ਬਰਾਂ'}:`,
          text: item.title,
          link: item.link
        }));
        setItems(liveList);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const current = items[currentIndex] || items[0];

  return (
    <div className="outer">
      <div className="breaking-ribbon">
        <h4>ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼</h4>
      </div>
      <div className="newsticker" style={{ overflow: 'hidden' }}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          <li key={currentIndex} style={{ transition: 'all 0.4s ease-in-out' }}>
            <h4>
              <span className="category">{current.category}</span>
              <a href={current.link} target="_blank" rel="noreferrer">
                {' '}{current.text}
              </a>
            </h4>
          </li>
        </ul>
        <div className="navi">
          <button className="up" onClick={handlePrev} type="button" aria-label="ਪਿਛਲੀ ਖ਼ਬਰ">
            <i className="fa fa-caret-left"></i>
          </button>
          <button className="down" onClick={handleNext} type="button" aria-label="ਅਗਲੀ ਖ਼ਬਰ">
            <i className="fa fa-caret-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
