import React from 'react';

export default function TeamParallaxModule() {
  return (
    <>
      <div id="parallax-section1">
        <div className="image3 img-overlay1">
          <div className="container">
            <div className="caption text-center">
              <h2 className="color-white weight-300 small-caption">
                We introduce you our <strong>Punjab Files Team!</strong> Get more information about us here!
              </h2>
              <a href="#about-us" className="btn btn-default">
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="add-place" style={{ textAlign: 'center', margin: '20px 0' }}>
        <a href="#" target="_blank" rel="noreferrer">
          <img src="/img/banner_820x100.jpg" alt="Advertisement Banner" style={{ maxWidth: '100%', height: 'auto' }} />
        </a>
      </div>
    </>
  );
}
