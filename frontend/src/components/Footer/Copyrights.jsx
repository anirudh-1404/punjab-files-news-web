import React from 'react';

export default function Copyrights() {
  const currentYear = new Date().getFullYear();

  return (
    <div id="copyrights" style={{ backgroundColor: 'var(--brand-navy-dark)', background: 'var(--brand-navy-dark)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="container">
        <div className="copyright">
          © {currentYear}, ਕਾਪੀਰਾਈਟ ਪੰਜਾਬ ਫਾਈਲਜ਼ (Punjab Files) | ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।
        </div>
        <div className="footer-social-icons">
          <ul>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="facebook" title="Facebook">
                <i className="fa fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="twitter" title="Twitter / X">
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="youtube" title="YouTube">
                <i className="fa fa-youtube"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="instagram" title="Instagram">
                <i className="fa fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
