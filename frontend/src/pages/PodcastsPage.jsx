import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { podcastAPI } from '../services/api';
import AdBanner from '../components/Common/AdBanner';
import { formatArticleDate } from '../services/dateUtils';

// Helper to extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : null;
}

// Format date nicely in Punjabi (e.g., 7 ਅਕਤੂਬਰ, 2026)
function formatDate(dateStr) {
  if (!dateStr) return '';
  return formatArticleDate(dateStr, 'pa');
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayingId, setActivePlayingId] = useState(null);
  const [modalPodcast, setModalPodcast] = useState(null);

  // Lock body scroll when modal is open + handle Escape key
  useEffect(() => {
    if (modalPodcast) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setModalPodcast(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [modalPodcast]);

  useEffect(() => {
    let isMounted = true;
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const res = await podcastAPI.getPublished({ limit: 50 });
        if (isMounted && res && res.data) {
          setPodcasts(res.data);
          if (res.data.length > 0) {
            setActivePlayingId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load podcasts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPodcasts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered podcasts
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.host && p.host.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [podcasts, searchQuery]);

  // Featured Podcast (first one or active playing)
  const featuredPodcast = useMemo(() => {
    if (activePlayingId) {
      const found = podcasts.find((p) => p._id === activePlayingId);
      if (found) return found;
    }
    return podcasts[0] || null;
  }, [podcasts, activePlayingId]);

  const featuredYouTubeId = featuredPodcast ? extractYouTubeId(featuredPodcast.mediaUrl) : null;
  const isFeaturedVideo = featuredPodcast ? (featuredPodcast.mediaType === 'youtube' || Boolean(featuredYouTubeId)) : false;

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '16px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb & Clean Page Title (No Dark Banner) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
              <Link to="/" style={{ color: '#b71c1c', textDecoration: 'none', fontWeight: '700' }}>
                ਮੁੱਖ ਪੰਨਾ (Home)
              </Link>
              <span>/</span>
              <span style={{ color: '#0f172a', fontWeight: '800' }}>ਪੋਡਕਾਸਟ</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#1c2d5a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa fa-podcast" style={{ color: '#b71c1c' }}></i>
              <span>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਪੋਡਕਾਸਟ (Podcasts)</span>
            </h1>
          </div>
        </div>
        {/* 2. Spotlight: Featured Latest Episode */}
        {featuredPodcast && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              marginBottom: '36px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0' }}>
              {/* Left: Video Player */}
              <div style={{ backgroundColor: '#000000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isFeaturedVideo && featuredYouTubeId ? (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      key={featuredYouTubeId}
                      src={`https://www.youtube-nocookie.com/embed/${featuredYouTubeId}?autoplay=0&rel=0`}
                      title={featuredPodcast.title}
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
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={featuredPodcast.thumbnail || '/img/index_800x400-image01.jpg'}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                    />
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                      <audio controls src={featuredPodcast.mediaUrl} style={{ width: '100%' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Featured Info */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '4px' }}>
                      🔴 ਤਾਜ਼ਾ ਪੋਡਕਾਸਟ
                    </span>
                    {featuredPodcast.duration && (
                      <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#64748b' }}>
                        <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                        {featuredPodcast.duration}
                      </span>
                    )}
                    {featuredPodcast.publishedAt && (
                      <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        • {formatDate(featuredPodcast.publishedAt)}
                      </span>
                    )}
                  </div>

                  <h2 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: '1.35' }}>
                    {featuredPodcast.title}
                  </h2>

                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '13.5px',
                      color: '#475569',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {featuredPodcast.description}
                  </p>

                  {featuredPodcast.description && featuredPodcast.description.length > 120 && (
                    <button
                      type="button"
                      onClick={() => setModalPodcast(featuredPodcast)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#b71c1c',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '14px',
                        fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <span>ਹੋਰ ਪੜ੍ਹੋ... (Read More)</span>
                      <i className="fa fa-angle-right" style={{ fontSize: '13px', fontWeight: '900' }}></i>
                    </button>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>ਮੇਜ਼ਬਾਨ (Host):</span>
                    <strong style={{ fontSize: '13px', color: '#1c2d5a' }}>{featuredPodcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</strong>
                  </div>

                  {featuredPodcast.mediaUrl && (
                    <a
                      href={featuredPodcast.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa fa-youtube-play"></i>
                      <span>ਯੂਟਿਊਬ 'ਤੇ ਦੇਖੋ</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Filter Bar & Search */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            marginBottom: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          {/* Section Header: All Podcasts */}
          <div>
            <span
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                backgroundColor: '#1c2d5a',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}
            >
              <i className="fa fa-podcast"></i>
              <span>ਸਾਰੇ ਪੋਡਕਾਸਟ</span>
            </span>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '0 1 320px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ਪੋਡਕਾਸਟ ਖੋਜੋ... (Search podcasts)"
              style={{
                width: '100%',
                padding: '8px 36px 8px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <i className="fa fa-search" style={{ position: 'absolute', right: '12px', top: '11px', color: '#94a3b8' }}></i>
          </div>
        </div>

        {/* Advertisement Banner */}
        <AdBanner slot="podcasts_banner" containerStyle={{ marginBottom: '22px' }} />

        {/* 4. All Podcasts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', color: '#b71c1c', marginBottom: '12px', display: 'block' }}></i>
            <span>ਪੋਡਕਾਸਟ ਲੋਡ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...</span>
          </div>
        ) : filteredPodcasts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '48px 20px',
              textAlign: 'center',
              border: '1px dashed #cbd5e1'
            }}
          >
            <i className="fa fa-podcast" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px', display: 'block' }}></i>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>
              ਕੋਈ ਪੋਡਕਾਸਟ ਨਹੀਂ ਮਿਲਿਆ
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              {searchQuery ? 'ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।' : 'ਜਲਦ ਹੀ ਨਵੇਂ ਪੋਡਕਾਸਟ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤੇ ਜਾਣਗੇ।'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
            {filteredPodcasts.map((podcast) => {
              const ytId = extractYouTubeId(podcast.mediaUrl);
              const isVideo = podcast.mediaType === 'youtube' || Boolean(ytId);
              const isSpotlight = activePlayingId === podcast._id;

              return (
                <div
                  key={podcast._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: isSpotlight ? '2px solid #b71c1c' : '1px solid #e2e8f0',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Media Frame (Video or Thumbnail) */}
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, backgroundColor: '#000000', overflow: 'hidden' }}>
                    {isVideo && ytId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                        title={podcast.title}
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
                      />
                    ) : (
                      <>
                        <img
                          src={podcast.thumbnail || '/img/index_800x400-image01.jpg'}
                          alt=""
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '50%',
                              backgroundColor: '#b71c1c',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px'
                            }}
                          >
                            <i className="fa fa-play" style={{ marginLeft: '3px' }}></i>
                          </span>
                        </div>
                      </>
                    )}


                    {podcast.duration && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#ffffff',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: '700'
                        }}
                      >
                        ⏱ {podcast.duration}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#b71c1c', backgroundColor: '#fee2e2', padding: '1px 6px', borderRadius: '3px' }}>
                          ਪੋਡਕਾਸਟ
                        </span>
                        {podcast.publishedAt && (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {formatDate(podcast.publishedAt)}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          margin: '0 0 8px',
                          fontSize: '15px',
                          fontWeight: '800',
                          color: '#0f172a',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {podcast.title}
                      </h3>

                      <p
                        style={{
                          margin: '0 0 6px',
                          fontSize: '12.5px',
                          color: '#64748b',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {podcast.description}
                      </p>

                      {podcast.description && podcast.description.length > 80 && (
                        <button
                          type="button"
                          onClick={() => setModalPodcast(podcast)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#b71c1c',
                            fontWeight: '800',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '10px',
                            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          <span>ਹੋਰ ਪੜ੍ਹੋ (Read More)</span>
                          <i className="fa fa-angle-right"></i>
                        </button>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ color: '#64748b' }}>
                        ਮੇਜ਼ਬਾਨ: <strong style={{ color: '#334155' }}>{podcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setActivePlayingId(podcast._id);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#b71c1c',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        <span>ਮੁੱਖ ਪਲੇਅਰ 'ਚ ਚਲਾਓ</span>
                        <i className="fa fa-play-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Podcast Full Details Modal Popup */}
      {modalPodcast && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => setModalPodcast(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              border: '1.5px solid rgba(235, 177, 13, 0.4)',
              overflow: 'hidden',
              fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 22px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #1c2d5a 0%, #152244 100%)',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#ebb10d',
                    color: '#1c2d5a',
                    fontSize: '11px',
                    fontWeight: '900',
                    padding: '3px 9px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  <i className="fa fa-podcast" style={{ marginRight: '5px' }}></i> ਪੋਡਕਾਸਟ ਵੇਰਵੇ
                </span>
                {modalPodcast.duration && (
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                    <i className="fa fa-clock-o" style={{ marginRight: '4px', color: '#ebb10d' }}></i>
                    {modalPodcast.duration}
                  </span>
                )}
                {modalPodcast.publishedAt && (
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    • {formatDate(modalPodcast.publishedAt)}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalPodcast(null)}
                aria-label="ਬੰਦ ਕਰੋ (Close)"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b71c1c';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(90vh - 145px)'
              }}
            >
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#0f172a',
                  lineHeight: '1.35'
                }}
              >
                {modalPodcast.title}
              </h2>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '18px'
                }}
              >
                <i className="fa fa-microphone" style={{ color: '#b71c1c', fontSize: '13px' }}></i>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>ਮੇਜ਼ਬਾਨ (Host):</span>
                <strong style={{ fontSize: '13px', color: '#1c2d5a' }}>{modalPodcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</strong>
              </div>

              {/* Full Description with paragraph preservation */}
              <div
                style={{
                  fontSize: '14.5px',
                  color: '#334155',
                  lineHeight: '1.75',
                  whiteSpace: 'pre-line',
                  fontWeight: '500'
                }}
              >
                {modalPodcast.description}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => setModalPodcast(null)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਬੰਦ ਕਰੋ (Close)
              </button>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {modalPodcast._id !== activePlayingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePlayingId(modalPodcast._id);
                      setModalPodcast(null);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: '#1c2d5a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa fa-play-circle"></i>
                    <span>ਮੁੱਖ ਪਲੇਅਰ 'ਚ ਚਲਾਓ</span>
                  </button>
                )}

                {modalPodcast.mediaUrl && (
                  <a
                    href={modalPodcast.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa fa-youtube-play"></i>
                    <span>ਯੂਟਿਊਬ 'ਤੇ ਦੇਖੋ</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
