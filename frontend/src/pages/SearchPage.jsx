import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { getAllArticles } from '../services/articleStore';
import { formatArticleDate } from '../services/dateUtils';

const CATEGORY_MAP = {
  punjab: 'ਪੰਜਾਬ',
  religion: 'ਧਰਮ',
  world: 'ਦੇਸ਼-ਵਿਦੇਸ਼',
  sport: 'ਖੇਡਾਂ',
  health: 'ਸਿਹਤ',
  travel: 'ਸੈਰ-ਸਪਾਟਾ',
  'art-entertainment': 'ਮਨੋਰੰਜਨ'
};

const POPULAR_TAGS = ['ਪੰਜਾਬ', 'ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ', 'ਅੰਮ੍ਰਿਤਸਰ', 'ਲੁਧਿਆਣਾ', 'ਖੇਡਾਂ', 'ਸਿਹਤ', 'ਮਨੋਰੰਜਨ', 'ਵਿਰਾਸਤ'];

// Expand bilingual search terms (English <-> Punjabi / Transliterations)
const BILINGUAL_KEYWORDS = {
  punjab: ["ਪੰਜਾਬ", "punjab", "panjab"],
  panjab: ["ਪੰਜਾਬ", "punjab", "panjab"],
  amritsar: ["ਅੰਮ੍ਰਿਤਸਰ", "amritsar"],
  ludhiana: ["ਲੁਧਿਆਣਾ", "ludhiana"],
  jalandhar: ["ਜਲੰਧਰ", "jalandhar"],
  bathinda: ["ਬਠਿੰਡਾ", "bathinda", "bhatinda"],
  bhatinda: ["ਬਠਿੰਡਾ", "bathinda", "bhatinda"],
  patiala: ["ਪਟਿਆਲਾ", "patiala"],
  gurdaspur: ["ਗੁਰਦਾਸਪੁਰ", "gurdaspur"],
  tarn: ["ਤਰਨਤਾਰਨ", "ਤਰਨ", "tarn"],
  tarntaran: ["ਤਰਨਤਾਰਨ", "tarntaran"],
  sangrur: ["ਸੰਗਰੂਰ", "sangrur"],
  moga: ["ਮੋਗਾ", "moga"],
  firozpur: ["ਫ਼ਿਰੋਜ਼ਪੁਰ", "firozpur", "ferozepur"],
  ferozepur: ["ਫ਼ਿਰੋਜ਼ਪੁਰ", "firozpur", "ferozepur"],
  hushiarpur: ["ਹੁਸ਼ਿਆਰਪੁਰ", "hushiarpur", "hoshiarpur"],
  hoshiarpur: ["ਹੁਸ਼ਿਆਰਪੁਰ", "hushiarpur", "hoshiarpur"],
  kapurthala: ["ਕਪੂਰਥਲਾ", "kapurthala"],
  pathankot: ["ਪਠਾਨਕੋਟ", "pathankot"],
  majha: ["ਮਾਝਾ", "majha"],
  malwa: ["ਮਾਲਵਾ", "malwa"],
  doaba: ["ਦੋਆਬਾ", "doaba"],
  sports: ["ਖੇਡ", "ਖੇਡਾਂ", "sport", "sports"],
  sport: ["ਖੇਡ", "ਖੇਡਾਂ", "sport", "sports"],
  health: ["ਸਿਹਤ", "health"],
  religion: ["ਧਰਮ", "religion"],
  religious: ["ਧਰਮ", "religious"],
  entertainment: ["ਮਨੋਰੰਜਨ", "entertainment", "cinema"],
  cinema: ["ਮਨੋਰੰਜਨ", "cinema"],
  travel: ["ਸੈਰ-ਸਪਾਟਾ", "ਵਿਰਸਾ", "travel"],
  heritage: ["ਵਿਰਸਾ", "heritage"],
  world: ["ਦੇਸ਼-ਵਿਦੇਸ਼", "ਵਿਦੇਸ਼", "world"],
  national: ["ਦੇਸ਼-ਵਿਦੇਸ਼", "ਰਾਸ਼ਟਰੀ", "national"],
  farmer: ["ਕਿਸਾਨ", "ਖੇਤੀ", "farmer"],
  farmers: ["ਕਿਸਾਨ", "ਖੇਤੀ", "farmers"],
  kisan: ["ਕਿਸਾਨ", "kisan"],
  police: ["ਪੁਲਿਸ", "police"],
  crime: ["ਜੁਰਮ", "ਅਪਰਾਧ", "crime"],
  darbar: ["ਦਰਬਾਰ", "darbar"],
  mukhwak: ["ਮੁੱਖਵਾਕ", "ਹੁਕਮਨਾਮਾ", "mukhwak"],
  hukamnama: ["ਹੁਕਮਨਾਮਾ", "ਮੁੱਖਵਾਕ", "hukamnama"],
  live: ["ਲਾਈਵ", "live"],
  modi: ["ਮੋਦੀ", "modi"],
  mann: ["ਮਾਨ", "ਭਗਵੰਤ", "mann"],
  bhagwant: ["ਭਗਵੰਤ", "ਮਾਨ", "bhagwant"]
};

const getSearchTerms = (str) => {
  if (!str) return [];
  const clean = str.trim();
  const lower = clean.toLowerCase();
  const terms = new Set([clean, lower]);

  Object.keys(BILINGUAL_KEYWORDS).forEach((key) => {
    if (lower.includes(key)) {
      BILINGUAL_KEYWORDS[key].forEach((t) => terms.add(t));
    }
  });

  return Array.from(terms);
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync search input if query param changes
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Fetch / filter articles
  const executeSearch = useCallback(async (query) => {
    setLoading(true);
    try {
      let backendResults = [];
      try {
        const res = await articleAPI.getPublished({ search: query, limit: 50 });
        backendResults = res.data || res.articles || [];
      } catch (e) {
        console.warn('Backend search error, falling back to local store:', e.message);
      }

      // Also search local store for complete coverage
      const localAll = getAllArticles();
      const searchTerms = getSearchTerms(query);
      const localMatches = searchTerms.length > 0
        ? localAll.filter((art) => {
            const title = (art.title || '').toLowerCase();
            const excerpt = (art.excerpt || '').toLowerCase();
            const content = (art.content || '').toLowerCase();
            const author = (art.author || art.authorName || '').toLowerCase();
            const cat = (art.category || '').toLowerCase();
            const region = (art.punjabRegion || '').toLowerCase();
            const slug = (art.slug || '').toLowerCase();

            return searchTerms.some((term) =>
              title.includes(term) ||
              excerpt.includes(term) ||
              content.includes(term) ||
              author.includes(term) ||
              cat.includes(term) ||
              region.includes(term) ||
              slug.includes(term)
            );
          })
        : localAll;

      // Merge backend and local matches uniquely by slug or id
      const seenIds = new Set();
      const combined = [];

      backendResults.forEach((art) => {
        const key = art.slug || art._id;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          combined.push(art);
        }
      });

      localMatches.forEach((art) => {
        const key = art.slug || art.id || art._id;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          combined.push(art);
        }
      });

      setArticles(combined);
    } catch (err) {
      console.error('Failed to execute search:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    executeSearch(queryParam);
  }, [queryParam, executeSearch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
    setSearchParams({ q: tag });
  };

  // Filter by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return articles;
    return articles.filter((art) => art.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div
      className="search-page-wrapper"
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '80vh',
        padding: '30px 0 60px',
        fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '18px', fontSize: '13.5px', color: '#64748b' }}>
          <Link to="/" style={{ color: '#b71c1c', fontWeight: '700', textDecoration: 'none' }}>
            ਮੁੱਖ ਪੰਨਾ
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0f172a', fontWeight: '700' }}>ਖ਼ਬਰਾਂ ਦੀ ਖੋਜ (Search)</span>
        </div>

        {/* Main Search Header Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: '28px 24px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            borderTop: '4px solid #b71c1c'
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 10px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <i className="fa fa-search" style={{ color: '#b71c1c' }}></i>
            <span>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਖੋਜ ਕੇਂਦਰ (News Search)</span>
          </h1>
          <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' }}>
            ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ, ਸ਼ਹਿਰ, ਲੇਖਕ ਜਾਂ ਖ਼ਬਰ ਦਾ ਨਾਂ ਲਿਖ ਕੇ ਤੁਰੰਤ ਭਾਲੋ।
          </p>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ਖ਼ਬਰ ਦਾ ਨਾਮ, ਲੇਖਕ ਜਾਂ ਵਿਸ਼ਾ ਲਿਖੋ... (e.g. ਅੰਮ੍ਰਿਤਸਰ, ਖੇਡਾਂ)"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #cbd5e1',
                  fontSize: '15px',
                  outline: 'none',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#f8fafc'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#b71c1c')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 26px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(183,28,28,0.3)',
                transition: 'background-color 0.2s'
              }}
            >
              <i className="fa fa-search"></i>
              <span>ਖੋਜ ਕਰੋ</span>
            </button>
          </form>

          {/* Popular Search Tags */}
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>
              <i className="fa fa-fire" style={{ color: '#ebb10d', marginRight: '4px' }}></i> ਪ੍ਰਮੁੱਖ ਵਿਸ਼ੇ:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                style={{
                  background: queryParam === tag ? '#b71c1c' : '#f1f5f9',
                  color: queryParam === tag ? '#ffffff' : '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata & Category Filter Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '22px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {queryParam ? (
                <>
                  "{queryParam}" ਲਈ ਨਤੀਜੇ: <span style={{ color: '#b71c1c' }}>{filteredArticles.length} ਖ਼ਬਰਾਂ ਮਿਲੀਆਂ</span>
                </>
              ) : (
                <>
                  ਸਾਰੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ: <span style={{ color: '#b71c1c' }}>{filteredArticles.length}</span>
                </>
              )}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? '#1c2d5a' : '#ffffff',
                color: selectedCategory === 'all' ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ਸਭ ਕੈਟੇਗਰੀਆਂ
            </button>
            {Object.entries(CATEGORY_MAP).map(([catKey, catName]) => (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                style={{
                  backgroundColor: selectedCategory === catKey ? '#1c2d5a' : '#ffffff',
                  color: selectedCategory === catKey ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {catName}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style={{ color: '#b71c1c' }}></i>
            <p style={{ marginTop: '16px', fontSize: '15px', color: '#64748b', fontWeight: '700' }}>
              ਖ਼ਬਰਾਂ ਖੋਜੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ, ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ...
            </p>
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty State */
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: '#fef2f2',
                color: '#b71c1c',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                marginBottom: '16px'
              }}
            >
              <i className="fa fa-search-minus"></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
              ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ
            </h3>
            <p style={{ color: '#64748b', fontSize: '14.5px', maxWidth: '480px', margin: '0 auto 20px' }}>
              ਤੁਹਾਡੇ ਵੱਲੋਂ ਲਿਖੇ ਸ਼ਬਦ "{queryParam}" ਨਾਲ ਮਿਲਦੀ ਕੋਈ ਵੀ ਖ਼ਬਰ ਨਹੀਂ ਲੱਭੀ। ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਬਦ-ਜੋੜ (spelling) ਚੈੱਕ ਕਰੋ ਜਾਂ ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਵਰਤੋ।
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchParams({});
                }}
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਦੇਖੋ
              </button>
              <Link
                to="/"
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਵਾਪਸ ਜਾਓ
              </Link>
            </div>
          </div>
        ) : (
          /* Results Article Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {filteredArticles.map((art) => {
              const articleId = art.slug || art._id || art.id;
              const title = art.title || 'ਬਿਨਾਂ ਸਿਰਲੇਖ ਖ਼ਬਰ';
              const excerpt = art.excerpt || (art.content ? art.content.slice(0, 120) + '...' : '');
              const image = art.featuredImage || '/img/index_800x400-image01.jpg';
              const dateText = formatArticleDate(art.createdAt || art.publicationDate);
              const author = art.authorName || art.author || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਬਿਊਰੋ';
              const catLabel = CATEGORY_MAP[art.category] || art.category || 'ਪੰਜਾਬ';

              return (
                <div
                  key={articleId}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Article Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <Link to={`/news/${articleId}`}>
                      <img
                        src={image}
                        alt={title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = '/img/index_800x400-image01.jpg';
                        }}
                      />
                    </Link>
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#b71c1c',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        letterSpacing: '0.3px'
                      }}
                    >
                      {catLabel}
                    </span>
                    {art.punjabRegion && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: '#1c2d5a',
                          color: '#ebb10d',
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {art.punjabRegion.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Article Body */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Meta info */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                      <span><i className="fa fa-calendar-o" style={{ marginRight: '4px' }}></i>{dateText}</span>
                      <span><i className="fa fa-eye" style={{ marginRight: '4px' }}></i>{art.views || 108}</span>
                    </div>

                    {/* Headline */}
                    <h3
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: '16px',
                        fontWeight: '800',
                        lineHeight: 1.4,
                        color: '#0f172a'
                      }}
                    >
                      <Link
                        to={`/news/${articleId}`}
                        style={{
                          color: '#0f172a',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#b71c1c')}
                        onMouseLeave={(e) => (e.target.style.color = '#0f172a')}
                      >
                        {title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p
                      style={{
                        margin: '0 0 14px 0',
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: 1.5,
                        flex: 1
                      }}
                    >
                      {excerpt}
                    </p>

                    {/* Author & Read More Link */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '12.5px'
                      }}
                    >
                      <span style={{ color: '#475569', fontWeight: '700' }}>
                        <i className="fa fa-user-circle" style={{ color: '#ebb10d', marginRight: '5px' }}></i>
                        {author}
                      </span>
                      <Link
                        to={`/news/${articleId}`}
                        style={{
                          color: '#b71c1c',
                          fontWeight: '800',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        ਪੜ੍ਹੋ <i className="fa fa-arrow-right" style={{ fontSize: '11px' }}></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
