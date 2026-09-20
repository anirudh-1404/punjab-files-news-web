import React, { useState, useEffect } from 'react';
import { articleAPI, userAPI, breakingAPI } from '../../../services/api';

export default function OverviewStatsView({ user, onNavigate }) {
  const [stats, setStats] = useState({
    publishedCount: 0,
    pendingCount: 0,
    breakingCount: 0,
    usersCount: 0,
    totalViews: 0
  });
  const [readersChoice, setReadersChoice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [articlesRes, pendingRes, breakingRes, readersRes] = await Promise.all([
          articleAPI.getPublished({ limit: 100 }),
          user?.role !== 'reporter' ? articleAPI.getPendingArticles() : Promise.resolve({ count: 0 }),
          breakingAPI.getBreaking(),
          articleAPI.getReadersChoice()
        ]);

        let usersCount = 0;
        if (user?.role === 'admin') {
          try {
            const usersRes = await userAPI.getUsers();
            usersCount = usersRes.count || 0;
          } catch {
            usersCount = 0;
          }
        }

        const totalViews = (articlesRes.articles || []).reduce((acc, a) => acc + (a.views || 0), 0);

        setStats({
          publishedCount: articlesRes.total || (articlesRes.articles ? articlesRes.articles.length : 0),
          pendingCount: pendingRes.count || 0,
          breakingCount: breakingRes.count || 0,
          usersCount,
          totalViews
        });
        setReadersChoice(readersRes.data || readersRes.articles || []);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  const cards = [
    {
      title: 'ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਖ਼ਬਰਾਂ',
      sub: 'Live Published Articles',
      value: stats.publishedCount,
      icon: 'fa-newspaper-o',
      bg: '#ffffff',
      color: '#b71c1c'
    },
    {
      title: 'ਸਮੀਖਿਆ ਅਧੀਨ ਖ਼ਬਰਾਂ',
      sub: 'Pending Editorial Reviews',
      value: stats.pendingCount,
      icon: 'fa-clock-o',
      bg: stats.pendingCount > 0 ? '#fffbeb' : '#ffffff',
      color: stats.pendingCount > 0 ? '#d97706' : '#64748b'
    },
    {
      title: 'ਸਰਗਰਮ ਬਰੇਕਿੰਗ ਅਲਰਟ',
      sub: 'Active Breaking Tickers',
      value: stats.breakingCount,
      icon: 'fa-bolt',
      bg: '#ffffff',
      color: '#b71c1c'
    },
    {
      title: 'ਕੁੱਲ ਪਾਠਕ ਵਿਊਜ਼',
      sub: 'Total Article Views',
      value: stats.totalViews.toLocaleString('en-IN'),
      icon: 'fa-eye',
      bg: '#ffffff',
      color: '#1e293b'
    }
  ];

  if (user?.role === 'admin') {
    cards.push({
      title: 'ਕੁੱਲ ਸਟਾਫ਼ ਮੈਂਬਰ',
      sub: 'Registered Staff (Reporters & Editors)',
      value: stats.usersCount,
      icon: 'fa-users',
      bg: '#ffffff',
      color: '#047857'
    });
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '14px', marginBottom: '22px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
          ਨਿਊਜ਼ਰੂਮ ਓਵਰਵਿਊ (Newsroom Overview & Performance)
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
          ਪੰਜਾਬ ਫਾਈਲਜ਼ ਪੋਰਟਲ ਦਾ ਰੀਅਲ-ਟਾਈਮ ਡਾਟਾ ਅਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਸੰਖੇਪ।
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '25px' }}>
            {cards.map((c, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: c.bg,
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '18px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                    {c.title}
                  </span>
                  <i className={`fa ${c.icon}`} style={{ fontSize: '18px', color: c.color }}></i>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: c.color, margin: '2px 0' }}>
                  {c.value}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginRight: '6px' }}>
              ਤੇਜ਼ ਕਾਰਵਾਈਆਂ (Quick Actions):
            </span>

            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('all_news')}
                style={{
                  backgroundColor: '#b71c1c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-newspaper-o"></i> ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ (All News & Categories)
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('users')}
                style={{
                  backgroundColor: '#1c2d5a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-users"></i> ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ (Staff Management)
              </button>
            )}

            {['admin', 'editor'].includes(user?.role) && (
              <button
                type="button"
                onClick={() => onNavigate('review')}
                style={{
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-clock-o"></i> {user?.role === 'admin' ? 'ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਡੈਸਕ' : 'ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਡੈਸਕ'} {stats.pendingCount > 0 ? `(${stats.pendingCount})` : ''}
              </button>
            )}

            {['admin', 'editor'].includes(user?.role) && (
              <button
                type="button"
                onClick={() => onNavigate('breaking')}
                style={{
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-bolt"></i> ਬਰੇਕਿੰਗ ਨਿਊਜ਼ (Breaking News)
              </button>
            )}

            {['admin', 'editor'].includes(user?.role) && (
              <button
                type="button"
                onClick={() => onNavigate('mukhwak')}
                style={{
                  backgroundColor: '#b45309',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-book"></i> ਮੁੱਖ ਵਾਕ (Hukamnama)
              </button>
            )}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa fa-external-link"></i> ਲਾਈਵ ਵੈੱਬਸਾਈਟ ਦੇਖੋ
            </a>
          </div>

          {/* ========================================================= */}
          {/* READERS' CHOICE TOP 10 LEADERBOARD SECTION */}
          {/* ========================================================= */}
          <div style={{ marginTop: '28px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Section Header */}
            <div style={{ padding: '16px 20px', borderBottom: '2px solid #b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', backgroundColor: '#f8fafc' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    <i className="fa fa-fire"></i>
                  </span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                    ਪਾਠਕਾਂ ਦੀ ਪਸੰਦ (Readers' Choice — Top 10 Most-Read Articles)
                  </h4>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                  ਵੈੱਬਸਾਈਟ 'ਤੇ ਸਭ ਤੋਂ ਵੱਧ ਵਿਊਜ਼ ਪ੍ਰਾਪਤ ਕਰਨ ਵਾਲੀਆਂ ਪ੍ਰਮੁੱਖ ਖ਼ਬਰਾਂ (Highest Views Leaderboard)।
                </p>
              </div>

              {user?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => onNavigate('all_news')}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#b71c1c',
                    border: '1px solid #fca5a5',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਦੇਖੋ</span>
                  <i className="fa fa-arrow-right"></i>
                </button>
              )}
            </div>

            {/* Leaderboard Table */}
            {readersChoice.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                ਅਜੇ ਤੱਕ ਕੋਈ ਲਾਈਵ ਖ਼ਬਰਾਂ ਦਾ ਵਿਊਜ਼ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                      <th style={{ padding: '10px 14px', width: '60px', fontWeight: '800', textAlign: 'center' }}>ਰੈਂਕ</th>
                      <th style={{ padding: '10px 14px', fontWeight: '800' }}>ਖ਼ਬਰ ਦਾ ਸਿਰਲੇਖ</th>
                      <th style={{ padding: '10px 12px', fontWeight: '800' }}>ਕੈਟੇਗਰੀ</th>
                      <th style={{ padding: '10px 12px', fontWeight: '800' }}>ਭਾਸ਼ਾ</th>
                      <th style={{ padding: '10px 12px', fontWeight: '800' }}>ਪੱਤਰਕਾਰ</th>
                      <th style={{ padding: '10px 14px', fontWeight: '800', textAlign: 'center' }}>ਪਾਠਕ ਵਿਊਜ਼</th>
                      <th style={{ padding: '10px 14px', fontWeight: '800', textAlign: 'right' }}>ਵੇਖੋ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readersChoice.map((art, idx) => {
                      const rank = idx + 1;
                      let badgeStyle = {
                        bg: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b'
                      };
                      if (rank === 1) {
                        badgeStyle = {
                          bg: '#fef3c7',
                          border: '1.5px solid #f59e0b',
                          color: '#b45309',
                          boxShadow: '0 1px 3px rgba(245, 158, 11, 0.25)'
                        };
                      } else if (rank === 2) {
                        badgeStyle = {
                          bg: '#f1f5f9',
                          border: '1.5px solid #94a3b8',
                          color: '#1e293b'
                        };
                      } else if (rank === 3) {
                        badgeStyle = {
                          bg: '#ffedd5',
                          border: '1.5px solid #fb923c',
                          color: '#c2410c'
                        };
                      }

                      return (
                        <tr key={art._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                          {/* Rank (Symmetrical Circle Badge) */}
                          <td style={{ padding: '10px 14px', textAlign: 'center', width: '60px', verticalAlign: 'middle' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                borderRadius: '50%',
                                backgroundColor: badgeStyle.bg,
                                border: badgeStyle.border,
                                color: badgeStyle.color,
                                fontSize: '12.5px',
                                fontWeight: '800',
                                lineHeight: 1,
                                boxShadow: badgeStyle.boxShadow || 'none'
                              }}
                            >
                              #{rank}
                            </span>
                          </td>

                          {/* Title */}
                          <td style={{ padding: '10px 14px', maxWidth: '380px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <img
                                src={art.featuredImage || '/img/index_800x400-image01.jpg'}
                                alt=""
                                onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
                                style={{ width: '44px', height: '32px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                              />
                              <a
                                href={`/news/${art.slug || art._id}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', lineHeight: 1.3, textDecoration: 'none', cursor: 'pointer' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#b71c1c'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                              >
                                {art.title}
                              </a>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span style={{ backgroundColor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                              {art.category === 'punjab' ? 'ਪੰਜਾਬ' : art.category === 'religion' ? 'ਧਰਮ' : art.category === 'sports' ? 'ਖੇਡਾਂ' : art.category === 'national' ? 'ਦੇਸ਼-ਵਿਦੇਸ਼' : art.category || 'ਆਮ'}
                            </span>
                          </td>

                          {/* Language */}
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: '800', color: art.language === 'en' ? '#4338ca' : art.language === 'hi' ? '#c2410c' : '#b71c1c' }}>
                              {art.language === 'en' ? 'English' : art.language === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
                            </span>
                          </td>

                          {/* Author */}
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: '#475569', fontSize: '12px' }}>
                            {art.authorName || art.author?.name || 'ਪੱਤਰਕਾਰ'}
                          </td>

                          {/* Views */}
                          <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{ backgroundColor: '#fee2e2', color: '#b71c1c', padding: '3px 9px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fa fa-fire" style={{ color: '#e11d48' }}></i>
                              {(art.views || 0).toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <a
                              href={`/news/${art.slug || art._id}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#1e293b',
                                border: '1px solid #cbd5e1',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>ਵੇਖੋ</span>
                              <i className="fa fa-external-link"></i>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
