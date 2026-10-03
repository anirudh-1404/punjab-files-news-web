import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DarbarSahibMukhWak from './DarbarSahibMukhWak';
import { articleAPI, podcastAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';
import { getCardImageUrl } from '../../services/imageUtils';
import PodcastAudioCard from '../Common/PodcastAudioCard';

const DEFAULT_LEAD = {
  title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਵੱਡੀ ਮਨਜ਼ੂਰੀ',
  excerpt: 'ਸੂਬੇ ਦੇ ਸਰਬਪੱਖੀ ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਨਵੇਂ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਬਜਟ ਅਲਾਟ ਕੀਤਾ ਗਿਆ। ਸਿੱਖਿਆ ਅਤੇ ਸਿਹਤ ਦੇ ਖੇਤਰ ਵਿੱਚ ਵੱਡੇ ਸੁਧਾਰਾਂ ਦਾ ਐਲਾਨ।',
  category: 'punjab',
  categoryPa: 'ਪੰਜਾਬ • ਮੁੱਖ ਖ਼ਬਰ',
  authorName: 'ਸੰਪਾਦਕੀ ਡੈਸਕ',
  featuredImage: '/img/index_800x400-image01.jpg',
  slug: 'punjab-vidhan-sabha-session-bills-passed',
  publishedAt: new Date().toISOString()
};

const stripHtmlTags = (str) => {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function ParallaxHero() {
  const [leadStory, setLeadStory] = useState(DEFAULT_LEAD);
  const [latestPodcast, setLatestPodcast] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLead = async () => {
      try {
        const res = await articleAPI.getPublished({ limit: 1 });
        if (isMounted && res && res.data && res.data.length > 0) {
          setLeadStory(res.data[0]);
          return;
        }
      } catch (e) {}

      const local = getAllArticles();
      if (isMounted && local && local.length > 0) {
        setLeadStory(local[0]);
      }
    };

    const fetchPodcast = async () => {
      try {
        const res = await podcastAPI.getPublished({ limit: 1 });
        if (isMounted && res && res.data && res.data.length > 0) {
          setLatestPodcast(res.data[0]);
        }
      } catch (e) {}
    };

    fetchLead();
    fetchPodcast();
    window.addEventListener('storage', fetchLead);
    window.addEventListener('punjab_articles_updated', fetchLead);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', fetchLead);
      window.removeEventListener('punjab_articles_updated', fetchLead);
    };
  }, []);

  return (
    <section
      className="tv-studio-hero-section"
      style={{
        paddingTop: '8px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
      }}
    >
      <div className="container">
        <div
          className="hero-tri-layout-row"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          {/* ========================================================
              COLUMN 1 (approx 38%): HUKAMNAMA (PORTRAIT FORM) WITH LIVE CLOCK
          ======================================================== */}
          <div
            className="hero-col-hukamnama"
            style={{
              flex: '1 1 360px',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Section Header */}
            <div className="hero-col-header" style={{ marginBottom: '8px' }}>
              <span className="hero-col-badge badge-mukhwak" style={{ backgroundColor: '#ebb10d', color: '#0f172a', fontWeight: '800' }}>
                <i className="fa fa-book" style={{ marginRight: '6px' }}></i> ਮੁੱਖ ਵਾਕ
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title" style={{ fontSize: '14px', fontWeight: '800', color: '#1c2d5a' }}>
                ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ, ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ
              </h3>
            </div>

            {/* Sacred Portrait Hukamnama Card */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <DarbarSahibMukhWak />
            </div>
          </div>

          {/* ========================================================
              COLUMN 2 (approx 38%): CURRENT / MAIN HEADLINE (ਮੁੱਖ ਸੁਰਖ਼ੀ / LEAD STORY)
          ======================================================== */}
          <div
            className="hero-col-lead-headline"
            style={{
              flex: '1 1 360px',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Section Header */}
            <div className="hero-col-header" style={{ marginBottom: '8px' }}>
              <span className="hero-col-badge" style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontWeight: '800' }}>
                <span className="live-dot-pulse" style={{ width: '6px', height: '6px', marginRight: '6px' }}></span> ਮੁੱਖ ਸੁਰਖ਼ੀ
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title" style={{ fontSize: '14px', fontWeight: '800', color: '#1c2d5a' }}>
                ਅੱਜ ਦੀ ਵੱਡੀ ਖ਼ਬਰ (Lead Headline)
              </h3>
            </div>

            {/* Main Headline Hero Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s ease'
              }}
            >
              {/* Featured Image */}
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                <Link to={`/news/${leadStory.slug || leadStory.id || leadStory._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <img
                    src={getCardImageUrl(leadStory.featuredImage || '/img/index_800x400-image01.jpg', 600)}
                    alt={leadStory.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/index_800x400-image01.jpg';
                    }}
                  />
                </Link>

                {/* Badges on Image */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                    ਬ੍ਰੇਕਿੰਗ
                  </span>
                  <span style={{ backgroundColor: 'rgba(28, 45, 90, 0.85)', backdropFilter: 'blur(4px)', color: '#ebb10d', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '3px' }}>
                    {leadStory.categoryPa || 'ਪੰਜਾਬ'}
                  </span>
                </div>
              </div>

              {/* Headline Body */}
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2
                  style={{
                    margin: '0 0 10px',
                    fontSize: '18px',
                    fontWeight: '800',
                    lineHeight: '1.4',
                    color: '#0f172a'
                  }}
                >
                  <Link
                    to={`/news/${leadStory.slug || leadStory.id || leadStory._id}`}
                    style={{ color: '#0f172a', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#b71c1c')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                  >
                    {leadStory.title}
                  </Link>
                </h2>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: '13.5px',
                      lineHeight: '1.65',
                      color: '#475569',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {(() => {
                      const raw = leadStory.content && stripHtmlTags(leadStory.content).length > 50
                        ? leadStory.content
                        : (leadStory.excerpt || leadStory.content || '');
                      return stripHtmlTags(raw).slice(0, 450);
                    })()}
                  </p>
                </div>

                {/* Footer metadata & Read More CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa fa-user-circle" style={{ color: '#b71c1c' }}></i>
                    <span>{leadStory.authorName || 'ਸੰਪਾਦਕੀ ਡੈਸਕ'}</span>
                  </div>
                  <Link
                    to={`/news/${leadStory.slug || leadStory.id || leadStory._id}`}
                    style={{
                      color: '#b71c1c',
                      fontWeight: '800',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <span>ਹੋਰ ਪੜ੍ਹੋ</span>
                    <i className="fa fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              COLUMN 3 (approx 24% compact): WEB TV & PODCASTS
          ======================================================== */}
          <div
            className="hero-col-webtv"
            id="web-tv"
            style={{
              flex: '1 1 240px',
              maxWidth: '300px',
              minWidth: '220px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 1. WEB TV HEADER */}
            <div className="hero-col-header" style={{ marginBottom: '8px' }}>
              <span className="hero-col-badge badge-livetv" style={{ backgroundColor: '#b71c1c', color: '#fff', fontWeight: '800' }}>
                <span className="live-red-dot"></span> WEB TV
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title" style={{ fontSize: '13.5px', fontWeight: '800', color: '#1c2d5a' }}>
                24x7 HD ਪ੍ਰਸਾਰਣ
              </h3>
            </div>

            {/* TV Bezel Container - Tight wrap around video */}
            <div
              style={{
                backgroundColor: '#111317',
                borderRadius: '6px',
                padding: '8px 8px 10px',
                border: '1px solid #1c2d5a',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                marginBottom: '14px'
              }}
            >
              {/* TV Header Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 4px 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'livePulse 1.2s infinite' }}></span>
                  <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>
                    ON AIR • WEB TV
                  </span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#ebb10d' }}>
                  1080p HD
                </span>
              </div>

              {/* 16:9 Responsive Player */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '4px',
                  backgroundColor: '#000000'
                }}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0"
                  title="Punjab Files WEB TV"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                ></iframe>
              </div>
            </div>

            {/* 2. PODCASTS HEADER */}
            <div className="hero-col-header" style={{ marginBottom: '8px' }}>
              <span className="hero-col-badge badge-podcast" style={{ backgroundColor: '#b71c1c', color: '#fff', fontWeight: '800' }}>
                <i className="fa fa-podcast" style={{ marginRight: '6px' }}></i> ਪੋਡਕਾਸਟ
              </span>
              <span className="hero-col-divider">/</span>
              <h3 className="hero-col-title" style={{ fontSize: '13.5px', fontWeight: '800', color: '#1c2d5a' }}>
                ਨਵੇਂ ਐਪੀਸੋਡ
              </h3>
            </div>

            {/* Podcasts Box (Pure Audio Player or Empty State) */}
            {latestPodcast ? (
              <PodcastAudioCard podcast={latestPodcast} />
            ) : (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '6px',
                  padding: '16px 14px',
                  textAlign: 'center',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#b71c1c'
                  }}
                >
                  <i className="fa fa-podcast"></i>
                </div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                    ਨਵੇਂ ਪੋਡਕਾਸਟ ਜਲਦ ਆ ਰਹੇ ਹਨ
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                    ਪੰਜਾਬ ਦੇ ਤਾਜ਼ਾ ਮੁੱਦਿਆਂ 'ਤੇ ਵਿਸ਼ੇਸ਼ ਚਰਚਾ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
