import React, { useState, useEffect } from 'react';
import { mukhwakAPI, uploadAPI } from '../../../services/api';

const DEFAULT_IMAGE_PRESETS = [
  { label: 'ਦਰਬਾਰ ਸਾਹਿਬ ਅੰਮ੍ਰਿਤ ਵੇਲਾ (Default)', url: '/img/darbar-sahib-mukhwak.jpg' }
];

export default function MukhwakManagerView({ currentUser }) {
  const [mukhwaks, setMukhwaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMukhwak, setActiveMukhwak] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null means adding new

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    location: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
    raag: '',
    ang: '',
    gurbani: '',
    viakhya: '',
    englishTranslation: '',
    image: '/img/darbar-sahib-mukhwak.jpg',
    sgpcLink: 'https://sgpc.net/hukamnama/',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [listRes, activeRes] = await Promise.all([
        mukhwakAPI.getAll().catch(() => []),
        mukhwakAPI.getActive().catch(() => null)
      ]);

      setMukhwaks(Array.isArray(listRes) ? listRes : []);
      setActiveMukhwak(activeRes);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'ਮੁੱਖ ਵਾਕ ਲੋਡ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ।'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format today's date in Punjabi if blank
  const getTodayPunjabiDate = () => {
    const months = [
      'ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ',
      'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'
    ];
    const now = new Date();
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      date: getTodayPunjabiDate(),
      location: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
      raag: 'ਰਾਗੁ ਸੋਰਠਿ ਮਹਲਾ ੫',
      ang: '',
      gurbani: '',
      viakhya: '',
      englishTranslation: '',
      image: '/img/darbar-sahib-mukhwak.jpg',
      sgpcLink: 'https://sgpc.net/hukamnama/',
      isActive: true
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      date: item.date || '',
      location: item.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
      raag: item.raag || '',
      ang: item.ang || '',
      gurbani: item.gurbani || '',
      viakhya: item.viakhya || '',
      englishTranslation: item.englishTranslation || '',
      image: item.image || '/img/darbar-sahib-mukhwak.jpg',
      sgpcLink: item.sgpcLink || 'https://sgpc.net/hukamnama/',
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setModalOpen(true);
  };

  // Handle Image Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadAPI.uploadImage(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        setNotification({ type: 'success', message: 'ਫ਼ੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋ ਗਈ!' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ।' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date.trim() || !formData.raag.trim() || !formData.ang.trim() || !formData.gurbani.trim() || !formData.viakhya.trim()) {
      setNotification({
        type: 'error',
        message: 'ਕਿਰਪਾ ਕਰਕੇ ਮਿਤੀ, ਰਾਗ, ਅੰਗ, ਗੁਰਬਾਣੀ ਤੁਕਾਂ ਅਤੇ ਵਿਆਖਿਆ ਲਾਜ਼ਮੀ ਭਰੋ।'
      });
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem && editingItem._id && editingItem._id !== 'default_mukhwak') {
        // Update existing
        await mukhwakAPI.update(editingItem._id, formData);
        setNotification({
          type: 'success',
          message: 'ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ!'
        });
      } else {
        // Create new
        await mukhwakAPI.create(formData);
        setNotification({
          type: 'success',
          message: 'ਨਵਾਂ ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ!'
        });
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'ਮੁੱਖ ਵਾਕ ਸੇਵ ਕਰਨ ਵਿੱਚ ਦਿੱਕਤ ਆਈ।'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Set as Active Live
  const handleSetActive = async (id) => {
    try {
      setLoading(true);
      await mukhwakAPI.setActive(id);
      setNotification({
        type: 'success',
        message: 'ਚੁਣਿਆ ਗਿਆ ਮੁੱਖ ਵਾਕ ਹੁਣ ਹੋਮਪੇਜ ਉੱਤੇ ਲਾਈਵ ਹੋ ਗਿਆ ਹੈ!'
      });
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'ਲਾਈਵ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ।'
      });
      setLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await mukhwakAPI.delete(itemToDelete._id);
      setNotification({
        type: 'success',
        message: 'ਮੁੱਖ ਵਾਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ!'
      });
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'ਹਟਾਉਣ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ।'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>ੴ</span>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਮੁੱਖ ਵਾਕ ਪ੍ਰਬੰਧਨ (Daily Hukamnama Management)
            </h2>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਹੋਮਪੇਜ 'ਤੇ ਸੁਸ਼ੋਭਿਤ ਰੋਜ਼ਾਨਾ ਪਵਿੱਤਰ ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ, ਰਾਗ, ਅੰਗ ਅਤੇ ਵਿਆਖਿਆ ਨੂੰ ਇੱਥੋਂ ਅੱਪਡੇਟ, ਨਵਾਂ ਸ਼ਾਮਲ ਜਾਂ ਹਟਾਓ।
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '9px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> ਤਾਜ਼ਾ ਕਰੋ
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#b71c1c',
              border: 'none',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(183, 28, 28, 0.3)'
            }}
          >
            <i className="fa fa-plus"></i> ਨਵਾਂ ਮੁੱਖ ਵਾਕ ਦਰਜ ਕਰੋ (Add New)
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${notification.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: notification.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className={`fa ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. CURRENT LIVE MUKHWAK PREVIEW CARD */}
      {activeMukhwak && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '2px solid #ebb10d',
            marginBottom: '28px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(235, 177, 13, 0.12)'
          }}
        >
          {/* Card Top Banner */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              borderBottom: '1px solid #fde68a',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: '#047857',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#86efac', display: 'inline-block' }}></span>
                ਹੋਮਪੇਜ 'ਤੇ ਲਾਈਵ (Active Live on Homepage)
              </span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#92400e' }}>
                {activeMukhwak.date}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEdit(activeMukhwak)}
              style={{
                backgroundColor: '#1c2d5a',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa fa-pencil"></i> ਇਸ ਲਾਈਵ ਮੁੱਖ ਵਾਕ ਨੂੰ ਸੋਧੋ (Edit Live)
            </button>
          </div>

          {/* Card Body Preview */}
          <div style={{ padding: '20px 24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '180px', flexShrink: 0 }}>
              <img
                src={activeMukhwak.image || '/img/darbar-sahib-mukhwak.jpg'}
                alt="Darbar Sahib"
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1'
                }}
              />
              <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                {activeMukhwak.location || 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ'}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#b71c1c' }}>
                  {activeMukhwak.raag}
                </span>
                <span
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#0f172a'
                  }}
                >
                  ਅੰਗ: {activeMukhwak.ang}
                </span>
              </div>

              {/* Gurbani text preview */}
              <div
                style={{
                  backgroundColor: '#fefce8',
                  borderLeft: '4px solid #ebb10d',
                  padding: '12px 16px',
                  borderRadius: '0 6px 6px 0',
                  fontSize: '14.5px',
                  fontWeight: '700',
                  lineHeight: '1.8',
                  color: '#0f172a',
                  whiteSpace: 'pre-line',
                  marginBottom: '10px'
                }}
              >
                {activeMukhwak.gurbani}
              </div>

              {/* Viakhya preview */}
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                <strong style={{ color: '#0f172a' }}>ਅਰਥ / ਵਿਆਖਿਆ: </strong>
                {activeMukhwak.viakhya}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MUKHWAK HISTORY & ALL RECORDS TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
            ਮੁੱਖ ਵਾਕ ਰਿਕਾਰਡ ਸੂਚੀ (All Mukhwak Records) ({mukhwaks.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            ਕਿਸੇ ਵੀ ਪੁਰਾਣੇ ਮੁੱਖ ਵਾਕ ਨੂੰ ਦੁਬਾਰਾ ਲਾਈਵ ਜਾਂ ਸੋਧਿਆ ਜਾ ਸਕਦਾ ਹੈ।
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
            <div>ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...</div>
          </div>
        ) : mukhwaks.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa fa-book" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px' }}></i>
            <h4 style={{ margin: '0 0 6px', color: '#334155' }}>ਕੋਈ ਮੁੱਖ ਵਾਕ ਦਰਜ ਨਹੀਂ ਹੈ</h4>
            <p style={{ margin: '0 0 16px', fontSize: '13px' }}>
              ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਨਵਾਂ ਮੁੱਖ ਵਾਕ ਸ਼ਾਮਲ ਕਰੋ।
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + ਨਵਾਂ ਮੁੱਖ ਵਾਕ ਸ਼ਾਮਲ ਕਰੋ
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-table-view" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: '700', fontSize: '12px' }}>
                    <th style={{ padding: '12px 16px' }}>ਸਟੇਟਸ (Status)</th>
                    <th style={{ padding: '12px 16px' }}>ਮਿਤੀ (Date)</th>
                    <th style={{ padding: '12px 16px' }}>ਰਾਗ ਤੇ ਅੰਗ (Raag & Ang)</th>
                    <th style={{ padding: '12px 16px' }}>ਗੁਰਬਾਣੀ ਤੁਕਾਂ (Excerpt)</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ਕਾਰਵਾਈਆਂ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {mukhwaks.map((item) => {
                    const isCurrentActive = Boolean(item.isActive);
                    return (
                      <tr
                        key={item._id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: isCurrentActive ? '#fffdf5' : '#ffffff'
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          {isCurrentActive ? (
                            <span
                              style={{
                                backgroundColor: '#dcfce7',
                                color: '#15803d',
                                border: '1px solid #86efac',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '800',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              ● ਲਾਈਵ (Active)
                            </span>
                          ) : (
                            <span
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#64748b',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '700'
                              }}
                            >
                              ਪੁਰਾਲੇਖ (Archived)
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {item.date}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: '700', color: '#b71c1c' }}>{item.raag}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>ਅੰਗ: {item.ang}</div>
                        </td>

                        <td style={{ padding: '14px 16px', maxWidth: '350px' }}>
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#1e293b',
                              fontWeight: '600'
                            }}
                          >
                            {item.gurbani?.split('\n')[0] || ''}
                          </div>
                          <div
                            style={{
                              fontSize: '11.5px',
                              color: '#64748b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.viakhya}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            {!isCurrentActive && (
                              <button
                                type="button"
                                onClick={() => handleSetActive(item._id)}
                                title="ਇਸ ਮੁੱਖ ਵਾਕ ਨੂੰ ਹੋਮਪੇਜ ਉੱਤੇ ਲਾਈਵ ਕਰੋ"
                                style={{
                                  backgroundColor: '#047857',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  fontSize: '11.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa fa-check"></i> ਲਾਈਵ ਕਰੋ
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="ਸੋਧੋ (Edit)"
                              style={{
                                backgroundColor: '#1c2d5a',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              <i className="fa fa-pencil"></i> ਸੋਧੋ
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(item);
                                setDeleteModalOpen(true);
                              }}
                              title="ਹਟਾਓ (Delete)"
                              style={{
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
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

            {/* Mobile Mukhwak Card List */}
            <div className="mobile-mukhwak-card-list">
              {mukhwaks.map((item) => {
                const isCurrentActive = Boolean(item.isActive);
                return (
                  <div
                    key={item._id}
                    style={{
                      backgroundColor: isCurrentActive ? '#fffdf5' : '#ffffff',
                      border: isCurrentActive ? '1px solid #fde68a' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCurrentActive ? (
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                            ● ਲਾਈਵ (Active)
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                            ਪੁਰਾਲੇਖ
                          </span>
                        )}
                        <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '13px' }}>{item.date}</span>
                      </div>

                      <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#b71c1c' }}>
                        {item.raag} (ਅੰਗ: {item.ang})
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#fefce8', borderLeft: '3px solid #ebb10d', padding: '8px 10px', borderRadius: '0 4px 4px 0', fontSize: '13px', fontWeight: '700', color: '#0f172a', lineHeight: '1.5' }}>
                      {item.gurbani?.split('\n')[0] || ''}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '8px', gap: '6px' }}>
                      {!isCurrentActive && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(item._id)}
                          style={{
                            backgroundColor: '#047857',
                            color: '#ffffff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa fa-check"></i> ਲਾਈਵ ਕਰੋ
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        style={{
                          backgroundColor: '#1c2d5a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa fa-pencil"></i> ਸੋਧੋ
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setItemToDelete(item);
                          setDeleteModalOpen(true);
                        }}
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #fca5a5',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa fa-trash"></i> ਹਟਾਓ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 3. ADD / EDIT MUKHWAK MODAL */}
      {modalOpen && (
        <div
          className="cms-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 12px'
          }}
        >
          <div
            className="cms-modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>ੴ</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {editingItem ? 'ਮੁੱਖ ਵਾਕ ਸੋਧੋ (Edit Mukhwak)' : 'ਨਵਾਂ ਮੁੱਖ ਵਾਕ ਸ਼ਾਮਲ ਕਰੋ (Add Daily Mukhwak)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                {/* Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਮਿਤੀ (Date in Punjabi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="ਜਿਵੇਂ: 20 ਸਤੰਬਰ 2026"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Raag */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਰਾਗ (Raag Information) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.raag}
                    onChange={(e) => setFormData({ ...formData, raag: e.target.value })}
                    placeholder="ਜਿਵੇਂ: ਰਾਗੁ ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Ang */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    ਅੰਗ (Ang / Page Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ang}
                    onChange={(e) => setFormData({ ...formData, ang: e.target.value })}
                    placeholder="ਜਿਵੇਂ: ੬੫੪ ਜਾਂ 654"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Gurbani Sacred Lines */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਪਵਿੱਤਰ ਗੁਰਬਾਣੀ ਤੁਕਾਂ (Sacred Gurbani Lines) *
                  <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b', marginLeft: '6px' }}>
                    (ਹਰ ਤੁਕ ਨਵੀਂ ਲਾਈਨ 'ਤੇ ਲਿਖੋ)
                  </span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.gurbani}
                  onChange={(e) => setFormData({ ...formData, gurbani: e.target.value })}
                  placeholder="ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥&#10;ਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '2px solid #ebb10d',
                    backgroundColor: '#fffdf5',
                    fontSize: '15px',
                    fontWeight: '700',
                    lineHeight: '1.7',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Punjabi Viakhya */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਪੰਜਾਬੀ ਵਿਆਖਿਆ / ਅਰਥ (Punjabi Meaning / Viakhya) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.viakhya}
                  onChange={(e) => setFormData({ ...formData, viakhya: e.target.value })}
                  placeholder="ਹੇ ਭਾਈ! ਜਿਸ ਮਨੁੱਖ ਨੂੰ ਵੱਡੇ ਭਾਗਾਂ ਨਾਲ ਪੂਰਾ ਗੁਰੂ ਮਿਲ ਪੈਂਦਾ ਹੈ, ਉਸ ਦੇ ਮਨ ਵਿੱਚ ਆਤਮਕ ਜੀਵਨ ਦਾ ਚਾਨਣ ਹੋ ਜਾਂਦਾ ਹੈ..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* English Translation (Optional) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਅੰਗਰੇਜ਼ੀ ਅਨੁਵਾਦ (English Translation / Summary - Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.englishTranslation}
                  onChange={(e) => setFormData({ ...formData, englishTranslation: e.target.value })}
                  placeholder="By great good fortune, I have met the Perfect Guru, and my mind has been enlightened..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Image Selection & Presets */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  ਦਰਬਾਰ ਸਾਹਿਬ ਫ਼ੋਟੋ (Featured Image)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/img/darbar-sahib-mukhwak.jpg"
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                  <label
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      color: '#334155',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className={`fa ${uploadingImage ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                    {uploadingImage ? 'ਅਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...' : 'ਨਵੀਂ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Presets */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DEFAULT_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: formData.image === p.url ? '2px solid #b71c1c' : '1px solid #cbd5e1',
                        backgroundColor: formData.image === p.url ? '#fef2f2' : '#ffffff',
                        fontSize: '11.5px',
                        color: formData.image === p.url ? '#b71c1c' : '#475569',
                        cursor: 'pointer',
                        fontWeight: formData.image === p.url ? '700' : '500'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Toggle Checkbox */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #86efac',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveToggle" style={{ fontSize: '13.5px', fontWeight: '700', color: '#166534', cursor: 'pointer' }}>
                  ਇਸ ਮੁੱਖ ਵਾਕ ਨੂੰ ਤੁਰੰਤ ਹੋਮਪੇਜ ਉੱਤੇ ਲਾਈਵ (Live) ਕਰੋ
                </label>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ਰੱਦ ਕਰੋ (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#b71c1c',
                    border: 'none',
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {submitting ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i> ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check"></i> {editingItem ? 'ਅੱਪਡੇਟ ਕਰੋ (Save Changes)' : 'ਦਰਜ ਕਰੋ (Submit)'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && itemToDelete && (
        <div
          className="cms-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 12px'
          }}
        >
          <div
            className="cms-modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '450px',
              width: '100%',
              padding: '20px 16px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '12px'
                }}
              >
                <i className="fa fa-trash"></i>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                ਮੁੱਖ ਵਾਕ ਹਟਾਉਣ ਦੀ ਪੁਸ਼ਟੀ (Confirm Delete)
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                ਕੀ ਤੁਸੀਂ ਵਾਕਈ <strong>{itemToDelete.date}</strong> ({itemToDelete.raag}) ਦਾ ਮੁੱਖ ਵਾਕ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਲਈ ਜਾ ਸਕਦੀ।
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                disabled={deleting}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਰੱਦ ਕਰੋ (Cancel)
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                style={{
                  backgroundColor: '#dc2626',
                  border: 'none',
                  color: '#ffffff',
                  padding: '9px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {deleting ? 'ਹਟਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...' : 'ਹਾਂ, ਹਟਾਓ (Confirm)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
