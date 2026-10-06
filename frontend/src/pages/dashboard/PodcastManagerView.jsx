import React, { useState, useEffect } from 'react';
import { podcastAPI } from '../../services/api';

// Helper to extract YouTube Video ID
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function PodcastManagerView({ currentUser }) {
  const role = currentUser?.role || 'reporter';

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'published'
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Streamlined Form State: ONLY YouTube Link, Title, Description
  const [formData, setFormData] = useState({
    mediaUrl: '',
    title: '',
    description: ''
  });

  const loadPodcasts = async () => {
    setLoading(true);
    try {
      const res = await podcastAPI.getStaffAll();
      if (res && res.data) {
        setPodcasts(res.data);
      }
    } catch (err) {
      console.error('Error fetching podcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      mediaUrl: '',
      title: '',
      description: ''
    });
    setMsg({ text: '', type: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (podcast) => {
    setEditingId(podcast._id);
    setFormData({
      mediaUrl: podcast.mediaUrl || '',
      title: podcast.title || '',
      description: podcast.description || ''
    });
    setMsg({ text: '', type: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mediaUrl.trim() || !formData.title.trim() || !formData.description.trim()) {
      setMsg({ text: 'ਕਿਰਪਾ ਕਰਕੇ ਯੂਟਿਊਬ ਲਿੰਕ, ਸਿਰਲੇਖ ਅਤੇ ਵੇਰਵਾ ਦਰਜ ਕਰੋ।', type: 'error' });
      return;
    }

    const ytId = extractYouTubeId(formData.mediaUrl);
    const autoThumbnail = ytId
      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      : '/img/index_800x400-image01.jpg';

    const payload = {
      mediaUrl: formData.mediaUrl.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      mediaType: 'youtube',
      thumbnail: autoThumbnail,
      host: currentUser?.name || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ',
      duration: '20:00'
    };

    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      let res;
      if (editingId) {
        res = await podcastAPI.update(editingId, payload);
      } else {
        res = await podcastAPI.create(payload);
      }

      if (res && res.success) {
        setMsg({ text: res.message || 'ਪੋਡਕਾਸਟ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਿਆ ਹੈ!', type: 'success' });
        setShowModal(false);
        setFormData({ mediaUrl: '', title: '', description: '' });
        setEditingId(null);
        loadPodcasts();
      }
    } catch (err) {
      setMsg({ text: err.message || 'ਪੋਡਕਾਸਟ ਸੇਵ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ।', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await podcastAPI.updateStatus(id, newStatus);
      if (res && res.success) {
        setMsg({ text: `ਪੋਡਕਾਸਟ ਸਥਿਤੀ ਅੱਪਡੇਟ ਹੋ ਗਈ: ${newStatus}`, type: 'success' });
        loadPodcasts();
      }
    } catch (err) {
      setMsg({ text: err.message || 'ਸਥਿਤੀ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ ਆਈ', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਇਹ ਪੋਡਕਾਸਟ ਡਿਲੀਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?')) return;
    try {
      const res = await podcastAPI.delete(id);
      if (res && res.success) {
        setMsg({ text: 'ਪੋਡਕਾਸਟ ਡਿਲੀਟ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।', type: 'success' });
        loadPodcasts();
      }
    } catch (err) {
      setMsg({ text: err.message || 'ਡਿਲੀਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ', type: 'error' });
    }
  };

  const filteredPodcasts = podcasts.filter((p) => {
    if (filter === 'pending') {
      return ['pending_editor', 'pending_admin'].includes(p.status);
    }
    if (filter === 'published') {
      return p.status === 'published';
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>● ਪ੍ਰਕਾਸ਼ਿਤ (Live)</span>;
      case 'pending_admin':
        return <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>⏳ ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਅਧੀਨ</span>;
      case 'pending_editor':
        return <span style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>⏳ ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਅਧੀਨ</span>;
      case 'rejected':
        return <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>✕ ਰੱਦ (Rejected)</span>;
      default:
        return <span style={{ backgroundColor: '#94a3b8', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>ਡਰਾਫਟ</span>;
    }
  };

  const modalYouTubeId = extractYouTubeId(formData.mediaUrl);

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1c2d5a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-podcast" style={{ color: '#b71c1c' }}></i>
            <span>ਪੋਡਕਾਸਟ ਪ੍ਰਬੰਧਨ ਡੈਸਕ (Podcasts Desk)</span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            {role === 'reporter'
              ? 'ਆਪਣੇ ਵੀਡੀਓ ਪੋਡਕਾਸਟ ਦਾ ਯੂਟਿਊਬ ਲਿੰਕ, ਸਿਰਲੇਖ ਅਤੇ ਵੇਰਵਾ ਦਰਜ ਕਰੋ।'
              : role === 'editor'
              ? 'ਪੋਡਕਾਸਟ ਰਿਵਿਊ ਕਰੋ, ਪ੍ਰਵਾਨਗੀ ਲਈ ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ, ਜਾਂ ਨਵਾਂ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ।'
              : 'ਸਾਰੇ ਪੋਡਕਾਸਟ ਐਪੀਸੋਡ ਪ੍ਰਵਾਨ ਕਰੋ, ਸਿੱਧੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ ਜਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          style={{
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: '700',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(183, 28, 28, 0.25)'
          }}
        >
          <i className="fa fa-plus-circle"></i>
          <span>ਨਵਾਂ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ (+ Add Podcast)</span>
        </button>
      </div>

      {/* Notifications */}
      {msg.text && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '18px',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: msg.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: msg.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${msg.type === 'error' ? '#fca5a5' : '#86efac'}`
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '12.5px',
            backgroundColor: filter === 'all' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'all' ? '#fff' : '#475569'
          }}
        >
          ਸਾਰੇ ({podcasts.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '6px 14px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '12.5px',
            backgroundColor: filter === 'pending' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'pending' ? '#fff' : '#475569'
          }}
        >
          ਸਮੀਖਿਆ ਅਧੀਨ ({podcasts.filter((p) => ['pending_editor', 'pending_admin'].includes(p.status)).length})
        </button>
        <button
          onClick={() => setFilter('published')}
          style={{
            padding: '6px 14px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '12.5px',
            backgroundColor: filter === 'published' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'published' ? '#fff' : '#475569'
          }}
        >
          ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ({podcasts.filter((p) => p.status === 'published').length})
        </button>
      </div>

      {/* Podcasts Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
        </div>
      ) : filteredPodcasts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <i className="fa fa-podcast" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '10px' }}></i>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>ਕੋਈ ਪੋਡਕਾਸਟ ਨਹੀਂ ਮਿਲਿਆ।</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', fontWeight: '800' }}>
                <th style={{ padding: '10px 14px', width: '100px' }}>ਥੰਬਨੇਲ</th>
                <th style={{ padding: '10px 14px' }}>ਸਿਰਲੇਖ & ਵੇਰਵਾ</th>
                <th style={{ padding: '10px 14px', width: '150px' }}>ਲੇਖਕ / ਹੋਸਟ</th>
                <th style={{ padding: '10px 14px', width: '130px' }}>ਸਥਿਤੀ</th>
                <th style={{ padding: '10px 14px', width: '180px', textAlign: 'right' }}>ਕਾਰਵਾਈ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPodcasts.map((podcast) => {
                const ytId = extractYouTubeId(podcast.mediaUrl);
                const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (podcast.thumbnail || '/img/index_800x400-image01.jpg');

                return (
                  <tr key={podcast._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Thumbnail */}
                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <a href={podcast.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ position: 'relative', display: 'block', width: '70px', height: '42px', borderRadius: '4px', overflow: 'hidden' }}>
                        <img
                          src={thumb}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                        />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                          <i className="fa fa-play-circle"></i>
                        </span>
                      </a>
                    </td>

                    {/* Title & Description */}
                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '13.5px', marginBottom: '3px' }}>
                        {podcast.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {podcast.description}
                      </div>
                      <a
                        href={podcast.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                      >
                        <i className="fa fa-youtube-play" style={{ color: '#ef4444' }}></i>
                        <span>{podcast.mediaUrl}</span>
                      </a>
                    </td>

                    {/* Author / Host */}
                    <td style={{ padding: '12px 14px', verticalAlign: 'top', fontSize: '12.5px' }}>
                      <div style={{ fontWeight: '700', color: '#334155' }}>{podcast.authorName || 'ਸਟਾਫ਼'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>ਹੋਸਟ: {podcast.host || 'ਟੀਮ'}</div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      {getStatusBadge(podcast.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {/* Editor action */}
                        {role === 'editor' && podcast.status === 'pending_editor' && (
                          <button
                            onClick={() => handleStatusUpdate(podcast._id, 'pending_admin')}
                            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}
                            title="ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜੋ"
                          >
                            ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ
                          </button>
                        )}

                        {/* Admin action */}
                        {role === 'admin' && podcast.status !== 'published' && (
                          <button
                            onClick={() => handleStatusUpdate(podcast._id, 'published')}
                            style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}
                            title="ਸਿੱਧਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ"
                          >
                            ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(podcast)}
                          style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '11.5px', color: '#334155', cursor: 'pointer' }}
                          title="ਸੋਧੋ (Edit)"
                        >
                          <i className="fa fa-pencil"></i>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(podcast._id)}
                          style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', padding: '4px 8px', fontSize: '11.5px', color: '#b91c1c', cursor: 'pointer' }}
                          title="ਡਿਲੀਟ ਕਰੋ"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* STREAMLINED UPLOAD / EDIT MODAL (YouTube URL + Title + Description ONLY) */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa fa-youtube-play" style={{ color: '#ef4444' }}></i>
                <span>{editingId ? 'ਪੋਡਕਾਸਟ ਸੋਧੋ (Edit Video Podcast)' : 'ਨਵਾਂ ਵੀਡੀਓ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ (Upload Video Podcast)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer', padding: 0 }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 1. YouTube URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਯੂਟਿਊਬ ਵੀਡੀਓ ਲਿੰਕ (YouTube Video URL) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=... ਜਾਂ https://youtu.be/..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  ਕਿਸੇ ਵੀ ਯੂਟਿਊਬ ਵੀਡੀਓ ਜਾਂ ਪੋਡਕਾਸਟ ਦਾ ਲਿੰਕ ਇੱਥੇ ਪੇਸਟ ਕਰੋ। ਥੰਬਨੇਲ ਆਟੋਮੈਟਿਕ ਬਣ ਜਾਵੇਗਾ।
                </span>

                {/* Instant Live Video Preview if valid YouTube ID */}
                {modalYouTubeId && (
                  <div style={{ marginTop: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1c2d5a', backgroundColor: '#000' }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${modalYouTubeId}?rel=0`}
                        title="Preview"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਸਿਰਲੇਖ (Podcast Title) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="ਜਿਵੇਂ: ਪੰਜਾਬ ਦੇ ਤਾਜ਼ਾ ਮੁੱਦਿਆਂ 'ਤੇ ਵਿਸ਼ੇਸ਼ ਚਰਚਾ"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* 3. Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਵੇਰਵਾ (Podcast Description) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="ਇਸ ਪੋਡਕਾਸਟ ਬਾਰੇ ਸੰਖੇਪ ਵੇਰਵਾ ਜਾਂ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '9px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '700', color: '#475569' }}
                >
                  ਰੱਦ ਕਰੋ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: role === 'admin' ? '#10b981' : '#b71c1c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 22px',
                    fontWeight: '800',
                    fontSize: '13.5px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {submitting ? (
                    <span><i className="fa fa-spinner fa-spin"></i> ਸੇਵ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...</span>
                  ) : editingId ? (
                    'ਅੱਪਡੇਟ ਕਰੋ (Update Podcast)'
                  ) : role === 'admin' ? (
                    'ਸਿੱਧਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ (Publish Directly)'
                  ) : role === 'editor' ? (
                    'ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜੋ (Submit for Admin)'
                  ) : (
                    'ਸਮੀਖਿਆ ਲਈ ਭੇਜੋ (Submit for Editor)'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
