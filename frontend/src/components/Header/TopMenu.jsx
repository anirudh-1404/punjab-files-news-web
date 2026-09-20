import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPI, getSavedUser } from '../../services/api';

export default function TopMenu() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [currentUser, setCurrentUser] = useState(() => getSavedUser());
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getSavedUser());
    };
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('punjab_files_auth_changed', handleAuthChange);

    const handleClickOutside = (e) => {
      if (!e.target.closest('.staff-portal-menu')) {
        setStaffDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('punjab_files_auth_changed', handleAuthChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="top-menu">
      <div className="container">
        {/* Left Social & Contact Links */}
        <ul className="left-top-menu">
          <li>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="facebook">
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="twitter">
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="youtube">
              <i className="fa fa-youtube"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="instagram">
              <i className="fa fa-instagram"></i>
            </a>
          </li>
          <li className="address">
            <a href="mailto:info@punjabfiles.com">
              <i className="fa fa-envelope-o"></i> info@punjabfiles.com
            </a>
          </li>
        </ul>

        {/* Right Nav: Back to Home (if admin) + Staff Login Portal */}
        <ul className="right-top-menu pull-right" style={{ display: 'flex', alignItems: 'center', height: '40px', margin: 0 }}>
          {isAdmin && (
            <li style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
              <Link
                to="/"
                style={{
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  height: '28px',
                  lineHeight: '28px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)'
                }}
              >
                <i className="fa fa-arrow-left" style={{ color: '#ebb10d' }}></i>
                <span>ਮੁੱਖ ਪੰਨਾ (Home)</span>
              </Link>
            </li>
          )}

          {/* Staff Login Dropdown (Prominent & Stylish) */}
          <li className="staff-portal-menu" style={{ position: 'relative', margin: '0 0 0 10px', display: 'flex', alignItems: 'center' }}>
            <button
              type="button"
              className="staff-portal-btn"
              onClick={() => setStaffDropdownOpen((prev) => !prev)}
            >
              <i className="fa fa-shield" style={{ color: '#ebb10d', fontSize: '13px' }}></i>
              <span>
                {currentUser ? (
                  `${currentUser.name.split(' ')[0]} (${currentUser.role})`
                ) : (
                  <>
                    <span>ਸਟਾਫ਼ ਲੌਗਇਨ</span>
                    <span className="hidden-xs"> (Staff Login)</span>
                  </>
                )}
              </span>
              <i className={`fa fa-angle-${staffDropdownOpen ? 'up' : 'down'}`} style={{ color: '#ebb10d', fontSize: '12px' }}></i>
            </button>

            {staffDropdownOpen && (
              <div className="staff-portal-dropdown-card">
                {currentUser ? (
                  <>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#94a3b8' }}>
                      ਦਾਖ਼ਲ ਯੂਜ਼ਰ: <strong style={{ color: '#ebb10d' }}>{currentUser.name}</strong>
                      <div style={{ textTransform: 'uppercase', fontSize: '10.5px', color: '#38bdf8', fontWeight: '800', marginTop: '2px' }}>
                        ਰੋਲ: {currentUser.role}
                      </div>
                    </div>
                    <Link
                      to="/admin"
                      className="staff-dropdown-item"
                      onClick={() => setStaffDropdownOpen(false)}
                    >
                      <span className="staff-dropdown-icon-circle" style={{ backgroundColor: 'rgba(235,177,13,0.15)', color: '#ebb10d' }}>
                        <i className="fa fa-tachometer"></i>
                      </span>
                      <div className="staff-dropdown-text-col">
                        <span className="staff-dropdown-title">ਮੇਰਾ ਡੈਸ਼ਬੋਰਡ (My Dashboard)</span>
                        <span className="staff-dropdown-sub">Open staff work console</span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        authAPI.logout();
                        setCurrentUser(null);
                        setStaffDropdownOpen(false);
                        window.dispatchEvent(new Event('punjab_files_auth_changed'));
                        window.location.href = '/';
                      }}
                      style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '11px 16px', color: '#f87171', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <i className="fa fa-sign-out"></i>
                      <span>ਲੌਗਆਊਟ (Logout)</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '8px 16px 8px', fontSize: '10.5px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa fa-lock" style={{ color: '#ebb10d' }}></i>
                      <span>ਰੋਲ ਅਨੁਸਾਰ ਲੌਗਇਨ ਕਰੋ</span>
                    </div>

                    {/* Admin */}
                    <Link
                      to="/admin?role=admin"
                      className="staff-dropdown-item"
                      onClick={() => setStaffDropdownOpen(false)}
                    >
                      <span className="staff-dropdown-icon-circle" style={{ backgroundColor: '#b71c1c', color: '#ffffff' }}>
                        <i className="fa fa-shield"></i>
                      </span>
                      <div className="staff-dropdown-text-col">
                        <span className="staff-dropdown-title">Login as Admin</span>
                        <span className="staff-dropdown-sub">ਮੁੱਖ ਪ੍ਰਬੰਧਕ ਡੈਸ਼ਬੋਰਡ (Super Admin)</span>
                      </div>
                    </Link>

                    {/* Editor */}
                    <Link
                      to="/admin?role=editor"
                      className="staff-dropdown-item"
                      onClick={() => setStaffDropdownOpen(false)}
                    >
                      <span className="staff-dropdown-icon-circle" style={{ backgroundColor: '#ebb10d', color: '#0f172a' }}>
                        <i className="fa fa-pencil-square-o"></i>
                      </span>
                      <div className="staff-dropdown-text-col">
                        <span className="staff-dropdown-title">Login as Editor</span>
                        <span className="staff-dropdown-sub">ਸੰਪਾਦਕ ਸਮੀਖਿਆ ਡੈਸਕ (Chief Editor)</span>
                      </div>
                    </Link>

                    {/* Reporter */}
                    <Link
                      to="/admin?role=reporter"
                      className="staff-dropdown-item"
                      onClick={() => setStaffDropdownOpen(false)}
                    >
                      <span className="staff-dropdown-icon-circle" style={{ backgroundColor: '#1c2d5a', color: '#ffffff' }}>
                        <i className="fa fa-newspaper-o"></i>
                      </span>
                      <div className="staff-dropdown-text-col">
                        <span className="staff-dropdown-title">Login as Reporter</span>
                        <span className="staff-dropdown-sub">ਪੱਤਰਕਾਰ ਖ਼ਬਰ ਡੈਸਕ (Field Reporter)</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
