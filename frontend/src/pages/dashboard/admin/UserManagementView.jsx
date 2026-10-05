import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../../../services/api';
import ActionModal from '../../../components/Common/ActionModal';

export default function UserManagementView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(['reporter']);
  const [canDirectPublish, setCanDirectPublish] = useState(false);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [popup, setPopup] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAPI.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleRole = (roleKey) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleKey)) {
        if (prev.length === 1) return prev; // Keep at least one role selected
        return prev.filter((r) => r !== roleKey);
      } else {
        return [...prev, roleKey];
      }
    });
  };

  const getUserRoles = (u) => {
    if (Array.isArray(u.roles) && u.roles.length > 0) return u.roles;
    if (u.role) return [u.role];
    return ['reporter'];
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMsg({ type: 'error', text: 'ਨਾਮ, ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਲਾਜ਼ਮੀ ਹਨ।' });
      return;
    }

    if (selectedRoles.length === 0) {
      setMsg({ type: 'error', text: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਭੂਮਿਕਾ (Role) ਚੁਣੋ।' });
      return;
    }

    try {
      setCreating(true);
      setMsg({ type: '', text: '' });

      let primaryRole = 'reporter';
      if (selectedRoles.includes('admin')) primaryRole = 'admin';
      else if (selectedRoles.includes('editor')) primaryRole = 'editor';
      else primaryRole = 'reporter';

      await userAPI.registerStaff({
        name: name.trim(),
        email: email.trim(),
        password,
        role: primaryRole,
        roles: selectedRoles,
        canDirectPublish: selectedRoles.includes('reporter') ? canDirectPublish : true
      });

      setMsg({
        type: 'success',
        text: `ਸਟਾਫ਼ ਮੈਂਬਰ "${name}" ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਹੋ ਗਿਆ ਹੈ! (Roles: ${selectedRoles.join(', ')})`
      });
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRoles(['reporter']);
      setCanDirectPublish(false);
      fetchUsers();
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleDirectPublish = async (userId, currentStatus, userName) => {
    try {
      const nextStatus = !currentStatus;
      await userAPI.updateDirectPublish(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, canDirectPublish: nextStatus } : u))
      );
      setMsg({
        type: 'success',
        text: `ਰਿਪੋਰਟਰ "${userName}" ਲਈ ਸਿੱਧਾ ਲਾਈਵ: ${nextStatus ? 'ਚਾਲੂ (Enabled)' : 'ਬੰਦ (Disabled)'}`
      });
      setTimeout(() => setMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਸਿੱਧਾ ਲਾਈਵ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    }
  };

  const handleToggleExistingUserRole = async (userId, roleKey) => {
    const targetUser = users.find((u) => u._id === userId);
    if (!targetUser) return;
    const currentRoles = getUserRoles(targetUser);
    let updatedRoles = [];
    if (currentRoles.includes(roleKey)) {
      if (currentRoles.length === 1) {
        setPopup({
          type: 'error',
          title: 'ਭੂਮਿਕਾ ਲੋੜੀਂਦੀ ਹੈ (Role Required)',
          message: 'ਘੱਟੋ-ਘੱਟ ਇੱਕ ਭੂਮਿਕਾ ਹੋਣੀ ਜ਼ਰੂਰੀ ਹੈ (At least one role is required).'
        });
        return;
      }
      updatedRoles = currentRoles.filter((r) => r !== roleKey);
    } else {
      updatedRoles = [...currentRoles, roleKey];
    }

    let primaryRole = 'reporter';
    if (updatedRoles.includes('admin')) primaryRole = 'admin';
    else if (updatedRoles.includes('editor')) primaryRole = 'editor';
    else primaryRole = 'reporter';

    try {
      await userAPI.updateRole(userId, { role: primaryRole, roles: updatedRoles });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: primaryRole, roles: updatedRoles } : u
        )
      );
      setMsg({
        type: 'success',
        text: `ਯੂਜ਼ਰ "${targetUser.name}" ਦੀਆਂ ਭੂਮਿਕਾਵਾਂ ਅੱਪਡੇਟ ਹੋ ਗਈਆਂ: ${updatedRoles.join(', ')}`
      });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਭੂਮਿਕਾ ਬਦਲਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      await userAPI.updateStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: nextStatus } : u))
      );
      setMsg({
        type: 'success',
        text: `ਖਾਤਾ ਸਥਿਤੀ: ${nextStatus ? 'ਐਕਟਿਵ (Active)' : 'ਬੰਦ (Deactivated)'}`
      });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
        message: 'ਖਾਤਾ ਸਥਿਤੀ ਬਦਲਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
      });
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setPopup({
      type: 'confirm',
      title: 'ਯੂਜ਼ਰ ਖਾਤਾ ਮਿਟਾਓ (Delete User)',
      message: `ਕੀ ਤੁਸੀਂ ਵਾਕਈ "${userName}" ਦਾ ਖਾਤਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?\n\n(Are you sure you want to delete the account for "${userName}"?)\n\nਇਹ ਕਿਰਿਆ ਵਾਪਸ ਨਹੀਂ ਹੋ ਸਕਦੀ।`,
      confirmLabel: 'ਹਾਂ, ਮਿਟਾਓ (Yes, Delete)',
      confirmColor: '#b71c1c',
      onConfirm: async () => {
        setPopup(null);
        try {
          await userAPI.deleteUser(userId);
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          setMsg({ type: 'success', text: `ਯੂਜ਼ਰ "${userName}" ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।` });
          setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'ਸਮੱਸਿਆ ਆਈ (Error)',
            message: 'ਯੂਜ਼ਰ ਮਿਟਾਉਣ ਵਿੱਚ ਗਲਤੀ: ' + err.message
          });
        }
      }
    });
  };

  const getRoleBadge = (r) => {
    if (r === 'admin') {
      return (
        <span
          key={r}
          style={{
            backgroundColor: '#1e293b',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '800',
            padding: '3px 6px',
            height: '26px',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxSizing: 'border-box'
          }}
        >
          👑 ਐਡਮਿਨ
        </span>
      );
    }
    if (r === 'editor') {
      return (
        <span
          key={r}
          style={{
            backgroundColor: '#b71c1c',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '800',
            padding: '3px 6px',
            height: '26px',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxSizing: 'border-box'
          }}
        >
          ✍️ ਸੰਪਾਦਕ
        </span>
      );
    }
    return (
      <span
        key={r}
        style={{
          backgroundColor: '#047857',
          color: '#fff',
          fontSize: '11px',
          fontWeight: '800',
          padding: '3px 6px',
          height: '26px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          boxSizing: 'border-box'
        }}
      >
        📰 ਪੱਤਰਕਾਰ
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '14px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
            ਸਟਾਫ਼ ਅਤੇ ਯੂਜ਼ਰ ਪ੍ਰਬੰਧਨ (Staff & User Management)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            ਨਵੇਂ ਸਟਾਫ਼ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ, ਉਹਨਾਂ ਨੂੰ ਇੱਕੋ ਸਮੇਂ ਐਡਮਿਨ, ਸੰਪਾਦਕ ਜਾਂ ਪੱਤਰਕਾਰ ਬਣਾਓ (Assign multiple roles via checkboxes).
          </p>
        </div>
        <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px' }}>
          ਕੇਵਲ ਐਡਮਿਨ ਲਈ (Admin Only)
        </span>
      </div>

      {msg.text && (
        <div
          style={{
            backgroundColor: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${msg.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: msg.type === 'success' ? '#166534' : '#991b1b',
            padding: '11px 16px',
            borderRadius: '5px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px'
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Add Staff Member Form */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
              <i className="fa fa-user-plus"></i>
            </span>
            <span>ਨਵਾਂ ਸਟਾਫ਼ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Add Staff Member)</span>
          </h4>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#64748b' }}>
            ਸਾਰੇ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹਨ (* Required)
          </span>
        </div>

        <form onSubmit={handleCreateUser}>
          {/* Row 1: Symmetrical 3-Column Grid for Credentials */}
          <div className="staff-form-grid-3" style={{ marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                ਪੂਰਾ ਨਾਮ (Full Name) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ਜਸਪ੍ਰੀਤ ਸਿੰਘ"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                ਈਮੇਲ (Email) *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@punjabfiles.com"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                ਪਾਸਵਰਡ (Password) *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ (Min 6 characters)"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Row 2: Symmetrical 3-Column Grid for Role Checkboxes */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa fa-shield" style={{ color: '#b71c1c' }}></i>
                <span>ਭੂਮਿਕਾਵਾਂ ਨਿਰਧਾਰਿਤ ਕਰੋ (Assign Roles - Checkboxes): *</span>
              </label>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                ਘੱਟੋ-ਘੱਟ 1 ਭੂਮਿਕਾ ਚੁਣੋ (Min 1 role)
              </span>
            </div>

            <div className="staff-form-grid-3">
              {/* Admin Card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  minHeight: '58px',
                  borderRadius: '7px',
                  border: `2px solid ${selectedRoles.includes('admin') ? '#1e293b' : '#cbd5e1'}`,
                  backgroundColor: selectedRoles.includes('admin') ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedRoles.includes('admin') ? '0 2px 8px rgba(30, 41, 59, 0.08)' : 'none',
                  userSelect: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('admin')}
                  onChange={() => handleToggleRole('admin')}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#1e293b',
                    margin: 0,
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: selectedRoles.includes('admin') ? '#0f172a' : '#475569' }}>
                    <span>👑</span>
                    <span style={{ whiteSpace: 'nowrap' }}>ਮੁੱਖ ਐਡਮਿਨ (Admin)</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: selectedRoles.includes('admin') ? '#1e293b' : '#94a3b8' }}>
                    ਪੂਰਾ ਕੰਟਰੋਲ (Full Access)
                  </span>
                </div>
              </label>

              {/* Editor Card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  minHeight: '58px',
                  borderRadius: '7px',
                  border: `2px solid ${selectedRoles.includes('editor') ? '#b71c1c' : '#cbd5e1'}`,
                  backgroundColor: selectedRoles.includes('editor') ? '#fff5f5' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedRoles.includes('editor') ? '0 2px 8px rgba(183, 28, 28, 0.08)' : 'none',
                  userSelect: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('editor')}
                  onChange={() => handleToggleRole('editor')}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#b71c1c',
                    margin: 0,
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: selectedRoles.includes('editor') ? '#b71c1c' : '#475569' }}>
                    <span>✍️</span>
                    <span style={{ whiteSpace: 'nowrap' }}>ਮੁੱਖ ਸੰਪਾਦਕ (Editor)</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: selectedRoles.includes('editor') ? '#b71c1c' : '#94a3b8' }}>
                    ਸੰਪਾਦਕੀ ਕੰਟਰੋਲ (Editorial)
                  </span>
                </div>
              </label>

              {/* Reporter Card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  minHeight: '58px',
                  borderRadius: '7px',
                  border: `2px solid ${selectedRoles.includes('reporter') ? '#047857' : '#cbd5e1'}`,
                  backgroundColor: selectedRoles.includes('reporter') ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedRoles.includes('reporter') ? '0 2px 8px rgba(4, 120, 87, 0.08)' : 'none',
                  userSelect: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes('reporter')}
                  onChange={() => handleToggleRole('reporter')}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#047857',
                    margin: 0,
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: selectedRoles.includes('reporter') ? '#047857' : '#475569' }}>
                    <span>📰</span>
                    <span style={{ whiteSpace: 'nowrap' }}>ਪੱਤਰਕਾਰ (Reporter)</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: selectedRoles.includes('reporter') ? '#047857' : '#94a3b8' }}>
                    ਖ਼ਬਰਾਂ ਰਿਪੋਰਟਿੰਗ (Reporting)
                  </span>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
              <i className="fa fa-info-circle" style={{ color: '#3b82f6' }}></i>
              <span>ਤੁਸੀਂ ਇੱਕ ਯੂਜ਼ਰ ਨੂੰ ਇੱਕੋ ਸਮੇਂ ਐਡਮਿਨ, ਸੰਪਾਦਕ ਅਤੇ ਪੱਤਰਕਾਰ ਤਿੰਨੋਂ ਬਣਾ ਸਕਦੇ ਹੋ (You can assign any combination of roles).</span>
            </div>
          </div>

          {/* Row 3: Direct Publish Option (when Reporter is selected) */}
          {selectedRoles.includes('reporter') && (
            <div
              style={{
                marginBottom: '16px',
                backgroundColor: canDirectPublish ? '#f0fdf4' : '#ffffff',
                border: `1.5px solid ${canDirectPublish ? '#86efac' : '#cbd5e1'}`,
                borderRadius: '8px',
                padding: '12px 16px',
                transition: 'all 0.2s ease',
                boxShadow: canDirectPublish ? '0 2px 6px rgba(22, 163, 74, 0.08)' : 'none'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  margin: 0,
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={canDirectPublish}
                  onChange={(e) => setCanDirectPublish(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#16a34a',
                    margin: 0,
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                      ⚡ ਸਿੱਧਾ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ (Allow Direct Live Publishing without approval)
                    </span>
                    <span
                      style={{
                        backgroundColor: canDirectPublish ? '#dcfce7' : '#f1f5f9',
                        color: canDirectPublish ? '#15803d' : '#64748b',
                        fontSize: '10.5px',
                        fontWeight: '800',
                        padding: '1px 8px',
                        borderRadius: '10px'
                      }}
                    >
                      {canDirectPublish ? '✓ ਚਾਲੂ (Enabled)' : '✕ ਬੰਦ (Disabled)'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#64748b', lineHeight: '1.4' }}>
                    ਜੇਕਰ ਇਹ ਚਾਲੂ ਹੋਵੇਗਾ, ਤਾਂ ਇਸ ਰਿਪੋਰਟਰ ਦੀਆਂ ਖ਼ਬਰਾਂ ਬਿਨਾਂ ਸੰਪਾਦਕ ਜਾਂ ਐਡਮਿਨ ਦੀ ਪ੍ਰਵਾਨਗੀ ਦੇ ਸਿੱਧੀਆਂ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲਾਈਵ ਹੋ ਜਾਣਗੀਆਂ।
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Row 4: Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '2px' }}>
            <button
              type="submit"
              disabled={creating}
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                height: '40px',
                padding: '0 22px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: creating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(183, 28, 28, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <i className={creating ? 'fa fa-spinner fa-spin' : 'fa fa-user-plus'}></i>
              <span>{creating ? 'ਜੋੜਿਆ ਜਾ ਰਿਹਾ ਹੈ...' : '+ ਨਵਾਂ ਸਟਾਫ਼ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Add Staff Member)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Staff Table */}
      <div>
        <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
          ਸਟਾਫ਼ ਮੈਂਬਰਾਂ ਦੀ ਸੂਚੀ (Staff Member List) ({users.length})
        </h4>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-table-view" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                    <th style={{ padding: '10px 12px' }}>ਨਾਮ (Name)</th>
                    <th style={{ padding: '10px 12px' }}>ਈਮੇਲ (Email)</th>
                    <th style={{ padding: '10px 12px' }}>ਮੌਜੂਦਾ ਭੂਮਿਕਾਵਾਂ (Roles)</th>
                    <th style={{ padding: '10px 12px' }}>ਸਿੱਧਾ ਲਾਈਵ (Direct Publish)</th>
                    <th style={{ padding: '10px 12px' }}>ਸਟੇਟਸ (Status)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ਕਾਰਵਾਈ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = currentUser && currentUser.id === u._id;
                    const uRoles = getUserRoles(u);
                    const isReporter = uRoles.includes('reporter');

                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>
                          {u.name} {isSelf && <span style={{ fontSize: '11px', color: '#b71c1c' }}>(ਤੁਸੀਂ - You)</span>}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px' }}>
                          {isSelf ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 86px)', gap: '6px' }}>
                              {uRoles.map((r) => getRoleBadge(r))}
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 86px)', gap: '6px', alignItems: 'center' }}>
                              {[
                                { key: 'admin', label: 'ਐਡਮਿਨ', bg: '#1e293b' },
                                { key: 'editor', label: 'ਸੰਪਾਦਕ', bg: '#b71c1c' },
                                { key: 'reporter', label: 'ਰਿਪੋਰਟਰ', bg: '#047857' }
                              ].map(({ key, label, bg }) => {
                                const active = uRoles.includes(key);
                                return (
                                  <label
                                    key={key}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px',
                                      padding: '3px 4px',
                                      height: '26px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      border: active ? `1px solid ${bg}` : '1px solid #cbd5e1',
                                      backgroundColor: active ? bg : '#ffffff',
                                      color: active ? '#ffffff' : '#64748b',
                                      transition: 'all 0.15s ease',
                                      boxSizing: 'border-box',
                                      userSelect: 'none'
                                    }}
                                    title={`Toggle ${label} role for ${u.name}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={active}
                                      onChange={() => handleToggleExistingUserRole(u._id, key)}
                                      style={{ width: '12px', height: '12px', cursor: 'pointer', margin: 0 }}
                                    />
                                    <span>{label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {isReporter ? (
                            <button
                              type="button"
                              onClick={() => handleToggleDirectPublish(u._id, u.canDirectPublish, u.name)}
                              style={{
                                backgroundColor: u.canDirectPublish ? '#16a34a' : '#f1f5f9',
                                color: u.canDirectPublish ? '#ffffff' : '#64748b',
                                border: u.canDirectPublish ? 'none' : '1px solid #cbd5e1',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <i className={u.canDirectPublish ? 'fa fa-bolt' : 'fa fa-ban'}></i>
                              {u.canDirectPublish ? 'ਚਾਲੂ (Auto-Publish)' : 'ਬੰਦ (Approval Needed)'}
                            </button>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => handleToggleStatus(u._id, u.isActive)}
                            style={{
                              backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2',
                              color: u.isActive ? '#15803d' : '#b91c1c',
                              border: 'none',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: isSelf ? 'default' : 'pointer'
                            }}
                          >
                            {u.isActive ? 'ਸਰਗਰਮ (Active)' : 'ਬੰਦ (Inactive)'}
                          </button>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#b71c1c',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                fontSize: '13px'
                              }}
                              title="Delete user"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile User Card List */}
            <div className="mobile-user-card-list">
              {users.map((u) => {
                const isSelf = currentUser && currentUser.id === u._id;
                const uRoles = getUserRoles(u);
                const isReporter = uRoles.includes('reporter');

                return (
                  <div
                    key={u._id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                          {u.name} {isSelf && <span style={{ fontSize: '11px', color: '#b71c1c' }}>(ਤੁਸੀਂ - You)</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                      </div>
                      <div>
                        {isSelf ? (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {uRoles.map((r) => getRoleBadge(r))}
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', alignItems: 'center' }}>
                            {[
                              { key: 'admin', label: 'ਐਡਮਿਨ', bg: '#1e293b' },
                              { key: 'editor', label: 'ਸੰਪਾਦਕ', bg: '#b71c1c' },
                              { key: 'reporter', label: 'ਰਿਪੋਰਟਰ', bg: '#047857' }
                            ].map(({ key, label, bg }) => {
                              const active = uRoles.includes(key);
                              return (
                                <label
                                  key={key}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '3px',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    border: active ? `1px solid ${bg}` : '1px solid #cbd5e1',
                                    backgroundColor: active ? bg : '#ffffff',
                                    color: active ? '#ffffff' : '#64748b',
                                    userSelect: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() => handleToggleExistingUserRole(u._id, key)}
                                    style={{ width: '12px', height: '12px', cursor: 'pointer', margin: 0 }}
                                  />
                                  <span>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(u._id, u.isActive)}
                          style={{
                            backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2',
                            color: u.isActive ? '#15803d' : '#b91c1c',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: isSelf ? 'default' : 'pointer'
                          }}
                        >
                          {u.isActive ? '● ਸਰਗਰਮ (Active)' : '● ਬੰਦ (Inactive)'}
                        </button>

                        {isReporter && (
                          <button
                            type="button"
                            onClick={() => handleToggleDirectPublish(u._id, u.canDirectPublish, u.name)}
                            style={{
                              backgroundColor: u.canDirectPublish ? '#16a34a' : '#f1f5f9',
                              color: u.canDirectPublish ? '#ffffff' : '#64748b',
                              border: u.canDirectPublish ? 'none' : '1px solid #cbd5e1',
                              padding: '3px 8px',
                              borderRadius: '16px',
                              fontSize: '10.5px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className={u.canDirectPublish ? 'fa fa-bolt' : 'fa fa-ban'}></i>
                            {u.canDirectPublish ? 'Auto-Publish' : 'Manual Approval'}
                          </button>
                        )}
                      </div>

                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fca5a5',
                            color: '#b91c1c',
                            cursor: 'pointer',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa fa-trash"></i> ਹਟਾਓ (Delete)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
