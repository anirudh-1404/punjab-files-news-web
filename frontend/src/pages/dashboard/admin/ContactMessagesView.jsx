import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { contactAPI } from '../../../services/api';
import ActionModal from '../../../components/Common/ActionModal';

export default function ContactMessagesView({ onUnreadCountChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState('');
  const [popup, setPopup] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contactAPI.getMessages();
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to load contact messages:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (onUnreadCountChange) {
      const count = messages.filter((m) => m.status === 'unread').length;
      onUnreadCountChange(count);
    }
  }, [messages, onUnreadCountChange]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setActionLoading(id);
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
      await contactAPI.updateStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
      setNotification(`ਸੁਨੇਹਾ '${newStatus === 'read' ? 'ਪੜ੍ਹ ਲਿਆ' : 'ਅਣਪੜ੍ਹਿਆ'}' ਮਾਰਕ ਕੀਤਾ ਗਿਆ।`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਸੁਨੇਹੇ ਦੀ ਸਥਿਤੀ ਬਦਲਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (id, senderName) => {
    setPopup({
      type: 'confirm',
      title: 'ਸੁਨੇਹਾ ਮਿਟਾਓ (Delete Message)',
      message: `ਕੀ ਤੁਸੀਂ "${senderName}" ਵੱਲੋਂ ਭੇਜਿਆ ਇਹ ਸੁਨੇਹਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?\n\n(Are you sure you want to delete this message?)`,
      confirmLabel: 'ਹਾਂ, ਮਿਟਾਓ (Yes, Delete)',
      confirmColor: '#b71c1c',
      onConfirm: async () => {
        setPopup(null);
        try {
          setActionLoading(id);
          await contactAPI.deleteMessage(id);
          setMessages((prev) => prev.filter((m) => m._id !== id));
          setNotification('ਸੁਨੇਹਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ!');
          setTimeout(() => setNotification(''), 3000);
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
            message: 'ਸੁਨੇਹਾ ਮਿਟਾਉਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
          });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // 1. Status Filter
      if (filter === 'unread' && m.status !== 'unread') return false;
      if (filter === 'read' && m.status !== 'read') return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.phone?.toLowerCase().includes(q) ||
          m.message?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, filter, searchQuery]);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '21px', fontWeight: '800', color: '#0f172a' }}>
              ਸੰਪਰਕ ਸੁਨੇਹੇ ਤੇ ਪਾਠਕ ਪ੍ਰਤੀਕਿਰਿਆ (Contact & Reader Messages)
            </h3>
            {unreadCount > 0 ? (
              <span style={{ backgroundColor: '#dc2626', color: '#ffffff', fontSize: '11.5px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                ● {unreadCount} ਨਵੇਂ ਸੁਨੇਹੇ (Unread)
              </span>
            ) : (
              <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11.5px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                ਸਾਰੇ ਸੁਨੇਹੇ ਪੜ੍ਹ ਲਏ ਗਏ (All Read)
              </span>
            )}
          </div>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਵੈੱਬਸਾਈਟ ਦੇ ਸੰਪਰਕ (Contact Us) ਫ਼ਾਰਮ ਰਾਹੀਂ ਪਾਠਕਾਂ ਵੱਲੋਂ ਭੇਜੇ ਗਏ ਸੁਨੇਹੇ, ਫੀਡਬੈਕ ਅਤੇ ਖ਼ਬਰਾਂ ਇੱਥੇ ਦਰਜ ਹੁੰਦੀਆਂ ਹਨ (Messages, feedback, and tips submitted via Contact Us form appear here).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '7px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#334155',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa fa-refresh"></i>
          <span>ਤਾਜ਼ਾ ਕਰੋ (Refresh)</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '6px', fontSize: '13.5px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa fa-check-circle" style={{ fontSize: '18px' }}></i>
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="cms-filter-bar" style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `ਸਾਰੇ (All) (${messages.length})` },
            { key: 'unread', label: `ਨਵੇਂ / ਅਣਪੜ੍ਹੇ (Unread) (${unreadCount})` },
            { key: 'read', label: `ਪੜ੍ਹੇ ਹੋਏ (Read) (${messages.length - unreadCount})` }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: '700',
                border: filter === tab.key ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                backgroundColor: filter === tab.key ? '#b71c1c' : '#ffffff',
                color: filter === tab.key ? '#ffffff' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '320px' }}>
          <i className="fa fa-search" style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8', fontSize: '13px' }}></i>
          <input
            type="text"
            placeholder="ਨਾਮ, ਈਮੇਲ ਜਾਂ ਫ਼ੋਨ ਖੋਜੋ (Search name, email, phone)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', color: '#b71c1c' }}></i>
          <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: '600' }}>ਸੁਨੇਹੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ... (Loading messages...)</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <i className="fa fa-envelope-open-o" style={{ fontSize: '36px', color: '#94a3b8', marginBottom: '10px' }}></i>
          <h4 style={{ margin: '0 0 6px', color: '#334155', fontSize: '16px' }}>ਕੋਈ ਸੁਨੇਹਾ ਨਹੀਂ ਮਿਲਿਆ (No Messages Found)</h4>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            ਇਸ ਫਿਲਟਰ ਤਹਿਤ ਕੋਈ ਸੰਪਰਕ ਸੁਨੇਹਾ ਮੌਜੂਦ ਨਹੀਂ ਹੈ (No messages under this filter).
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredMessages.map((m) => {
            const isUnread = m.status === 'unread';
            return (
              <div
                key={m._id}
                style={{
                  backgroundColor: isUnread ? '#fffdf7' : '#ffffff',
                  border: isUnread ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  borderLeft: isUnread ? '4px solid #f97316' : '4px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Top Row: Sender Info & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a' }}>
                      <i className="fa fa-user-circle" style={{ marginRight: '6px', color: '#b71c1c' }}></i>
                      {m.name}
                    </span>

                    {/* Unread / Read Pill */}
                    {isUnread ? (
                      <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                        ● ਨਵਾਂ ਸੁਨੇਹਾ (Unread)
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                        ✓ ਪੜ੍ਹ ਲਿਆ (Read)
                      </span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                    <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
                    {m.createdAt ? new Date(m.createdAt).toLocaleString('pa-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                  </span>
                </div>

                {/* Contact Info Row: Email & Phone */}
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '13px', marginBottom: '12px', color: '#475569' }}>
                  <span>
                    <strong style={{ color: '#1e293b' }}>ਈਮੇਲ (Email): </strong>
                    <a
                      href={`mailto:${m.email}`}
                      style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: '600' }}
                    >
                      {m.email}
                    </a>
                  </span>

                  <span>
                    <strong style={{ color: '#1e293b' }}>ਫ਼ੋਨ ਨੰਬਰ (Phone): </strong>
                    <a
                      href={`tel:${m.phone}`}
                      style={{ color: '#047857', textDecoration: 'none', fontWeight: '600' }}
                    >
                      {m.phone}
                    </a>
                  </span>
                </div>

                {/* Message Body */}
                <div
                  style={{
                    backgroundColor: isUnread ? '#fffbf0' : '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '12px'
                  }}
                >
                  {m.message}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button
                    type="button"
                    disabled={actionLoading === m._id}
                    onClick={() => handleToggleStatus(m._id, m.status)}
                    style={{
                      backgroundColor: isUnread ? '#1e40af' : '#ffffff',
                      color: isUnread ? '#ffffff' : '#475569',
                      border: isUnread ? 'none' : '1px solid #cbd5e1',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: actionLoading === m._id ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className={isUnread ? 'fa fa-check' : 'fa fa-envelope-o'}></i>
                    <span>{isUnread ? 'ਪੜ੍ਹ ਲਿਆ ਮਾਰਕ ਕਰੋ (Mark Read)' : 'ਅਣਪੜ੍ਹਿਆ ਬਣਾਓ (Mark Unread)'}</span>
                  </button>

                  <a
                    href={`mailto:${m.email}?subject=Re: Punjab Files Inquiry - ${encodeURIComponent(m.name)}`}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fa fa-reply"></i>
                    <span>ਜਵਾਬ ਭੇਜੋ (Reply)</span>
                  </a>

                  <button
                    type="button"
                    disabled={actionLoading === m._id}
                    onClick={() => handleDelete(m._id, m.name)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: actionLoading === m._id ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fa fa-trash"></i>
                    <span>ਮਿਟਾਓ (Delete)</span>
                  </button>
                </div>
              </div>
            );
          })}
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
