import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DarbarSahibMukhWak from './Hero/DarbarSahibMukhWak';
import { getAllArticles } from '../services/articleStore';

const fallbackRegionalNews = {
  majha: [
    {
      id: 'art-1',
      title: 'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ: ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਮਨਜ਼ੂਰੀ, ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਨਵੀਆਂ ਸਹੂਲਤਾਂ',
      desc: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਆਉਣ ਵਾਲੇ ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੇ ਸ਼ਰਧਾਲੂਆਂ ਦੀ ਸਹੂਲਤ ਲਈ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਬੰਧ ਮੁਕੰਮਲ।',
      region: 'ਮਾਝਾ',
      district: 'ਅੰਮ੍ਰਿਤਸਰ',
      time: '15 ਮਿੰਟ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image01.jpg'
    },
    {
      id: 'art-9',
      title: 'ਗੁਰਦਾਸਪੁਰ ਤੇ ਤਰਨਤਾਰਨ: ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ',
      desc: 'ਨਹਿਰੀ ਵਿਭਾਗ ਵੱਲੋਂ ਟੇਲਾਂ ਤੱਕ ਪਾਣੀ ਪਹੁੰਚਾਉਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਨਿਗਰਾਨ ਟੀਮਾਂ ਤਾਇਨਾਤ।',
      region: 'ਮਾਝਾ',
      district: 'ਗੁਰਦਾਸਪੁਰ',
      time: '30 ਮਿੰਟ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image08.jpg'
    }
  ],
  malwa: [
    {
      id: 'art-2',
      title: 'ਲੁਧਿਆਣਾ ਤੇ ਬਠਿੰਡਾ: ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨਾਲ ਹਜ਼ਾਰਾਂ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਖੁੱਲ੍ਹਣਗੇ ਰਾਹ',
      desc: 'ਟੈਕਸਟਾਈਲ ਅਤੇ ਆਟੋ ਪਾਰਟਸ ਸਨਅਤਾਂ ਨੂੰ ਨਿਵੇਸ਼ ਲਈ ਵਿਸ਼ੇਸ਼ ਛੋਟਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇਣ ਦਾ ਫ਼ੈਸਲਾ।',
      region: 'ਮਾਲਵਾ',
      district: 'ਲੁਧਿਆਣਾ',
      time: '20 ਮਿੰਟ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image02.jpg'
    },
    {
      id: 'art-10',
      title: 'ਪਟਿਆਲਾ ਤੇ ਸੰਗਰੂਰ: ਖੇਤੀਬਾੜੀ ਖੋਜ ਕੇਂਦਰ ਵੱਲੋਂ ਸਾਉਣੀ ਦੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਨਵੀਂ ਐਡਵਾਈਜ਼ਰੀ ਜਾਰੀ',
      desc: 'ਮਾਹਿਰਾਂ ਨੇ ਕਿਸਾਨਾਂ ਨੂੰ ਘੱਟ ਪਾਣੀ ਵਾਲੀਆਂ ਕਿੱਸਮਾਂ ਅਪਣਾਉਣ ਦੀ ਦਿੱਤੀ ਸਲਾਹ।',
      region: 'ਮਾਲਵਾ',
      district: 'ਪਟਿਆਲਾ',
      time: '45 ਮਿੰਟ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image09.jpg'
    }
  ],
  doaba: [
    {
      id: 'art-3',
      title: 'ਜਲੰਧਰ: ਸਪੋਰਟਸ ਇੰਡਸਟਰੀ ਲਈ ਵਿਸ਼ੇਸ਼ ਕਲੱਸਟਰ ਪ੍ਰਾਜੈਕਟ ਸ਼ੁਰੂ, ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਵਿੱਚ ਵਾਧਾ',
      desc: 'ਵਿਸ਼ਵ ਪ੍ਰਸਿੱਧ ਖੇਡ ਸਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਨਿਰਮਾਤਾਵਾਂ ਨੂੰ ਵਿਸ਼ਵ ਪੱਧਰੀ ਟੈਸਟਿੰਗ ਲੈਬ ਮਿਲੇਗੀ।',
      region: 'ਦੋਆਬਾ',
      district: 'ਜਲੰਧਰ',
      time: '25 ਮਿੰਟ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image03.jpg'
    },
    {
      id: 'art-11',
      title: 'ਹੁਸ਼ਿਆਰਪੁਰ ਤੇ ਕਪੂਰਥਲਾ: ਵਾਤਾਵਰਨ ਸੰਭਾਲ ਮੁਹਿੰਮ ਤਹਿਤ ਲੱਖਾਂ ਬੂਟੇ ਲਗਾਉਣ ਦਾ ਟੀਚਾ',
      desc: 'ਪਿੰਡਾਂ ਅਤੇ ਨਹਿਰਾਂ ਦੇ ਕਿਨਾਰੇ ਹਰਿਆਵਲ ਵਧਾਉਣ ਲਈ ਸਮਾਜ ਸੇਵੀ ਸੰਸਥਾਵਾਂ ਦਾ ਵੱਡਾ ਸਹਿਯੋਗ।',
      region: 'ਦੋਆਬਾ',
      district: 'ਹੁਸ਼ਿਆਰਪੁਰ',
      time: '1 ਘੰਟਾ ਪਹਿਲਾਂ',
      img: '/img/index_800x400-image10.jpg'
    }
  ]
};

export default function DarbarSahibAndPunjabModule() {
  const [activeRegion, setActiveRegion] = useState('all');
  const [regionalNews, setRegionalNews] = useState(fallbackRegionalNews);

  useEffect(() => {
    const loadDynamicPunjabNews = () => {
      const all = getAllArticles({ category: 'punjab' });
      if (all && all.length > 0) {
        const majha = all.filter((a) => a.punjabRegion === 'majha').map((a) => ({
          id: a.id,
          title: a.title,
          desc: a.excerpt || a.content.substring(0, 110) + '...',
          region: 'ਮਾਝਾ',
          district: 'ਮਾਝਾ ਬਿਊਰੋ',
          time: a.publicationTime || 'ਤਾਜ਼ਾ',
          img: a.featuredImage
        }));

        const malwa = all.filter((a) => a.punjabRegion === 'malwa').map((a) => ({
          id: a.id,
          title: a.title,
          desc: a.excerpt || a.content.substring(0, 110) + '...',
          region: 'ਮਾਲਵਾ',
          district: 'ਮਾਲਵਾ ਬਿਊਰੋ',
          time: a.publicationTime || 'ਤਾਜ਼ਾ',
          img: a.featuredImage
        }));

        const doaba = all.filter((a) => a.punjabRegion === 'doaba').map((a) => ({
          id: a.id,
          title: a.title,
          desc: a.excerpt || a.content.substring(0, 110) + '...',
          region: 'ਦੋਆਬਾ',
          district: 'ਦੋਆਬਾ ਬਿਊਰੋ',
          time: a.publicationTime || 'ਤਾਜ਼ਾ',
          img: a.featuredImage
        }));

        setRegionalNews({
          majha: majha.length > 0 ? majha : fallbackRegionalNews.majha,
          malwa: malwa.length > 0 ? malwa : fallbackRegionalNews.malwa,
          doaba: doaba.length > 0 ? doaba : fallbackRegionalNews.doaba
        });
      }
    };

    loadDynamicPunjabNews();
    window.addEventListener('storage', loadDynamicPunjabNews);
    window.addEventListener('punjab_articles_updated', loadDynamicPunjabNews);

    return () => {
      window.removeEventListener('storage', loadDynamicPunjabNews);
      window.removeEventListener('punjab_articles_updated', loadDynamicPunjabNews);
    };
  }, []);

  const getFilteredNews = () => {
    if (activeRegion === 'majha') return regionalNews.majha;
    if (activeRegion === 'malwa') return regionalNews.malwa;
    if (activeRegion === 'doaba') return regionalNews.doaba;
    // 'all': combine from each
    return [
      regionalNews.majha[0] || fallbackRegionalNews.majha[0],
      regionalNews.malwa[0] || fallbackRegionalNews.malwa[0],
      regionalNews.doaba[0] || fallbackRegionalNews.doaba[0],
      regionalNews.majha[1] || fallbackRegionalNews.majha[1]
    ].filter(Boolean);
  };

  const newsToDisplay = getFilteredNews();

  return (
    <section className="module" id="punjab" style={{ backgroundColor: '#ffffff', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Section Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਪੰਜਾਬ ਵਿਸ਼ੇਸ਼</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਪੰਜਾਬ ਦੇ ਤਿੰਨੋਂ ਖਿੱਤੇ (ਮਾਝਾ, ਮਾਲਵਾ, ਦੋਆਬਾ) ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ
            </h3>
          </div>

          {/* Region Filter Buttons */}
          <div className="module-header-right">
            <button
              type="button"
              onClick={() => setActiveRegion('all')}
              style={{
                background: activeRegion === 'all' ? '#1c2d5a' : '#edf2f7',
                color: activeRegion === 'all' ? '#ffffff' : '#1a202c',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ਸਾਰਾ ਪੰਜਾਬ
            </button>
            <button
              type="button"
              onClick={() => setActiveRegion('majha')}
              style={{
                background: activeRegion === 'majha' ? '#b71c1c' : '#edf2f7',
                color: activeRegion === 'majha' ? '#ffffff' : '#1a202c',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ਮਾਝਾ (Majha)
            </button>
            <button
              type="button"
              onClick={() => setActiveRegion('malwa')}
              style={{
                background: activeRegion === 'malwa' ? '#b71c1c' : '#edf2f7',
                color: activeRegion === 'malwa' ? '#ffffff' : '#1a202c',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ਮਾਲਵਾ (Malwa)
            </button>
            <button
              type="button"
              onClick={() => setActiveRegion('doaba')}
              style={{
                background: activeRegion === 'doaba' ? '#b71c1c' : '#edf2f7',
                color: activeRegion === 'doaba' ? '#ffffff' : '#1a202c',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ਦੋਆਬਾ (Doaba)
            </button>
          </div>
        </div>

        {/* 4-Column Regional Newspaper Grid */}
        <div className="row">
          {newsToDisplay.map((item, index) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={item.id || index} style={{ marginBottom: '18px' }}>
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
                    {/* Image with Region Badge */}
                    <div style={{ position: 'relative', width: '100%', height: '165px', overflow: 'hidden', backgroundColor: '#edf2f7' }}>
                      <Link to={`/news/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/index_370x185-image01.jpg';
                          }}
                        />
                      </Link>
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#b71c1c',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: '3px'
                        }}
                      >
                        {item.region} • {item.district}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '600' }}>
                          <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                          {item.time}
                        </span>
                      </div>

                      {/* Bold Black Headline */}
                      <h4
                        style={{
                          margin: '2px 0 6px 0',
                          fontSize: '14.5px',
                          fontWeight: '800',
                          lineHeight: '1.35',
                          color: '#000000'
                        }}
                      >
                        <Link
                          to={`/news/${item.id}`}
                          style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}
                        >
                          {item.title}
                        </Link>
                      </h4>

                      {/* Deep Black Summary */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12.5px',
                          lineHeight: '1.55',
                          color: '#111111',
                          fontWeight: '500',
                          marginTop: 'auto'
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </section>
  );
}
