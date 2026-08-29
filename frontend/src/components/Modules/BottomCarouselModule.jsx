import React, { useState } from 'react';

const carouselItems = [
  {
    title: 'ਨਵੀਂ ਪੀੜ੍ਹੀ ਦੀ ਪਸੰਦ ਅਤੇ ਡਿਜੀਟਲ ਮੀਡੀਆ ਰਿਪੋਰਟਾਂ।',
    category: 'ਲਾਈਵ 24/7',
    date: 'ਸ਼ੁੱਕਰਵਾਰ, 24 ਅਕਤੂਬਰ 2026',
    img: '/img/index_108x108_slider-image01.jpg',
    link: '#watch-live'
  },
  {
    title: 'ਡਿਜੀਟਲ ਰੇਡੀਓ ਅਤੇ ਪੰਜਾਬੀ ਪੋਡਕਾਸਟ ਲੜੀ ਦਾ ਵਿਸਥਾਰ।',
    category: '24 ਟੀਵੀ ਤੇ ਰੇਡੀਓ',
    date: 'ਸ਼ੁੱਕਰਵਾਰ, 24 ਅਕਤੂਬਰ 2026',
    img: '/img/index_108x108_slider-image02.jpg',
    link: '#tv-radio'
  },
  {
    title: 'ਵਿਸ਼ੇਸ਼ ਡਾਕੂਮੈਂਟਰੀਆਂ ਅਤੇ ਜ਼ਮੀਨੀ ਖੋਜੀ ਪੱਤਰਕਾਰੀ ਸ਼ੋਅ।',
    category: 'ਵੈੱਬ ਸ਼ੋਅ',
    date: 'ਸ਼ੁੱਕਰਵਾਰ, 24 ਅਕਤੂਬਰ 2026',
    img: '/img/index_108x108_slider-image03.jpg',
    link: '#web-shows'
  },
  {
    title: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਸਟੋਰ ਅਤੇ ਓਰੀਜਨਲ ਕਿਤਾਬਾਂ ਤੇ ਮਰਚੈਂਡਾਈਜ਼।',
    category: 'ਸਟੋਰ',
    date: 'ਸ਼ੁੱਕਰਵਾਰ, 24 ਅਕਤੂਬਰ 2026',
    img: '/img/index_108x108_slider-image04.jpg',
    link: '#store'
  },
  {
    title: 'ਕਾਰੋਬਾਰੀ ਨਿਵੇਸ਼ ਅਤੇ ਨਵੀਨਤਮ ਤਕਨੀਕੀ ਵਿਕਾਸ ਯੋਜਨਾਵਾਂ।',
    category: 'ਵਪਾਰ',
    date: 'ਸ਼ੁੱਕਰਵਾਰ, 24 ਅਕਤੂਬਰ 2026',
    img: '/img/index_108x108_slider-image05.jpg',
    link: '#business'
  }
];

export default function BottomCarouselModule() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsVisible = 4;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const visibleItems = [];
  for (let i = 0; i < itemsVisible; i++) {
    visibleItems.push(carouselItems[(startIndex + i) % carouselItems.length]);
  }

  return (
    <section className="module highlight">
      <div className="container">
        <h3 className="carousel-title">ਪੰਜਾਬ ਫਾਈਲਜ਼ ਵਿਸ਼ੇਸ਼ ਗੈਲਰੀ</h3>
        <div id="small-gallery-slider" className="owl-carousel owl-theme" style={{ display: 'block', opacity: 1, position: 'relative' }}>
          <div className="owl-wrapper-outer">
            <div className="owl-wrapper" style={{ display: 'flex', gap: '15px' }}>
              {visibleItems.map((item, idx) => (
                <div className="owl-item" style={{ flex: '1 0 calc(25% - 12px)' }} key={idx}>
                  <div className="small-gallery">
                    <img className="img-responsive" src={item.img} alt={item.title} />
                    <div className="post-content">
                      <a href={item.link}>{item.category}</a>
                      <p>
                        <a href={item.link}>{item.title}</a>
                      </p>
                      <i className="fa fa-clock-o"></i>
                      <span className="day"> {item.date}</span>
                    </div>
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

        <div className="bottom-add-place"></div>
      </div>
    </section>
  );
}
