import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

import OverviewStatsView from './admin/OverviewStatsView';
import UserManagementView from './admin/UserManagementView';
import MukhwakManagerView from './admin/MukhwakManagerView';
import AllNewsCategoryView from './admin/AllNewsCategoryView';
import CategoryManagerView from './admin/CategoryManagerView';
import ReviewQueueView from './editor/ReviewQueueView';
import BreakingNewsManagerView from './editor/BreakingNewsManagerView';
import CreateArticleView from './reporter/CreateArticleView';
import MyArticlesView from './reporter/MyArticlesView';
import ContactMessagesView from './admin/ContactMessagesView';
import { contactAPI } from '../../services/api';

export default function DashboardLayout({ user, onLogout }) {
  // Default tab based on role
  const getDefaultTab = (role) => {
    if (role === 'admin') return 'overview';
    if (role === 'editor') return 'review';
    return 'create';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTab(user?.role));
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Available tabs for each role
  const getTabsForRole = () => {
    const role = user?.role || 'reporter';

    if (role === 'reporter') {
      return [
        { id: 'create', label: 'ਨਵੀਂ ਖ਼ਬਰ ਲਿਖੋ', icon: 'fa-pencil-square-o', sub: 'Write News' },
        { id: 'my_articles', label: 'ਮੇਰੀਆਂ ਖ਼ਬਰਾਂ', icon: 'fa-list-alt', sub: 'My Articles' }
      ];
    }

    if (role === 'editor') {
      return [
        { id: 'review', label: 'ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ', icon: 'fa-check-square-o', sub: 'Review Desk' },
        { id: 'breaking', label: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼', icon: 'fa-bolt', sub: 'Breaking Ticker' },
        { id: 'contact_queries', label: 'ਸੰਪਰਕ ਸੁਨੇਹੇ', icon: 'fa-envelope-o', sub: 'Inquiries' },
        { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ)', icon: 'fa-book', sub: 'Daily Mukhwak' }
      ];
    }

    // Admin
    return [
      { id: 'overview', label: 'ਓਵਰਵਿਊ', icon: 'fa-dashboard', sub: 'Overview' },
      { id: 'all_news', label: 'ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (ਕੈਟੇਗਰੀ ਵਾਈਜ਼)', icon: 'fa-newspaper-o', sub: 'All News & Categories' },
      { id: 'categories', label: 'ਕੈਟੇਗਰੀ ਮੈਨੇਜਰ', icon: 'fa-tags', sub: 'Categories' },
      { id: 'review', label: 'ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਡੈਸਕ', icon: 'fa-check-square-o', sub: 'Final Approval Desk' },
      { id: 'contact_queries', label: 'ਸੰਪਰਕ ਸੁਨੇਹੇ', icon: 'fa-envelope-o', sub: 'Inquiries' },
      { id: 'users', label: 'ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ', icon: 'fa-users', sub: 'Staff Management' },
      { id: 'breaking', label: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼', icon: 'fa-bolt', sub: 'Breaking News' },
      { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ)', icon: 'fa-book', sub: 'Daily Mukhwak' }
    ];
  };

  // Fetch initial unread contact messages count for admin/editor
  React.useEffect(() => {
    if (['admin', 'editor'].includes(user?.role)) {
      contactAPI
        .getMessages()
        .then((res) => {
          const unread = (res.messages || []).filter((m) => m.status === 'unread').length;
          setUnreadMessagesCount(unread);
        })
        .catch(() => {});
    }
  }, [user?.role]);

  // Keep activeTab in sync with allowed tabs for the current role
  React.useEffect(() => {
    const validTabs = getTabsForRole().map((t) => t.id);
    if (!validTabs.includes(activeTab)) {
      setActiveTab(getDefaultTab(user?.role));
    }
  }, [user?.role]);

  const tabs = getTabsForRole();

  const getRoleBadge = (r) => {
    if (r === 'admin') {
      return {
        label: 'ਮੁੱਖ ਪ੍ਰਬੰਧਕ (Super Admin)',
        bg: '#1c2d5a',
        color: '#ffffff'
      };
    }
    if (r === 'editor') {
      return {
        label: 'ਮੁੱਖ ਸੰਪਾਦਕ (Chief Editor)',
        bg: '#b71c1c',
        color: '#ffffff'
      };
    }
    return {
      label: 'ਪੱਤਰਕਾਰ (Field Reporter)',
      bg: '#047857',
      color: '#ffffff'
    };
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="admin-dashboard-wrapper" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Brand Header Bar */}
      <header
        className="admin-cms-header"
        style={{
          backgroundColor: '#0a0d14',
          borderBottom: '3px solid #b71c1c',
          padding: '10px 0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
        }}
      >
        <div className="container">
          <div className="admin-header-flex">
            {/* Left: Brand Logo & Portal Title */}
            <div className="admin-header-brand">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img
                  src={whiteLogo}
                  alt="Punjab Files Logo"
                  className="admin-logo-img"
                  style={{ height: '42px', width: 'auto', display: 'block' }}
                />
              </Link>
              <div className="admin-portal-titles" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '12px' }}>
                <span className="portal-main-title" style={{ color: '#ffffff', fontSize: '14.5px', fontWeight: '800', display: 'block', letterSpacing: '0.3px', lineHeight: 1.2 }}>
                  ਨਿਊਜ਼ਰੂਮ ਪੋਰਟਲ (Newsroom CMS)
                </span>
                <span className="portal-sub-title" style={{ color: '#ebb10d', fontSize: '11px', fontWeight: '700', display: 'block' }}>
                  Punjab Files Broadcast & Digital Media
                </span>
              </div>
            </div>

            {/* Right: User Profile Info & Action Controls */}
            <div className="admin-header-controls">
              {/* User Identity Pill */}
              <div className="admin-user-pill">
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: roleInfo.bg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '12.5px',
                    flexShrink: 0
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="admin-user-text">
                  <span style={{ display: 'block', color: '#ffffff', fontSize: '12.5px', fontWeight: '700', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    {user?.name || 'Staff User'}
                  </span>
                  <span style={{ display: 'block', color: roleInfo.bg === '#1c2d5a' ? '#93c5fd' : roleInfo.bg === '#b71c1c' ? '#fca5a5' : '#86efac', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              {/* View Live Website Button */}
              <Link
                to="/"
                className="admin-btn-view-site"
                title="ਵੈੱਬਸਾਈਟ ਦੇਖੋ"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className="fa fa-globe" style={{ color: '#ebb10d' }}></i>
                <span className="btn-label-desktop">ਵੈੱਬਸਾਈਟ ਦੇਖੋ</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="admin-btn-logout"
                title="ਲੌਗਆਊਟ ਕਰੋ"
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className="fa fa-sign-out"></i>
                <span>ਲੌਗਆਊਟ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar with Touch Scrolling */}
      <div className="admin-cms-tabs-bar" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div
          className="container admin-tabs-scroll-container"
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            padding: '0 15px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #b71c1c' : '3px solid transparent',
                  color: isActive ? '#b71c1c' : '#475569',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <i className={`fa ${tab.icon}`} style={{ color: isActive ? '#b71c1c' : '#94a3b8' }}></i>
                <span>{tab.label}</span>
                {tab.id === 'contact_queries' && unreadMessagesCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      lineHeight: 1.2
                    }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="admin-cms-main" style={{ flex: 1, padding: '24px 0 50px' }}>
        <div className="container">
          {activeTab === 'overview' && user?.role === 'admin' && (
            <OverviewStatsView user={user} onNavigate={setActiveTab} />
          )}

          {activeTab === 'all_news' && user?.role === 'admin' && (
            <AllNewsCategoryView currentUser={user} />
          )}

          {activeTab === 'categories' && user?.role === 'admin' && (
            <CategoryManagerView />
          )}

          {activeTab === 'create' && user?.role === 'reporter' && (
            <CreateArticleView user={user} onArticleCreated={() => setActiveTab('my_articles')} />
          )}

          {activeTab === 'my_articles' && user?.role === 'reporter' && (
            <MyArticlesView user={user} />
          )}

          {activeTab === 'review' && ['admin', 'editor'].includes(user?.role) && (
            <ReviewQueueView currentUser={user} />
          )}

          {activeTab === 'breaking' && ['admin', 'editor'].includes(user?.role) && (
            <BreakingNewsManagerView />
          )}

          {activeTab === 'contact_queries' && ['admin', 'editor'].includes(user?.role) && (
            <ContactMessagesView onUnreadCountChange={setUnreadMessagesCount} />
          )}

          {activeTab === 'users' && user?.role === 'admin' && (
            <UserManagementView currentUser={user} />
          )}

          {activeTab === 'mukhwak' && ['admin', 'editor'].includes(user?.role) && (
            <MukhwakManagerView currentUser={user} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#000000', color: '#94a3b8', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '12px' }}>
        <div className="container">
          © {new Date().getFullYear()} ਪੰਜਾਬ ਫਾਈਲਜ਼ ਨਿਊਜ਼ਰੂਮ CMS (Punjab Files) | ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।
        </div>
      </footer>
    </div>
  );
}
