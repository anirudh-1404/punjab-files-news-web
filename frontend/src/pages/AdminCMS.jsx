import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getStoredArticles,
  createNewArticle,
  deleteArticle,
  getStoredBreaking,
  saveBreaking
} from '../services/articleStore';

export default function AdminCMS() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === '1') return true;
    }
    return localStorage.getItem('punjab_cms_auth') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('punjab_cms_role') || 'publisher'; // 'admin' or 'publisher'
  });

  const [activeTab, setActiveTab] = useState('add'); // 'add', 'list', 'breaking'
  const [articles, setArticles] = useState([]);
  const [breakingList, setBreakingList] = useState([]);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('punjab');
  const [punjabRegion, setPunjabRegion] = useState('majha');
  const [language, setLanguage] = useState('pa');
  const [author, setAuthor] = useState('ਪੰਜਾਬ ਫਾਈਲਜ਼ ਪੱਤਰਕਾਰ');
  const [featuredImage, setFeaturedImage] = useState('/img/index_800x400-image01.jpg');
  const [isBreaking, setIsBreaking] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Breaking News Input
  const [newBreakingTag, setNewBreakingTag] = useState('ਪੰਜਾਬ');
  const [newBreakingText, setNewBreakingText] = useState('');

  useEffect(() => {
    setArticles(getStoredArticles());
    setBreakingList(getStoredBreaking());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    localStorage.setItem('punjab_cms_auth', 'true');
    localStorage.setItem('punjab_cms_role', userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('punjab_cms_auth');
  };

  const handlePublishNews = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਲੇਖ ਅਤੇ ਖ਼ਬਰ ਦਾ ਵੇਰਵਾ ਦਰਜ ਕਰੋ (Please enter title and content).');
      return;
    }

    const created = createNewArticle({
      title: title.trim(),
      content: content.trim(),
      category,
      punjabRegion: category === 'punjab' ? punjabRegion : undefined,
      language,
      author: author.trim() || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ',
      featuredImage: featuredImage || '/img/index_800x400-image01.jpg',
      isBreaking
    });

    setArticles(getStoredArticles());
    setBreakingList(getStoredBreaking());
    window.dispatchEvent(new Event('punjab_articles_updated'));
    window.dispatchEvent(new Event('punjab_breaking_updated'));

    setSuccessMsg('ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋ ਗਈ ਹੈ! (News Published Successfully!)');
    setTitle('');
    setContent('');
    setIsBreaking(false);

    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('list');
    }, 2000);
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਇਹ ਖ਼ਬਰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? (Delete this article?)')) {
      deleteArticle(id);
      setArticles(getStoredArticles());
      window.dispatchEvent(new Event('punjab_articles_updated'));
    }
  };

  const handleAddBreaking = (e) => {
    e.preventDefault();
    if (!newBreakingText.trim()) return;

    const updated = [
      {
        id: 'b-' + Date.now(),
        tag: newBreakingTag,
        text: newBreakingText.trim()
      },
      ...breakingList
    ];

    saveBreaking(updated);
    setBreakingList(updated);
    window.dispatchEvent(new Event('punjab_breaking_updated'));
    setNewBreakingText('');
  };

  const handleDeleteBreaking = (id) => {
    const updated = breakingList.filter((b) => b.id !== id);
    saveBreaking(updated);
    setBreakingList(updated);
    window.dispatchEvent(new Event('punjab_breaking_updated'));
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen" style={{ backgroundColor: '#f1f5f9', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 15px' }}>
        <div style={{ backgroundColor: '#ffffff', maxWidth: '440px', width: '100%', padding: '30px 25px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '3px' }}>
              PUNJAB FILES CMS
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#000000', margin: '10px 0 4px' }}>
              ਨਿਊਜ਼ ਪ੍ਰਕਾਸ਼ਕ / ਐਡਮਿਨ ਲੌਗਿਨ
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              ਖ਼ਬਰਾਂ ਲਿਖਣ ਅਤੇ ਪ੍ਰਬੰਧਨ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                ਭੂਮਿਕਾ ਚੁਣੋ (Role)
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
              >
                <option value="publisher">ਪ੍ਰਕਾਸ਼ਕ / ਪੱਤਰਕਾਰ (Publisher / Editor)</option>
                <option value="admin">ਮੁੱਖ ਐਡਮਿਨ (Chief Admin - Full Control)</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                ਈਮੇਲ (Email)
              </label>
              <input
                type="email"
                defaultValue={userRole === 'admin' ? 'admin@punjabfiles.com' : 'editor@punjabfiles.com'}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                ਪਾਸਵਰਡ (Password)
              </label>
              <input
                type="password"
                defaultValue="punjab123"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                padding: '11px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              ਪੋਰਟਲ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ (Enter CMS)
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '12px', color: '#1c2d5a', textDecoration: 'none', fontWeight: '600' }}>
              ← ਵੈੱਬਸਾਈਟ ’ਤੇ ਵਾਪਸ ਜਾਓ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="admin-cms-dashboard" style={{ backgroundColor: '#f8fafc', minHeight: '85vh', padding: '25px 0 60px' }}>
      <div className="container">
        
        {/* Top Control Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: userRole === 'admin' ? '#1c2d5a' : '#b71c1c',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  textTransform: 'uppercase'
                }}
              >
                {userRole === 'admin' ? 'ਮੁੱਖ ਐਡਮਿਨ' : 'ਨਿਊਜ਼ ਪਬਲਿਸ਼ਰ'}
              </span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#000000' }}>
                ਪੰਜਾਬ ਫਾਈਲਜ਼ ਪਬਲਿਸ਼ਿੰਗ ਡੈਸਕ
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
              ਮੋਬਾਈਲ ਅਤੇ ਡੈਸਕਟਾਪ ਤੋਂ 24x7 ਤੇਜ਼ੀ ਨਾਲ ਖ਼ਬਰਾਂ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/"
              style={{
                backgroundColor: '#edf2f7',
                color: '#1e293b',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <i className="fa fa-eye"></i> ਲਾਈਵ ਸਾਈਟ ਦੇਖੋ
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <i className="fa fa-sign-out"></i> ਲੌਗ ਆਉਟ
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            style={{
              backgroundColor: activeTab === 'add' ? '#b71c1c' : '#ffffff',
              color: activeTab === 'add' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <i className="fa fa-plus-circle" style={{ marginRight: '6px' }}></i> ਨਵੀਂ ਖ਼ਬਰ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              backgroundColor: activeTab === 'list' ? '#b71c1c' : '#ffffff',
              color: activeTab === 'list' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <i className="fa fa-list" style={{ marginRight: '6px' }}></i> ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ({articles.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breaking')}
            style={{
              backgroundColor: activeTab === 'breaking' ? '#b71c1c' : '#ffffff',
              color: activeTab === 'breaking' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <i className="fa fa-bolt" style={{ marginRight: '6px' }}></i> ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਟਿੱਕਰ ({breakingList.length})
          </button>
        </div>

        {/* TAB 1: ADD NEWS FORM (MOBILE OPTIMIZED) */}
        {activeTab === 'add' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#000000', borderBottom: '2px solid #b71c1c', paddingBottom: '8px' }}>
              ਖ਼ਬਰ ਲਿਖੋ ਅਤੇ ਤੁਰੰਤ ਲਾਈਵ ਕਰੋ (Quick Publish Form)
            </h3>

            {successMsg && (
              <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontWeight: '700', fontSize: '13.5px' }}>
                <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i> {successMsg}
              </div>
            )}

            <form onSubmit={handlePublishNews}>
              {/* Row 1: Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                  ਖ਼ਬਰ ਦਾ ਮੁੱਖ ਸਿਰਲੇਖ (Article Headline) *
                </label>
                <input
                  type="text"
                  placeholder="ਸਿਰਲੇਖ ਲਿਖੋ (ਜਿਵੇਂ: ਮਾਝਾ ਵਿੱਚ ਵਿਕਾਸ ਪ੍ਰਾਜੈਕਟ ਸ਼ੁਰੂ...)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              {/* Row 2: Category, Punjab Region, Language */}
              <div className="row">
                <div className="col-sm-4 col-xs-12" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                    ਸ਼੍ਰੇਣੀ (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
                  >
                    <option value="punjab">ਪੰਜਾਬ (Punjab)</option>
                    <option value="religion">ਧਰਮ (Religion)</option>
                    <option value="world">ਦੇਸ਼-ਵਿਦੇਸ਼ (World & National)</option>
                    <option value="sports">ਖੇਡਾਂ (Sports)</option>
                    <option value="health">ਸਿਹਤ (Health)</option>
                    <option value="politics">ਰਾਜਨੀਤੀ (Politics)</option>
                  </select>
                </div>

                {category === 'punjab' && (
                  <div className="col-sm-4 col-xs-12" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                      ਪੰਜਾਬ ਦਾ ਖਿੱਤਾ (Region) *
                    </label>
                    <select
                      value={punjabRegion}
                      onChange={(e) => setPunjabRegion(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
                    >
                      <option value="majha">ਮਾਝਾ (Majha - Amritsar, Gurdaspur, Tarn Taran)</option>
                      <option value="malwa">ਮਾਲਵਾ (Malwa - Ludhiana, Bathinda, Patiala)</option>
                      <option value="doaba">ਦੋਆਬਾ (Doaba - Jalandhar, Hoshiarpur, Kapurthala)</option>
                    </select>
                  </div>
                )}

                <div className="col-sm-4 col-xs-12" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                    ਭਾਸ਼ਾ (Language) *
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
                  >
                    <option value="pa">ਪੰਜਾਬੀ (Gurmukhi)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Author and Featured Image */}
              <div className="row">
                <div className="col-sm-6 col-xs-12" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                    ਲਿਖਾਰੀ / ਰਿਪੋਰਟਰ (Author Name)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="ਪੱਤਰਕਾਰ ਦਾ ਨਾਂਅ"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
                  />
                </div>

                <div className="col-sm-6 col-xs-12" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                    ਤਸਵੀਰ (Featured Image URL)
                  </label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="/img/index_800x400-image01.jpg"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('/img/index_800x400-image01.jpg')}
                      style={{ fontSize: '10.5px', padding: '2px 6px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '3px' }}
                    >
                      ਨਿਊਜ਼ 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('/img/index_800x400-image02.jpg')}
                      style={{ fontSize: '10.5px', padding: '2px 6px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '3px' }}
                    >
                      ਨਿਊਜ਼ 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('/img/darbar-sahib-mukhwak.jpg')}
                      style={{ fontSize: '10.5px', padding: '2px 6px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '3px' }}
                    >
                      ਦਰਬਾਰ ਸਾਹਿਬ
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Full Article Content */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>
                  ਖ਼ਬਰ ਦਾ ਪੂਰਾ ਵੇਰਵਾ (Article Full Content) *
                </label>
                <textarea
                  rows="7"
                  placeholder="ਇੱਥੇ ਖ਼ਬਰ ਦਾ ਵਿਸਥਾਰਪੂਰਵਕ ਵੇਰਵਾ ਲਿਖੋ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', lineHeight: '1.6' }}
                ></textarea>
              </div>

              {/* Breaking News Checkbox */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="breakingCheckbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="breakingCheckbox" style={{ fontSize: '13.5px', fontWeight: '700', color: '#b71c1c', cursor: 'pointer', margin: 0 }}>
                  ਇਸ ਖ਼ਬਰ ਨੂੰ ਉੱਪਰ ਚੱਲ ਰਹੇ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਟਿੱਕਰ (Top Ticker) ਵਿੱਚ ਵੀ ਸ਼ਾਮਲ ਕਰੋ
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '4px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(183, 28, 28, 0.4)'
                }}
              >
                <i className="fa fa-send" style={{ marginRight: '8px' }}></i> ਖ਼ਬਰ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ (Publish News)
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE ARTICLES LIST */}
        {activeTab === 'list' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#000000', borderBottom: '2px solid #b71c1c', paddingBottom: '8px' }}>
              ਪ੍ਰਕਾਸ਼ਿਤ ਖ਼ਬਰਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ({articles.length})
            </h3>

            <div className="table-responsive">
              <table className="table table-bordered table-striped" style={{ fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ width: '60px' }}>ਤਸਵੀਰ</th>
                    <th>ਸਿਰਲੇਖ (Title)</th>
                    <th style={{ width: '100px' }}>ਸ਼੍ਰੇਣੀ</th>
                    <th style={{ width: '90px' }}>ਖਿੱਤਾ</th>
                    <th style={{ width: '80px' }}>ਪਾਠਕ</th>
                    <th style={{ width: '100px' }}>ਐਕਸ਼ਨ</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((art) => (
                    <tr key={art.id}>
                      <td>
                        <img src={art.featuredImage} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '2px' }} />
                      </td>
                      <td>
                        <Link to={`/news/${art.id}`} style={{ fontWeight: '700', color: '#000000', textDecoration: 'none' }}>
                          {art.title}
                        </Link>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {art.author} • {art.publicationDate}
                        </div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{art.category}</span>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize' }}>{art.punjabRegion || '—'}</span>
                      </td>
                      <td>
                        <strong>{art.views?.toLocaleString() || 0}</strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(art.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ਹਟਾਓ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BREAKING NEWS MANAGER */}
        {activeTab === 'breaking' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#000000', borderBottom: '2px solid #b71c1c', paddingBottom: '8px' }}>
              ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼ ਟਿੱਕਰ ਮੈਨੇਜਰ (Manage Ticker Alerts)
            </h3>

            {/* Quick Add Breaking Alert */}
            <form onSubmit={handleAddBreaking} style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <select
                value={newBreakingTag}
                onChange={(e) => setNewBreakingTag(e.target.value)}
                style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="ਪੰਜਾਬ">ਪੰਜਾਬ</option>
                <option value="ਮਾਝਾ">ਮਾਝਾ</option>
                <option value="ਮਾਲਵਾ">ਮਾਲਵਾ</option>
                <option value="ਦੋਆਬਾ">ਦੋਆਬਾ</option>
                <option value="ਧਰਮ">ਧਰਮ</option>
                <option value="ਕੌਮਾਂਤਰੀ">ਕੌਮਾਂਤਰੀ</option>
              </select>

              <input
                type="text"
                placeholder="ਨਵਾਂ ਬ੍ਰੇਕਿੰਗ ਅਲਰਟ ਲਿਖੋ (ਜਿਵੇਂ: ਮੌਸਮ ਵਿਭਾਗ ਵੱਲੋਂ ਯੈਲੋ ਅਲਰਟ ਜਾਰੀ...)"
                value={newBreakingText}
                onChange={(e) => setNewBreakingText(e.target.value)}
                style={{ flex: 1, minWidth: '220px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />

              <button
                type="submit"
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                + ਟਿੱਕਰ ਵਿੱਚ ਜੋੜੋ
              </button>
            </form>

            {/* Breaking Items List */}
            <div className="list-group">
              {breakingList.map((b) => (
                <div
                  key={b.id}
                  className="list-group-item"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '2px' }}>
                      {b.tag}
                    </span>
                    <span style={{ fontSize: '13px', color: '#000000', fontWeight: '600' }}>
                      {b.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteBreaking(b.id)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#b91c1c',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
