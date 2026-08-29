import React, { useState, useEffect } from 'react';

const newsItems = [
  { category: 'News:', text: 'Extra! Extra! Rethinking the Punjab Files 24h Breaking News Experience.' },
  { category: 'Travel:', text: 'New direct flight corridors connecting northern hubs announced today.' },
  { category: 'Politics:', text: 'Momentous policy reforms introduced to support agricultural modernization.' },
  { category: 'Health:', text: 'State-of-the-art regional health centers inaugurated with modern facilities.' },
  { category: 'World:', text: 'Global climate and sustainability pact draws historic participation.' },
  { category: 'Finance:', text: 'Economic indicators signal steady growth in tech and industrial sectors.' }
];

export default function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const current = newsItems[currentIndex];

  return (
    <div className="outer">
      <div className="breaking-ribbon">
        <h4>Breaking News</h4>
      </div>
      <div className="newsticker" style={{ overflow: 'hidden' }}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          <li key={currentIndex} style={{ transition: 'all 0.4s ease-in-out' }}>
            <h4>
              <span className="category">{current.category}</span>
              <a href="#breaking-story"> {current.text}</a>
            </h4>
          </li>
        </ul>
        <div className="navi">
          <button className="up" onClick={handlePrev} type="button" aria-label="Previous Breaking News">
            <i className="fa fa-caret-left"></i>
          </button>
          <button className="down" onClick={handleNext} type="button" aria-label="Next Breaking News">
            <i className="fa fa-caret-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
