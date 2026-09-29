import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { articleAPI, categoryAPI } from '../../../services/api';
import { formatArticleDate } from '../../../services/dateUtils';
import { transliterateGurmukhiToEnglish } from '../../../services/slugUtils';

const CATEGORIES = [
  { id: 'all', label: 'ਸਾਰੀਆਂ', labelEn: 'All News', icon: 'fa-th-large' },
  { id: 'punjab', label: 'ਪੰਜਾਬ', labelEn: 'Punjab', icon: 'fa-map-marker' },
  { id: 'religion', label: 'ਧਰਮ ਤੇ ਵਿਰਾਸਤ', labelEn: 'Religion', icon: 'fa-sun-o' },
  { id: 'national', label: 'ਦੇਸ਼-ਵਿਦੇਸ਼', labelEn: 'National & World', icon: 'fa-globe' },
  { id: 'sports', label: 'ਖੇਡਾਂ', labelEn: 'Sports', icon: 'fa-trophy' },
  { id: 'health', label: 'ਸਿਹਤ', labelEn: 'Health', icon: 'fa-heartbeat' },
  { id: 'travel', label: 'ਸੈਰ-ਸਪਾਟਾ', labelEn: 'Travel', icon: 'fa-plane' },
  { id: 'entertainment', label: 'ਮਨੋਰੰਜਨ', labelEn: 'Entertainment', icon: 'fa-film' },
  { id: 'business', label: 'ਵਪਾਰ', labelEn: 'Business', icon: 'fa-line-chart' }
];

const PUNJAB_REGIONS = [
  { id: 'all', label: 'ਸਾਰੇ ਖੇਤਰ (All Regions)' },
  { id: 'majha', label: 'ਮਾਝਾ (Majha)' },
  { id: 'malwa', label: 'ਮਾਲਵਾ (Malwa)' },
  { id: 'doaba', label: 'ਦੋਆਬਾ (Doaba)' }
];

export default function AllNewsCategoryView({ currentUser }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeLang, setActiveLang] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'views', 'oldest'
  const [notification, setNotification] = useState('');

  // Modals state
  const [editingArticle, setEditingArticle] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'punjab',
    punjabRegion: 'majha',
    language: 'pa',
    featuredImage: '',
    status: 'published',
    isBreaking: false
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all articles
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleAPI.getReviewDeskArticles({
        status: activeStatus,
        category: activeCategory,
        punjabRegion: activeCategory === 'punjab' ? activeRegion : 'all',
        language: activeLang,
        search: searchQuery,
        sort: sortBy
      });
      setArticles(res.articles || res.data || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setNotification('ਖ਼ਬਰਾਂ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeRegion, activeStatus, activeLang, searchQuery, sortBy]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Load dynamic categories
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (isMounted && res && res.data && res.data.length > 0) {
          const dynamic = [
            { id: 'all', label: 'ਸਾਰੀਆਂ', labelEn: 'All News', icon: 'fa-th-large' },
            ...res.data.map((c) => ({
              id: c.slug,
              label: c.namePa,
              labelEn: c.nameEn,
              icon: c.icon || 'fa-newspaper-o'
            }))
          ];
          setCategoriesList(dynamic);
        }
      } catch (e) {}
    };
    loadCategories();
    window.addEventListener('punjab_categories_updated', loadCategories);
    return () => {
      isMounted = false;
      window.removeEventListener('punjab_categories_updated', loadCategories);
    };
  }, []);

  // Dynamic counts per category from current full or filtered list
  const categoryCounts = useMemo(() => {
    const counts = { all: articles.length };
    categoriesList.forEach((c) => {
      if (c.id !== 'all') {
        counts[c.id] = articles.filter((a) => a.category === c.id).length;
      }
    });
    return counts;
  }, [articles, categoriesList]);

  // Trigger Edit
  const openEditModal = (art) => {
    setEditingArticle(art);
    setEditFormData({
      title: art.title || '',
      slug: art.slug || '',
      excerpt: art.excerpt || '',
      content: art.content || '',
      category: art.category || 'punjab',
      punjabRegion: art.punjabRegion || 'majha',
      language: art.language || 'pa',
      featuredImage: art.featuredImage || '',
      status: art.status || 'published',
      isBreaking: Boolean(art.isBreaking)
    });
  };

  const closeEditModal = () => {
    setEditingArticle(null);
    setIsSavingEdit(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!editFormData.title.trim()) {
      alert('ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ (Title is required)');
      return;
    }

    try {
      setIsSavingEdit(true);
      await articleAPI.updateArticle(editingArticle._id, {
        title: editFormData.title.trim(),
        slug: editFormData.slug?.trim() || undefined,
        excerpt: editFormData.excerpt.trim(),
        content: editFormData.content.trim(),
        category: editFormData.category,
        punjabRegion: editFormData.category === 'punjab' ? editFormData.punjabRegion : null,
        language: editFormData.language,
        featuredImage: editFormData.featuredImage.trim(),
        status: editFormData.status,
        isBreaking: editFormData.isBreaking
      });

      setNotification(`ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਕੀਤੀ ਗਈ: "${editFormData.title.substring(0, 40)}..."`);
      closeEditModal();
      await fetchArticles();
      setTimeout(() => setNotification(''), 4500);
    } catch (err) {
      alert('Error updating article: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Trigger Delete
  const openDeleteModal = (art) => {
    setDeletingArticle(art);
  };

  const closeDeleteModal = () => {
    setDeletingArticle(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingArticle) return;
    try {
      setIsDeleting(true);
      await articleAPI.deleteArticle(deletingArticle._id);
      setNotification(`ਖ਼ਬਰ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ: "${deletingArticle.title.substring(0, 40)}..."`);
      closeDeleteModal();
      await fetchArticles();
      setTimeout(() => setNotification(''), 4500);
    } catch (err) {
      alert('Error deleting article: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helpers
  const getCategoryLabel = (cat) => {
    const found = categoriesList.find((c) => c.id === cat);
    return found ? found.label : (cat ? cat.toUpperCase() : 'ਅਣਪਛਾਤੀ');
  };

  const getStatusBadge = (st) => {
    if (st === 'published') {
      return (
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa fa-check-circle"></i> ਲਾਈਵ (Live)
        </span>
      );
    }
    if (st === 'pending_admin') {
      return (
        <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa fa-hourglass-half"></i> ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ (Pending Admin)
        </span>
      );
    }
    if (st === 'pending_editor' || st === 'pending_review') {
      return (
        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa fa-clock-o"></i> ਸੰਪਾਦਕ ਸਮੀਖਿਆ (Pending Editor)
        </span>
      );
    }
    if (st === 'rejected') {
      return (
        <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa fa-times-circle"></i> ਰੱਦ (Rejected)
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
        {st}
      </span>
    );
  };

  const getLangBadge = (lang) => {
    if (lang === 'hi') {
      return <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px', fontWeight: '800' }}>हिंदी (Hindi)</span>;
    }
    if (lang === 'en') {
      return <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px', fontWeight: '800' }}>English</span>;
    }
    return <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px', fontWeight: '800' }}>ਪੰਜਾਬੀ (Punjabi)</span>;
  };

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {/* Top Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '21px', fontWeight: '800', color: '#0f172a' }}>
              ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (All News & Category Manager)
            </h3>
            <span style={{ backgroundColor: '#1c2d5a', color: '#ffffff', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
              {articles.length} ਖ਼ਬਰਾਂ (Articles Found)
            </span>
          </div>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਨੂੰ ਕੈਟੇਗਰੀ ਅਨੁਸਾਰ ਦੇਖੋ, ਕਿਸੇ ਵੀ ਖ਼ਬਰ ਨੂੰ ਸੋਧੋ (Edit) ਜਾਂ ਹਟਾਓ (Delete) (View all news by category, edit, or delete any article).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchArticles}
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '7px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa fa-refresh"></i>
          <span>ਤਾਜ਼ਾ ਕਰੋ (Refresh)</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '6px', fontSize: '13.5px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa fa-check-circle" style={{ fontSize: '18px' }}></i>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Category Switcher Tabs */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (cat.id !== 'punjab') setActiveRegion('all');
                }}
                style={{
                  padding: '9px 15px',
                  borderRadius: '24px',
                  border: isActive ? '1px solid #b71c1c' : '1px solid #e2e8f0',
                  backgroundColor: isActive ? '#b71c1c' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className={`fa ${cat.icon}`} style={{ color: isActive ? '#ebb10d' : '#64748b' }}></i>
                <span>{cat.label} {cat.labelEn ? `(${cat.labelEn})` : ''}</span>
                {categoryCounts[cat.id] !== undefined && (
                  <span
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isActive ? '#ffffff' : '#475569',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}
                  >
                    {categoryCounts[cat.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-region Pills (if Punjab selected) */}
        {activeCategory === 'punjab' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '10px 14px', backgroundColor: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#9f1239' }}>
              <i className="fa fa-map-pin"></i> ਪੰਜਾਬ ਖੇਤਰ (Region):
            </span>
            {PUNJAB_REGIONS.map((r) => {
              const isRegActive = activeRegion === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveRegion(r.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: isRegActive ? '1px solid #b71c1c' : '1px solid #fda4af',
                    backgroundColor: isRegActive ? '#b71c1c' : '#ffffff',
                    color: isRegActive ? '#ffffff' : '#9f1239',
                    fontSize: '12px',
                    fontWeight: isRegActive ? '800' : '600',
                    cursor: 'pointer'
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Secondary Filter & Search Bar */}
      <div className="cms-filter-bar" style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <i className="fa fa-search" style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }}></i>
          <input
            type="text"
            placeholder="ਸਿਰਲੇਖ ਜਾਂ ਪੱਤਰਕਾਰ ਦੇ ਨਾਮ ਨਾਲ ਖ਼ਬਰ ਲੱਭੋ... (Search by title or reporter...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="cms-filter-dropdowns" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filter */}
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">ਸਾਰੇ ਸਟੇਟਸ (All Status)</option>
            <option value="published">ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ (Live)</option>
            <option value="pending_admin">ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਬਕਾਇਆ (Pending Admin)</option>
            <option value="pending_editor">ਸੰਪਾਦਕ ਸਮੀਖਿਆ ਬਕਾਇਆ (Pending Editor)</option>
            <option value="rejected">ਰੱਦ ਕੀਤੀਆਂ (Rejected)</option>
          </select>

          {/* Language Filter */}
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ (All Languages)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="newest">ਤਾਜ਼ਾ ਪਹਿਲਾਂ (Newest)</option>
            <option value="views">ਸਭ ਤੋਂ ਵੱਧ ਪੜ੍ਹੀਆਂ (Views / Popular)</option>
            <option value="oldest">ਪੁਰਾਣੀਆਂ ਪਹਿਲਾਂ (Oldest)</option>
          </select>
        </div>
      </div>

      {/* 3. Articles Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', color: '#b71c1c' }}></i>
          <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: '600' }}>ਖ਼ਬਰਾਂ ਲੋਡ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ... (Loading articles...)</p>
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <i className="fa fa-newspaper-o" style={{ fontSize: '36px', color: '#94a3b8', marginBottom: '10px' }}></i>
          <h4 style={{ margin: '0 0 6px', color: '#334155', fontSize: '16px' }}>ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ (No Articles Found)</h4>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            ਇਸ ਕੈਟੇਗਰੀ ਜਾਂ ਫਿਲਟਰ ਤਹਿਤ ਕੋਈ ਖ਼ਬਰ ਮੌਜੂਦ ਨਹੀਂ ਹੈ (No articles found under this filter).
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile <= 768px) */}
          <div className="desktop-table-view" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                  <th style={{ padding: '12px 10px', width: '50px', fontWeight: '800', textAlign: 'center' }}>ਨੰ: (No.)</th>
                  <th style={{ padding: '12px 14px', fontWeight: '800' }}>ਖ਼ਬਰ (News Title)</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ਕੈਟੇਗਰੀ (Category)</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ਭਾਸ਼ਾ (Language)</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ਪੱਤਰਕਾਰ / ਮਿਤੀ (Author / Date)</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ਵਿਊਜ਼ (Views)</th>
                  <th style={{ padding: '12px 10px', fontWeight: '800' }}>ਸਟੇਟਸ (Status)</th>
                  <th style={{ padding: '12px 14px', fontWeight: '800', textAlign: 'right' }}>ਕਾਰਵਾਈਆਂ (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((art, idx) => (
                  <tr key={art._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.15s' }}>
                    {/* Sr No (Symmetrical Box) */}
                    <td style={{ padding: '12px 10px', textAlign: 'center', width: '50px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                          borderRadius: '6px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Article Thumbnail & Title */}
                    <td style={{ padding: '12px 14px', maxWidth: '340px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img
                          src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                          alt={art.title}
                          onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div>
                          <a
                            href={`/news/${art.slug || art._id}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontWeight: '700',
                              color: '#0f172a',
                              fontSize: '13.5px',
                              lineHeight: 1.3,
                              marginBottom: '3px',
                              textDecoration: 'none',
                              display: 'block',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#b71c1c'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                          >
                            {art.title}
                          </a>
                          {art.isBreaking && (
                            <span style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '1px 5px', borderRadius: '3px', marginRight: '6px' }}>
                              <i className="fa fa-bolt"></i> ਬਰੇਕਿੰਗ (Breaking)
                            </span>
                          )}
                          <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                            {art.excerpt ? art.excerpt.substring(0, 55) + '...' : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
                        {getCategoryLabel(art.category)}
                      </span>
                      {art.category === 'punjab' && art.punjabRegion && (
                        <div style={{ fontSize: '10.5px', color: '#b71c1c', fontWeight: '700', marginTop: '3px' }}>
                          {art.punjabRegion === 'majha' ? 'ਮਾਝਾ (Majha)' : art.punjabRegion === 'malwa' ? 'ਮਾਲਵਾ (Malwa)' : art.punjabRegion === 'doaba' ? 'ਦੋਆਬਾ (Doaba)' : art.punjabRegion}
                        </div>
                      )}
                    </td>

                    {/* Language */}
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      {getLangBadge(art.language)}
                    </td>

                    {/* Author & Date */}
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>
                        {art.authorName || art.author?.name || 'ਪੱਤਰਕਾਰ (Reporter)'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {art.publishedAt || art.createdAt ? formatArticleDate(art.publishedAt || art.createdAt, art.language) : '—'}
                      </div>
                    </td>

                    {/* Views */}
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: '800', color: (art.views || 0) > 100 ? '#b71c1c' : '#334155', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <i className={`fa ${(art.views || 0) > 100 ? 'fa-fire' : 'fa-eye'}`} style={{ color: (art.views || 0) > 100 ? '#e11d48' : '#94a3b8' }}></i>
                        {(art.views || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                      {getStatusBadge(art.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {/* View live link */}
                        <a
                          href={`/news/${art.slug || art._id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="ਵੇਖੋ (View Live)"
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa fa-external-link"></i>
                        </a>

                        {/* Edit button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(art)}
                          title="ਸੋਧੋ (Edit News)"
                          style={{
                            backgroundColor: '#1c2d5a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa fa-pencil"></i>
                          <span>ਸੋਧੋ (Edit)</span>
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(art)}
                          title="ਮਿਟਾਓ (Delete News)"
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dedicated Mobile Card List (shown on mobile <= 768px) */}
          <div className="mobile-news-card-list">
            {articles.map((art, idx) => (
              <div
                key={art._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                {/* Header: Rank + Category + Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px' }}>
                      {getCategoryLabel(art.category)} {art.punjabRegion ? `• ${art.punjabRegion}` : ''}
                    </span>
                    {getLangBadge(art.language)}
                  </div>
                  <div>{getStatusBadge(art.status)}</div>
                </div>

                {/* Content: Thumbnail + Full Headline */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <img
                    src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                    alt={art.title}
                    onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                    style={{ width: '74px', height: '54px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a
                      href={`/news/${art.slug || art._id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontWeight: '700',
                        color: '#0f172a',
                        fontSize: '13.5px',
                        lineHeight: '1.35',
                        marginBottom: '4px',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      {art.title}
                    </a>
                    {art.isBreaking && (
                      <span style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '1px 5px', borderRadius: '3px', display: 'inline-block', marginBottom: '2px' }}>
                        <i className="fa fa-bolt"></i> ਬਰੇਕਿੰਗ (Breaking)
                      </span>
                    )}
                    <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span><i className="fa fa-user" style={{ marginRight: '3px' }}></i>{art.authorName || art.author?.name || 'ਪੱਤਰਕਾਰ (Reporter)'}</span>
                      <span>•</span>
                      <span>{art.publishedAt || art.createdAt ? formatArticleDate(art.publishedAt || art.createdAt, art.language) : '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Views + Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontWeight: '800', color: (art.views || 0) > 100 ? '#b71c1c' : '#334155', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <i className={`fa ${(art.views || 0) > 100 ? 'fa-fire' : 'fa-eye'}`} style={{ color: (art.views || 0) > 100 ? '#e11d48' : '#94a3b8' }}></i>
                    {(art.views || 0).toLocaleString('en-IN')} ਵਿਊਜ਼ (Views)
                  </span>

                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <a
                      href={`/news/${art.slug || art._id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className="fa fa-external-link"></i> ਵੇਖੋ (View)
                    </a>

                    <button
                      type="button"
                      onClick={() => openEditModal(art)}
                      style={{
                        backgroundColor: '#1c2d5a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className="fa fa-pencil"></i> ਸੋਧੋ (Edit)
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(art)}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className="fa fa-trash"></i> ਮਿਟਾਓ (Delete)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 4. EDIT ARTICLE MODAL */}
      {/* ========================================================= */}
      {editingArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #cbd5e1'
            }}
          >
            {/* Modal Header */}
            <div style={{ backgroundColor: '#1c2d5a', color: '#ffffff', padding: '16px 22px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa fa-pencil-square-o" style={{ fontSize: '18px', color: '#ebb10d' }}></i>
                <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>
                  ਖ਼ਬਰ ਸੋਧੋ (Edit News Article)
                </h4>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEdit} style={{ padding: '22px' }}>
              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਖ਼ਬਰ ਦਾ ਸਿਰਲੇਖ (News Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
              </div>

              {/* English URL Slug */}
              <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  🔗 ਅੰਗਰੇਜ਼ੀ URL ਸਿਰਲੇਖ (English URL Slug)
                </label>
                <input
                  type="text"
                  value={editFormData.slug || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                  placeholder="e.g. amritsar-smart-city-heritage-street-project"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}
                />
                <div style={{ marginTop: '5px', fontSize: '11.5px', color: '#0369a1' }}>
                  <strong>URL: </strong> /news/{editFormData.slug ? transliterateGurmukhiToEnglish(editFormData.slug) : transliterateGurmukhiToEnglish(editFormData.title || 'news')}
                </div>
              </div>

              {/* Category, Region, Language row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਕੈਟੇਗਰੀ (Category)
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600' }}
                  >
                    {categoriesList.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label} ({c.labelEn})</option>
                    ))}
                  </select>
                </div>

                {/* Punjab Region (if category === 'punjab') */}
                {editFormData.category === 'punjab' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#b71c1c', marginBottom: '6px' }}>
                      ਪੰਜਾਬ ਜ਼ੋਨ (Punjab Region)
                    </label>
                    <select
                      value={editFormData.punjabRegion}
                      onChange={(e) => setEditFormData({ ...editFormData, punjabRegion: e.target.value })}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '13px', fontWeight: '600', backgroundColor: '#fff1f2' }}
                    >
                      <option value="majha">ਮਾਝਾ (Majha)</option>
                      <option value="malwa">ਮਾਲਵਾ (Malwa)</option>
                      <option value="doaba">ਦੋਆਬਾ (Doaba)</option>
                    </select>
                  </div>
                )}

                {/* Language */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਭਾਸ਼ਾ (Language)
                  </label>
                  <select
                    value={editFormData.language}
                    onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਸਟੇਟਸ (Publication Status)
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '700' }}
                  >
                    <option value="published">ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ (Published Live)</option>
                    <option value="pending_admin">ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਬਕਾਇਆ (Pending Admin)</option>
                    <option value="pending_editor">ਸੰਪਾਦਕ ਸਮੀਖਿਆ ਬਕਾਇਆ (Pending Editor)</option>
                    <option value="rejected">ਰੱਦ ਕਰੋ (Rejected)</option>
                  </select>
                </div>
              </div>

              {/* Featured Image URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਮੁੱਖ ਤਸਵੀਰ ਲਿੰਕ (Featured Image URL)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editFormData.featuredImage}
                    onChange={(e) => setEditFormData({ ...editFormData, featuredImage: e.target.value })}
                    placeholder="/img/index_800x400-image01.jpg ਜਾਂ ਕੋਈ ਵੀ ਚਿੱਤਰ URL"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  {editFormData.featuredImage && (
                    <img
                      src={editFormData.featuredImage}
                      alt="Preview"
                      onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                      style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਸੰਖੇਪ ਵੇਰਵਾ (Short Excerpt)
                </label>
                <textarea
                  rows="2"
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              {/* Full Content */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਪੂਰੀ ਖ਼ਬਰ ਦਾ ਵੇਰਵਾ (Full Article Content)
                </label>
                <textarea
                  rows="6"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              {/* Breaking News Checkbox */}
              <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="modalIsBreaking"
                  checked={editFormData.isBreaking}
                  onChange={(e) => setEditFormData({ ...editFormData, isBreaking: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#b71c1c' }}
                />
                <label htmlFor="modalIsBreaking" style={{ fontSize: '13px', fontWeight: '700', color: '#b71c1c', cursor: 'pointer' }}>
                  <i className="fa fa-bolt"></i> ਇਸ ਖ਼ਬਰ ਨੂੰ 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਟਿੱਕਰ' ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ (Mark as Breaking News)
                </label>
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSavingEdit}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '9px 18px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ਵਾਪਸ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  style={{
                    backgroundColor: '#1c2d5a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 22px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isSavingEdit ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i>
                      <span>ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ... (Saving...)</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check"></i>
                      <span>ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ (Save Changes)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {deletingArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #fecdd3',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                margin: '0 auto 16px'
              }}
            >
              <i className="fa fa-trash"></i>
            </div>

            <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              ਖ਼ਬਰ ਡਿਲੀਟ ਕਰੋ (Delete News)?
            </h4>

            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
              ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਇਹ ਖ਼ਬਰ ਸਿਸਟਮ ਵਿੱਚੋਂ ਪੱਕੇ ਤੌਰ 'ਤੇ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਲਈ ਜਾ ਸਕਦੀ (Are you sure you want to permanently delete this article? This action cannot be undone).
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px 14px',
                marginBottom: '20px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                textAlign: 'left'
              }}
            >
              <i className="fa fa-file-text-o" style={{ marginRight: '6px', color: '#b71c1c' }}></i>
              {deletingArticle.title}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਵਾਪਸ (Cancel)
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  backgroundColor: '#b91c1c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 22px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isDeleting ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    <span>ਹਟਾਇਆ ਜਾ ਰਿਹਾ ਹੈ... (Deleting...)</span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-trash"></i>
                    <span>ਹਾਂ, ਡਿਲੀਟ ਕਰੋ (Delete)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
