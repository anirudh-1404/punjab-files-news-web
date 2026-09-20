import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';
import { formatArticleDate } from '../../services/dateUtils';

const defaultReligionItems = [
  {
    id: 'rel-1',
    title: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖਵਾਕ: ਗੁਰੂ ਕਿਰਪਾ ਨਾਲ ਜੀਵਨ ਵਿੱਚ ਆਨੰਦ',
    publicationDate: '11 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 04:30 ਵਜੇ',
    featuredImage: '/img/index_800x400-image04.jpg',
    excerpt: 'ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ ॥ ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥ ਅੰਗ ੬੧੪'
  },
  {
    id: 'rel-2',
    title: 'ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਤੇ ਕੀਰਤਪੁਰ ਸਾਹਿਬ: ਇਤਿਹਾਸਕ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬਾਨ ਦੇ ਸੁੰਦਰੀਕਰਨ ਦਾ ਕਾਰਜ ਆਰੰਭ',
    publicationDate: '10 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸ਼ਾਮ 06:15 ਵਜੇ',
    featuredImage: '/img/index_800x400-image16.jpg',
    excerpt: 'ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ ਵੱਲੋਂ ਪੁਰਾਤਨ ਵਿਰਾਸਤੀ ਇਮਾਰਤਸਾਜ਼ੀ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਲਈ ਮਾਹਿਰ ਟੀਮਾਂ ਤਾਇਨਾਤ।'
  },
  {
    id: 'rel-3',
    title: 'ਤਖ਼ਤ ਸ੍ਰੀ ਦਮਦਮਾ ਸਾਹਿਬ ਤਲਵੰਡੀ ਸਾਬੋ: ਗੁਰਮਤਿ ਸਮਾਗਮ ਵਿੱਚ ਸੰਗਤਾਂ ਦਾ ਭਾਰੀ ਇਕੱਠ',
    publicationDate: '09 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 10:00 ਵਜੇ',
    featuredImage: '/img/index_800x400-image06.jpg',
    excerpt: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਸੰਪੂਰਨਤਾ ਦਿਵਸ ਨੂੰ ਸਮਰਪਿਤ ਮਹਾਨ ਕੀਰਤਨ ਦਰਬਾਰ ਦਾ ਆਯੋਜਨ ਕੀਤਾ ਗਿਆ।'
  }
];

export default function ReligionModule() {
  const [religionItems, setReligionItems] = useState(defaultReligionItems);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await articleAPI.getPublished({ category: 'religion' });
        if (isMounted && res && res.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.slug || item._id,
            title: item.title,
            publicationDate: item.publishedAt ? formatArticleDate(item.publishedAt, item.language) : 'ਅੱਜ',
            publicationTime: item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString('pa-IN', { hour: '2-digit', minute: '2-digit' }) : 'ਹੁਣੇ',
            featuredImage: item.featuredImage || '/img/index_800x400-image04.jpg',
            excerpt: item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : '')
          }));
          setReligionItems(mapped);
          return;
        }
      } catch (err) {
        // Fallback
      }

      const all = getAllArticles();
      const filtered = all.filter((a) => a.category === 'religion');
      if (isMounted && filtered && filtered.length > 0) {
        setReligionItems(filtered);
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('punjab_articles_updated', loadData);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadData);
      window.removeEventListener('punjab_articles_updated', loadData);
    };
  }, []);

  return (
    <section className="module" id="religion" style={{ backgroundColor: '#ffffff', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Title Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਧਰਮ ਤੇ ਅਧਿਆਤਮ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ, ਗੁਰਦੁਆਰਾ ਸਾਹਿਬਾਨ ਅਤੇ ਧਾਰਮਿਕ ਸਮਾਚਾਰ</h3>
          </div>
          <div className="module-header-right">
            <a
              href="/#religion"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1c2d5a',
                textDecoration: 'none'
              }}
            >
              ਸਾਰੀਆਂ ਧਾਰਮਿਕ ਖ਼ਬਰਾਂ ਦੇਖੋ <i className="fa fa-angle-right"></i>
            </a>
          </div>
        </div>

        {/* News Cards Grid using identical 24hnews theme layout */}
        <div className="row">
          {religionItems.slice(0, 3).map((item, index) => (
            <div className="col-sm-4 col-xs-12" key={item.id || index} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Featured Image */}
                <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden', backgroundColor: '#edf2f7' }}>
                  <a href={`/news/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={item.featuredImage || '/img/index_800x400-image04.jpg'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/index_800x400-image04.jpg';
                      }}
                    />
                  </a>
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#ebb10d',
                      color: '#111317',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '3px'
                    }}
                  >
                    ਧਰਮ
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600' }}>
                      <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                      {item.publicationTime || 'ਅੱਜ'} • {item.publicationDate}
                    </span>
                  </div>

                  {/* Headline */}
                  <h4
                    style={{
                      margin: '0 0 8px',
                      fontSize: '14.5px',
                      fontWeight: '800',
                      lineHeight: '1.35',
                      color: '#000000'
                    }}
                  >
                    <a href={`/news/${item.id}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}>
                      {item.title}
                    </a>
                  </h4>

                  {/* Excerpt */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      lineHeight: '1.55',
                      color: '#111111',
                      fontWeight: '500',
                      marginTop: 'auto'
                    }}
                  >
                    {item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : '')}
                  </p>

                  <div style={{ marginTop: '10px' }}>
                    <a
                      href={`/news/${item.id}`}
                      style={{ fontSize: '11.5px', fontWeight: '700', color: '#b71c1c', textDecoration: 'none' }}
                    >
                      ਹੋਰ ਪੜ੍ਹੋ <i className="fa fa-angle-double-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
