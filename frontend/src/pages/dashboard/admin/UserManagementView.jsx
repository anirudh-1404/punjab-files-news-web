import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../../../services/api';

export default function UserManagementView({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reporter');
  const [canDirectPublish, setCanDirectPublish] = useState(false);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMsg({ type: 'error', text: 'ਨਾਮ, ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਲਾਜ਼ਮੀ ਹਨ।' });
      return;
    }

    try {
      setCreating(true);
      setMsg({ type: '', text: '' });
      await userAPI.registerStaff({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        canDirectPublish: role === 'reporter' ? canDirectPublish : false
      });

      setMsg({ type: 'success', text: `ਸਟਾਫ਼ ਮੈਂਬਰ "${name}" ਸਫ਼ਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਹੋ ਗਿਆ ਹੈ!` });
      setName('');
      setEmail('');
      setPassword('');
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
      alert('Error updating direct publish: ' + err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert('Error updating role: ' + err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      await userAPI.updateStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: nextStatus } : u))
      );
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`ਕੀ ਤੁਸੀਂ ਵਾਕਈ "${userName}" ਦਾ ਖਾਤਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?`)) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setMsg({ type: 'success', text: `ਯੂਜ਼ਰ "${userName}" ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।` });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getRoleBadge = (r) => {
    if (r === 'admin') {
      return <span style={{ backgroundColor: '#1e293b', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '3px' }}>ਮੁੱਖ ਐਡਮਿਨ (Admin)</span>;
    }
    if (r === 'editor') {
      return <span style={{ backgroundColor: '#b71c1c', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '3px' }}>ਮੁੱਖ ਸੰਪਾਦਕ (Editor)</span>;
    }
    return <span style={{ backgroundColor: '#047857', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '3px' }}>ਪੱਤਰਕਾਰ (Reporter)</span>;
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
            ਨਵੇਂ ਪੱਤਰਕਾਰ ਅਤੇ ਸੰਪਾਦਕ ਸ਼ਾਮਲ ਕਰੋ, ਉਹਨਾਂ ਦੀ ਭੂਮਿਕਾ (Role) ਬਦਲੋ ਜਾਂ ਖਾਤਾ ਸਰਗਰਮ/ਬੰਦ ਕਰੋ (Add reporters & editors, manage roles, or toggle active status).
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
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '18px', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
          <i className="fa fa-user-plus" style={{ marginRight: '6px', color: '#b71c1c' }}></i> ਨਵਾਂ ਸਟਾਫ਼ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Add Staff Member)
        </h4>

        <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              ਪੂਰਾ ਨਾਮ (Full Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ਜਸਪ੍ਰੀਤ ਸਿੰਘ"
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              ਈਮੇਲ (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reporter@punjabfiles.com"
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              ਪਾਸਵਰਡ (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ (Min 6 characters)"
              required
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
              ਭੂਮਿਕਾ (Role)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
            >
              <option value="reporter">ਪੱਤਰਕਾਰ (Reporter)</option>
              <option value="editor">ਸੰਪਾਦਕ (Editor)</option>
              <option value="admin">ਮੁੱਖ ਐਡਮਿਨ (Admin)</option>
            </select>
          </div>

          {role === 'reporter' && (
            <div style={{ gridColumn: '1 / -1', marginTop: '4px', backgroundColor: '#f1f5f9', padding: '10px 14px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                <input
                  type="checkbox"
                  checked={canDirectPublish}
                  onChange={(e) => setCanDirectPublish(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>⚡ ਸਿੱਧਾ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ (Allow Direct Live Publishing without approval)</span>
              </label>
              <p style={{ margin: '4px 0 0 24px', fontSize: '11.5px', color: '#64748b' }}>
                ਜੇਕਰ ਇਹ ਚਾਲੂ ਹੋਵੇਗਾ, ਤਾਂ ਇਸ ਰਿਪੋਰਟਰ ਦੀਆਂ ਖ਼ਬਰਾਂ ਬਿਨਾਂ ਸੰਪਾਦਕ ਜਾਂ ਐਡਮਿਨ ਦੀ ਪ੍ਰਵਾਨਗੀ ਦੇ ਸਿੱਧੀਆਂ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲਾਈਵ ਹੋ ਜਾਣਗੀਆਂ।
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={creating}
              style={{
                backgroundColor: '#b71c1c',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: creating ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {creating ? '...' : '+ ਸ਼ਾਮਲ ਕਰੋ (Add)'}
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
              <table style={{ width: '100%', minWidth: '620px', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                    <th style={{ padding: '10px 12px' }}>ਨਾਮ (Name)</th>
                    <th style={{ padding: '10px 12px' }}>ਈਮੇਲ (Email)</th>
                    <th style={{ padding: '10px 12px' }}>ਮੌਜੂਦਾ ਭੂਮਿਕਾ (Role)</th>
                    <th style={{ padding: '10px 12px' }}>ਸਿੱਧਾ ਲਾਈਵ (Direct Publish)</th>
                    <th style={{ padding: '10px 12px' }}>ਸਟੇਟਸ (Status)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ਕਾਰਵਾਈ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = currentUser && currentUser.id === u._id;
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>
                          {u.name} {isSelf && <span style={{ fontSize: '11px', color: '#b71c1c' }}>(ਤੁਸੀਂ - You)</span>}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px' }}>
                          {isSelf ? (
                            getRoleBadge(u.role)
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            >
                              <option value="reporter">ਪੱਤਰਕਾਰ (Reporter)</option>
                              <option value="editor">ਸੰਪਾਦਕ (Editor)</option>
                              <option value="admin">ਐਡਮਿਨ (Admin)</option>
                            </select>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {u.role === 'reporter' ? (
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
                          getRoleBadge(u.role)
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: '700' }}
                          >
                            <option value="reporter">ਪੱਤਰਕਾਰ (Reporter)</option>
                            <option value="editor">ਸੰਪਾਦਕ (Editor)</option>
                            <option value="admin">ਐਡਮਿਨ (Admin)</option>
                          </select>
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

                        {u.role === 'reporter' && (
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
    </div>
  );
}
