import React, { useState } from 'react';

const galleryItems = [
  { img: '/img/index_slider-large-image01.jpg', title: 'ਤਸਵੀਰ 1' },
  { img: '/img/index_slider-large-image02.jpg', title: 'ਤਸਵੀਰ 2' },
  { img: '/img/index_slider-large-image03.jpg', title: 'ਤਸਵੀਰ 3' },
  { img: '/img/index_slider-large-image04.jpg', title: 'ਤਸਵੀਰ 4' },
  { img: '/img/index_slider-large-image05.jpg', title: 'ਤਸਵੀਰ 5' },
  { img: '/img/index_slider-large-image06.jpg', title: 'ਤਸਵੀਰ 6' }
];

export default function HomeGalleryModule() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? galleryItems.length - itemsPerPage : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= galleryItems.length - itemsPerPage ? 0 : prev + 1));
  };

  const visibleItems = [];
  for (let i = 0; i < itemsPerPage; i++) {
    visibleItems.push(galleryItems[(startIndex + i) % galleryItems.length]);
  }

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
                <div className="owl-item" style={{ flex: '1 0 calc(25% - 12px)', position: 'relative' }} key={idx}>
                  <div className="big-gallery" style={{ position: 'relative' }}>
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
