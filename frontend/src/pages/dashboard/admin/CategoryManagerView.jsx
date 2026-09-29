import React, { useState, useEffect, useCallback } from 'react';
import { categoryAPI } from '../../../services/api';
import ActionModal from '../../../components/Common/ActionModal';

const CORE_SLUGS = ['punjab', 'religion', 'world', 'sport', 'health', 'travel', 'art-entertainment', 'politics', 'business'];
const isDefaultCategory = (cat) => Boolean(cat?.isDefault || CORE_SLUGS.includes(cat?.slug));

const POPULAR_ICONS = [
  { icon: 'fa-newspaper-o', label: 'ਖ਼ਬਰਾਂ (General)' },
  { icon: 'fa-line-chart', label: 'ਵਪਾਰ (Business)' },
  { icon: 'fa-leaf', label: 'ਖੇਤੀਬਾੜੀ / ਵਾਤਾਵਰਨ (Agriculture)' },
  { icon: 'fa-laptop', label: 'ਤਕਨਾਲੋਜੀ (Technology)' },
  { icon: 'fa-graduation-cap', label: 'ਸਿੱਖਿਆ (Education)' },
  { icon: 'fa-balance-scale', label: 'ਕਾਨੂੰਨ / ਅਦਾਲਤ (Law)' },
  { icon: 'fa-university', label: 'ਰਾਜਨੀਤੀ (Politics)' },
  { icon: 'fa-shield', label: 'ਸੁਰੱਖਿਆ / ਕ੍ਰਾਈਮ (Crime)' },
  { icon: 'fa-car', label: 'ਆਟੋਮੋਬਾਈਲ (Autos)' },
  { icon: 'fa-music', label: 'ਸੰਗੀਤ (Music)' },
  { icon: 'fa-heartbeat', label: 'ਸਿਹਤ (Health)' },
  { icon: 'fa-plane', label: 'ਸੈਰ-ਸਪਾਟਾ (Travel)' }
];

export default function CategoryManagerView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    namePa: '',
    nameEn: '',
    slug: '',
    icon: 'fa-newspaper-o',
    order: 10
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Custom Popup State (replaces all alert/confirm browser dialogs)
  const [popup, setPopup] = useState(null);
  // popup = { type: 'alert'|'confirm', title, message, onConfirm?, confirmLabel?, confirmColor? }

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.getAll();
      if (res && res.data && res.data.length > 0) {
        setCategories(res.data);
        setIsFallbackMode(Boolean(res.isFallback));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setNotification({ type: 'error', text: 'ਕੈਟੇਗਰੀਆਂ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ।' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open modal for new category
  const handleOpenNew = () => {
    setEditingCategory(null);
    setFormData({
      namePa: '',
      nameEn: '',
      slug: '',
      icon: 'fa-newspaper-o',
      order: categories.length + 1
    });
    setShowModal(true);
  };

  // Open modal to edit existing category
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      namePa: cat.namePa || '',
      nameEn: cat.nameEn || '',
      slug: cat.slug || '',
      icon: cat.icon || 'fa-newspaper-o',
      order: cat.order !== undefined ? cat.order : 10
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namePa.trim() || !formData.nameEn.trim()) {
      setPopup({
        type: 'alert',
        title: 'ਖਾਨੇ ਖਾਲੀ ਹਨ (Required Fields)',
        message: 'ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਨਾਮ ਦੋਵੇਂ ਦਰਜ ਕਰਨੇ ਲਾਜ਼ਮੀ ਹਨ। (Both Punjabi and English names are required.)'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        setNotification(`ਕੈਟੇਗਰੀ "${formData.namePa}" ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਕੀਤੀ ਗਈ!`);
      } else {
        await categoryAPI.create(formData);
        setNotification(`ਨਵੀਂ ਕੈਟੇਗਰੀ "${formData.namePa}" ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਕੀਤੀ ਗਈ!`);
      }
      setShowModal(false);
      fetchCategories();
      // Notify other components like navbar and forms
      window.dispatchEvent(new Event('punjab_categories_updated'));
    } catch (err) {
      console.error('Save category error:', err);
      setPopup({
        type: 'alert',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: err.message || 'ਕੈਟੇਗਰੀ ਸੇਵ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ।'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete - allows deleting ANY category
  const handleDelete = (cat) => {
    setPopup({
      type: 'confirm',
      title: 'ਕੈਟੇਗਰੀ ਡਿਲੀਟ ਕਰੋ (Delete Category)',
      message: `ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਕੈਟੇਗਰੀ "${cat.namePa} (${cat.nameEn})" ਨੂੰ ਡਿਲੀਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?\n\n(Are you sure you want to delete "${cat.nameEn}"?)\n\nਇਹ ਕਿਰਿਆ ਵਾਪਸ ਨਹੀਂ ਹੋ ਸਕਦੀ।`,
      confirmLabel: 'ਹਾਂ, ਡਿਲੀਟ ਕਰੋ (Yes, Delete)',
      confirmColor: '#b71c1c',
      onConfirm: async () => {
        setPopup(null);
        try {
          setDeletingId(cat._id);
          await categoryAPI.delete(cat._id);
          setNotification(`ਕੈਟੇਗਰੀ "${cat.namePa}" ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤੀ ਗਈ।`);
          fetchCategories();
          window.dispatchEvent(new Event('punjab_categories_updated'));
        } catch (err) {
          console.error('Delete category error:', err);
          setPopup({
            type: 'error',
            title: 'ਡਿਲੀਟ ਵਿੱਚ ਸਮੱਸਿਆ (Delete Failed)',
            message: err.message || 'ਕੈਟੇਗਰੀ ਡਿਲੀਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ।'
          });
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const defaultCount = categories.filter(isDefaultCategory).length;
  const customCount = categories.filter((c) => !isDefaultCategory(c)).length;

  return (
    <div className="category-manager-container" style={{ padding: '4px' }}>
      {/* Top Banner & Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          padding: '18px 20px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-tags" style={{ color: '#b71c1c' }}></i>
            ਕੈਟੇਗਰੀ ਮੈਨੇਜਮੈਂਟ (Category Manager)
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਖ਼ਬਰਾਂ ਦੀਆਂ ਕੈਟੇਗਰੀਆਂ ਨਿਯੰਤਰਿਤ ਕਰੋ, ਨਵੀਂ ਕੈਟੇਗਰੀ ਸ਼ਾਮਲ ਕਰੋ ਜਾਂ ਸੋਧੋ (Manage news categories, add new, or edit).
          </p>
        </div>

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
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(183, 28, 28, 0.25)',
            transition: 'background-color 0.2s'
          }}
        >
          <i className="fa fa-plus-circle" style={{ fontSize: '16px' }}></i>
          ਨਵੀਂ ਕੈਟੇਗਰੀ ਸ਼ਾਮਲ ਕਰੋ (Add New)
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            backgroundColor: typeof notification === 'object' && notification.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: typeof notification === 'object' && notification.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
            color: typeof notification === 'object' && notification.type === 'error' ? '#991b1b' : '#166534',
            padding: '10px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{typeof notification === 'object' ? (notification.type === 'error' ? '⚠ ' : '✓ ') + notification.text : '✓ ' + notification}</span>
          <button
            type="button"
            onClick={() => setNotification('')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Fallback Notice Banner */}
      {isFallbackMode && !notification && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            padding: '11px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <i className="fa fa-info-circle" style={{ color: '#2563eb', fontSize: '16px' }}></i>
          <span>
            <strong>ਸੂਚਨਾ (Notice):</strong> ਰੈਂਡਰ ਬੈਕਐਂਡ ਨਵੀਆਂ ਰੂਟਸ ਨਾਲ ਡਿਪਲਾਏ ਹੋ ਰਿਹਾ ਹੈ। ਸਿਸਟਮ ਦੀਆਂ ਸਾਰੀਆਂ 9 ਮੂਲ ਕੈਟੇਗਰੀਆਂ (Core Categories) ਲਾਈਵ ਲੋਡ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।
          </span>
        </div>
      )}

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ਕੁੱਲ ਕੈਟੇਗਰੀਆਂ (Total)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1c2d5a', marginTop: '2px' }}>{categories.length}</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ਮੁੱਖ ਸਿਸਟਮ ਕੈਟੇਗਰੀਆਂ (Core Default)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#047857', marginTop: '2px' }}>{defaultCount}</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ਨਵੀਆਂ ਸ਼ਾਮਲ ਕੈਟੇਗਰੀਆਂ (Custom Added)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#b71c1c', marginTop: '2px' }}>{customCount}</div>
        </div>
      </div>

      {/* Categories Table / Card Grid */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#334155' }}>
            ਮੌਜੂਦਾ ਕੈਟੇਗਰੀ ਸੂਚੀ (All Active Categories)
          </h3>
        </div>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', color: '#b71c1c', marginBottom: '8px' }}></i>
            <div>ਕੈਟੇਗਰੀਆਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ... (Loading categories...)</div>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            ਕੋਈ ਕੈਟੇਗਰੀ ਨਹੀਂ ਮਿਲੀ (No categories found).
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>ਕ੍ਰਮ (Order)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>ਆਈਕਨ (Icon)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>ਪੰਜਾਬੀ ਨਾਮ (Punjabi)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>ਅੰਗਰੇਜ਼ੀ ਨਾਮ (English)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>URL ਸਲੱਗ (Slug)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700' }}>ਕਿਸਮ (Type)</th>
                  <th style={{ padding: '10px 16px', fontWeight: '700', textAlign: 'right' }}>ਕਾਰਵਾਈ (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr
                    key={cat._id || idx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdf4f4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>
                      #{cat.order || idx + 1}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '6px',
                          color: '#1c2d5a'
                        }}
                      >
                        <i className={`fa ${cat.icon || 'fa-newspaper-o'}`} style={{ fontSize: '15px' }}></i>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>
                      {cat.namePa}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      {cat.nameEn}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#0284c7',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          textDecoration: 'none',
                          backgroundColor: '#f0f9ff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bae6fd'
                        }}
                        title="ਵੇਖੋ (Open category page)"
                      >
                        /category/{cat.slug} ↗
                      </a>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {isDefaultCategory(cat) ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          ਸਿਸਟਮ ਡਿਫੌਲਟ (Default)
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          ਕਸਟਮ ਸ਼ਾਮਲ (Custom)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1e293b',
                          cursor: 'pointer',
                          marginRight: '6px'
                        }}
                      >
                        <i className="fa fa-pencil" style={{ marginRight: '4px' }}></i> ਸੋਧੋ (Edit)
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === cat._id}
                        onClick={() => handleDelete(cat)}
                        style={{
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#b71c1c',
                          cursor: 'pointer'
                        }}
                      >
                        {deletingId === cat._id ? (
                          <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                          <>
                            <i className="fa fa-trash" style={{ marginRight: '4px' }}></i> ਹਟਾਓ (Delete)
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                {editingCategory ? 'ਕੈਟੇਗਰੀ ਸੋਧੋ (Edit Category)' : 'ਨਵੀਂ ਕੈਟੇਗਰੀ ਸ਼ਾਮਲ ਕਰੋ (Add Category)'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Punjabi Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                  ਪੰਜਾਬੀ ਨਾਮ (Punjabi Name) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ਉਦਾਹਰਣ: ਵਪਾਰ ਤੇ ਕਾਰੋਬਾਰ, ਖੇਤੀਬਾੜੀ, ਆਦਿ"
                  value={formData.namePa}
                  onChange={(e) => setFormData({ ...formData, namePa: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              {/* English Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                  ਅੰਗਰੇਜ਼ੀ ਨਾਮ (English Name) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Example: Business, Agriculture, Technology"
                  value={formData.nameEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w\-]+/g, '');
                    setFormData({
                      ...formData,
                      nameEn: val,
                      slug: editingCategory ? formData.slug : autoSlug
                    });
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              {/* URL Slug */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                  URL ਸਲੱਗ (URL Slug / Key)
                </label>
                <input
                  type="text"
                  disabled={editingCategory?.isDefault}
                  placeholder="business"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    backgroundColor: editingCategory?.isDefault ? '#f1f5f9' : '#ffffff'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                  ਪੇਜ ਲਿੰਕ: /category/{formData.slug || 'your-slug'}
                </span>
              </div>

              {/* Quick Icon Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  ਆਈਕਨ ਚੁਣੋ (Select Icon)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  {POPULAR_ICONS.map((item, idx) => {
                    const isSelected = formData.icon === item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.icon })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#b71c1c' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <i className={`fa ${item.icon}`}></i> {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Number */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                  ਕ੍ਰਮ ਨੰਬਰ (Display Priority Order)
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  style={{ width: '100px', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  ਰੱਦ ਕਰੋ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#b71c1c',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(183, 28, 28, 0.3)'
                  }}
                >
                  {isSubmitting ? 'ਸੇਵ ਹੋ ਰਿਹਾ... (Saving...)' : editingCategory ? 'ਅੱਪਡੇਟ ਕਰੋ (Update)' : 'ਸ਼ਾਮਲ ਕਰੋ (Save Category)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Popup Modal (replaces browser alert/confirm) */}
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
