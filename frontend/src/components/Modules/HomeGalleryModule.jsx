import React, { useState } from 'react';

const galleryItems = [
  { img: '/img/index_slider-large-image01.jpg', title: 'Gallery 1' },
  { img: '/img/index_slider-large-image02.jpg', title: 'Gallery 2' },
  { img: '/img/index_slider-large-image03.jpg', title: 'Gallery 3' },
  { img: '/img/index_slider-large-image04.jpg', title: 'Gallery 4' },
  { img: '/img/index_slider-large-image05.jpg', title: 'Gallery 5' },
  { img: '/img/index_slider-large-image06.jpg', title: 'Gallery 6' }
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
    <section className="module">
      <h2 className="title-style05 style-02">
        more headlines in our <span><a href="#sections">item sections</a></span>
      </h2>
      <div className="center-title">
        <span className="title-line-left"></span>
        <h4 className="title-style05 style-01">latest # news</h4>
        <span className="title-line-right"></span>
      </div>

      <div className="container">
        <h3 className="carousel-title-gray">Home Gallery</h3>
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
