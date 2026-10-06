import React, { useState, useEffect, useMemo, useRef } from 'react';
import { galleryAPI, uploadAPI, categoryAPI } from '../../services/api';

// Fallback core categories if API not reachable
export const DEFAULT_GALLERY_CATEGORIES = [
  { id: 'punjab', labelPa: 'ਪੰਜਾਬ', labelEn: 'Punjab', color: '#b71c1c', icon: 'fa-map-marker' },
  { id: 'religion', labelPa: 'ਧਰਮ ਤੇ ਵਿਰਾਸਤ', labelEn: 'Religion', color: '#059669', icon: 'fa-book' },
  { id: 'world', labelPa: 'ਦੇਸ਼-ਵਿਦੇਸ਼', labelEn: 'National & World', color: '#1c2d5a', icon: 'fa-globe' },
  { id: 'sport', labelPa: 'ਖੇਡਾਂ', labelEn: 'Sports', color: '#0284c7', icon: 'fa-trophy' },
  { id: 'health', labelPa: 'ਸਿਹਤ', labelEn: 'Health', color: '#e11d48', icon: 'fa-heartbeat' },
  { id: 'travel', labelPa: 'ਸੈਰ-ਸਪਾਟਾ', labelEn: 'Travel', color: '#d97706', icon: 'fa-plane' },
  { id: 'art-entertainment', labelPa: 'ਮਨੋਰੰਜਨ', labelEn: 'Entertainment', color: '#db2777', icon: 'fa-film' }
];

export default function GalleryManagerView({ currentUser }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Dynamic Categories from Category Manager
  const availableCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((c) => ({
        id: c.slug,
        labelPa: c.namePa,
        labelEn: c.nameEn,
        color: c.color || '#1c2d5a',
        icon: c.icon || 'fa-tag'
      }));
    }
    return DEFAULT_GALLERY_CATEGORIES;
  }, [categories]);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('punjab');
  const [formCategoryNamePa, setFormCategoryNamePa] = useState('ਪੰਜਾਬ');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formPhotographer, setFormPhotographer] = useState('ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ');
  const [formEventDate, setFormEventDate] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formOrder, setFormOrder] = useState(0);

  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await galleryAPI.getAdmin();
      if (res?.data) {
        setItems(res.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'ਗੈਲਰੀ ਤਸਵੀਰਾਂ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ: ' + (err.message || 'ਤਰੁੱਟੀ')
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      if (res && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error fetching categories for gallery:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // Image Upload Handler
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
        setFeedback({ type: 'success', message: 'ਫ਼ੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋ ਗਈ!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ: ' + (err.message || '') });
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Form for New Photo
  const handleOpenNew = () => {
    setEditingId(null);
    setFormTitle('');
    const firstCat = availableCategories[0] || DEFAULT_GALLERY_CATEGORIES[0];
    setFormCategory(firstCat.id);
    setFormCategoryNamePa(firstCat.labelPa);
    setFormImageUrl('');
    setFormCaption('');
    setFormPhotographer('ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ');
    setFormEventDate(new Date().toISOString().split('T')[0]);
    setFormIsPublished(true);
    setFormOrder(0);
    setIsFormOpen(true);

    setTimeout(() => {
      document.getElementById('gallery-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Edit Existing Photo
  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormTitle(item.title || '');
    setFormCategory(item.category || 'punjab');
    setFormCategoryNamePa(item.categoryNamePa || 'ਪੰਜਾਬ');
    setFormImageUrl(item.imageUrl || '');
    setFormCaption(item.caption || '');
    setFormPhotographer(item.photographer || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ');
    setFormEventDate(item.eventDate || '');
    setFormIsPublished(item.isPublished !== false);
    setFormOrder(item.order || 0);
    setIsFormOpen(true);

    setTimeout(() => {
      document.getElementById('gallery-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      setFeedback({ type: 'error', message: 'ਕਿਰਪਾ ਕਰਕੇ ਫ਼ੋਟੋ ਦਾ ਸਿਰਲੇਖ ਭਰੋ।' });
      return;
    }

    if (!formImageUrl.trim()) {
      setFeedback({ type: 'error', message: 'ਕਿਰਪਾ ਕਰਕੇ ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ URL ਲਿੰਕ ਦਿਓ।' });
      return;
    }

    try {
      setSaving(true);
      setFeedback({ type: '', message: '' });

      const payload = {
        title: formTitle.trim(),
        imageUrl: formImageUrl.trim(),
        category: formCategory,
        categoryNamePa: formCategoryNamePa.trim(),
        caption: formCaption.trim(),
        photographer: formPhotographer.trim() || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ',
        eventDate: formEventDate.trim(),
        isPublished: formIsPublished,
        order: Number(formOrder) || 0
      };

      let res;
      if (editingId) {
        res = await galleryAPI.update(editingId, payload);
      } else {
        res = await galleryAPI.create(payload);
      }

      setFeedback({
        type: 'success',
        message: res.message || 'ਫ਼ੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ ਹੈ!'
      });

      setIsFormOpen(false);
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'ਸੇਵ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ: ' + (err.message || '')
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`ਕੀ ਤੁਸੀਂ ਵਾਕਈ "${title}" ਫ਼ੋਟੋ ਗੈਲਰੀ ਵਿੱਚੋਂ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?`)) return;

    try {
      setFeedback({ type: '', message: '' });
      const res = await galleryAPI.delete(id);
      setFeedback({ type: 'success', message: res.message || 'ਫ਼ੋਟੋ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ।' });
      await fetchItems();
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਹਟਾਉਣ ਵਿੱਚ ਤਰੁੱਟੀ: ' + (err.message || '') });
    }
  };

  // Quick Toggle Published
  const handleToggle = async (id) => {
    try {
      const res = await galleryAPI.toggle(id);
      setFeedback({
        type: 'success',
        message: res.message || 'ਸਟੇਟਸ ਅੱਪਡੇਟ ਹੋ ਗਿਆ।'
      });
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isPublished: res.isPublished } : item))
      );
    } catch (err) {
      setFeedback({ type: 'error', message: 'ਸਟੇਟਸ ਬਦਲਣ ਵਿੱਚ ਤਰੁੱਟੀ: ' + (err.message || '') });
    }
  };

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (statusFilter === 'published' && !item.isPublished) return false;
      if (statusFilter === 'draft' && item.isPublished) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchCaption = item.caption?.toLowerCase().includes(q);
        const matchPhotographer = item.photographer?.toLowerCase().includes(q);
        if (!matchTitle && !matchCaption && !matchPhotographer) return false;
      }
      return true;
    });
  }, [items, categoryFilter, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((i) => i.isPublished).length;
    const draft = total - published;
    const categoriesUsed = new Set(items.map((i) => i.category)).size;
    return { total, published, draft, categoriesUsed };
  }, [items]);

  return (
    <div className="gallery-manager-view" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header with Stats & Add Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#1c2d5a',
                color: '#ebb10d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              <i className="fa fa-camera-retro"></i>
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
                ਫ਼ੋਟੋ ਗੈਲਰੀ ਪ੍ਰਬੰਧਨ (Photo Gallery)
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                ਵੈੱਬਸਾਈਟ ਉੱਤੇ ਉੱਚ-ਗੁਣਵੱਤਾ ਤਸਵੀਰਾਂ, ਸਮਾਗਮਾਂ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟਾਂ ਦੀ ਗੈਲਰੀ ਅੱਪਲੋਡ ਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={fetchItems}
            disabled={loading}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i>
            <span>ਰਿਫ੍ਰੈਸ਼</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            style={{
              backgroundColor: '#b71c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 3px 10px rgba(183, 28, 28, 0.3)'
            }}
          >
            <i className="fa fa-plus-circle"></i>
            <span>ਨਵੀਂ ਫ਼ੋਟੋ ਸ਼ਾਮਲ ਕਰੋ</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '700',
            backgroundColor: feedback.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: feedback.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${feedback.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            <i
              className={`fa ${feedback.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}
              style={{ marginRight: '8px' }}
            ></i>
            {feedback.message}
          </span>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* 2. Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>ਕੁੱਲ ਤਸਵੀਰਾਂ</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{stats.total}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>ਪਬਲਿਸ਼ ਕੀਤੀਆਂ (Live)</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#059669', marginTop: '4px' }}>{stats.published}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#d97706', textTransform: 'uppercase' }}>ਡਰਾਫਟ (Drafts)</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>{stats.draft}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#1c2d5a', textTransform: 'uppercase' }}>ਕੈਟੇਗਰੀਆਂ (Categories)</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#1c2d5a', marginTop: '4px' }}>{stats.categoriesUsed}</div>
        </div>
      </div>

      {/* 3. Upload & Edit Form Drawer/Card */}
      {isFormOpen && (
        <div
          id="gallery-form-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '2px solid #b71c1c',
            boxShadow: '0 8px 24px rgba(183, 28, 28, 0.08)',
            padding: '24px',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
              <i className="fa fa-pencil" style={{ color: '#b71c1c', marginRight: '8px' }}></i>
              {editingId ? 'ਗੈਲਰੀ ਫ਼ੋਟੋ ਸੋਧੋ (Edit Gallery Photo)' : 'ਨਵੀਂ ਫ਼ੋਟੋ ਸ਼ਾਮਲ ਕਰੋ (Add New Photo)'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
              }}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              {/* Photo Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਫ਼ੋਟੋ ਦਾ ਸਿਰਲੇਖ / ਟਾਈਟਲ <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ਉਦਾਹਰਣ: ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਦ੍ਰਿਸ਼"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਕੈਟੇਗਰੀ (Category) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => {
                    const sel = e.target.value;
                    setFormCategory(sel);
                    const found = availableCategories.find((c) => c.id === sel);
                    if (found) setFormCategoryNamePa(found.labelPa);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.labelPa} ({cat.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photographer / Credit */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਫ਼ੋਟੋਗ੍ਰਾਫਰ / ਕ੍ਰੈਡਿਟ
                </label>
                <input
                  type="text"
                  value={formPhotographer}
                  onChange={(e) => setFormPhotographer(e.target.value)}
                  placeholder="ਉਦਾਹਰਣ: ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ / ਗੁਰਮੀਤ ਸਿੰਘ"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Event Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                  ਤਾਰੀਖ (Event / Capture Date)
                </label>
                <input
                  type="date"
                  value={formEventDate}
                  onChange={(e) => setFormEventDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Photo Image Upload & URL */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                ਫ਼ੋਟੋ ਫਾਈਲ ਜਾਂ URL ਲਿੰਕ <span style={{ color: '#b71c1c' }}>*</span>
              </label>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="ਫ਼ੋਟੋ URL ਲਿੰਕ ਪੇਸਟ ਕਰੋ ਜਾਂ ਨਾਲ ਦਿੱਤੇ ਬਟਨ ਤੋਂ ਆਪਣੇ ਫੋਨ/ਕੰਪਿਊਟਰ ਵਿੱਚੋਂ ਅੱਪਲੋਡ ਕਰੋ"
                  required
                  style={{
                    flex: '1 1 300px',
                    padding: '9px 12px',
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
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className={`fa ${uploadingImage ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
                  <span>{uploadingImage ? 'ਅੱਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...' : 'ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਕਰੋ'}</span>
                </button>
              </div>

              {/* Preview Thumbnail */}
              {formImageUrl && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <img
                    src={formImageUrl}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1'
                    }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#059669', display: 'block' }}>
                      <i className="fa fa-check-circle" style={{ marginRight: '4px' }}></i> ਫ਼ੋਟੋ ਤਿਆਰ ਹੈ
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-all' }}>
                      {formImageUrl.substring(0, 50)}...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description / Caption */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                ਵੇਰਵਾ / ਕੈਪਸ਼ਨ (Description / Caption)
              </label>
              <textarea
                value={formCaption}
                onChange={(e) => setFormCaption(e.target.value)}
                placeholder="ਇਸ ਤਸਵੀਰ ਬਾਰੇ ਸੰਖੇਪ ਜਾਣਕਾਰੀ ਜਾਂ ਪ੍ਰਸੰਗ ਲਿਖੋ..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Status & Order Settings */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '14px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                <input
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>ਫ਼ੋਟੋ ਲਾਈਵ ਪਬਲਿਸ਼ ਕਰੋ (Published)</span>
              </label>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>ਤਰਜੀਹ ਕ੍ਰਮ (Order):</span>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(e.target.value)}
                  style={{
                    width: '80px',
                    padding: '5px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px'
                  }}
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ਰੱਦ ਕਰੋ (Cancel)
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '9px 22px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(183, 28, 28, 0.3)'
                }}
              >
                <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                <span>{saving ? 'ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...' : editingId ? 'ਅੱਪਡੇਟ ਕਰੋ' : 'ਫ਼ੋਟੋ ਪਬਲਿਸ਼ ਕਰੋ'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          padding: '14px 18px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: categoryFilter === 'all' ? '800' : '600',
              border: 'none',
              backgroundColor: categoryFilter === 'all' ? '#0f172a' : '#f1f5f9',
              color: categoryFilter === 'all' ? '#ffffff' : '#475569',
              cursor: 'pointer'
            }}
          >
            ਸਾਰੀਆਂ ({items.length})
          </button>

          {availableCategories.map((cat) => {
            const isSel = categoryFilter === cat.id;
            const count = items.filter((i) => i.category === cat.id).length;
            if (count === 0 && !isSel) return null;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: isSel ? '800' : '600',
                  border: isSel ? `1.5px solid ${cat.color}` : '1px solid #e2e8f0',
                  backgroundColor: isSel ? cat.color : '#ffffff',
                  color: isSel ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className={`fa ${cat.icon}`}></i>
                <span>{cat.labelPa} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="all">ਸਾਰੇ ਸਟੇਟਸ</option>
            <option value="published">ਸਿਰਫ਼ ਪਬਲਿਸ਼ (Live)</option>
            <option value="draft">ਸਿਰਫ਼ ਡਰਾਫਟ (Drafts)</option>
          </select>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ਖੋਜੋ..."
              style={{
                padding: '7px 28px 7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                width: '160px'
              }}
            />
            <i className="fa fa-search" style={{ position: 'absolute', right: '9px', top: '10px', color: '#94a3b8', fontSize: '11px' }}></i>
          </div>
        </div>
      </div>

      {/* 5. Photos Grid List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', color: '#b71c1c', marginBottom: '12px', display: 'block' }}></i>
          <span>ਗੈਲਰੀ ਤਸਵੀਰਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px dashed #cbd5e1'
          }}
        >
          <i className="fa fa-picture-o" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px', display: 'block' }}></i>
          <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>
            ਕੋਈ ਤਸਵੀਰ ਨਹੀਂ ਮਿਲੀ
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
            {searchQuery ? 'ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ।' : 'ਨਵੀਂ ਫ਼ੋਟੋ ਸ਼ਾਮਲ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਉੱਤੇ ਕਲਿੱਕ ਕਰੋ।'}
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            style={{
              backgroundColor: '#b71c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            + ਨਵੀਂ ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਕਰੋ
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredItems.map((item) => {
            const catObj = availableCategories.find((c) => c.id === item.category);

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Photo Thumbnail */}
                <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />

                  {/* Category Pill Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: catObj?.color || '#1c2d5a',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.3px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.categoryNamePa || catObj?.labelPa || item.category}
                  </span>

                  {/* Live Status Pill */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: item.isPublished ? '#059669' : '#d97706',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.isPublished ? '● LIVE' : '○ DRAFT'}
                  </span>
                </div>

                {/* Content Box */}
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4
                    style={{
                      margin: '0 0 6px',
                      fontSize: '14.5px',
                      fontWeight: '800',
                      color: '#0f172a',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                    title={item.title}
                  >
                    {item.title}
                  </h4>

                  {item.caption && (
                    <p
                      style={{
                        margin: '0 0 10px',
                        fontSize: '12px',
                        color: '#64748b',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.caption}
                    </p>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                    <span>
                      <i className="fa fa-user" style={{ marginRight: '4px' }}></i>
                      {item.photographer || 'ਡੈਸਕ'}
                    </span>
                    <span>
                      {item.eventDate || new Date(item.createdAt).toLocaleDateString('pa-IN')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '8px 14px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: item.isPublished ? '#059669' : '#d97706',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <i className={`fa ${item.isPublished ? 'fa-toggle-on' : 'fa-toggle-off'}`} style={{ marginRight: '4px' }}></i>
                    {item.isPublished ? 'ਲਾਈਵ' : 'ਡਰਾਫਟ'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#1c2d5a',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa fa-pencil" style={{ marginRight: '3px' }}></i> ਸੋਧੋ
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id, item.title)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #fca5a5',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#b71c1c',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
