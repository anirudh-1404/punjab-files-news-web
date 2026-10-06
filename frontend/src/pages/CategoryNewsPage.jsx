import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../services/api';
import { getAllArticles } from '../services/articleStore';
import { formatArticleDate } from '../services/dateUtils';
import { getHighResImageUrl, getCardImageUrl } from '../services/imageUtils';
import { useLanguage } from '../context/LanguageContext';
import AdBanner from '../components/Common/AdBanner';

const REGION_INFO = {
  majha: {
    namePa: 'ਮਾਝਾ',
    nameEn: 'Majha',
    tagline: 'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ, ਤਰਨਤਾਰਨ ਅਤੇ ਪਠਾਨਕੋਟ ਜ਼ਿਲ੍ਹਿਆਂ ਦੀਆਂ ਤਾਜ਼ਾ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ',
    color: '#b71c1c',
    bg: '#fef2f2',
    districts: ['ਅੰਮ੍ਰਿਤਸਰ', 'ਗੁਰਦਾਸਪੁਰ', 'ਤਰਨਤਾਰਨ', 'ਪਠਾਨਕੋਟ']
  },
  malwa: {
    namePa: 'ਮਾਲਵਾ',
    nameEn: 'Malwa',
    tagline: 'ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ, ਸੰਗਰੂਰ, ਮੋਗਾ, ਫ਼ਿਰੋਜ਼ਪੁਰ ਅਤੇ ਮਾਨਸਾ ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਖ਼ਬਰਾਂ',
    color: '#1c2d5a',
    bg: '#f0f9ff',
    districts: ['ਲੁਧਿਆਣਾ', 'ਬਠਿੰਡਾ', 'ਪਟਿਆਲਾ', 'ਸੰਗਰੂਰ', 'ਮੋਗਾ', 'ਫ਼ਿਰੋਜ਼ਪੁਰ', 'ਫ਼ਾਜ਼ਿਲਕਾ', 'ਮਾਨਸਾ']
  },
  doaba: {
    namePa: 'ਦੋਆਬਾ',
    nameEn: 'Doaba',
    tagline: 'ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ, ਕਪੂਰਥਲਾ ਅਤੇ ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ ਨਗਰ (ਨਵਾਂਸ਼ਹਿਰ) ਦੀਆਂ ਖ਼ਾਸ ਰਿਪੋਰਟਾਂ',
    color: '#047857',
    bg: '#f0fdf4',
    districts: ['ਜਲੰਧਰ', 'ਹੁਸ਼ਿਆਰਪੁਰ', 'ਕਪੂਰਥਲਾ', 'ਨਵਾਂਸ਼ਹਿਰ (SBS ਨਗਰ)']
  },
  all: {
    namePa: 'ਸਾਰਾ ਪੰਜਾਬ',
    nameEn: 'All Punjab',
    tagline: 'ਪੰਜਾਬ ਭਰ ਦੇ ਸਾਰੇ 23 ਜ਼ਿਲ੍ਹਿਆਂ ਦੀਆਂ ਤਾਜ਼ਾ, ਭਰੋਸੇਯੋਗ ਅਤੇ ਨਿਰਪੱਖ ਖ਼ਬਰਾਂ',
    color: '#b71c1c',
    bg: '#fef2f2',
    districts: ['ਮਾਝਾ', 'ਮਾਲਵਾ', 'ਦੋਆਬਾ']
  }
};

const CATEGORY_NAMES = {
  punjab: 'ਪੰਜਾਬ ਵਿਸ਼ੇਸ਼ (Punjab News)',
  religion: 'ਧਰਮ ਤੇ ਅਧਿਆਤਮ (Religion)',
  world: 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & International)',
  sport: 'ਖੇਡ ਜਗਤ (Sports)',
  health: 'ਸਿਹਤ ਸੰਭਾਲ (Health & Wellness)',
  travel: 'ਸੈਰ-ਸਪਾਟਾ ਤੇ ਵਿਰਸਾ (Travel & Heritage)',
  'art-entertainment': 'ਮਨੋਰੰਜਨ ਤੇ ਸਿਨੇਮਾ (Entertainment)',
  politics: 'ਰਾਜਨੀਤੀ (Politics)',
  business: 'ਵਪਾਰ ਤੇ ਕਾਰੋਬਾਰ (Business)'
};

export default function CategoryNewsPage() {
  const { category = 'punjab', subRegion } = useParams();
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [trendingArticles, setTrendingArticles] = useState([]);

  const currentRegionKey = subRegion ? subRegion.toLowerCase() : 'all';
  const regionInfo = REGION_INFO[currentRegionKey] || REGION_INFO.all;
  const categoryTitle = categoryMeta
    ? `${categoryMeta.namePa} (${categoryMeta.nameEn})`
    : (CATEGORY_NAMES[category] || category.toUpperCase());

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadCategoryData() {
      try {
        setLoading(true);

        // 0. Fetch category metadata if custom
        try {
          const catRes = await categoryAPI.getAll();
          if (isMounted && catRes && catRes.data) {
            const found = catRes.data.find((c) => c.slug === category);
            if (found) setCategoryMeta(found);
          }
        } catch (e) {}

        // 1. Fetch published articles from backend
        const queryParams = { category, limit: 30, language };
        if (subRegion && subRegion !== 'all') {
          queryParams.punjabRegion = subRegion.toLowerCase();
        }

        const res = await articleAPI.getPublished(queryParams);
        let liveArticles = Array.isArray(res?.data) ? res.data : [];

        if (isMounted) {
          setArticles(liveArticles);
          // Trending articles from general store or api
          const allStoreArticles = getAllArticles({ language });
          setTrendingArticles(allStoreArticles.slice(0, 5));
        }
      } catch (err) {
        console.warn('Backend load error, checking local store:', err);
        if (isMounted) {
          const filter = { category, language };
          if (subRegion && subRegion !== 'all') {
            filter.punjabRegion = subRegion.toLowerCase();
          }
          const localList = getAllArticles(filter);
          setArticles(localList);
          setTrendingArticles(getAllArticles({ language }).slice(0, 5));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCategoryData();
    window.addEventListener('storage', loadCategoryData);
    window.addEventListener('punjab_articles_updated', loadCategoryData);
    window.addEventListener('punjab_language_changed', loadCategoryData);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadCategoryData);
      window.removeEventListener('punjab_articles_updated', loadCategoryData);
      window.removeEventListener('punjab_language_changed', loadCategoryData);
    };
  }, [category, subRegion, language]);

  const leadArticle = articles[0] || null;
  const otherArticles = articles.slice(1);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 0' }}>
        <div className="container">
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '12.5px',
              color: '#64748b'
            }}
          >
            <li>
              <Link to="/" style={{ color: '#0f172a', fontWeight: '700', textDecoration: 'none' }}>
                <i className="fa fa-home"></i> ਮੁੱਖ ਪੰਨਾ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/category/punjab" style={{ color: '#b71c1c', fontWeight: '700', textDecoration: 'none' }}>
                ਪੰਜਾਬ (Punjab)
              </Link>
            </li>
            {subRegion && (
              <>
                <li>/</li>
                <li style={{ color: regionInfo.color, fontWeight: '800' }}>
                  {regionInfo.namePa} ({regionInfo.nameEn})
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* 2. REGION / CATEGORY HERO HEADER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #e2e8f0',
          padding: '24px 0 20px',
          marginBottom: '28px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span
                  style={{
                    backgroundColor: regionInfo.color,
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    letterSpacing: '0.5px'
                  }}
                >
                  ਖੇਤਰੀ ਨਿਊਜ਼ ਡੈਸਕ (REGIONAL DESK)
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  • {articles.length} ਖ਼ਬਰਾਂ ਉਪਲਬਧ
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: '26px',
                  fontWeight: '800',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>ਪੰਜਾਬ ਵਿਸ਼ੇਸ਼: {regionInfo.namePa}</span>
                <span style={{ fontSize: '16px', color: '#64748b', fontWeight: '600' }}>
                  ({regionInfo.nameEn})
                </span>
              </h1>

              <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#475569' }}>
                {regionInfo.tagline}
              </p>
            </div>

            {/* Region Switcher Buttons */}
            {category === 'punjab' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <Link
                  to="/category/punjab"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    backgroundColor: currentRegionKey === 'all' ? '#1c2d5a' : 'transparent',
                    color: currentRegionKey === 'all' ? '#ffffff' : '#334155',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ਸਾਰਾ ਪੰਜਾਬ
                </Link>
                <Link
                  to="/category/punjab/majha"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    backgroundColor: currentRegionKey === 'majha' ? '#b71c1c' : 'transparent',
                    color: currentRegionKey === 'majha' ? '#ffffff' : '#334155',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ਮਾਝਾ (Majha)
                </Link>
                <Link
                  to="/category/punjab/malwa"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    backgroundColor: currentRegionKey === 'malwa' ? '#1c2d5a' : 'transparent',
                    color: currentRegionKey === 'malwa' ? '#ffffff' : '#334155',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ਮਾਲਵਾ (Malwa)
                </Link>
                <Link
                  to="/category/punjab/doaba"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    backgroundColor: currentRegionKey === 'doaba' ? '#047857' : 'transparent',
                    color: currentRegionKey === 'doaba' ? '#ffffff' : '#334155',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ਦੋਆਬਾ (Doaba)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT LAYOUT */}
      <div className="container">
        <div className="row">
          {/* Main Articles Column */}
          <div className="col-md-8 col-sm-12">
            {loading ? (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', color: '#b71c1c', marginBottom: '14px' }}></i>
                <h4 style={{ margin: 0, color: '#334155' }}>ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...</h4>
              </div>
            ) : articles.length === 0 ? (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fa fa-newspaper-o" style={{ fontSize: '42px', color: '#cbd5e1', marginBottom: '16px' }}></i>
                <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>ਇਸ ਖੇਤਰ ਵਿੱਚ ਫ਼ਿਲਹਾਲ ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਹੈ</h3>
                <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px' }}>
                  ਜਲਦ ਹੀ ਸਾਡੀ ਫੀਲਡ ਰਿਪੋਰਟਿੰਗ ਟੀਮ ਵੱਲੋਂ ਨਵੀਆਂ ਖ਼ਬਰਾਂ ਅੱਪਡੇਟ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ।
                </p>
                <Link
                  to="/"
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    padding: '10px 22px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਵਾਪਸ ਜਾਓ
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Lead Story */}
                {leadArticle && (
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      marginBottom: '28px',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <Link
                      to={`/news/${leadArticle.slug || leadArticle._id || leadArticle.id}`}
                      style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
                    >
                      <div style={{ height: '340px', overflow: 'hidden', position: 'relative', backgroundColor: '#0f172a' }}>
                        <img
                          src={getHighResImageUrl(leadArticle.featuredImage || '/img/index_800x400-image01.jpg')}
                          alt={leadArticle.title}
                          loading="eager"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            imageRendering: '-webkit-optimize-contrast'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: '#b71c1c',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '4px 12px',
                            borderRadius: '3px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                          }}
                        >
                          ਪ੍ਰਮੁੱਖ ਖ਼ਬਰ (LEAD STORY)
                        </div>
                      </div>
                    </Link>

                    <div style={{ padding: '22px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '12px', color: '#64748b' }}>
                        <span style={{ fontWeight: '700', color: regionInfo.color }}>
                          <i className="fa fa-map-marker"></i> {leadArticle.district || regionInfo.namePa}
                        </span>
                        <span>•</span>
                        <span>
                          <i className="fa fa-user"></i> {leadArticle.authorName || 'ਸੰਪਾਦਕੀ ਡੈਸਕ'}
                        </span>
                        <span>•</span>
                        <span>
                          <i className="fa fa-clock-o"></i>{' '}
                          {formatArticleDate(leadArticle.publishedAt || leadArticle.createdAt, leadArticle.language)}
                        </span>
                      </div>

                      <h2 style={{ margin: '0 0 10px', fontSize: '21px', fontWeight: '800', lineHeight: '1.4' }}>
                        <Link
                          to={`/news/${leadArticle.slug || leadArticle._id || leadArticle.id}`}
                          style={{ color: '#0f172a', textDecoration: 'none' }}
                        >
                          {leadArticle.title}
                        </Link>
                      </h2>

                      <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                        {leadArticle.excerpt || leadArticle.content?.substring(0, 180) + '...'}
                      </p>

                      <Link
                        to={`/news/${leadArticle.slug || leadArticle._id || leadArticle.id}`}
                        style={{
                          backgroundColor: '#1c2d5a',
                          color: '#ffffff',
                          padding: '8px 18px',
                          borderRadius: '4px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        ਪੂਰੀ ਖ਼ਬਰ ਪੜ੍ਹੋ <i className="fa fa-angle-right"></i>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sub-grid of Other Articles */}
                {otherArticles.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                    {otherArticles.map((art) => (
                      <div
                        key={art._id || art.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <Link
                          to={`/news/${art.slug || art._id || art.id}`}
                          style={{ textDecoration: 'none', display: 'block', height: '180px', overflow: 'hidden' }}
                        >
                          <img
                            src={getCardImageUrl(art.featuredImage || '/img/index_800x400-image02.jpg', 420)}
                            alt={art.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              imageRendering: '-webkit-optimize-contrast'
                            }}
                          />
                        </Link>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '11.5px', color: '#64748b' }}>
                            <span
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#0f172a',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '3px'
                              }}
                            >
                              {art.district || regionInfo.namePa}
                            </span>
                            <span>•</span>
                            <span>
                              {formatArticleDate(art.publishedAt || art.createdAt, art.language)}
                            </span>
                          </div>

                          <h3 style={{ margin: '0 0 10px', fontSize: '15.5px', fontWeight: '800', lineHeight: '1.4' }}>
                            <Link
                              to={`/news/${art.slug || art._id || art.id}`}
                              style={{ color: '#0f172a', textDecoration: 'none' }}
                            >
                              {art.title}
                            </Link>
                          </h3>

                          <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b', lineHeight: '1.5', flex: 1 }}>
                            {art.excerpt?.substring(0, 110) || art.content?.substring(0, 110)}...
                          </p>

                          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#94a3b8' }}>
                            <span>
                              <i className="fa fa-user" style={{ marginRight: '4px' }}></i> {art.authorName || 'ਪੱਤਰਕਾਰ'}
                            </span>
                            <Link
                              to={`/news/${art.slug || art._id || art.id}`}
                              style={{ color: '#b71c1c', fontWeight: '700', textDecoration: 'none' }}
                            >
                              ਪੜ੍ਹੋ <i className="fa fa-angle-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="col-md-4 col-sm-12">
            {/* 1. Regional Quick Jump Widget */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <h4
                style={{
                  margin: '0 0 14px',
                  fontSize: '15px',
                  fontWeight: '800',
                  color: '#0f172a',
                  borderBottom: '2px solid #b71c1c',
                  paddingBottom: '8px'
                }}
              >
                ਪੰਜਾਬ ਦੇ ਹੋਰ ਖਿੱਤੇ (Other Regions)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  to="/category/punjab/majha"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: currentRegionKey === 'majha' ? '#fef2f2' : '#f8fafc',
                    border: currentRegionKey === 'majha' ? '2px solid #b71c1c' : '1px solid #e2e8f0',
                    color: currentRegionKey === 'majha' ? '#b71c1c' : '#1e293b',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>ਮਾਝਾ (Majha)</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ...</span>
                </Link>

                <Link
                  to="/category/punjab/malwa"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: currentRegionKey === 'malwa' ? '#f0f9ff' : '#f8fafc',
                    border: currentRegionKey === 'malwa' ? '2px solid #1c2d5a' : '1px solid #e2e8f0',
                    color: currentRegionKey === 'malwa' ? '#1c2d5a' : '#1e293b',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>ਮਾਲਵਾ (Malwa)</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ...</span>
                </Link>

                <Link
                  to="/category/punjab/doaba"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: currentRegionKey === 'doaba' ? '#f0fdf4' : '#f8fafc',
                    border: currentRegionKey === 'doaba' ? '2px solid #047857' : '1px solid #e2e8f0',
                    color: currentRegionKey === 'doaba' ? '#047857' : '#1e293b',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>ਦੋਆਬਾ (Doaba)</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ...</span>
                </Link>
              </div>
            </div>

            {/* 2. Trending / Readers' Choice Widget */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <h4
                style={{
                  margin: '0 0 14px',
                  fontSize: '15px',
                  fontWeight: '800',
                  color: '#0f172a',
                  borderBottom: '2px solid #ebb10d',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-fire" style={{ color: '#d97706' }}></i> ਪਾਠਕਾਂ ਦੀ ਪਸੰਦ (Trending)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id || idx}
                    to={`/news/${art.id}`}
                    style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center' }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: idx === 0 ? '#b71c1c' : idx === 1 ? '#ebb10d' : '#f1f5f9',
                        color: idx < 2 ? '#ffffff' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '800',
                        flexShrink: 0
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h5
                        style={{
                          margin: '0 0 3px',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#0f172a',
                          lineHeight: '1.4'
                        }}
                      >
                        {art.title?.substring(0, 70)}...
                      </h5>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {art.views || 100 + idx * 30} ਪਾਠਕਾਂ ਨੇ ਪੜ੍ਹਿਆ
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Ad Banner (300x250) - Hidden if no ad */}
            <AdBanner slot="sidebar_rectangle" containerStyle={{ marginBottom: '24px' }} />

            {/* 3. Live TV Promotional Box */}
            <div
              className="dark-box"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  marginBottom: '10px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'pulse 1s infinite' }}></span>
                ਲਾਈਵ ਸਟ੍ਰੀਮ 24/7
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                ਪੰਜਾਬ ਫਾਈਲਜ਼ ਲਾਈਵ ਟੀਵੀ
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: '#94a3b8' }}>
                ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਗੁਰਬਾਣੀ ਪ੍ਰਸਾਰਣ ਅਤੇ ਪੰਜਾਬ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਲਾਈਵ ਦੇਖੋ।
              </p>
              <Link
                to="/#live-tv"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-play-circle" style={{ color: '#b71c1c' }}></i> ਹੁਣੇ ਲਾਈਵ ਦੇਖੋ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
