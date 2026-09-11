import React, { useState, useEffect } from 'react';
import { getStoredBreaking } from '../../services/articleStore';
import { getLivePunjabiNews } from '../../services/newsService';

export default function HeaderBreakingTicker() {
  const [news, setNews] = useState(() => getStoredBreaking());

  useEffect(() => {
    let isMounted = true;

    // Load from persistent store first
    const stored = getStoredBreaking();
    if (stored && stored.length > 0) {
      setNews(stored);
    }

    // Augment with fresh live Punjabi RSS items
    getLivePunjabiNews().then((data) => {
      if (isMounted && data && data.breaking && data.breaking.length > 0) {
        const liveItems = data.breaking.map((item, idx) => ({
          id: 'live-' + idx,
          tag: item.source || 'ਤਾਜ਼ਾ',
          text: item.title,
          link: item.link || '#'
        }));
        // Combine CMS items first, then live RSS items
        setNews([...stored, ...liveItems]);
      }
    });

    // Listen to local storage changes so if admin updates breaking news in another tab or form, it syncs
    const handleStorage = () => {
      setNews(getStoredBreaking());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('punjab_breaking_updated', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('punjab_breaking_updated', handleStorage);
    };
  }, []);

  return (
    <div className="header-top-breaking-wrapper">
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '36px', overflow: 'hidden' }}>
        {/* Left Badge */}
        <div className="breaking-ticker-badge">
          <span className="live-dot-pulse"></span>
          <span className="badge-text">ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼</span>
        </div>

        {/* Continuous Marquee Ticker */}
        <div className="breaking-marquee-container">
          <div className="breaking-marquee-track">
            {/* Render items twice for infinite seamless loop */}
            {[...news, ...news].map((item, index) => (
              <span key={`${item.id}-${index}`} className="marquee-item">
                <span className="marquee-tag">{item.tag || 'ਪੰਜਾਬ'}</span>
                <span className="marquee-text">{item.text}</span>
                <span className="marquee-divider">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
