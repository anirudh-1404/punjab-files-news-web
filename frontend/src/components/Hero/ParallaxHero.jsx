import React from 'react';

export default function ParallaxHero() {
  return (
    <div id="parallax-section">
      <div className="image1 img-overlay1">
        <div className="container">
          <div className="caption text-center">
            <div className="color-white text-center weight-300 medium-caption">
              Get the latest breaking news and top news headlines
            </div>
            <div className="color-white text-center weight-800 large-caption" style={{ fontSize: '48px', margin: '15px 0' }}>
              HAPPENING NOW ON PUNJAB FILES CHANNEL
            </div>
            <div className="color-white text-center weight-400 medium-caption" style={{ fontSize: '24px', marginBottom: '10px' }}>
              No one hurt in North Side blaze
            </div>
            <h5 style={{ textTransform: 'uppercase', letterSpacing: '1px', maxWidth: '800px', margin: '0 auto' }}>
              A fire that broke out Tuesday afternoon in the Park West, forcing residents to evacuate, is under control and no one was hurt.
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
