import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { getAllArticles } from '../services/articleStore';
import { getCardImageUrl } from '../services/imageUtils';
import { useLanguage } from '../context/LanguageContext';

const emptyRegionalNews = {
  majha: [],
  malwa: [],
  doaba: []
};

export default function DarbarSahibAndPunjabModule() {
  const { language } = useLanguage();
  const [activeRegion, setActiveRegion] = useState('all');
  const [regionalNews, setRegionalNews] = useState(emptyRegionalNews);

  useEffect(() => {
    let isMounted = true;

    const loadDynamicPunjabNews = async () => {
      try {
        const res = await articleAPI.getPublished({ category: 'punjab', language });
        if (isMounted && res && res.data && res.data.length > 0) {
          const all = res.data;
          const majhaFromApi = all.filter((a) => a.punjabRegion === 'majha').map((a) => ({
            id: a.slug || a._id,
            title: a.title,
            desc: a.excerpt || (a.content ? a.content.substring(0, 110) + '...' : ''),
            region: 'ਮਾਝਾ',
            district: 'ਮਾਝਾ ਬਿਊਰੋ',
            time: a.publishedAt ? new Date(a.publishedAt).toLocaleTimeString('pa-IN', { hour: '2-digit', minute: '2-digit' }) : 'ਤਾਜ਼ਾ',
            img: a.featuredImage || '/img/index_800x400-image08.jpg'
          }));

          const malwaFromApi = all.filter((a) => a.punjabRegion === 'malwa').map((a) => ({
            id: a.slug || a._id,
            title: a.title,
            desc: a.excerpt || (a.content ? a.content.substring(0, 110) + '...' : ''),
            region: 'ਮਾਲਵਾ',
            district: 'ਮਾਲਵਾ ਬਿਊਰੋ',
            time: a.publishedAt ? new Date(a.publishedAt).toLocaleTimeString('pa-IN', { hour: '2-digit', minute: '2-digit' }) : 'ਤਾਜ਼ਾ',
            img: a.featuredImage || '/img/index_800x400-image09.jpg'
          }));

          const doabaFromApi = all.filter((a) => a.punjabRegion === 'doaba').map((a) => ({
            id: a.slug || a._id,
            title: a.title,
            desc: a.excerpt || (a.content ? a.content.substring(0, 110) + '...' : ''),
            region: 'ਦੋਆਬਾ',
            district: 'ਦੋਆਬਾ ਬਿਊਰੋ',
            time: a.publishedAt ? new Date(a.publishedAt).toLocaleTimeString('pa-IN', { hour: '2-digit', minute: '2-digit' }) : 'ਤਾਜ਼ਾ',
            img: a.featuredImage || '/img/index_800x400-image10.jpg'
          }));

          setRegionalNews({
            majha: majhaFromApi.slice(0, 4),
            malwa: malwaFromApi.slice(0, 4),
            doaba: doabaFromApi.slice(0, 4)
          });
          return;
        }
      } catch (err) {
        // Fallback to local store
      }

      // Fallback if API was unavailable
      const allLocal = getAllArticles({ category: 'punjab', language });
      if (isMounted) {
        if (allLocal && allLocal.length > 0) {
          const majha = allLocal.filter((a) => a.punjabRegion === 'majha').map((a) => ({
            id: a.id,
            title: a.title,
            desc: a.excerpt || a.content.substring(0, 110) + '...',
            region: 'ਮਾਝਾ',
            district: 'ਮਾਝਾ ਬਿਊਰੋ',
            time: a.publicationTime || 'ਤਾਜ਼ਾ',
            img: a.featuredImage
          }));

          const malwa = allLocal.filter((a) => a.punjabRegion === 'malwa').map((a) => ({
            id: a.id,
            title: a.title,
            desc: a.excerpt || a.content.substring(0, 110) + '...',
            region: 'ਮਾਲਵਾ',
            district: 'ਮਾਲਵਾ ਬਿਊਰੋ',
            time: a.publicationTime || 'ਤਾਜ਼ਾ',
            img: a.featuredImage
          }));

          const doaba = allLocal.filter((a) => a.punjabRegion === 'doaba').map((a) => ({
            id: a.id,
            title: a.title,
            desc: a.excerpt || a.content.substring(0, 110) + '...',
            region: 'ਦੋਆਬਾ',
            district: 'ਦੋਆਬਾ ਬਿਊਰੋ',
            time: a.publicationTime || 'ਤਾਜ਼ਾ',
            img: a.featuredImage
          }));

          setRegionalNews({
            majha: majha.slice(0, 4),
            malwa: malwa.slice(0, 4),
            doaba: doaba.slice(0, 4)
          });
        } else {
          setRegionalNews(emptyRegionalNews);
        }
      }
    };

    loadDynamicPunjabNews();
    window.addEventListener('storage', loadDynamicPunjabNews);
    window.addEventListener('punjab_articles_updated', loadDynamicPunjabNews);
    window.addEventListener('punjab_language_changed', loadDynamicPunjabNews);

    const handleRegionSelect = (e) => {
      if (e.detail && ['all', 'majha', 'malwa', 'doaba'].includes(e.detail)) {
        setActiveRegion(e.detail);
      }
    };
    window.addEventListener('punjab_region_select', handleRegionSelect);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadDynamicPunjabNews);
      window.removeEventListener('punjab_articles_updated', loadDynamicPunjabNews);
      window.removeEventListener('punjab_language_changed', loadDynamicPunjabNews);
      window.removeEventListener('punjab_region_select', handleRegionSelect);
    };
  }, [language]);

  const getFilteredNews = () => {
    if (activeRegion === 'majha') return regionalNews.majha;
    if (activeRegion === 'malwa') return regionalNews.malwa;
    if (activeRegion === 'doaba') return regionalNews.doaba;
    // 'all': combine all available items
    return [
      ...regionalNews.majha,
      ...regionalNews.malwa,
      ...regionalNews.doaba
    ].slice(0, 4);
  };

  const newsToDisplay = getFilteredNews();

  // If no articles have been published from admin yet, don't show an empty module
  if (newsToDisplay.length === 0) {
    return null;
  }

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
                          src={getCardImageUrl(item.img, 380)}
                          alt={item.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.3s',
                            imageRendering: '-webkit-optimize-contrast'
                          }}
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
