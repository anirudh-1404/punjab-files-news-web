import React, { useState, useEffect } from 'react';

const slidesData = [
  [
    {
      cls: 'first',
      category: 'Around the World',
      badgeClass: 'bg-1',
      title: "New global rules on firms' tax disclosure urged by economists",
      img: '/img/index_slider-image01.jpg',
      link: '#news'
    },
    {
      cls: 'second',
      category: 'Politics',
      badgeClass: 'bg-6',
      title: 'How legislative referendum has changed politics, whatever the result',
      img: '/img/index_slider-image02.jpg',
      link: '#politics'
    },
    {
      cls: 'third',
      category: 'Sport News',
      badgeClass: 'bg-4',
      title: 'Championship Countdown: Grand tournament race preview',
      img: '/img/index_slider-image03.jpg',
      link: '#sport'
    },
    {
      cls: 'fourth',
      category: 'Travel',
      badgeClass: 'bg-2',
      title: 'Get the latest travel news, transit corridors and train times',
      img: '/img/index_slider-image04.jpg',
      link: '#travel'
    }
  ],
  [
    {
      cls: 'first',
      category: 'Technology',
      badgeClass: 'bg-1',
      title: 'Tech Leaders interview: a manifesto for involving citizens in science',
      img: '/img/index_slider-image05.jpg',
      link: '#tech'
    },
    {
      cls: 'second',
      category: 'Lifestyle',
      badgeClass: 'bg-6',
      title: 'Feelgood fashion & wellbeing: habits that enhance your daily mood',
      img: '/img/index_slider-image06.jpg',
      link: '#lifestyle'
    },
    {
      cls: 'third',
      category: 'Headlines',
      badgeClass: 'bg-4',
      title: 'Community spotlight: inspiring stories of grassroots innovators',
      img: '/img/index_slider-image07.jpg',
      link: '#headlines'
    },
    {
      cls: 'fourth',
      category: 'Environment',
      badgeClass: 'bg-2',
      title: 'Sustainable agriculture is an increasingly vital strategy for farmers',
      img: '/img/index_slider-image08.jpg',
      link: '#environment'
    }
  ],
  [
    {
      cls: 'first',
      category: 'Breaking News',
      badgeClass: 'bg-1',
      title: 'Civic authorities announce new infrastructure development packages',
      img: '/img/index_slider-image09.jpg',
      link: '#breaking'
    },
    {
      cls: 'second',
      category: 'Politics',
      badgeClass: 'bg-6',
      title: 'Assembly discusses upcoming budget allocations and welfare policies',
      img: '/img/index_slider-image10.jpg',
      link: '#politics'
    },
    {
      cls: 'third',
      category: 'Soccer News',
      badgeClass: 'bg-4',
      title: 'Live match reports, premier fixtures and updated league points table',
      img: '/img/index_slider-image11.jpg',
      link: '#soccer'
    },
    {
      cls: 'fourth',
      category: 'Health',
      badgeClass: 'bg-2',
      title: 'Food & Nutrition: Healthy lifestyle choices and wellness routines',
      img: '/img/index_slider-image12.jpg',
      link: '#health'
    }
  ]
];

export default function NewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  return (
    <div id="news-slider" className="owl-carousel owl-theme" style={{ display: 'block', opacity: 1, position: 'relative' }}>
      <div className="owl-wrapper-outer">
        <div className="owl-wrapper">
          <div className="owl-item" style={{ width: '100%' }}>
            <div className="news-slide" style={{ transition: 'opacity 0.5s ease-in-out' }}>
              {slidesData[currentSlide].map((item, idx) => (
                <div className={`news-slider-layer ${item.cls}`} key={idx}>
                  <a href={item.link}>
                    <div className="content">
                      <span className={`category-tag ${item.badgeClass}`}>{item.category}</span>
                      <p>{item.title}</p>
                    </div>
                    <img src={item.img} alt={item.title} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="owl-controls clickable" style={{ display: 'block' }}>
        <div className="owl-buttons">
          <div className="owl-prev" onClick={handlePrev} style={{ cursor: 'pointer' }}>
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="owl-next" onClick={handleNext} style={{ cursor: 'pointer' }}>
            <i className="fa fa-angle-right"></i>
          </div>
        </div>
        <div className="owl-pagination">
          {slidesData.map((_, i) => (
            <div
              key={i}
              className={`owl-page ${currentSlide === i ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              <span className=""></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
