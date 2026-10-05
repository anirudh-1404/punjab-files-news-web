import React, { useState, useEffect, useCallback } from 'react';
import { articleAPI } from '../../../services/api';
import { formatArticleDate } from '../../../services/dateUtils';
import ActionModal from '../../../components/Common/ActionModal';
import EditArticleModal from '../../../components/Common/EditArticleModal';

export default function MyArticlesView({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'pending_review', 'rejected'
  const [actionMsg, setActionMsg] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  const [popup, setPopup] = useState(null);

  const fetchMyArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleAPI.getMyArticles();
      setArticles(res.articles || []);
    } catch (err) {
      console.error('Failed to load my articles:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyArticles();
  }, [fetchMyArticles]);

  const handleDelete = (id, title) => {
    setPopup({
      type: 'confirm',
      title: 'ਖ਼ਬਰ ਹਟਾਓ (Delete Article)',
      message: `ਕੀ ਤੁਸੀਂ ਇਸ ਖ਼ਬਰ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?\n\n"${title}"`,
      confirmLabel: 'ਹਾਂ, ਹਟਾਓ (Yes, Delete)',
      confirmColor: '#b71c1c',
      onConfirm: async () => {
        setPopup(null);
        try {
          await articleAPI.deleteArticle(id);
          setActionMsg('ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ!');
          setArticles((prev) => prev.filter((a) => a._id !== id));
          setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
            message: 'ਖ਼ਬਰ ਹਟਾਉਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
          });
        }
      }
    });
  };

  const filtered = articles.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'pending_editor') {
      return a.status === 'pending_editor' || a.status === 'pending_review';
    }
    return a.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 9px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i className="fa fa-check-circle"></i> ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ (Live)
          </span>
        );
      case 'pending_admin':
        return (
          <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '3px 9px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i className="fa fa-hourglass-half"></i> ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜਿਆ (Pending Admin)
          </span>
        );
      case 'pending_editor':
      case 'pending_review':
        return (
          <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', padding: '3px 9px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i className="fa fa-clock-o"></i> ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਅਧੀਨ (Under Review)
          </span>
        );
      case 'rejected':
        return (
          <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '3px 9px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i className="fa fa-times-circle"></i> ਰੱਦ ਕੀਤਾ ਗਿਆ (Rejected)
          </span>
        );
      default:
        return (
          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 9px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '700' }}>
            ਡਰਾਫ਼ਟ (Draft)
          </span>
        );
    }
  };

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '2px solid #b71c1c', paddingBottom: '14px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
            ਮੇਰੀਆਂ ਸਬਮਿਟ ਕੀਤੀਆਂ ਖ਼ਬਰਾਂ (My Submitted Articles)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਤੁਹਾਡੇ ਵੱਲੋਂ ਲਿਖੀਆਂ ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਅਤੇ ਉਹਨਾਂ ਦਾ ਲਾਈਵ ਸਟੇਟਸ ਇੱਥੇ ਨਜ਼ਰ ਆਵੇਗਾ (Track all your submitted articles and their live status here).
          </p>
        </div>

        {/* Status Filters */}
        <div className="review-tabs-scroll" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'ਸਭ (All)' },
            { key: 'published', label: 'ਲਾਈਵ (Live)' },
            { key: 'pending_admin', label: 'ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ (Admin Pending)' },
            { key: 'pending_editor', label: 'ਸੰਪਾਦਕ ਸਮੀਖਿਆ (Editor Pending)' },
            { key: 'rejected', label: 'ਰੱਦ (Rejected)' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '4px',
                border: filter === tab.key ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                backgroundColor: filter === tab.key ? '#b71c1c' : '#ffffff',
                color: filter === tab.key ? '#ffffff' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {actionMsg && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '5px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
          <p style={{ margin: 0, fontSize: '13.5px' }}>ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ... (Loading articles...)</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
          <i className="fa fa-newspaper-o" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '10px' }}></i>
          <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#334155' }}>ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ (No Articles Found)</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕੋਈ ਖ਼ਬਰ ਇਸ ਕੈਟੇਗਰੀ ਵਿੱਚ ਦਰਜ ਨਹੀਂ ਕੀਤੀ (You haven't submitted any articles in this filter).
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-table-view" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '10px 12px' }}>ਤਸਵੀਰ (Image)</th>
                  <th style={{ padding: '10px 12px' }}>ਸਿਰਲੇਖ (Title)</th>
                  <th style={{ padding: '10px 12px' }}>ਭਾਸ਼ਾ (Language)</th>
                  <th style={{ padding: '10px 12px' }}>ਕੈਟੇਗਰੀ (Category)</th>
                  <th style={{ padding: '10px 12px' }}>ਸਟੇਟਸ (Status)</th>
                  <th style={{ padding: '10px 12px' }}>ਮਿਤੀ (Date)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>ਕਾਰਵਾਈ (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((art) => (
                  <tr key={art._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', width: '60px' }}>
                      <img
                        src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                        alt=""
                        style={{ width: '50px', height: '34px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                      />
                    </td>
                    <td style={{ padding: '10px 12px', maxWidth: '300px' }}>
                      {art.status === 'published' ? (
                        <a
                          href={`/news/${art.slug || art._id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontWeight: '700', color: '#0f172a', display: 'block', textDecoration: 'none', cursor: 'pointer' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#b71c1c'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                        >
                          {art.title}
                        </a>
                      ) : (
                        <span style={{ fontWeight: '700', color: '#0f172a', display: 'block' }}>
                          {art.title}
                        </span>
                      )}
                      {art.isBreaking && (
                        <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '1px 5px', borderRadius: '2px', marginTop: '3px', display: 'inline-block' }}>
                          ਬਰੇਕਿੰਗ (Breaking)
                        </span>
                      )}
                      {art.status === 'rejected' && art.rejectionReason && (
                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '3px 6px', borderRadius: '3px', borderLeft: '2px solid #b91c1c' }}>
                          <strong>ਕਾਰਨ (Reason):</strong> {art.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {art.language === 'hi' ? (
                        <span style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                          हिंदी (Hindi)
                        </span>
                      ) : art.language === 'en' ? (
                        <span style={{ backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                          English
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#fef2f2', color: '#b71c1c', border: '1px solid #fecaca', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                          ਪੰਜਾਬੀ (Punjabi)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa fa-folder-o" style={{ fontSize: '9.5px', color: '#2563eb' }}></i>
                          {art.category === 'punjab' ? 'ਪੰਜਾਬ (Punjab)' : art.category === 'religion' ? 'ਧਰਮ ਤੇ ਵਿਰਾਸਤ (Religion)' : art.category === 'world' || art.category === 'national' ? 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)' : art.category === 'sport' || art.category === 'sports' ? 'ਖੇਡਾਂ (Sports)' : art.category === 'health' ? 'ਸਿਹਤ (Health)' : art.category === 'travel' ? 'ਸੈਰ-ਸਪਾਟਾ (Travel)' : art.category === 'art-entertainment' || art.category === 'entertainment' ? 'ਮਨੋਰੰਜਨ (Entertainment)' : art.category === 'business' ? 'ਵਪਾਰ (Business)' : art.category}
                        </span>
                        {art.category === 'punjab' && art.punjabRegion && (
                          <span style={{ backgroundColor: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3', fontSize: '10.5px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <i className="fa fa-map-marker" style={{ fontSize: '9.5px', color: '#e11d48' }}></i>
                            {art.punjabRegion === 'majha' ? 'ਮਾਝਾ (Majha)' : art.punjabRegion === 'malwa' ? 'ਮਾਲਵਾ (Malwa)' : art.punjabRegion === 'doaba' ? 'ਦੋਆਬਾ (Doaba)' : art.punjabRegion}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>{getStatusBadge(art.status)}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>
                      {art.createdAt ? formatArticleDate(art.createdAt, art.language) : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {art.status === 'published' && (
                          <a
                            href={`/news/${art.slug || art._id}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="ਲਾਈਵ ਵੇਖੋ (View Live)"
                          >
                            <i className="fa fa-external-link"></i>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setEditingArticle(art)}
                          style={{
                            backgroundColor: '#1c2d5a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="ਖ਼ਬਰ ਸੋਧੋ (Edit News)"
                        >
                          <i className="fa fa-pencil"></i>
                          <span>ਸੋਧੋ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(art._id, art.title)}
                          style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fca5a5',
                            color: '#b71c1c',
                            cursor: 'pointer',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          title="Delete"
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

          {/* Dedicated Mobile Card List */}
          <div className="mobile-news-card-list">
            {filtered.map((art) => (
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
                {/* Header: Category + Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa fa-folder-o" style={{ fontSize: '9.5px', color: '#2563eb' }}></i>
                      {art.category === 'punjab' ? 'ਪੰਜਾਬ (Punjab)' : art.category === 'religion' ? 'ਧਰਮ ਤੇ ਵਿਰਾਸਤ (Religion)' : art.category === 'world' || art.category === 'national' ? 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)' : art.category === 'sport' || art.category === 'sports' ? 'ਖੇਡਾਂ (Sports)' : art.category === 'health' ? 'ਸਿਹਤ (Health)' : art.category === 'travel' ? 'ਸੈਰ-ਸਪਾਟਾ (Travel)' : art.category === 'art-entertainment' || art.category === 'entertainment' ? 'ਮਨੋਰੰਜਨ (Entertainment)' : art.category === 'business' ? 'ਵਪਾਰ (Business)' : art.category}
                    </span>
                    {art.category === 'punjab' && art.punjabRegion && (
                      <span style={{ backgroundColor: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3', fontSize: '10.5px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <i className="fa fa-map-marker" style={{ fontSize: '9.5px', color: '#e11d48' }}></i>
                        {art.punjabRegion === 'majha' ? 'ਮਾਝਾ (Majha)' : art.punjabRegion === 'malwa' ? 'ਮਾਲਵਾ (Malwa)' : art.punjabRegion === 'doaba' ? 'ਦੋਆਬਾ (Doaba)' : art.punjabRegion}
                      </span>
                    )}
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748b' }}>
                      {art.language === 'hi' ? 'हिंदी' : art.language === 'en' ? 'English' : 'ਪੰਜਾਬੀ'}
                    </span>
                  </div>
                  <div>{getStatusBadge(art.status)}</div>
                </div>

                {/* Content: Thumbnail + Headline */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <img
                    src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                    alt=""
                    style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {art.status === 'published' ? (
                      <a
                        href={`/news/${art.slug || art._id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: '700', color: '#0f172a', fontSize: '13.5px', lineHeight: '1.35', display: 'block', textDecoration: 'none' }}
                      >
                        {art.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13.5px', lineHeight: '1.35', display: 'block' }}>
                        {art.title}
                      </span>
                    )}

                    {art.isBreaking && (
                      <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '1px 5px', borderRadius: '2px', marginTop: '2px', display: 'inline-block' }}>
                        ਬਰੇਕਿੰਗ (Breaking)
                      </span>
                    )}

                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {art.createdAt ? formatArticleDate(art.createdAt, art.language) : '—'}
                    </div>
                  </div>
                </div>

                {/* Rejection notice if applicable */}
                {art.status === 'rejected' && art.rejectionReason && (
                  <div style={{ fontSize: '11.5px', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #b91c1c' }}>
                    <strong>ਕਾਰਨ (Reason):</strong> {art.rejectionReason}
                  </div>
                )}

                {/* Footer Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '8px', gap: '8px' }}>
                  {art.status === 'published' && (
                    <a
                      href={`/news/${art.slug || art._id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <i className="fa fa-external-link"></i> ਲਾਈਵ ਵੇਖੋ (View Live)
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditingArticle(art)}
                    style={{
                      backgroundColor: '#1c2d5a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 10px',
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
                    onClick={() => handleDelete(art._id, art.title)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fa fa-trash"></i> ਹਟਾਓ (Delete)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={Boolean(editingArticle)}
        article={editingArticle}
        currentUser={user}
        onClose={() => setEditingArticle(null)}
        onSaved={() => {
          setActionMsg('ਤੁਹਾਡੀ ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸੋਧੀ ਗਈ ਹੈ (Your article has been updated)!');
          fetchMyArticles();
          setTimeout(() => setActionMsg(''), 4500);
        }}
      />

      {/* Custom Action Modal */}
      <ActionModal
        isOpen={Boolean(popup)}
        type={popup?.type || 'alert'}
        title={popup?.title}
        message={popup?.message}
        confirmLabel={popup?.confirmLabel}
        confirmColor={popup?.confirmColor}
        onConfirm={popup?.onConfirm}
        onClose={() => setPopup(null)}
      />
    </div>
  );
}
