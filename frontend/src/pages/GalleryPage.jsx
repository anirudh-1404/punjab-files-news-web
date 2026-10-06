import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { galleryAPI, categoryAPI } from '../services/api';

// Core fallback categories matching Category Manager
export const DEFAULT_GALLERY_CATEGORIES = [
  { id: 'all', labelPa: 'ਸਾਰੀਆਂ ਤਸਵੀਰਾਂ', labelEn: 'All Photos', icon: 'fa-th-large' },
  { id: 'punjab', labelPa: 'ਪੰਜਾਬ', labelEn: 'Punjab', icon: 'fa-map-marker', color: '#b71c1c' },
  { id: 'religion', labelPa: 'ਧਰਮ ਤੇ ਵਿਰਾਸਤ', labelEn: 'Religion', icon: 'fa-book', color: '#059669' },
  { id: 'world', labelPa: 'ਦੇਸ਼-ਵਿਦੇਸ਼', labelEn: 'National & World', icon: 'fa-globe', color: '#1c2d5a' },
  { id: 'sport', labelPa: 'ਖੇਡਾਂ', labelEn: 'Sports', icon: 'fa-trophy', color: '#0284c7' },
  { id: 'health', labelPa: 'ਸਿਹਤ', labelEn: 'Health', icon: 'fa-heartbeat', color: '#e11d48' },
  { id: 'travel', labelPa: 'ਸੈਰ-ਸਪਾਟਾ', labelEn: 'Travel', icon: 'fa-plane', color: '#d97706' },
  { id: 'art-entertainment', labelPa: 'ਮਨੋਰੰਜਨ', labelEn: 'Entertainment', icon: 'fa-film', color: '#db2777' }
];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dynamic Categories from Category Manager
  const galleryCategories = useMemo(() => {
    const list = [{ id: 'all', labelPa: 'ਸਾਰੀਆਂ ਤਸਵੀਰਾਂ', labelEn: 'All Photos', icon: 'fa-th-large' }];
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        list.push({
          id: c.slug,
          labelPa: c.namePa,
          labelEn: c.nameEn,
          color: c.color || '#1c2d5a',
          icon: c.icon || 'fa-tag'
        });
      });
    } else {
      DEFAULT_GALLERY_CATEGORIES.slice(1).forEach((c) => list.push(c));
    }
    return list;
  }, [categories]);

  // Lightbox Modal State
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadGallery() {
      try {
        setLoading(true);
        const [galleryRes, catRes] = await Promise.all([
          galleryAPI.getPublic({ limit: 100 }),
          categoryAPI.getAll().catch(() => ({ data: [] }))
        ]);
        if (isMounted && galleryRes && Array.isArray(galleryRes.data)) {
          setItems(galleryRes.data);
        }
        if (isMounted && catRes && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered by Category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // Current active photo in Lightbox
  const activePhoto = useMemo(() => {
    if (activePhotoIndex === null || !filteredPhotos[activePhotoIndex]) return null;
    return filteredPhotos[activePhotoIndex];
  }, [filteredPhotos, activePhotoIndex]);

  // Next / Prev Handlers
  const handlePrev = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setActivePhotoIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  }, [filteredPhotos.length]);

  const handleCloseModal = useCallback(() => {
    setActivePhotoIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, handlePrev, handleNext, handleCloseModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhotoIndex]);

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '20px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb & Clean Page Title (No Dark Banner) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>
              <Link to="/" style={{ color: '#b71c1c', textDecoration: 'none', fontWeight: '700' }}>
                ਮੁੱਖ ਪੰਨਾ (Home)
              </Link>
              <span>/</span>
              <span style={{ color: '#0f172a', fontWeight: '800' }}>ਫ਼ੋਟੋ ਗੈਲਰੀ</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#1c2d5a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa fa-camera-retro" style={{ color: '#b71c1c' }}></i>
              <span>ਪੰਜਾਬ ਫਾਈਲਜ਼ ਫ਼ੋਟੋ ਗੈਲਰੀ (Photo Gallery)</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#ffffff', color: '#1c2d5a', border: '1.5px solid #cbd5e1', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              ਕੁੱਲ {filteredPhotos.length} ਤਸਵੀਰਾਂ
            </span>
          </div>
        </div>

        {/* Dynamic Category Filter Pills Toolbar (Sourced from Category Manager) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '26px',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', marginRight: '6px' }}>
            <i className="fa fa-filter" style={{ marginRight: '4px' }}></i> ਕੈਟੇਗਰੀ:
          </span>

          {galleryCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' ? items.length : items.filter((i) => i.category === cat.id).length;

            if (cat.id !== 'all' && count === 0 && !isSelected) return null;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? '800' : '600',
                  border: isSelected ? '1.5px solid #b71c1c' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#b71c1c' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(183, 28, 28, 0.25)' : 'none'
                }}
              >
                <i className={`fa ${cat.icon || 'fa-tag'}`} style={{ fontSize: '11px', color: isSelected ? '#ffffff' : cat.color || '#64748b' }}></i>
                <span>{cat.labelPa}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '10.5px',
                    fontWeight: '800',
                    marginLeft: '2px'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '36px', color: '#b71c1c', marginBottom: '14px', display: 'block' }}></i>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>ਗੈਲਰੀ ਤਸਵੀਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...</span>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px dashed #cbd5e1'
            }}
          >
            <i className="fa fa-camera-retro" style={{ fontSize: '48px', color: '#94a3b8', marginBottom: '14px', display: 'block' }}></i>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>
              ਇਸ ਕੈਟੇਗਰੀ ਵਿੱਚ ਕੋਈ ਤਸਵੀਰ ਨਹੀਂ ਮਿਲੀ
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              ਜਲਦ ਹੀ ਹੋਰ ਨਵੀਆਂ ਤਸਵੀਰਾਂ ਅੱਪਡੇਟ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ।
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredPhotos.map((photo, idx) => {
              const catObj = galleryCategories.find((c) => c.id === photo.category);

              return (
                <div
                  key={photo._id || idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className="gallery-photo-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(28, 45, 90, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Photo Frame with Hover Overlay */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '66.6%', // 3:2 ratio
                      backgroundColor: '#0f172a',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    {/* Category Tag Pill */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: catObj?.color || '#1c2d5a',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        zIndex: 2
                      }}
                    >
                      {photo.categoryNamePa || catObj?.labelPa || photo.category}
                    </span>

                    {/* Expand icon pill */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        backdropFilter: 'blur(3px)',
                        zIndex: 2
                      }}
                    >
                      <i className="fa fa-arrows-alt"></i>
                    </span>
                  </div>

                  {/* Caption & Metadata */}
                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        margin: '0 0 6px',
                        fontSize: '14.5px',
                        fontWeight: '800',
                        color: '#0f172a',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {photo.title}
                    </h3>

                    {photo.caption && (
                      <p
                        style={{
                          margin: '0 0 10px',
                          fontSize: '12px',
                          color: '#64748b',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {photo.caption}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                      <span>
                        <i className="fa fa-user" style={{ marginRight: '4px' }}></i>
                        {photo.photographer || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}
                      </span>
                      <span>
                        {photo.eventDate || new Date(photo.createdAt).toLocaleDateString('pa-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          FULL-SCREEN LIGHTBOX MODAL WITH NEXT / PREVIOUS ARROWS
      ========================================================================= */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 8, 16, 0.94)',
            backdropFilter: 'blur(6px)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          {/* Top Bar: Counter & Close Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              color: '#ffffff',
              paddingBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  letterSpacing: '0.5px'
                }}
              >
                {activePhotoIndex + 1} / {filteredPhotos.length}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                ਕੀਬੋਰਡ ਐਰੋ (← / →) ਨਾਲ ਅੱਗੇ-ਪਿੱਛੇ ਕਰੋ
              </span>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              title="ਬੰਦ ਕਰੋ (Close Escape)"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              &times;
            </button>
          </div>

          {/* Center Stage: Previous Arrow + Image + Next Arrow */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '1200px',
              width: '100%',
              margin: '0 auto',
              overflow: 'hidden'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              title="ਪਿਛਲੀ ਤਸਵੀਰ (Previous Image ←)"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b71c1c';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <i className="fa fa-chevron-left"></i>
            </button>

            {/* High-Res Image Display */}
            <div
              style={{
                maxWidth: '90%',
                maxHeight: '75vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  userSelect: 'none'
                }}
              />
            </div>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="ਅਗਲੀ ਤਸਵੀਰ (Next Image →)"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b71c1c';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>

          {/* Bottom Bar: Title, Caption, Photographer & Date */}
          <div
            className="lightbox-modal-content"
            style={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              backgroundColor: 'rgba(10, 16, 30, 0.95)',
              borderRadius: '10px',
              padding: '16px 22px',
              color: '#ffffff',
              boxSizing: 'border-box',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    boxShadow: '0 2px 6px rgba(183, 28, 28, 0.4)'
                  }}
                >
                  {activePhoto.categoryNamePa || activePhoto.category}
                </span>
                <div
                  className="lightbox-photo-title"
                  style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '900',
                    margin: 0
                  }}
                >
                  {activePhoto.title}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', gap: '16px', alignItems: 'center' }}>
                {activePhoto.photographer && (
                  <span className="lightbox-meta-item" style={{ color: '#ffffff' }}>
                    <i className="fa fa-user" style={{ marginRight: '5px', color: '#ebb10d' }}></i>
                    {activePhoto.photographer}
                  </span>
                )}
                {activePhoto.eventDate && (
                  <span className="lightbox-meta-item" style={{ color: '#cbd5e1' }}>
                    <i className="fa fa-calendar" style={{ marginRight: '5px', color: '#38bdf8' }}></i>
                    {activePhoto.eventDate}
                  </span>
                )}
              </div>
            </div>

            {activePhoto.caption && (
              <div
                className="lightbox-photo-caption"
                style={{
                  color: '#f8fafc',
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  marginTop: '6px'
                }}
              >
                {activePhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
