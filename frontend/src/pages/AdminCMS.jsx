import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import { authAPI, getToken, getSavedUser } from '../services/api';
import blackLogo from '../assets/punjab-files-black-logo.jpeg';

export default function AdminCMS() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role'); // 'admin' | 'editor' | 'reporter'

  const [currentUser, setCurrentUser] = useState(() => getSavedUser());
  const [email, setEmail] = useState('admin@punjabfiles.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Role Configurations
  const ROLE_CONFIGS = {
    admin: {
      key: 'admin',
      badge: 'SUPER ADMIN (ਮੁੱਖ ਪ੍ਰਬੰਧਕ)',
      badgeBg: '#ebb10d',
      badgeColor: '#0f172a',
      title: 'ਮੁੱਖ ਪ੍ਰਬੰਧਕ ਲੌਗਇਨ (Super Admin)',
      subtitle: 'ਸੰਪੂਰਨ ਸਿਸਟਮ, ਸਟਾਫ਼ ਅਤੇ ਓਵਰਵਿਊ ਪ੍ਰਬੰਧਨ ਲਈ ਦਾਖ਼ਲ ਹੋਵੋ',
      defaultEmail: 'admin@punjabfiles.com',
      defaultPass: 'AdminPassword123!',
      icon: 'fa-shield'
    },
    editor: {
      key: 'editor',
      badge: 'CHIEF EDITOR (ਮੁੱਖ ਸੰਪਾਦਕ)',
      badgeBg: '#b71c1c',
      badgeColor: '#ffffff',
      title: 'ਮੁੱਖ ਸੰਪਾਦਕ ਲੌਗਇਨ (Chief Editor)',
      subtitle: 'ਖ਼ਬਰਾਂ ਦੀ ਸਮੀਖਿਆ, ਮਨਜ਼ੂਰੀ ਅਤੇ ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਪ੍ਰਬੰਧਨ ਲਈ ਦਾਖ਼ਲ ਹੋਵੋ',
      defaultEmail: 'editor@punjabfiles.com',
      defaultPass: 'EditorPassword123!',
      icon: 'fa-pencil-square-o'
    },
    reporter: {
      key: 'reporter',
      badge: 'FIELD REPORTER (ਫੀਲਡ ਪੱਤਰਕਾਰ)',
      badgeBg: '#1c2d5a',
      badgeColor: '#ffffff',
      title: 'ਪੱਤਰਕਾਰ ਲੌਗਇਨ (Field Reporter)',
      subtitle: 'ਨਵੀਂ ਖ਼ਬਰ ਸਬਮਿਟ ਕਰਨ ਅਤੇ ਆਪਣੀਆਂ ਖ਼ਬਰਾਂ ਦੇਖਣ ਲਈ ਦਾਖ਼ਲ ਹੋਵੋ',
      defaultEmail: 'reporter@punjabfiles.com',
      defaultPass: 'ReporterPassword123!',
      icon: 'fa-newspaper-o'
    }
  };

  const currentRoleConfig = ROLE_CONFIGS[roleParam] || ROLE_CONFIGS.admin;

  // Sync email and pass when URL role param changes
  useEffect(() => {
    const config = ROLE_CONFIGS[roleParam] || ROLE_CONFIGS.admin;
    setEmail(config.defaultEmail);
    setPassword(config.defaultPass);
    setErrorMsg('');
  }, [roleParam]);

  useEffect(() => {
    async function verifySession() {
      const token = getToken();
      if (token && !currentUser) {
        try {
          const res = await authAPI.getMe();
          if (res.user) {
            setCurrentUser(res.user);
          }
        } catch {
          authAPI.logout();
          setCurrentUser(null);
        }
      }
    }
    verifySession();
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const data = await authAPI.login(email.trim(), password);
      setCurrentUser(data.user);
      window.dispatchEvent(new Event('punjab_files_auth_changed'));
    } catch (err) {
      setErrorMsg(err.message || 'ਲੌਗਇਨ ਅਸਫ਼ਲ ਰਿਹਾ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਵੇਰਵੇ ਜਾਂਚੋ।');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    window.dispatchEvent(new Event('punjab_files_auth_changed'));
  };

  const selectRole = (roleKey) => {
    setSearchParams({ role: roleKey });
    const config = ROLE_CONFIGS[roleKey];
    setEmail(config.defaultEmail);
    setPassword(config.defaultPass);
    setErrorMsg('');
  };

  // If Authenticated, Render Full Role-Based Dashboard
  if (currentUser) {
    return <DashboardLayout user={currentUser} onLogout={handleLogout} />;
  }

  // Login Screen (Matching Punjab Files Theme: Black, Crimson Red, Gold, Clean White)
  return (
    <div
      style={{
        backgroundColor: 'transparent',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '45px 15px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '460px',
          width: '100%',
          padding: '36px 30px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Role Badge & Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span
            style={{
              backgroundColor: currentRoleConfig.badgeBg,
              color: currentRoleConfig.badgeColor,
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '3px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}
          >
            {currentRoleConfig.badge}
          </span>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '12px 0 4px' }}>
            {currentRoleConfig.title}
          </h2>

          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
            {currentRoleConfig.subtitle}
          </p>
        </div>

        {/* Quick Role Selector Tabs */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', marginBottom: '18px' }}>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
            ਰੋਲ ਚੁਣੋ (Switch Role):
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => selectRole('admin')}
              style={{
                flex: 1,
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '6px 4px',
                borderRadius: '4px',
                border: currentRoleConfig.key === 'admin' ? '1px solid #1c2d5a' : '1px solid #cbd5e1',
                backgroundColor: currentRoleConfig.key === 'admin' ? '#1c2d5a' : '#ffffff',
                color: currentRoleConfig.key === 'admin' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <i className="fa fa-shield"></i>
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => selectRole('editor')}
              style={{
                flex: 1,
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '6px 4px',
                borderRadius: '4px',
                border: currentRoleConfig.key === 'editor' ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                backgroundColor: currentRoleConfig.key === 'editor' ? '#b71c1c' : '#ffffff',
                color: currentRoleConfig.key === 'editor' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <i className="fa fa-pencil-square-o"></i>
              <span>Editor</span>
            </button>

            <button
              type="button"
              onClick={() => selectRole('reporter')}
              style={{
                flex: 1,
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '6px 4px',
                borderRadius: '4px',
                border: currentRoleConfig.key === 'reporter' ? '1px solid #047857' : '1px solid #cbd5e1',
                backgroundColor: currentRoleConfig.key === 'reporter' ? '#047857' : '#ffffff',
                color: currentRoleConfig.key === 'reporter' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <i className="fa fa-newspaper-o"></i>
              <span>Reporter</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '5px',
              color: '#b91c1c',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px'
            }}
          >
            <i className="fa fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              ਈਮੇਲ (Registered Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@punjabfiles.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#0f172a'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              ਪਾਸਵਰਡ (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#0f172a'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#b71c1c',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '5px',
              fontSize: '14.5px',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 3px 10px rgba(183, 28, 28, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> ਵੈਰੀਫਾਈ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...
              </>
            ) : (
              <>
                <i className="fa fa-lock"></i> ਪੋਰਟਲ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ (Login to Newsroom)
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontSize: '12.5px',
              color: '#1c2d5a',
              textDecoration: 'none',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← ਮੁੱਖ ਵੈੱਬਸਾਈਟ ’ਤੇ ਵਾਪਸ ਜਾਓ (Back to Website)
          </Link>
        </div>
      </div>
    </div>
  );
}
