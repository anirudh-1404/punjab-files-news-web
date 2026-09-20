import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getReadersChoiceTop10 } from '../../services/articleStore';

const defaultTopArticles = [
  { id: 'top-1', rank: '01', title: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖਵਾਕ: ਗੁਰੂ ਕਿਰਪਾ ਨਾਲ ਜੀਵਨ ਵਿੱਚ ਆਨੰਦ', category: 'ਧਰਮ', views: 3120 },
  { id: 'top-2', rank: '02', title: 'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ: ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਮਨਜ਼ੂਰੀ, ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਨਵੀਆਂ ਸਹੂਲਤਾਂ', category: 'ਮਾਝਾ', views: 2450 },
  { id: 'top-3', rank: '03', title: 'ਲੁਧਿਆਣਾ ਤੇ ਬਠਿੰਡਾ: ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨਾਲ ਹਜ਼ਾਰਾਂ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਖੁੱਲ੍ਹਣਗੇ ਰਾਹ', category: 'ਮਾਲਵਾ', views: 2180 },
  { id: 'top-4', rank: '04', title: 'ਜਲੰਧਰ: ਸਪੋਰਟਸ ਇੰਡਸਟਰੀ ਲਈ ਵਿਸ਼ੇਸ਼ ਕਲੱਸਟਰ ਪ੍ਰਾਜੈਕਟ ਸ਼ੁਰੂ, ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਵਿੱਚ ਵਾਧਾ', category: 'ਦੋਆਬਾ', views: 1940 },
  { id: 'top-5', rank: '05', title: 'ਗੁਰਦਾਸਪੁਰ ਤੇ ਤਰਨਤਾਰਨ: ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ ਕਰਨ ਦਾ ਕਾਰਜ ਆਰੰਭ', category: 'ਮਾਝਾ', views: 1820 },
  { id: 'top-6', rank: '06', title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ', category: 'ਰਾਜਨੀਤੀ', views: 1720 },
  { id: 'top-7', rank: '07', title: 'ਕੌਮਾਂਤਰੀ ਪੰਜਾਬੀ ਡਾਇਸਪੋਰਾ: ਕੈਨੇਡਾ ਤੇ ਯੂਕੇ ਵਿੱਚ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਨੇ ਮਾਰੀਆਂ ਮੱਲਾਂ', category: 'ਦੇਸ਼-ਵਿਦੇਸ਼', views: 1650 },
  { id: 'top-8', rank: '08', title: 'ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ ਦਾ ਧਮਾਕੇਦਾਰ ਆਗਾਜ਼, ਹਜ਼ਾਰਾਂ ਖਿਡਾਰੀ ਮੈਦਾਨ ਵਿੱਚ', category: 'ਖੇਡਾਂ', views: 1530 },
  { id: 'top-9', rank: '09', title: 'ਗੁਰਦਾਸਪੁਰ ਤੇ ਤਰਨਤਾਰਨ: ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ', category: 'ਮਾਝਾ', views: 1410 },
  { id: 'top-10', rank: '10', title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੈਡੀਕਲ ਸਹੂਲਤਾਂ ਦਾ ਹੋਵੇਗਾ ਵਿਸਥਾਰ', category: 'ਸਿਹਤ', views: 1180 }
];

export default function ReadersChoiceModule() {
  const [topArticles, setTopArticles] = useState(defaultTopArticles);

  useEffect(() => {
    let isMounted = true;

    const loadTopNews = async () => {
      try {
        const res = await articleAPI.getReadersChoice();
        if (isMounted && res && res.data && res.data.length > 0) {
          const fromApi = res.data.map((item, idx) => ({
            id: item.slug || item._id,
            rank: String(idx + 1).padStart(2, '0'),
            title: item.title,
            category: item.category === 'punjab' ? (item.punjabRegion || 'ਪੰਜਾਬ') : item.category,
            views: item.views || 1000
          }));

          const combined = [...fromApi, ...defaultTopArticles.slice(fromApi.length)].slice(0, 10);
          setTopArticles(combined);
          return;
        }
      } catch (err) {
        // Fallback
      }

      const top = getReadersChoiceTop10();
      if (isMounted && top && top.length > 0) {
        setTopArticles(top);
      }
    };

    loadTopNews();
    window.addEventListener('storage', loadTopNews);
    window.addEventListener('punjab_articles_updated', loadTopNews);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadTopNews);
      window.removeEventListener('punjab_articles_updated', loadTopNews);
    };
  }, []);

  const leftCol = topArticles.slice(0, 5);
  const rightCol = topArticles.slice(5, 10);

  return (
    <section className="module" id="readers-choice-section" style={{ backgroundColor: '#ffffff', paddingTop: '14px', paddingBottom: '22px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Title - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਪਾਠਕਾਂ ਦੀ ਪਸੰਦ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">ਸਭ ਤੋਂ ਵੱਧ ਪੜ੍ਹੀਆਂ ਗਈਆਂ ਟੌਪ 10 ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ (Top 10 Reads)</h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', backgroundColor: '#edf2f7', padding: '4px 10px', borderRadius: '3px' }}>
              <i className="fa fa-fire" style={{ color: '#b71c1c', marginRight: '4px' }}></i> ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ
            </span>
          </div>
        </div>

        {/* 2-Column Compact Ranked Grid (01 to 10) */}
        <div className="row">
          {/* Left Column (01 to 05) */}
          <div className="col-md-6 col-sm-12" style={{ marginBottom: '15px' }}>
            <div style={{ backgroundColor: '#fbfbfd', border: '1px solid #edf2f7', borderRadius: '6px', padding: '10px 16px' }}>
              {leftCol.map((item, idx) => {
                const rankNumber = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '12px 0',
                      borderBottom: idx < leftCol.length - 1 ? '1px solid #edf2f7' : 'none'
                    }}
                  >
                    {/* Rank Number */}
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: idx === 0 ? '#b71c1c' : idx === 1 ? '#ebb10d' : '#94a3b8',
                        fontFamily: "'Roboto Condensed', sans-serif",
                        lineHeight: 1,
                        minWidth: '32px',
                        paddingTop: '2px'
                      }}
                    >
                      {rankNumber}
                    </div>

                    {/* Headline & Meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: '700',
                            color: '#b71c1c',
                            backgroundColor: 'rgba(183, 28, 28, 0.08)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.category === 'punjab' ? (item.punjabRegion || 'ਪੰਜਾਬ') : item.category}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#1e293b', fontWeight: '600' }}>
                          <i className="fa fa-eye" style={{ marginRight: '3px' }}></i>
                          {item.views ? item.views.toLocaleString() : '1,000+'} ਪਾਠਕ
                        </span>
                      </div>

                      <h4
                        style={{
                          margin: 0,
                          fontSize: '13.5px',
                          fontWeight: '800',
                          lineHeight: '1.35',
                          color: '#000000'
                        }}
                      >
                        <a
                          href={`/news/${item.id}`}
                          style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}
                        >
                          {item.title}
                        </a>
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (06 to 10) */}
          <div className="col-md-6 col-sm-12" style={{ marginBottom: '15px' }}>
            <div style={{ backgroundColor: '#fbfbfd', border: '1px solid #edf2f7', borderRadius: '6px', padding: '10px 16px' }}>
              {rightCol.map((item, idx) => {
                const rankNumber = String(idx + 6).padStart(2, '0');
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '12px 0',
                      borderBottom: idx < rightCol.length - 1 ? '1px solid #edf2f7' : 'none'
                    }}
                  >
                    {/* Rank Number */}
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#94a3b8',
                        fontFamily: "'Roboto Condensed', sans-serif",
                        lineHeight: 1,
                        minWidth: '32px',
                        paddingTop: '2px'
                      }}
                    >
                      {rankNumber}
                    </div>

                    {/* Headline & Meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: '700',
                            color: '#b71c1c',
                            backgroundColor: 'rgba(183, 28, 28, 0.08)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.category === 'punjab' ? (item.punjabRegion || 'ਪੰਜਾਬ') : item.category}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#1e293b', fontWeight: '600' }}>
                          <i className="fa fa-eye" style={{ marginRight: '3px' }}></i>
                          {item.views ? item.views.toLocaleString() : '1,000+'} ਪਾਠਕ
                        </span>
                      </div>

                      <h4
                        style={{
                          margin: 0,
                          fontSize: '13.5px',
                          fontWeight: '800',
                          lineHeight: '1.35',
                          color: '#000000'
                        }}
                      >
                        <a
                          href={`/news/${item.id}`}
                          style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}
                        >
                          {item.title}
                        </a>
                      </h4>
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
