import React, { useState } from 'react';

export default function TopMenu() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="top-menu">
      <div className="container">
        {/* Left Social & Contact Links */}
        <ul className="left-top-menu">
          <li>
            <a href="#" className="facebook">
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="#" className="twitter">
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="#" className="youtube">
              <i className="fa fa-youtube"></i>
            </a>
          </li>
          <li>
            <a href="#" className="google-plus">
              <i className="fa fa-google-plus"></i>
            </a>
          </li>
          <li>
            <a href="#" className="linkedin">
              <i className="fa fa-linkedin"></i>
            </a>
          </li>
          <li>
            <a href="#" className="instagram">
              <i className="fa fa-instagram"></i>
            </a>
          </li>
          <li className="address">
            <a href="#">
              <i className="fa fa-phone"></i> +00 (123) 456 7890
            </a>
          </li>
          <li className="address">
            <a href="#">
              <i className="fa fa-envelope-o"></i> info@domain.com
            </a>
          </li>
        </ul>

        {/* Right Nav & Search */}
        <ul className="right-top-menu pull-right">
          <li className="contact">
            <a href="#contact">
              <i className="fa fa-map-marker fa-i"></i>
            </a>
          </li>
          <li className="about">
            <a href="#about-us">
              <i className="fa fa-user fa-i"></i>
            </a>
          </li>
          <li>
            <div className="search-container">
              <div className="search-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                <span style={{ cursor: 'pointer' }}>
                  <i className="fa fa-search"></i>
                </span>
              </div>
              <div className="search-input" style={{ display: searchOpen ? 'block' : 'none' }}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    className="search-bar"
                    placeholder="Search..."
                    title="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
