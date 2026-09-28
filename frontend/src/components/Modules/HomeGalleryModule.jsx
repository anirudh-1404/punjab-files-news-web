import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import { getAllArticles } from '../../services/articleStore';

export default function HomeGalleryModule() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    let isMounted = true;
    const loadGallery = async () => {
      try {
        const res = await articleAPI.getPublished({ limit: 12 });
        if (isMounted && res && res.data && res.data.length > 0) {
          const withImages = res.data
            .filter((a) => a.featuredImage)
            .map((a) => ({ img: a.featuredImage, title: a.title, id: a.slug || a._id }));
          if (withImages.length > 0) {
            setGalleryItems(withImages);
            return;
          }
        }
      } catch (e) {}

      const local = getAllArticles();
      if (isMounted) {
        const withImages = local
          .filter((a) => a.featuredImage)
          .map((a) => ({ img: a.featuredImage, title: a.title, id: a.slug || a.id }));
        setGalleryItems(withImages);
      }
    };

    loadGallery();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (galleryItems.length === 0) {
    return null;
  }

  const itemsPerPage = windowWidth < 640 ? 1 : windowWidth < 992 ? 2 : 4;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, galleryItems.length - itemsPerPage) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= galleryItems.length - itemsPerPage ? 0 : prev + 1));
  };

  const visibleItems = [];
  for (let i = 0; i < Math.min(itemsPerPage, galleryItems.length); i++) {
    visibleItems.push(galleryItems[(startIndex + i) % galleryItems.length]);
  }

  const flexBasis = itemsPerPage === 1 ? '100%' : itemsPerPage === 2 ? 'calc(50% - 8px)' : 'calc(25% - 12px)';

  return (
    <section className="module" style={{ backgroundColor: '#ffffff', paddingTop: '14px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Module Header - Single Row */}
        <div className="module-header-row">
          <div className="module-header-left">
            <span className="module-header-badge bg-red">ਗੈਲਰੀ</span>
            <span className="module-header-divider">/</span>
            <h3 className="module-header-title">
              ਤਸਵੀਰਾਂ ਅਤੇ ਵੀਡੀਓਜ਼ ਵਿੱਚ ਪੰਜਾਬ (Photo & Video Gallery)
            </h3>
          </div>
          <div className="module-header-right">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#b71c1c', backgroundColor: 'rgba(183, 28, 28, 0.08)', padding: '3px 8px', borderRadius: '3px' }}>
              <i className="fa fa-camera" style={{ marginRight: '4px' }}></i> ਖ਼ਾਸ ਝਲਕੀਆਂ
            </span>
          </div>
        </div>

        <div id="big-gallery-slider-3" className="owl-carousel owl-theme" style={{ display: 'block', opacity: 1, position: 'relative' }}>
          <div className="owl-wrapper-outer">
            <div className="owl-wrapper" style={{ display: 'flex', gap: '15px' }}>
              {visibleItems.map((item, idx) => (
                <div className="owl-item" style={{ flex: `1 0 ${flexBasis}`, maxWidth: flexBasis, position: 'relative' }} key={idx}>
                  <div className="big-gallery" style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    <a href="#video">
                      <span className="play-icon"></span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="owl-controls clickable" style={{ display: 'block' }}>
            <div className="owl-buttons">
              <div className="owl-prev" onClick={handlePrev} style={{ cursor: 'pointer' }}>
                <i className="fa fa-angle-left"></i>
              </div>
              <div className="owl-next" onClick={handleNext} style={{ cursor: 'pointer' }}>
                <i className="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
