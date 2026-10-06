import React, { useState, useEffect, useMemo, useRef } from 'react';
import { adAPI, uploadAPI } from '../../services/api';

export const AD_SLOTS = [
  {
    id: 'home_middle_banner',
    label: 'ਹੋਮਪੇਜ ਵਿਚਕਾਰਲੀ ਪੱਟੀ (Home Middle Banner)',
    recommendedSize: '970x90 / 820x100 px',
    description: 'ਹੋਮਪੇਜ ਉੱਤੇ ਖ਼ਬਰਾਂ ਦੇ ਸੈਕਸ਼ਨਾਂ ਦੇ ਵਿਚਕਾਰ',
    icon: 'fa-arrows-h',
    color: '#1c2d5a'
  },
  {
    id: 'sidebar_rectangle',
    label: 'ਸਾਈਡਬਾਰ ਬਾਕਸ (Sidebar Rectangle)',
    recommendedSize: '300x250 px',
    description: 'ਖ਼ਬਰਾਂ ਦੇ ਸੱਜੇ ਪਾਸੇ (ਮੀਡੀਅਮ ਬਾਕਸ)',
    icon: 'fa-square-o',
    color: '#0284c7'
  },
  {
    id: 'sidebar_halfpage',
    label: 'ਸਾਈਡਬਾਰ ਲੰਬਾ ਬੈਨਰ (Sidebar Half-Page)',
    recommendedSize: '300x600 px',
    description: 'ਸੱਜੇ ਪਾਸੇ ਲੰਬਾ ਹਾਈ-ਵਿਜ਼ੀਬਿਲਟੀ ਬੈਨਰ',
    icon: 'fa-columns',
    color: '#7c3aed'
  },
  {
    id: 'article_top_banner',
    label: 'ਖ਼ਬਰ ਦੇ ਉੱਪਰ (Article Top Banner)',
    recommendedSize: '728x90 px',
    description: "ਖ਼ਬਰ ਡਿਟੇਲ ਪੇਜ 'ਤੇ ਸਿਰਲੇਖ ਤੋਂ ਉੱਪਰ",
    icon: 'fa-newspaper-o',
    color: '#d97706'
  },
  {
    id: 'article_bottom_banner',
    label: 'ਖ਼ਬਰ ਦੇ ਹੇਠਾਂ (Article Bottom Banner)',
    recommendedSize: '728x90 px',
    description: 'ਖ਼ਬਰ ਦੇ ਅੰਤ ਵਿੱਚ (Article End)',
    icon: 'fa-file-text-o',
    color: '#059669'
  },
  {
    id: 'podcasts_banner',
    label: 'ਪੋਡਕਾਸਟ ਪੇਜ ਬੈਨਰ (Podcasts Banner)',
    recommendedSize: '970x90 px',
    description: "ਪੋਡਕਾਸਟ ਪੇਜ 'ਤੇ ਸਪੌਟਲਾਈਟ ਦੇ ਹੇਠਾਂ",
    icon: 'fa-podcast',
    color: '#e11d48'
  }
];

export default function AdManagerView({ currentUser }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters
  const [slotFilter, setSlotFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlot, setFormSlot] = useState('home_middle_banner');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTargetUrl, setFormTargetUrl] = useState('');
  const [formSizeLabel, setFormSizeLabel] = useState('970x90');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  const fileInputRef = useRef(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await adAPI.getAll();
      if (res?.data) {
        setAds(res.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'ਇਸ਼ਤਿਹਾਰ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ: ' + (err.message || 'ਤਰੁੱਟੀ')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const triggerUpdateEvent = () => {
    window.dispatchEvent(new Event('punjab_ads_updated'));
  };

  // Image File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਫ਼ ਫੋਟੋ (Image) ਫਾਈਲ ਚੁਣੋ।' });
      return;
    }

    try {
      setUploadingImage(true);
      setFeedback({ type: '', message: '' });
      const res = await uploadAPI.uploadImage(file);
      if (res?.url) {
        setFormImageUrl(res.url);
        setFeedback({ type: 'success', message: 'ਫੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋ ਗਈ!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਫੋਟੋ ਅੱਪਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ: ' + (err.message || '') });
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Form for New Ad
  const handleOpenNew = () => {
    setEditingAdId(null);
    setFormTitle('');
    setFormSlot('home_middle_banner');
    setFormImageUrl('');
    setFormTargetUrl('');
    setFormSizeLabel('970x90');
    setFormStartDate('');
    setFormEndDate('');
    setFormIsActive(true);
    setFormOpenInNewTab(true);
    setFormNotes('');
    setIsFormOpen(true);

    setTimeout(() => {
      document.getElementById('ad-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Edit Existing Ad
  const handleEdit = (item) => {
    setEditingAdId(item._id);
    setFormTitle(item.title || '');
    setFormSlot(item.slot || 'home_middle_banner');
    setFormImageUrl(item.imageUrl || '');
    setFormTargetUrl(item.targetUrl || '');
    setFormSizeLabel(item.sizeLabel || 'Responsive');
    setFormStartDate(item.startDate || '');
    setFormEndDate(item.endDate || '');
    setFormIsActive(item.isActive !== false);
    setFormOpenInNewTab(item.openInNewTab !== false);
    setFormNotes(item.notes || '');
    setIsFormOpen(true);

    setTimeout(() => {
      document.getElementById('ad-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Save Ad Form
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      setFeedback({ type: 'error', message: 'ਸਿਰਲੇਖ / ਸਪਾਂਸਰ ਨਾਮ ਦਰਜ ਕਰੋ।' });
      return;
    }

    if (!formImageUrl.trim()) {
      setFeedback({ type: 'error', message: 'ਬੈਨਰ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਫੋਟੋ ਲਿੰਕ ਦਰਜ ਕਰੋ।' });
      return;
    }

    try {
      setSaving(true);
      setFeedback({ type: '', message: '' });

      const payload = {
        title: formTitle.trim(),
        slot: formSlot,
        imageUrl: formImageUrl.trim(),
        targetUrl: formTargetUrl.trim(),
        sizeLabel: formSizeLabel.trim() || 'Responsive',
        startDate: formStartDate || null,
        endDate: formEndDate || null,
        isActive: formIsActive,
        openInNewTab: formOpenInNewTab,
        notes: formNotes.trim()
      };

      let res;
      if (editingAdId) {
        res = await adAPI.update(editingAdId, payload);
      } else {
        res = await adAPI.create(payload);
      }

      setFeedback({
        type: 'success',
        message: res.message || 'ਇਸ਼ਤਿਹਾਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਿਆ ਹੈ!'
      });

      setIsFormOpen(false);
      setEditingAdId(null);
      await fetchAds();
      triggerUpdateEvent();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'ਸੇਵ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ: ' + (err.message || '')
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete Ad
  const handleDelete = async (id, title) => {
    if (!window.confirm(`ਕੀ ਤੁਸੀਂ ਵਾਕਈ "${title}" ਇਸ਼ਤਿਹਾਰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?`)) return;

    try {
      setFeedback({ type: '', message: '' });
      const res = await adAPI.delete(id);
      setFeedback({ type: 'success', message: res.message || 'ਇਸ਼ਤਿਹਾਰ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।' });
      if (editingAdId === id) setIsFormOpen(false);
      await fetchAds();
      triggerUpdateEvent();
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਹਟਾਉਣ ਵਿੱਚ ਤਰੁੱਟੀ: ' + (err.message || '') });
    }
  };

  // Toggle Active
  const handleToggle = async (id) => {
    try {
      const res = await adAPI.toggle(id);
      setFeedback({ type: 'success', message: res.message || 'ਸਟੇਟਸ ਬਦਲ ਦਿੱਤਾ ਗਿਆ ਹੈ।' });
      await fetchAds();
      triggerUpdateEvent();
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਸਟੇਟਸ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ।' });
    }
  };

  // Filtered Ads
  const filteredAds = useMemo(() => {
    return ads.filter((item) => {
      const matchesSlot = slotFilter === 'all' || item.slot === slotFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.isActive) ||
        (statusFilter === 'inactive' && !item.isActive);
      return matchesSlot && matchesStatus;
    });
  }, [ads, slotFilter, statusFilter]);

  // Total Clicks
  const totalClicks = useMemo(() => {
    return ads.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);
  }, [ads]);

  const activeAdsCount = useMemo(() => {
    return ads.filter((a) => a.isActive).length;
  }, [ads]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px' }}>
      {/* 1. Header & Summary Stats */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '900', color: '#1c2d5a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-bullhorn" style={{ color: '#b71c1c' }}></i>
            <span>ਇਸ਼ਤਿਹਾਰ ਪ੍ਰਬੰਧਨ (Advertisement Manager)</span>
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
            ਵੱਖ-ਵੱਖ ਪੇਜਾਂ ਅਤੇ ਸਲਾਟਾਂ ਉੱਤੇ ਬੈਨਰ ਫੋਟੋਆਂ, ਸਪਾਂਸਰ ਲਿੰਕ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          style={{
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '7px',
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 2px 8px rgba(183, 28, 28, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa fa-plus"></i>
          <span>ਨਵਾਂ ਇਸ਼ਤਿਹਾਰ ਜੋੜੋ (+ Add Ad)</span>
        </button>
      </div>

      {/* 2. Stat Badges Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>ਕੁੱਲ ਇਸ਼ਤਿਹਾਰ</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>{ads.length}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px' }}>
          <span style={{ fontSize: '11px', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>ਲਾਈਵ / ਚਾਲੂ</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#16a34a' }}>{activeAdsCount}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px 16px' }}>
          <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase' }}>ਕੁੱਲ ਕਲਿੱਕ (Clicks Tracked)</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#0284c7' }}>{totalClicks}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>ਕੁੱਲ ਉਪਲਬਧ ਸਲਾਟ</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#1c2d5a' }}>{AD_SLOTS.length}</div>
        </div>
      </div>

      {/* 3. Feedback Notification */}
      {feedback.message && (
        <div
          style={{
            padding: '11px 16px',
            borderRadius: '8px',
            marginBottom: '18px',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className={`fa ${feedback.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      )}

      {/* 4. AD CREATION / EDIT FORM */}
      {isFormOpen && (
        <div
          id="ad-form-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: editingAdId ? '2px solid #3b82f6' : '1px solid #cbd5e1',
            padding: '22px 24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: editingAdId ? '#3b82f6' : '#b71c1c',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}
              >
                {editingAdId ? 'EDIT AD' : 'NEW AD'}
              </span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                {editingAdId ? 'ਇਸ਼ਤਿਹਾਰ ਸੋਧੋ (Edit Advertisement)' : 'ਨਵਾਂ ਇਸ਼ਤਿਹਾਰ ਬਣਾਓ (Create New Advertisement)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingAdId(null);
              }}
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                padding: '4px 10px',
                fontSize: '12px',
                color: '#475569',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <i className="fa fa-times" style={{ marginRight: '4px' }}></i> ਬੰਦ ਕਰੋ
            </button>
          </div>

          <form onSubmit={handleSave}>
            {/* Row 1: Title & Placement Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਸਿਰਲੇਖ / ਸਪਾਂਸਰ ਦਾ ਨਾਮ (Title / Sponsor) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. ABC Jewellers Festive Sale"
                  required
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਪਲੇਸਮੈਂਟ ਸਲਾਟ (Placement Slot) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <select
                  value={formSlot}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setFormSlot(selected);
                    const slotObj = AD_SLOTS.find((s) => s.id === selected);
                    if (slotObj) setFormSizeLabel(slotObj.recommendedSize.split(' ')[0]);
                  }}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  {AD_SLOTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.recommendedSize})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Slot Info Card */}
            {(() => {
              const currentSlotObj = AD_SLOTS.find((s) => s.id === formSlot);
              return (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <span style={{ color: '#475569' }}>
                    📍 <strong>ਕਿੱਥੇ ਦਿਖੇਗਾ:</strong> {currentSlotObj?.description}
                  </span>
                  <span style={{ fontWeight: '800', color: currentSlotObj?.color }}>
                    ਸਿਫਾਰਸ਼ੀ ਸਾਈਜ਼: {currentSlotObj?.recommendedSize}
                  </span>
                </div>
              );
            })()}

            {/* Row 2: Banner Image (Upload Button or URL) */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                ਬੈਨਰ ਫੋਟੋ (Banner Image) <span style={{ color: '#b71c1c' }}>*</span>
              </label>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="ਫੋਟੋ URL ਲਿੰਕ ਪੇਸਟ ਕਰੋ ਜਾਂ ਨਾਲ ਦਿੱਤੇ ਬਟਨ ਤੋਂ ਅੱਪਲੋਡ ਕਰੋ"
                  required
                  style={{
                    flex: '1 1 300px',
                    height: '38px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  style={{
                    backgroundColor: '#1c2d5a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 14px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {uploadingImage ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i>
                      <span>ਅੱਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-upload"></i>
                      <span>ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ (Upload)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Image Preview */}
              {formImageUrl && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                    ਲਾਈਵ ਫੋਟੋ ਝਲਕ (Preview):
                  </span>
                  <img
                    src={formImageUrl}
                    alt="Preview"
                    style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Row 3: Target URL & Size Label */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਕਲਿੱਕ / ਰੀਡਾਇਰੈਕਟ ਲਿੰਕ (Target Destination URL)
                </label>
                <input
                  type="text"
                  value={formTargetUrl}
                  onChange={(e) => setFormTargetUrl(e.target.value)}
                  placeholder="e.g. https://clientwebsite.com ਜਾਂ WhatsApp ਲਿੰਕ"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਸਾਈਜ਼ ਲੇਬਲ (Dimensions)
                </label>
                <input
                  type="text"
                  value={formSizeLabel}
                  onChange={(e) => setFormSizeLabel(e.target.value)}
                  placeholder="e.g. 728x90, 300x250, Responsive"
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Row 4: Dates & Active Switches */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                  ਸ਼ੁਰੂਆਤੀ ਤਾਰੀਖ਼ (Start Date - Optional)
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                  ਸਮਾਪਤੀ ਤਾਰੀਖ਼ (End / Expiry Date)
                </label>
                <input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Status Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                  ਸਟੇਟਸ (Status)
                </label>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#b71c1c', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12.5px', fontWeight: '800', color: formIsActive ? '#15803d' : '#94a3b8' }}>
                      {formIsActive ? 'ਚਾਲੂ (Active)' : 'ਬੰਦ (Off)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Open in New Tab */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                  ਨਵੇਂ ਟੈਬ ਵਿੱਚ ਖੋਲ੍ਹੋ
                </label>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={formOpenInNewTab}
                      onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#1c2d5a', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                      New Window (_blank)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(183, 28, 28, 0.25)'
                }}
              >
                {saving ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    <span>ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...</span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-check"></i>
                    <span>{editingAdId ? 'ਇਸ਼ਤਿਹਾਰ ਅੱਪਡੇਟ ਕਰੋ (Update)' : 'ਇਸ਼ਤਿਹਾਰ ਪਬਲਿਸ਼ ਕਰੋ (Publish)'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingAdId(null);
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '9px 14px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                ਰੱਦ ਕਰੋ (Cancel)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. DEDICATED FILTER TOOLBAR */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>ਸਟੇਟਸ:</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid',
              borderColor: statusFilter === 'all' ? '#1c2d5a' : '#cbd5e1',
              backgroundColor: statusFilter === 'all' ? '#1c2d5a' : '#ffffff',
              color: statusFilter === 'all' ? '#ffffff' : '#475569',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ਸਾਰੇ ({ads.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid',
              borderColor: statusFilter === 'active' ? '#16a34a' : '#cbd5e1',
              backgroundColor: statusFilter === 'active' ? '#16a34a' : '#ffffff',
              color: statusFilter === 'active' ? '#ffffff' : '#475569',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ਚਾਲੂ ({activeAdsCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid',
              borderColor: statusFilter === 'inactive' ? '#64748b' : '#cbd5e1',
              backgroundColor: statusFilter === 'inactive' ? '#64748b' : '#ffffff',
              color: statusFilter === 'inactive' ? '#ffffff' : '#475569',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ਬੰਦ ({ads.length - activeAdsCount})
          </button>
        </div>

        {/* Slot Dropdown Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>ਸਲਾਟ:</span>
          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            style={{
              height: '32px',
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: '700',
              color: '#1e293b',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">ਸਾਰੇ ਸਲਾਟ (All Slots)</option>
            {AD_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. ADS LIST TABLE */}
      {filteredAds.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '44px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px dashed #cbd5e1'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#b71c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '22px'
            }}
          >
            <i className="fa fa-bullhorn"></i>
          </div>
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
            ਕੋਈ ਇਸ਼ਤਿਹਾਰ ਨਹੀਂ ਮਿਲਿਆ
          </h4>
          <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#64748b' }}>
            ਨਵਾਂ ਬੈਨਰ ਸ਼ਾਮਲ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            style={{
              backgroundColor: '#b71c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa fa-plus"></i>
            <span>ਪਹਿਲਾ ਇਸ਼ਤਿਹਾਰ ਸ਼ਾਮਲ ਕਰੋ</span>
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  <th style={{ padding: '12px 14px', width: '110px' }}>ਬੈਨਰ</th>
                  <th style={{ padding: '12px 14px' }}>ਸਿਰਲੇਖ & ਲਿੰਕ</th>
                  <th style={{ padding: '12px 14px', width: '170px' }}>ਸਲਾਟ & ਸਾਈਜ਼</th>
                  <th style={{ padding: '12px 14px', width: '80px', textAlign: 'center' }}>ਕਲਿੱਕ</th>
                  <th style={{ padding: '12px 14px', width: '90px', textAlign: 'center' }}>ਸਟੇਟਸ</th>
                  <th style={{ padding: '12px 14px', width: '130px', textAlign: 'right' }}>ਕਾਰਵਾਈਆਂ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((item) => {
                  const slotObj = AD_SLOTS.find((s) => s.id === item.slot);
                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Thumbnail */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={item.imageUrl}
                            alt=""
                            style={{
                              width: '90px',
                              height: '48px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#0f172a'
                            }}
                          />
                        </a>
                      </td>

                      {/* Title & Link */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: '800', fontSize: '13.5px', color: '#0f172a', marginBottom: '2px' }}>
                          {item.title}
                        </div>
                        {item.targetUrl ? (
                          <a
                            href={item.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '11px',
                              color: '#0284c7',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              maxWidth: '260px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <i className="fa fa-external-link" style={{ fontSize: '10px' }}></i>
                            <span>{item.targetUrl}</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>ਕੋਈ ਲਿੰਕ ਨਹੀਂ</span>
                        )}
                      </td>

                      {/* Slot & Size */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            backgroundColor: '#eff6ff',
                            color: slotObj?.color || '#1c2d5a',
                            border: '1px solid #bfdbfe',
                            display: 'inline-block',
                            marginBottom: '3px'
                          }}
                        >
                          {slotObj?.label.split('(')[0] || item.slot}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                          ਸਾਈਜ਼: {item.sizeLabel || slotObj?.recommendedSize}
                        </div>
                      </td>

                      {/* Clicks */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: '#0284c7' }}>
                          {item.clicksCount || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(item._id)}
                          style={{
                            border: `1px solid ${item.isActive ? '#86efac' : '#cbd5e1'}`,
                            borderRadius: '16px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            backgroundColor: item.isActive ? '#dcfce7' : '#f8fafc',
                            color: item.isActive ? '#15803d' : '#64748b',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            margin: '0 auto'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.isActive ? '#16a34a' : '#94a3b8' }}></span>
                          <span>{item.isActive ? 'ਚਾਲੂ' : 'ਬੰਦ'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            title="ਸੋਧੋ (Edit)"
                            style={{
                              backgroundColor: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              borderRadius: '5px',
                              padding: '5px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '700'
                            }}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, item.title)}
                            title="ਹਟਾਓ (Delete)"
                            style={{
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              borderRadius: '5px',
                              padding: '5px 8px',
                              fontSize: '11px',
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
        </div>
      )}
    </div>
  );
}
