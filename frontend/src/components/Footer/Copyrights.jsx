import React from 'react';

export default function Copyrights() {
  const currentYear = new Date().getFullYear();

  return (
    <div id="copyrights">
      <div className="container">
        <div className="copyright">
          © {currentYear}, Copyrights Punjab Files. All Rights Reserved.
        </div>
        <div className="footer-social-icons">
          <ul>
            <li>
              <a href="https://plus.google.com" target="_blank" rel="noreferrer" className="google-plus">
                <i className="fa fa-google-plus"></i>
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="facebook">
                <i className="fa fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="twitter">
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="linkedin">
                <i className="fa fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
