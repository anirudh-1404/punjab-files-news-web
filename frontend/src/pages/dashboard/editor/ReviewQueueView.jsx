import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../../../services/api';
import ActionModal from '../../../components/Common/ActionModal';

export default function ReviewQueueView({ currentUser, onStatusChanged }) {
  const isAdmin = currentUser?.role === 'admin';
  const defaultTab = isAdmin ? 'pending_admin' : 'pending_editor';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [articles, setArticles] = useState([]);
  const [counts, setCounts] = useState({
    pendingEditor: 0,
    pendingAdmin: 0,
    published: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreview, setActivePreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState('');
  const [popup, setPopup] = useState(null);

  // Rejection modal state
  const [rejectModalArticle, setRejectModalArticle] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch articles from backend review-desk endpoint
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleAPI.getReviewDeskArticles(activeTab);
      setArticles(res.articles || res.data || []);
      if (res.counts) {
        setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load review desk articles:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle Status Update (Publish / Forward to Admin / Re-approve)
  const handleUpdateStatus = async (id, status, title, customReason = null) => {
    try {
      setActionLoading(id);
      await articleAPI.updateStatus(id, status, customReason);

      let msg = `ਖ਼ਬਰ ਅੱਪਡੇਟ ਹੋ ਗਈ ਹੈ: "${title}"`;
      if (status === 'published') {
        msg = `ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋ ਗਈ ਹੈ: "${title}"`;
      } else if (status === 'pending_admin') {
        msg = `ਖ਼ਬਰ ਐਡਮਿਨ ਦੀ ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ: "${title}"`;
      } else if (status === 'rejected') {
        msg = `ਖ਼ਬਰ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ: "${title}"`;
      }

      setNotification(msg);

      // Close modal if open
      setRejectModalArticle(null);
      setRejectionReason('');
      setActivePreview(null);

      // Refresh list & counts
      await fetchArticles();

      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setNotification(''), 4500);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਖ਼ਬਰ ਸਥਿਤੀ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Open Rejection Dialog
  const openRejectDialog = (art) => {
    setRejectModalArticle(art);
    setRejectionReason('');
  };

  // Submit Rejection with Reason
  const submitRejection = () => {
    if (!rejectModalArticle) return;
    handleUpdateStatus(
      rejectModalArticle._id,
      'rejected',
      rejectModalArticle.title,
      rejectionReason.trim() || 'ਕੋਈ ਵਿਸ਼ੇਸ਼ ਕਾਰਨ ਦਰਜ ਨਹੀਂ ਕੀਤਾ ਗਿਆ (No specific reason provided)'
    );
  };

  // Filtered articles by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.authorName?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.author?.name?.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {/* Top Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '21px', fontWeight: '800', color: '#0f172a' }}>
              {isAdmin
                ? 'ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਡੈਸਕ (Super Admin Final Approval Desk)'
                : 'ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਡੈਸਕ (Chief Editor Review Desk)'}
            </h3>

            {/* Notification badge */}
            {isAdmin && counts.pendingAdmin > 0 && (
              <span style={{ backgroundColor: '#1e40af', color: '#ffffff', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                {counts.pendingAdmin} ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਉਡੀਕ (Pending Approval)
              </span>
            )}
            {!isAdmin && counts.pendingEditor > 0 && (
              <span style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                {counts.pendingEditor} ਸਮੀਖਿਆ ਬਕਾਇਆ (Pending Review)
              </span>
            )}
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
            {isAdmin
              ? 'ਸੰਪਾਦਕ ਵੱਲੋਂ ਸਮੀਖਿਆ ਕੀਤੀਆਂ ਖ਼ਬਰਾਂ ਦੀ ਅੰਤਿਮ ਪੜਚੋਲ ਕਰੋ ਅਤੇ ਇੱਕ ਕਲਿੱਕ ਨਾਲ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲਾਈਵ ਕਰੋ (Review editor-verified news and publish live with one click).'
              : 'ਰਿਪੋਰਟਰਾਂ ਵੱਲੋਂ ਭੇਜੀਆਂ ਗਈਆਂ ਖ਼ਬਰਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ, ਸੁਧਾਰ ਕਰੋ, ਅਤੇ ਐਡਮਿਨ ਦੀ ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਲਈ ਅੱਗੇ ਭੇਜੋ (Review reporter submissions, make edits, and forward to Admin for final approval).'}
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
            gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          <i className="fa fa-refresh"></i>
          <span>ਤਾਜ਼ਾ ਕਰੋ (Refresh)</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa fa-check-circle" style={{ fontSize: '18px' }}></i>
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="review-filters-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {/* Filter Tabs */}
        <div className="review-tabs-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {isAdmin ? (
            <>
              {/* Admin Tab 1: Pending Final Approval */}
              <button
                type="button"
                onClick={() => setActiveTab('pending_admin')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: activeTab === 'pending_admin' ? '1px solid #1e40af' : '1px solid #cbd5e1',
                  backgroundColor: activeTab === 'pending_admin' ? '#1e40af' : '#ffffff',
                  color: activeTab === 'pending_admin' ? '#ffffff' : '#475569',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-hourglass-half"></i>
                <span>ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਲਈ (Ready for Approval)</span>
                <span style={{ backgroundColor: activeTab === 'pending_admin' ? '#ffffff' : '#f1f5f9', color: activeTab === 'pending_admin' ? '#1e40af' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                  {counts.pendingAdmin}
                </span>
              </button>

              {/* Admin Tab 2: With Editor */}
              <button
                type="button"
                onClick={() => setActiveTab('pending_editor')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: activeTab === 'pending_editor' ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                  backgroundColor: activeTab === 'pending_editor' ? '#b71c1c' : '#ffffff',
                  color: activeTab === 'pending_editor' ? '#ffffff' : '#475569',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-clock-o"></i>
                <span>ਸੰਪਾਦਕ ਕੋਲ ਬਕਾਇਆ (With Editor)</span>
                <span style={{ backgroundColor: activeTab === 'pending_editor' ? '#ffffff' : '#f1f5f9', color: activeTab === 'pending_editor' ? '#b71c1c' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                  {counts.pendingEditor}
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Editor Tab 1: Pending Review */}
              <button
                type="button"
                onClick={() => setActiveTab('pending_editor')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: activeTab === 'pending_editor' ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                  backgroundColor: activeTab === 'pending_editor' ? '#b71c1c' : '#ffffff',
                  color: activeTab === 'pending_editor' ? '#ffffff' : '#475569',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-clock-o"></i>
                <span>ਸਮੀਖਿਆ ਬਕਾਇਆ (Pending Review)</span>
                <span style={{ backgroundColor: activeTab === 'pending_editor' ? '#ffffff' : '#f1f5f9', color: activeTab === 'pending_editor' ? '#b71c1c' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                  {counts.pendingEditor}
                </span>
              </button>

              {/* Editor Tab 2: Forwarded to Admin */}
              <button
                type="button"
                onClick={() => setActiveTab('pending_admin')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: activeTab === 'pending_admin' ? '1px solid #1e40af' : '1px solid #cbd5e1',
                  backgroundColor: activeTab === 'pending_admin' ? '#1e40af' : '#ffffff',
                  color: activeTab === 'pending_admin' ? '#ffffff' : '#475569',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-paper-plane"></i>
                <span>ਐਡਮਿਨ ਨੂੰ ਭੇਜੀਆਂ (Sent to Admin)</span>
                <span style={{ backgroundColor: activeTab === 'pending_admin' ? '#ffffff' : '#f1f5f9', color: activeTab === 'pending_admin' ? '#1e40af' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                  {counts.pendingAdmin}
                </span>
              </button>
            </>
          )}

          {/* Common: Live Published Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: activeTab === 'published' ? '1px solid #16a34a' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'published' ? '#16a34a' : '#ffffff',
              color: activeTab === 'published' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa fa-check-circle"></i>
            <span>ਮਨਜ਼ੂਰ ਤੇ ਲਾਈਵ (Live)</span>
            <span style={{ backgroundColor: activeTab === 'published' ? '#ffffff' : '#f1f5f9', color: activeTab === 'published' ? '#16a34a' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
              {counts.published}
            </span>
          </button>

          {/* Common: Rejected Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: activeTab === 'rejected' ? '1px solid #dc2626' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'rejected' ? '#dc2626' : '#ffffff',
              color: activeTab === 'rejected' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa fa-times-circle"></i>
            <span>ਰੱਦ ਕੀਤੀਆਂ (Rejected)</span>
            <span style={{ backgroundColor: activeTab === 'rejected' ? '#ffffff' : '#f1f5f9', color: activeTab === 'rejected' ? '#dc2626' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
              {counts.rejected}
            </span>
          </button>

          {/* Common: All Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: activeTab === 'all' ? '1px solid #1c2d5a' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'all' ? '#1c2d5a' : '#ffffff',
              color: activeTab === 'all' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa fa-list"></i>
            <span>ਸਾਰੀਆਂ (All)</span>
            <span style={{ backgroundColor: activeTab === 'all' ? '#ffffff' : '#f1f5f9', color: activeTab === 'all' ? '#1c2d5a' : '#475569', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
              {counts.total}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '320px' }}>
          <i className="fa fa-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}></i>
          <input
            type="text"
            placeholder="ਸਿਰਲੇਖ ਜਾਂ ਰਿਪੋਰਟਰ ਖੋਜੋ (Search title or reporter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12.5px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '12px', color: '#b71c1c' }}></i>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>ਖ਼ਬਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ... (Loading articles...)</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <i className="fa fa-folder-open-o" style={{ fontSize: '40px', color: '#94a3b8', marginBottom: '12px' }}></i>
          <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>
            ਇਸ ਸੈਕਸ਼ਨ ਵਿੱਚ ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਹੈ (No articles in this section).
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            ਤੁਸੀਂ ਦੂਸਰੇ ਟੈਬ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਤਾਜ਼ਾ ਰੀਫ੍ਰੈਸ਼ ਕਰ ਸਕਦੇ ਹੋ (Check other tabs or click refresh).
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredArticles.map((art) => {
            const isApproved = art.status === 'published';
            const isRejected = art.status === 'rejected';
            const isPendingAdmin = art.status === 'pending_admin';
            const isPendingEditor = art.status === 'pending_editor' || art.status === 'pending_review';

            return (
              <div
                key={art._id}
                className="review-article-card"
                style={{
                  border: isRejected
                    ? '1px solid #fecaca'
                    : isApproved
                    ? '1px solid #bbf7d0'
                    : isPendingAdmin
                    ? '1px solid #bfdbfe'
                    : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '18px',
                  backgroundColor: isRejected
                    ? '#fffafa'
                    : isApproved
                    ? '#fcfdfc'
                    : isPendingAdmin
                    ? '#f8faff'
                    : '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  position: 'relative'
                }}
              >
                {/* Thumbnail */}
                <div className="review-thumb-col" style={{ position: 'relative', width: '120px', height: '85px', flexShrink: 0 }}>
                  <img
                    src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                  {art.mediaType === 'video' && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        color: '#ebb10d',
                        fontSize: '10px',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <i className="fa fa-video-camera"></i> ਵੀਡੀਓ (Video)
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  {/* Status & Meta Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {isPendingEditor && (
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa fa-clock-o"></i> ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਬਕਾਇਆ (Editor Review)
                      </span>
                    )}

                    {isPendingAdmin && (
                      <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa fa-hourglass-half"></i> ਐਡਮਿਨ ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਲਈ (Ready for Admin)
                      </span>
                    )}

                    {isApproved && (
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa fa-check-circle"></i> ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਤੇ ਲਾਈਵ (Live)
                      </span>
                    )}

                    {isRejected && (
                      <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa fa-times-circle"></i> ਰੱਦ ਕੀਤੀ ਗਈ (Rejected)
                      </span>
                    )}

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

                    {/* Language Badge */}
                    <span
                      style={{
                        backgroundColor: art.language === 'hi' ? '#fffbeb' : art.language === 'en' ? '#f0f9ff' : '#fef2f2',
                        color: art.language === 'hi' ? '#b45309' : art.language === 'en' ? '#0369a1' : '#b71c1c',
                        border: `1px solid ${art.language === 'hi' ? '#fde68a' : art.language === 'en' ? '#bae6fd' : '#fecaca'}`,
                        fontSize: '10.5px',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {art.language === 'hi' ? 'हिंदी (Hindi)' : art.language === 'en' ? 'English' : 'ਪੰਜਾਬੀ (Punjabi)'}
                    </span>

                    {art.isBreaking && (
                      <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '10.5px', fontWeight: '800', padding: '2px 7px', borderRadius: '4px' }}>
                        ਬਰੇਕਿੰਗ ਨਿਊਜ਼ (Breaking)
                      </span>
                    )}

                    {/* Author Info */}
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                      <i className="fa fa-user" style={{ marginRight: '4px', color: '#64748b' }}></i>
                      {art.authorName || (art.author ? art.author.name : 'ਰਿਪੋਰਟਰ (Reporter)')}
                      {art.author?.canDirectPublish && (
                        <span style={{ marginLeft: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '10px', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>
                          ⚡ Auto-Publish
                        </span>
                      )}
                    </span>

                    {/* Date */}
                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                      <i className="fa fa-calendar" style={{ marginRight: '4px' }}></i>
                      {isApproved && art.publishedAt
                        ? `ਪ੍ਰਕਾਸ਼ਿਤ (Published): ${new Date(art.publishedAt).toLocaleString('pa-IN')}`
                        : new Date(art.createdAt).toLocaleString('pa-IN')}
                    </span>

                    {/* Live Views */}
                    {isApproved && (
                      <span style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: '700', backgroundColor: '#e0f2fe', padding: '2px 7px', borderRadius: '4px' }}>
                        <i className="fa fa-eye" style={{ marginRight: '4px' }}></i>
                        {art.views || 0} ਵਿਊਜ਼ (Views)
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <h4 style={{ margin: '0 0 6px', fontSize: '16.5px', fontWeight: '800', color: '#0f172a', lineHeight: '1.4' }}>
                    {art.title}
                  </h4>

                  {/* Excerpt */}
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                    {art.excerpt || (art.content ? art.content.substring(0, 150) + '...' : '')}
                  </p>

                  {/* Workflow Signatures */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                    {art.editorReviewedBy && (
                      <span style={{ color: '#1e40af' }}>
                        <i className="fa fa-check-square-o" style={{ marginRight: '4px' }}></i>
                        ਸੰਪਾਦਕ ਜਾਂਚ (Editor Verified): <strong>{art.editorReviewedBy.name || 'ਮੁੱਖ ਸੰਪਾਦਕ (Chief Editor)'}</strong>
                      </span>
                    )}
                    {art.adminApprovedBy && (
                      <span style={{ color: '#15803d' }}>
                        <i className="fa fa-check-circle" style={{ marginRight: '4px' }}></i>
                        ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ (Admin Approved): <strong>{art.adminApprovedBy.name || 'ਮੁੱਖ ਪ੍ਰਬੰਧਕ (Admin)'}</strong>
                      </span>
                    )}
                  </div>

                  {/* Rejection reason if rejected */}
                  {isRejected && (
                    <div style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #dc2626', padding: '8px 12px', borderRadius: '0 4px 4px 0', marginTop: '8px', fontSize: '12.5px', color: '#991b1b' }}>
                      <strong>ਰੱਦ ਕਰਨ ਦਾ ਕਾਰਨ (Rejection Reason):</strong> {art.rejectionReason || 'ਕੋਈ ਵਿਸ਼ੇਸ਼ ਕਾਰਨ ਦਰਜ ਨਹੀਂ (No reason given)'}
                      {art.rejectedBy && (
                        <span style={{ display: 'block', marginTop: '2px', fontSize: '11px', color: '#b91c1c' }}>
                          ਰੱਦ ਕਰਤਾ (Rejected By): {art.rejectedBy.name || 'ਸਟਾਫ਼ (Staff)'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="review-action-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'center', minWidth: '165px' }}>
                  {/* EDITOR PERSPECTIVE */}
                  {!isAdmin && (
                    <>
                      {/* If Editor Pending: Forward to Admin or Reject */}
                      {isPendingEditor && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => handleUpdateStatus(art._id, 'pending_admin', art.title)}
                            style={{
                              backgroundColor: '#1e40af',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '5px',
                              fontSize: '12.5px',
                              fontWeight: '800',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 5px rgba(30, 64, 175, 0.25)'
                            }}
                          >
                            <i className="fa fa-paper-plane"></i> ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ (Forward)
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => openRejectDialog(art)}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              padding: '6px 12px',
                              borderRadius: '5px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa fa-times"></i> ਰੱਦ ਕਰੋ (Reject)
                          </button>
                        </>
                      )}

                      {/* If Forwarded to Admin */}
                      {isPendingAdmin && (
                        <div style={{ textAlign: 'center', padding: '6px 8px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #bfdbfe', fontSize: '11.5px', color: '#1e40af', fontWeight: '700' }}>
                          <i className="fa fa-hourglass-half"></i> ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਦੀ ਉਡੀਕ (Awaiting Admin)
                        </div>
                      )}
                    </>
                  )}

                  {/* ADMIN PERSPECTIVE */}
                  {isAdmin && (
                    <>
                      {/* If Ready for Final Admin Approval */}
                      {isPendingAdmin && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => handleUpdateStatus(art._id, 'published', art.title)}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '5px',
                              fontSize: '12.5px',
                              fontWeight: '800',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 5px rgba(22, 163, 74, 0.25)'
                            }}
                          >
                            <i className="fa fa-check"></i> ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ (Publish Live)
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => openRejectDialog(art)}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              padding: '6px 12px',
                              borderRadius: '5px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa fa-times"></i> ਰੱਦ ਕਰੋ (Reject)
                          </button>
                        </>
                      )}

                      {/* If Editor Pending but Admin wants to directly approve */}
                      {isPendingEditor && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => handleUpdateStatus(art._id, 'published', art.title)}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '7px 12px',
                              borderRadius: '5px',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px'
                            }}
                          >
                            <i className="fa fa-bolt"></i> ਸਿੱਧਾ ਲਾਈਵ ਕਰੋ (Publish Live)
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading === art._id}
                            onClick={() => openRejectDialog(art)}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa fa-times"></i> ਰੱਦ ਕਰੋ (Reject)
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {/* Common: If Published, Show Live Link and Option to Unpublish */}
                  {isApproved && (
                    <>
                      <Link
                        to={`/news/${art.slug || art._id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                          padding: '7px 12px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className="fa fa-external-link" style={{ color: '#16a34a' }}></i>
                        <span>ਲਾਈਵ ਖ਼ਬਰ ਦੇਖੋ (View Live)</span>
                      </Link>

                      <button
                        type="button"
                        disabled={actionLoading === art._id}
                        onClick={() => openRejectDialog(art)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#b91c1c',
                          border: '1px solid #fca5a5',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <i className="fa fa-ban"></i> ਹਟਾਓ / ਰੱਦ ਕਰੋ (Unpublish / Reject)
                      </button>
                    </>
                  )}

                  {/* Common: If Rejected, Allow Re-approving */}
                  {isRejected && (
                    <button
                      type="button"
                      disabled={actionLoading === art._id}
                      onClick={() =>
                        handleUpdateStatus(
                          art._id,
                          isAdmin ? 'published' : 'pending_admin',
                          art.title
                        )
                      }
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: actionLoading === art._id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)'
                      }}
                    >
                      <i className="fa fa-undo"></i>{' '}
                      {isAdmin ? 'ਮੁੜ ਲਾਈਵ ਕਰੋ (Re-approve Live)' : 'ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ (Forward to Admin)'}
                    </button>
                  )}

                  {/* Toggle Preview Drawer */}
                  <button
                    type="button"
                    onClick={() => setActivePreview(activePreview?._id === art._id ? null : art)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#475569',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginTop: '2px'
                    }}
                  >
                    {activePreview?._id === art._id ? 'ਬੰਦ ਕਰੋ (Close)' : 'ਪੂਰੀ ਖ਼ਬਰ ਦੇਖੋ (Preview)'}
                  </button>
                </div>

                {/* Expandable Article Preview Drawer */}
                {activePreview?._id === art._id && (
                  <div style={{ width: '100%', marginTop: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', borderTop: '1px solid #e2e8f0' }}>
                    <h5 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                      ਪੂਰਾ ਆਰਟੀਕਲ ਪ੍ਰੀਵਿਊ (Full Article Preview):
                    </h5>
                    <div style={{ fontSize: '13.5px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line' }}>
                      {art.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectModalArticle && (
        <div
          className="cms-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px 12px'
          }}
        >
          <div
            className="cms-modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '520px',
              width: '100%',
              padding: '20px 16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa fa-times-circle"></i> ਖ਼ਬਰ ਰੱਦ ਕਰੋ (Reject News)
              </h4>
              <button
                type="button"
                onClick={() => setRejectModalArticle(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#334155' }}>
              ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਇਸ ਖ਼ਬਰ ਨੂੰ ਰੱਦ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? (Are you sure you want to reject this article?)
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
              "{rejectModalArticle.title}"
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              ਰੱਦ ਕਰਨ ਦਾ ਕਾਰਨ (Rejection Reason for Reporter):
            </label>
            <textarea
              rows="3"
              placeholder="ਉਦਾਹਰਣ: ਤੱਥ ਅਧੂਰੇ ਹਨ, ਸਪੈਲਿੰਗ ਠੀਕ ਕਰੋ, ਜਾਂ ਸਰੋਤ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectModalArticle(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                ਵਾਪਸ (Cancel)
              </button>
              <button
                type="button"
                disabled={actionLoading === rejectModalArticle._id}
                onClick={submitRejection}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#ffffff',
                  cursor: actionLoading === rejectModalArticle._id ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-times"></i> ਰੱਦ ਕਰਨ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ (Confirm Reject)
              </button>
            </div>
          </div>
        </div>
      )}

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
