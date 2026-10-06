import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import whiteLogo from '../../assets/punjab-files-logo-white.jpeg';
import OverviewStatsView from './admin/OverviewStatsView';
import AllNewsCategoryView from './admin/AllNewsCategoryView';
import CategoryManagerView from './admin/CategoryManagerView';
import CreateArticleView from './reporter/CreateArticleView';
import MyArticlesView from './reporter/MyArticlesView';
import ReviewQueueView from './editor/ReviewQueueView';
import BreakingNewsManagerView from './editor/BreakingNewsManagerView';
import ContactMessagesView from './admin/ContactMessagesView';
import UserManagementView from './admin/UserManagementView';
import MukhwakManagerView from './admin/MukhwakManagerView';
import PodcastManagerView from './PodcastManagerView';
import WebTVManagerView from './WebTVManagerView';
import AdManagerView from './AdManagerView';
import GalleryManagerView from './GalleryManagerView';
import { contactAPI } from '../../services/api';

export default function DashboardLayout({ user, activeRoleParam, onRoleChange, onLogout }) {
  const userRoles =
    Array.isArray(user?.roles) && user.roles.length > 0
      ? user.roles
      : [user?.role || 'reporter'];

  // Resolve which role dashboard to show:
  // Priority: if activeRoleParam passed and user has it, use that!
  // Otherwise default to highest available: admin > editor > reporter
  const resolveRole = (target) => {
    if (target && userRoles.includes(target)) return target;
    if (userRoles.includes('admin')) return 'admin';
    if (userRoles.includes('editor')) return 'editor';
    return 'reporter';
  };

  const [activeRole, setActiveRole] = useState(() => resolveRole(activeRoleParam));

  // Sync if activeRoleParam changes externally
  useEffect(() => {
    if (activeRoleParam && userRoles.includes(activeRoleParam) && activeRoleParam !== activeRole) {
      setActiveRole(activeRoleParam);
    }
  }, [activeRoleParam, userRoles]);

  // Default tab for each active role
  const getDefaultTabForRole = (role) => {
    if (role === 'admin') return 'overview';
    if (role === 'editor') return 'review';
    return 'create';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTabForRole(activeRole));
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Switch role handler
  const handleSwitchRole = (newRole) => {
    if (!userRoles.includes(newRole)) return;
    setActiveRole(newRole);
    setActiveTab(getDefaultTabForRole(newRole));
    if (onRoleChange) onRoleChange(newRole);
  };

  // Available tabs for each role
  const getTabsForRole = () => {
    if (activeRole === 'admin') {
      return [
        { id: 'overview', label: 'ਓਵਰਵਿਊ (Overview)', icon: 'fa-dashboard', sub: 'Overview' },
        { id: 'create', label: 'ਨਵੀਂ ਖ਼ਬਰ ਲਿਖੋ (Write News)', icon: 'fa-pencil-square-o', sub: 'Write & Publish News' },
        { id: 'all_news', label: 'ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (All News)', icon: 'fa-newspaper-o', sub: 'All News & Categories' },
        { id: 'gallery', label: 'ਫ਼ੋਟੋ ਗੈਲਰੀ (Gallery Manager)', icon: 'fa-camera-retro', sub: 'Photo Gallery' },
        { id: 'podcasts', label: 'ਪੋਡਕਾਸਟ ਪ੍ਰਬੰਧਨ (Podcasts)', icon: 'fa-podcast', sub: 'Podcast Management' },
        { id: 'ads', label: 'ਇਸ਼ਤਿਹਾਰ ਪ੍ਰਬੰਧਨ (Ad Manager)', icon: 'fa-bullhorn', sub: 'Banners & Sponsors' },
        { id: 'categories', label: 'ਕੈਟੇਗਰੀ ਮੈਨੇਜਰ (Category Manager)', icon: 'fa-tags', sub: 'Categories' },
        { id: 'review', label: 'ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਡੈਸਕ (Final Approval Desk)', icon: 'fa-check-square-o', sub: 'Final Approval Desk' },
        { id: 'contact_queries', label: 'ਸੰਪਰਕ ਸੁਨੇਹੇ (Contact Messages)', icon: 'fa-envelope-o', sub: 'Inquiries' },
        { id: 'users', label: 'ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ (Staff Management)', icon: 'fa-users', sub: 'Staff Management' },
        { id: 'breaking', label: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼ (Breaking News)', icon: 'fa-bolt', sub: 'Breaking News' },
        { id: 'webtv', label: 'ਵੈੱਬ ਟੀਵੀ (Web TV Stream)', icon: 'fa-television', sub: 'Web TV Live Stream' },
        { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (Daily Mukhwak)', icon: 'fa-book', sub: 'Daily Mukhwak' }
      ];
    }

    if (activeRole === 'editor') {
      return [
        { id: 'review', label: 'ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ (Review Desk)', icon: 'fa-check-square-o', sub: 'Review Desk' },
        { id: 'all_news', label: 'ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (All News)', icon: 'fa-newspaper-o', sub: 'All News & Categories' },
        { id: 'gallery', label: 'ਫ਼ੋਟੋ ਗੈਲਰੀ (Gallery Desk)', icon: 'fa-camera-retro', sub: 'Photo Gallery' },
        { id: 'create', label: 'ਨਵੀਂ ਖ਼ਬਰ ਲਿਖੋ (Write News)', icon: 'fa-pencil-square-o', sub: 'Write News' },
        { id: 'podcasts', label: 'ਪੋਡਕਾਸਟ ਸਮੀਖਿਆ (Podcasts Desk)', icon: 'fa-podcast', sub: 'Review Podcasts' },
        { id: 'ads', label: 'ਇਸ਼ਤਿਹਾਰ (Ad Manager)', icon: 'fa-bullhorn', sub: 'Banners & Sponsors' },
        { id: 'breaking', label: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼ (Breaking News)', icon: 'fa-bolt', sub: 'Breaking Ticker' },
        { id: 'webtv', label: 'ਵੈੱਬ ਟੀਵੀ (Web TV Stream)', icon: 'fa-television', sub: 'Web TV Live Stream' },
        { id: 'contact_queries', label: 'ਸੰਪਰਕ ਸੁਨੇਹੇ (Contact Messages)', icon: 'fa-envelope-o', sub: 'Inquiries' },
        { id: 'mukhwak', label: 'ਮੁੱਖ ਵਾਕ (Daily Mukhwak)', icon: 'fa-book', sub: 'Daily Mukhwak' }
      ];
    }

    // Reporter
    return [
      { id: 'create', label: 'ਨਵੀਂ ਖ਼ਬਰ ਲਿਖੋ (Write News)', icon: 'fa-pencil-square-o', sub: 'Write News' },
      { id: 'my_articles', label: 'ਮੇਰੀਆਂ ਖ਼ਬਰਾਂ (My Articles)', icon: 'fa-list-alt', sub: 'My Articles' },
      { id: 'gallery', label: 'ਫ਼ੋਟੋ ਗੈਲਰੀ (Photo Gallery)', icon: 'fa-camera-retro', sub: 'Add Photos' },
      { id: 'podcasts', label: 'ਪੋਡਕਾਸਟ (Podcasts)', icon: 'fa-podcast', sub: 'Add Podcasts' }
    ];
  };

  // Fetch initial unread contact messages count for admin/editor
  useEffect(() => {
    if (userRoles.includes('admin') || userRoles.includes('editor')) {
      contactAPI
        .getMessages()
        .then((res) => {
          const unread = (res.messages || []).filter((m) => m.status === 'unread').length;
          setUnreadMessagesCount(unread);
        })
        .catch(() => {});
    }
  }, [userRoles]);

  // Keep activeTab in sync with allowed tabs for current active role
  useEffect(() => {
    const validTabs = getTabsForRole().map((t) => t.id);
    if (!validTabs.includes(activeTab)) {
      setActiveTab(getDefaultTabForRole(activeRole));
    }
  }, [activeRole]);

  const tabs = getTabsForRole();

  const getRoleBadge = (r) => {
    if (r === 'admin') {
      return {
        label: 'ਮੁੱਖ ਪ੍ਰਬੰਧਕ (Super Admin)',
        short: 'Admin',
        bg: '#1c2d5a',
        color: '#ffffff'
      };
    }
    if (r === 'editor') {
      return {
        label: 'ਮੁੱਖ ਸੰਪਾਦਕ (Chief Editor)',
        short: 'Editor',
        bg: '#b71c1c',
        color: '#ffffff'
      };
    }
    return {
      label: 'ਪੱਤਰਕਾਰ (Field Reporter)',
      short: 'Reporter',
      bg: '#047857',
      color: '#ffffff'
    };
  };

  const roleInfo = getRoleBadge(activeRole);

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
                  <div style={{ display: 'flex', gap: '3px', marginTop: '2px', flexWrap: 'wrap' }}>
                    {userRoles.map((r) => {
                      const badge = getRoleBadge(r);
                      const isCurrent = r === activeRole;
                      return (
                        <span
                          key={r}
                          style={{
                            backgroundColor: badge.bg,
                            color: '#ffffff',
                            fontSize: '9.5px',
                            fontWeight: '800',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            whiteSpace: 'nowrap',
                            boxShadow: isCurrent ? '0 0 0 1.5px #ffffff' : 'none'
                          }}
                        >
                          {badge.short}
                        </span>
                      );
                    })}
                  </div>
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
                  transition: 'background 0.2s'
                }}
              >
                <i className="fa fa-external-link"></i>
                <span className="hidden-xs">ਵੈੱਬਸਾਈਟ ਦੇਖੋ</span>
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
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fa fa-sign-out"></i>
                <span>ਲੌਗਆਊਟ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Multi-Role Switcher Bar (Shown when user has more than 1 role) */}
      {userRoles.length > 1 && (
        <div style={{ backgroundColor: '#131926', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '7px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>
              <i className="fa fa-sliders" style={{ color: '#ebb10d' }}></i>
              <span>ਡੈਸ਼ਬੋਰਡ ਮੋਡ ਚੁਣੋ (Switch Dashboard View):</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {userRoles.includes('admin') && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole('admin')}
                  style={{
                    backgroundColor: activeRole === 'admin' ? '#1c2d5a' : 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                    border: activeRole === 'admin' ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>👑 ਮੁੱਖ ਐਡਮਿਨ (Admin)</span>
                  {activeRole === 'admin' && (
                    <span style={{ fontSize: '9px', backgroundColor: '#60a5fa', color: '#0f172a', padding: '1px 5px', borderRadius: '10px', fontWeight: '900' }}>
                      ਸਰਗਰਮ
                    </span>
                  )}
                </button>
              )}
              {userRoles.includes('editor') && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole('editor')}
                  style={{
                    backgroundColor: activeRole === 'editor' ? '#b71c1c' : 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                    border: activeRole === 'editor' ? '2px solid #f87171' : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>✍️ ਮੁੱਖ ਸੰਪਾਦਕ (Editor)</span>
                  {activeRole === 'editor' && (
                    <span style={{ fontSize: '9px', backgroundColor: '#f87171', color: '#ffffff', padding: '1px 5px', borderRadius: '10px', fontWeight: '900' }}>
                      ਸਰਗਰਮ
                    </span>
                  )}
                </button>
              )}
              {userRoles.includes('reporter') && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole('reporter')}
                  style={{
                    backgroundColor: activeRole === 'reporter' ? '#047857' : 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                    border: activeRole === 'reporter' ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>📰 ਪੱਤਰਕਾਰ (Reporter)</span>
                  {activeRole === 'reporter' && (
                    <span style={{ fontSize: '9px', backgroundColor: '#34d399', color: '#0f172a', padding: '1px 5px', borderRadius: '10px', fontWeight: '900' }}>
                      ਸਰਗਰਮ
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Header (Tab Bar) */}
      <nav
        className="admin-cms-subnav"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}
      >
        <div className="container">
          <div className="admin-tabs-list" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: '4px', padding: '6px 0' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`admin-tab-btn ${isActive ? 'is-active' : ''}`}
                  style={{
                    backgroundColor: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className={`fa ${tab.icon}`} style={{ color: isActive ? '#ebb10d' : '#94a3b8' }}></i>
                  <span>{tab.label}</span>
                  {tab.id === 'contact_queries' && unreadMessagesCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#b71c1c',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        marginLeft: '2px'
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
      </nav>

      {/* Main Content Area */}
      <main className="admin-cms-main" style={{ flex: 1, padding: '24px 0 50px' }}>
        <div className="container">
          {activeTab === 'overview' && activeRole === 'admin' && (
            <OverviewStatsView user={user} onNavigate={setActiveTab} />
          )}

          {activeTab === 'all_news' && ['admin', 'editor'].includes(activeRole) && (
            <AllNewsCategoryView currentUser={user} onNavigate={setActiveTab} />
          )}

          {activeTab === 'categories' && activeRole === 'admin' && (
            <CategoryManagerView />
          )}

          {activeTab === 'create' && (
            <CreateArticleView
              user={user}
              onArticleCreated={() => {
                if (activeRole === 'admin') setActiveTab('all_news');
                else if (activeRole === 'editor') setActiveTab('review');
                else setActiveTab('my_articles');
              }}
            />
          )}

          {activeTab === 'my_articles' && activeRole === 'reporter' && (
            <MyArticlesView user={user} />
          )}

          {activeTab === 'review' && ['admin', 'editor'].includes(activeRole) && (
            <ReviewQueueView currentUser={user} />
          )}

          {activeTab === 'breaking' && ['admin', 'editor'].includes(activeRole) && (
            <BreakingNewsManagerView />
          )}

          {activeTab === 'contact_queries' && ['admin', 'editor'].includes(activeRole) && (
            <ContactMessagesView onUnreadCountChange={setUnreadMessagesCount} />
          )}

          {activeTab === 'users' && activeRole === 'admin' && (
            <UserManagementView currentUser={user} />
          )}

          {activeTab === 'mukhwak' && ['admin', 'editor'].includes(activeRole) && (
            <MukhwakManagerView currentUser={user} />
          )}

          {activeTab === 'webtv' && ['admin', 'editor'].includes(activeRole) && (
            <WebTVManagerView currentUser={user} />
          )}

          {activeTab === 'podcasts' && (
            <PodcastManagerView currentUser={user} />
          )}

          {activeTab === 'gallery' && (
            <GalleryManagerView currentUser={user} />
          )}

          {activeTab === 'ads' && ['admin', 'editor'].includes(activeRole) && (
            <AdManagerView currentUser={user} />
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
