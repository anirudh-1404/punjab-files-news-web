import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';

import OverviewStatsView from './admin/OverviewStatsView';
import UserManagementView from './admin/UserManagementView';
import MukhwakManagerView from './admin/MukhwakManagerView';
import AllNewsCategoryView from './admin/AllNewsCategoryView';
import ReviewQueueView from './editor/ReviewQueueView';
import BreakingNewsManagerView from './editor/BreakingNewsManagerView';
import CreateArticleView from './reporter/CreateArticleView';
import MyArticlesView from './reporter/MyArticlesView';

export default function DashboardLayout({ user, onLogout }) {
  // Default tab based on role
  const getDefaultTab = (role) => {
    if (role === 'admin') return 'overview';
    if (role === 'editor') return 'review';
    return 'create';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTab(user?.role));

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
        { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ)', icon: 'fa-book', sub: 'Daily Mukhwak' }
      ];
    }

    // Admin
    return [
      { id: 'overview', label: 'ਓਵਰਵਿਊ', icon: 'fa-dashboard', sub: 'Overview' },
      { id: 'all_news', label: 'ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (ਕੈਟੇਗਰੀ ਵਾਈਜ਼)', icon: 'fa-newspaper-o', sub: 'All News & Categories' },
      { id: 'review', label: 'ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਡੈਸਕ', icon: 'fa-check-square-o', sub: 'Final Approval Desk' },
      { id: 'users', label: 'ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ', icon: 'fa-users', sub: 'Staff Management' },
      { id: 'breaking', label: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼', icon: 'fa-bolt', sub: 'Breaking News' },
      { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ)', icon: 'fa-book', sub: 'Daily Mukhwak' }
    ];
  };

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
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Brand Header Bar */}
      <header
        style={{
          backgroundColor: '#000000',
          borderBottom: '3px solid #b71c1c',
          padding: '12px 0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Brand Logo & Portal Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src={whiteLogo}
                alt="Punjab Files Logo"
                style={{ height: '48px', width: 'auto', display: 'block' }}
              />
            </Link>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '14px' }}>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '800', display: 'block', letterSpacing: '0.3px' }}>
                ਨਿਊਜ਼ਰੂਮ ਪੋਰਟਲ (Newsroom CMS)
              </span>
              <span style={{ color: '#ebb10d', fontSize: '11px', fontWeight: '700' }}>
                Punjab Files Broadcast & Digital Media
              </span>
            </div>
          </div>

          {/* User Profile Info & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* User Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: roleInfo.bg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '13px'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span style={{ display: 'block', color: '#ffffff', fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>
                  {user?.name || 'Staff User'}
                </span>
                <span style={{ display: 'block', color: roleInfo.bg === '#1c2d5a' ? '#93c5fd' : roleInfo.bg === '#b71c1c' ? '#fca5a5' : '#86efac', fontSize: '10.5px', fontWeight: '700' }}>
                  {roleInfo.label}
                </span>
              </div>
            </div>

            {/* View Website */}
            <Link
              to="/"
              style={{
                backgroundColor: 'transparent',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '7px 14px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa fa-globe" style={{ color: '#ebb10d' }}></i>
              <span>ਵੈੱਬਸਾਈਟ ਦੇਖੋ</span>
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa fa-sign-out"></i>
              <span>ਲੌਗਆਊਟ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div className="container" style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '0 15px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #b71c1c' : '3px solid transparent',
                  color: isActive ? '#b71c1c' : '#475569',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fa ${tab.icon}`} style={{ color: isActive ? '#b71c1c' : '#94a3b8' }}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 0 50px' }}>
        <div className="container">
          {activeTab === 'overview' && user?.role === 'admin' && (
            <OverviewStatsView user={user} onNavigate={setActiveTab} />
          )}

          {activeTab === 'all_news' && user?.role === 'admin' && (
            <AllNewsCategoryView currentUser={user} />
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
