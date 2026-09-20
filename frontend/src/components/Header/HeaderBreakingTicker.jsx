import React, { useState, useEffect } from 'react';
import { breakingAPI } from '../../services/api';
import { getStoredBreaking } from '../../services/articleStore';
import { getLivePunjabiNews } from '../../services/newsService';

export default function HeaderBreakingTicker() {
  const [news, setNews] = useState(() => getStoredBreaking());

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live breaking news from backend
    const loadBackendBreaking = async () => {
      try {
        const res = await breakingAPI.getBreaking();
        if (isMounted && res.items && res.items.length > 0) {
          const mapped = res.items.map((item) => ({
            id: item._id,
            tag: item.tag || 'ਪੰਜਾਬ',
            text: item.text
          }));
          setNews(mapped);
          return;
        }
      } catch (err) {
        console.warn('Backend breaking fetch fallback:', err.message);
      }

      // Fallback: stored breaking news + live RSS
      const stored = getStoredBreaking();
      if (isMounted && stored && stored.length > 0) {
        setNews(stored);
      }

      getLivePunjabiNews().then((data) => {
        if (isMounted && data && data.breaking && data.breaking.length > 0) {
          const liveItems = data.breaking.map((item, idx) => ({
            id: 'live-' + idx,
            tag: item.source || 'ਤਾਜ਼ਾ',
            text: item.title
          }));
          setNews([...stored, ...liveItems]);
        }
      });
    };

    loadBackendBreaking();

    // Re-fetch when breaking news is updated from dashboard
    const handleUpdate = () => {
      loadBackendBreaking();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('punjab_breaking_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('punjab_breaking_updated', handleUpdate);
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
