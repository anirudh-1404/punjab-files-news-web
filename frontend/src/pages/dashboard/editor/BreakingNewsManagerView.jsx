import React, { useState, useEffect, useCallback } from 'react';
import { breakingAPI } from '../../../services/api';
import ActionModal from '../../../components/Common/ActionModal';

const DEFAULT_TAGS = [
  { value: 'ਪੰਜਾਬ', label: 'ਪੰਜਾਬ (Punjab)' },
  { value: 'ਮਾਝਾ', label: 'ਮਾਝਾ (Majha)' },
  { value: 'ਮਾਲਵਾ', label: 'ਮਾਲਵਾ (Malwa)' },
  { value: 'ਦੋਆਬਾ', label: 'ਦੋਆਬਾ (Doaba)' },
  { value: 'ਧਰਮ', label: 'ਧਰਮ (Religion)' },
  { value: 'ਖੇਡਾਂ', label: 'ਖੇਡਾਂ (Sports)' },
  { value: 'ਦੇਸ਼-ਵਿਦੇਸ਼', label: 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)' },
  { value: 'ਸਿਹਤ', label: 'ਸਿਹਤ (Health)' }
];

export default function BreakingNewsManagerView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState('ਪੰਜਾਬ');
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [popup, setPopup] = useState(null);

  const fetchBreaking = useCallback(async () => {
    try {
      setLoading(true);
      const res = await breakingAPI.getBreaking();
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to load breaking items:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreaking();
  }, [fetchBreaking]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      const res = await breakingAPI.createBreaking({
        tag,
        text: text.trim(),
        priority: parseInt(priority, 10) || 1
      });

      setItems((prev) => [res.item, ...prev]);
      setText('');
      setMsg('ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਹੋ ਗਈ ਹੈ! (Breaking news added successfully)');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਸ਼ਾਮਲ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id, headline) => {
    setPopup({
      type: 'confirm',
      title: 'ਬਰੇਕਿੰਗ ਅਲਰਟ ਹਟਾਓ (Delete Breaking Alert)',
      message: `ਕੀ ਤੁਸੀਂ ਇਹ ਬਰੇਕਿੰਗ ਅਲਰਟ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?\n\n"${headline}"`,
      confirmLabel: 'ਹਾਂ, ਹਟਾਓ (Yes, Delete)',
      confirmColor: '#b71c1c',
      onConfirm: async () => {
        setPopup(null);
        try {
          await breakingAPI.deleteBreaking(id);
          setItems((prev) => prev.filter((i) => i._id !== id));
          setMsg('ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ! (Breaking news removed)');
          setTimeout(() => setMsg(''), 3000);
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
            message: 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਹਟਾਉਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
          });
        }
      }
    });
  };

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '14px', marginBottom: '22px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
          ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਮੈਨੇਜਰ (Live Breaking News Ticker)
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
          ਇੱਥੋਂ ਦਰਜ ਕੀਤੀਆਂ ਗਈਆਂ ਸੁਰਖੀਆਂ ਵੈੱਬਸਾਈਟ ਦੇ ਸਭ ਤੋਂ ਉੱਪਰ ਲਾਲ ਮਾਰਕੀ ਪੱਟੀ (Marquee Ticker) ਵਿੱਚ ਲਾਈਵ ਸਕ੍ਰੋਲ ਹੋਣਗੀਆਂ (Headlines added here will scroll live in the top red marquee ticker on the website).
        </p>
      </div>

      {msg && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '5px', fontSize: '13px', fontWeight: '600', marginBottom: '18px' }}>
          {msg}
        </div>
      )}

      {/* Add New Ticker Form */}
      <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '6px', padding: '16px', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#b71c1c' }}>
          <i className="fa fa-bolt" style={{ marginRight: '6px' }}></i> ਨਵਾਂ ਬਰੇਕਿੰਗ ਅਲਰਟ ਸ਼ਾਮਲ ਕਰੋ (Add New Alert)
        </h4>

        <form onSubmit={handleAdd} className="breaking-form-grid" style={{ display: 'grid', gridTemplateColumns: '170px 1fr 140px auto', gap: '10px', alignItems: 'center' }}>
          {/* Tag Select */}
          <div className="breaking-tag-col">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={{ width: '100%', padding: '9px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', fontWeight: '700' }}
            >
              {DEFAULT_TAGS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Input */}
          <div className="breaking-input-col">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਹੈੱਡਲਾਈਨ ਲਿਖੋ (Enter breaking headline)..."
              required
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px' }}
            />
          </div>

          {/* Priority */}
          <div className="breaking-priority-col">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: '100%', padding: '9px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}
            >
              <option value="5">ਤਰਜੀਹ 5 (High Priority)</option>
              <option value="4">ਤਰਜੀਹ 4 (Priority 4)</option>
              <option value="3">ਤਰਜੀਹ 3 (Priority 3)</option>
              <option value="2">ਤਰਜੀਹ 2 (Priority 2)</option>
              <option value="1">ਤਰਜੀਹ 1 (Normal)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="breaking-submit-col">
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: submitting ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {submitting ? '...' : '+ ਸ਼ਾਮਲ ਕਰੋ (Add)'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Tickers List */}
      <div>
        <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
          ਸਰਗਰਮ ਬਰੇਕਿੰਗ ਨਿਊਜ਼ (Active Breaking News) ({items.length})
        </h4>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '22px' }}></i>
          </div>
        ) : items.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
            ਇਸ ਸਮੇਂ ਕੋਈ ਵੀ ਬਰੇਕਿੰਗ ਅਲਰਟ ਐਕਟਿਵ ਨਹੀਂ ਹੈ (No active breaking news alerts currently).
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item) => (
              <div
                key={item._id}
                className="breaking-ticker-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '5px',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ backgroundColor: '#b71c1c', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                    {item.tag}
                  </span>
                  <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: '600' }}>
                    {item.text}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', padding: '2px 6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                    P-{item.priority || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, item.text)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#b71c1c',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontSize: '13px'
                    }}
                    title="Delete ticker item"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
