import React, { useState, useEffect } from 'react';
import { podcastAPI, uploadAPI } from '../../services/api';

export default function PodcastManagerView({ currentUser }) {
  const role = currentUser?.role || 'reporter';

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'published'
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [uploadingImg, setUploadingImg] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host: currentUser?.name || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ',
    mediaType: 'youtube', // 'youtube' or 'audio'
    mediaUrl: '',
    thumbnail: '/img/index_800x400-image01.jpg',
    duration: '20:00'
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.url }));
        setMsg({ text: 'ਕਵਰ ਫੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋਈ!', type: 'success' });
      }
    } catch (err) {
      setMsg({ text: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ: ' + err.message, type: 'error' });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mediaUrl.trim() || !formData.description.trim()) {
      setMsg({ text: 'ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਲੇਖ, ਵੇਰਵਾ ਅਤੇ ਮੀਡੀਆ ਲਿੰਕ ਭਰੋ।', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await podcastAPI.create(formData);
      if (res && res.success) {
        setMsg({ text: res.message || 'ਪੋਡਕਾਸਟ ਸਫਲਤਾਪੂਰਵਕ ਜੋੜਿਆ ਗਿਆ!', type: 'success' });
        setShowAddModal(false);
        setFormData({
          title: '',
          description: '',
          host: currentUser?.name || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਟੀਮ',
          mediaType: 'youtube',
          mediaUrl: '',
          thumbnail: '/img/index_800x400-image01.jpg',
          duration: '20:00'
        });
        loadPodcasts();
      }
    } catch (err) {
      setMsg({ text: err.message || 'ਪੋਡਕਾਸਟ ਜੋੜਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ।', type: 'error' });
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
              ? 'ਆਪਣੇ ਪੋਡਕਾਸਟ ਐਪੀਸੋਡ ਜੋੜੋ ਅਤੇ ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਦੀ ਸਥਿਤੀ ਦੇਖੋ।'
              : role === 'editor'
              ? 'ਰਿਪੋਰਟਰਾਂ ਦੇ ਪੋਡਕਾਸਟ ਰਿਵਿਊ ਕਰੋ, ਪ੍ਰਵਾਨਗੀ ਲਈ ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ, ਜਾਂ ਨਵਾਂ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ।'
              : 'ਸਾਰੇ ਪੋਡਕਾਸਟ ਐਪੀਸੋਡ ਪ੍ਰਵਾਨ ਕਰੋ, ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ ਜਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
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
            boxShadow: '0 2px 6px rgba(183,28,28,0.3)'
          }}
        >
          <i className="fa fa-plus-circle"></i>
          <span>ਨਵਾਂ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ (+ Add Podcast)</span>
        </button>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: msg.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: msg.type === 'error' ? '#b91c1c' : '#15803d',
            border: `1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'all' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ਸਾਰੇ ({podcasts.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            background: filter === 'pending' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'pending' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ਸਮੀਖਿਆ ਅਧੀਨ ({podcasts.filter((p) => ['pending_editor', 'pending_admin'].includes(p.status)).length})
        </button>
        <button
          onClick={() => setFilter('published')}
          style={{
            background: filter === 'published' ? '#1c2d5a' : '#f1f5f9',
            color: filter === 'published' ? '#ffffff' : '#475569',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ({podcasts.filter((p) => p.status === 'published').length})
        </button>
      </div>

      {/* Podcasts Table / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
          <p>ਪੋਡਕਾਸਟ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...</p>
        </div>
      ) : filteredPodcasts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
          <i className="fa fa-podcast" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '10px' }}></i>
          <h4 style={{ margin: '0 0 6px', color: '#334155' }}>ਕੋਈ ਪੋਡਕਾਸਟ ਨਹੀਂ ਮਿਲਿਆ</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਨਵਾਂ ਪੋਡਕਾਸਟ ਸ਼ਾਮਲ ਕਰੋ।
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px 12px' }}>ਕਵਰ</th>
                <th style={{ padding: '10px 12px' }}>ਸਿਰਲੇਖ ਅਤੇ ਵੇਰਵਾ</th>
                <th style={{ padding: '10px 12px' }}>ਮੇਜ਼ਬਾਨ</th>
                <th style={{ padding: '10px 12px' }}>ਮੀਡੀਆ</th>
                <th style={{ padding: '10px 12px' }}>ਸਥਿਤੀ</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>ਕਾਰਵਾਈਆਂ (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {filteredPodcasts.map((podcast) => (
                <tr key={podcast._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', width: '70px' }}>
                    <img
                      src={podcast.thumbnail || '/img/index_800x400-image01.jpg'}
                      alt=""
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                      {podcast.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {podcast.description}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', color: '#475569' }}>
                    {podcast.host}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: podcast.mediaType === 'youtube' ? '#ef4444' : '#0284c7' }}>
                      <i className={podcast.mediaType === 'youtube' ? 'fa fa-youtube-play' : 'fa fa-volume-up'}></i>
                      {podcast.mediaType === 'youtube' ? 'YouTube' : 'Audio MP3'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {podcast.duration}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {getStatusBadge(podcast.status)}
                  </td>
                  <td style={{ padding: '10px 12px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {/* Editor Action: Review & Forward */}
                    {role === 'editor' && podcast.status === 'pending_editor' && (
                      <button
                        onClick={() => handleStatusUpdate(podcast._id, 'pending_admin')}
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          marginRight: '6px'
                        }}
                        title="ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜੋ"
                      >
                        <i className="fa fa-share"></i> ਐਡਮਿਨ ਨੂੰ ਭੇਜੋ
                      </button>
                    )}

                    {/* Admin Action: Approve & Publish */}
                    {role === 'admin' && podcast.status !== 'published' && (
                      <button
                        onClick={() => handleStatusUpdate(podcast._id, 'published')}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          marginRight: '6px'
                        }}
                        title="ਪ੍ਰਵਾਨ ਕਰੋ ਤੇ ਲਾਈਵ ਕਰੋ"
                      >
                        <i className="fa fa-check"></i> ਲਾਈਵ ਕਰੋ
                      </button>
                    )}

                    {/* Reject (Editor / Admin) */}
                    {['editor', 'admin'].includes(role) && ['pending_editor', 'pending_admin'].includes(podcast.status) && (
                      <button
                        onClick={() => handleStatusUpdate(podcast._id, 'rejected')}
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          padding: '5px 8px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          marginRight: '6px'
                        }}
                        title="ਰੱਦ ਕਰੋ"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    )}

                    {/* Delete */}
                    {['editor', 'admin'].includes(role) && (
                      <button
                        onClick={() => handleDelete(podcast._id)}
                        style={{
                          backgroundColor: '#f8fafc',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          padding: '5px 8px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                        title="ਡਿਲੀਟ ਕਰੋ"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Podcast Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1c2d5a' }}>
                ਨਵਾਂ ਪੋਡਕਾਸਟ ਐਪੀਸੋਡ ਸ਼ਾਮਲ ਕਰੋ
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਪੋਡਕਾਸਟ ਸਿਰਲੇਖ (Podcast Title) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="ਉਦਾਹਰਣ: ਪੰਜਾਬ ਦੀ ਰਾਜਨੀਤੀ 'ਤੇ ਖ਼ਾਸ ਚਰਚਾ"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13.5px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* Host & Duration Row */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    ਮੇਜ਼ਬਾਨ / ਹੋਸਟ (Host / Speaker)
                  </label>
                  <input
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ width: '130px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    ਸਮਾਂ (Duration)
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="25:40"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Media Type Selection */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਮੀਡੀਆ ਕਿਸਮ (Media Type)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="mediaType"
                      value="youtube"
                      checked={formData.mediaType === 'youtube'}
                      onChange={handleInputChange}
                    />
                    <span>YouTube ਵੀਡੀਓ ਲਿੰਕ</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="mediaType"
                      value="audio"
                      checked={formData.mediaType === 'audio'}
                      onChange={handleInputChange}
                    />
                    <span>ਆਡੀਓ ਲਿੰਕ (MP3 / Audio URL)</span>
                  </label>
                </div>
              </div>

              {/* Media URL */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  {formData.mediaType === 'youtube' ? 'YouTube ਲਿੰਕ (URL) *' : 'ਆਡੀਓ MP3 ਲਿੰਕ (Audio URL) *'}
                </label>
                <input
                  type="url"
                  name="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={handleInputChange}
                  placeholder={formData.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/audio.mp3'}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* Thumbnail Image */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਕਵਰ ਫੋਟੋ (Thumbnail Poster)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImg}
                    style={{ fontSize: '12px' }}
                  />
                  {uploadingImg && <span style={{ fontSize: '12px', color: '#0284c7' }}><i className="fa fa-spinner fa-spin"></i> ਅੱਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...</span>}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਵੇਰਵਾ (Description / Summary) *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="ਇਸ ਪੋਡਕਾਸਟ ਐਪੀਸੋਡ ਬਾਰੇ ਸੰਖੇਪ ਜਾਣਕਾਰੀ..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '5px', fontSize: '13px', cursor: 'pointer' }}
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
                    borderRadius: '5px',
                    padding: '8px 20px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {submitting ? (
                    <span><i className="fa fa-spinner fa-spin"></i> ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...</span>
                  ) : role === 'admin' ? (
                    'ਸਿੱਧਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ (Publish Directly)'
                  ) : role === 'editor' ? (
                    'ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਲਈ ਭੇਜੋ (Submit for Admin)'
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
