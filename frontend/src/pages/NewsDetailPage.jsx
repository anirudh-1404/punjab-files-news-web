import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, incrementArticleViews, getRelatedArticles } from '../services/articleStore';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = getArticleById(id);
    if (found) {
      setArticle(found);
      incrementArticleViews(found.id);
      const rel = getRelatedArticles(found.id, found.category, 3);
      setRelated(rel);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="container" style={{ padding: '80px 15px', textAlign: 'center' }}>
        <h2 style={{ color: '#000000', fontWeight: '800' }}>ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ (Article Not Found)</h2>
        <p style={{ color: '#111111', margin: '15px 0 25px' }}>ਜਿਹੜੀ ਖ਼ਬਰ ਤੁਸੀਂ ਲੱਭ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਹੈ ਜਾਂ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ।</p>
        <Link
          to="/"
          style={{
            backgroundColor: '#b71c1c',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '700'
          }}
        >
          <i className="fa fa-home" style={{ marginRight: '6px' }}></i> ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਵਾਪਸ ਜਾਓ
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="news-detail-page" style={{ backgroundColor: '#f8fafc', padding: '25px 0 50px' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-wrapper" style={{ marginBottom: '16px', fontSize: '12.5px', color: '#1e293b' }}>
          <Link to="/" style={{ color: '#1c2d5a', textDecoration: 'none', fontWeight: '700' }}>
            ਮੁੱਖ ਪੰਨਾ
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#b71c1c', fontWeight: '700', textTransform: 'capitalize' }}>
            {article.category === 'punjab' ? `ਪੰਜਾਬ (${article.punjabRegion || 'ਸਾਰਾ ਪੰਜਾਬ'})` : article.category}
          </span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#111111', fontWeight: '600' }}>{article.title.substring(0, 35)}...</span>
        </div>

        <div className="row">
          {/* Main Article Column (col-md-8) */}
          <div className="col-md-8 col-sm-12">
            <article
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '24px 28px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {/* Category & Region Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    textTransform: 'uppercase'
                  }}
                >
                  {article.category === 'punjab' ? 'ਪੰਜਾਬ ਵਿਸ਼ੇਸ਼' : article.category}
                </span>
                {article.punjabRegion && (
                  <span
                    style={{
                      backgroundColor: '#ebb10d',
                      color: '#111317',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '3px'
                    }}
                  >
                    {article.punjabRegion.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Major Bold Black Headline */}
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#000000',
                  lineHeight: '1.35',
                  margin: '0 0 16px',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
              >
                {article.title}
              </h1>

              {/* Author & Timestamp Meta Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  padding: '12px 0',
                  borderTop: '1px solid #edf2f7',
                  borderBottom: '1px solid #edf2f7',
                  marginBottom: '22px',
                  fontSize: '12.5px',
                  color: '#1e293b',
                  fontWeight: '600'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa fa-user" style={{ color: '#1c2d5a' }}></i>
                  <span>ਲਿਖਾਰੀ / ਪੱਤਰਕਾਰ: <strong style={{ color: '#000000' }}>{article.author}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa fa-calendar" style={{ color: '#b71c1c' }}></i>
                  <span>ਤਾਰੀਖ: <strong style={{ color: '#000000' }}>{article.publicationDate}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa fa-clock-o" style={{ color: '#ebb10d' }}></i>
                  <span>ਸਮਾਂ: <strong style={{ color: '#000000' }}>{article.publicationTime}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <i className="fa fa-eye" style={{ color: '#1e293b' }}></i>
                  <span>{article.views?.toLocaleString() || 1} ਪਾਠਕ</span>
                </div>
              </div>

              {/* Featured Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxHeight: '440px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  backgroundColor: '#000'
                }}
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  style={{ width: '100%', maxHeight: '440px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/index_800x400-image01.jpg';
                  }}
                />
              </div>

              {/* Full Article Content */}
              <div
                className="article-body-text"
                style={{
                  fontSize: '16.5px',
                  lineHeight: '1.8',
                  color: '#111111',
                  fontWeight: '500',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
              >
                {article.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} style={{ marginBottom: '18px', textAlign: 'justify' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* ========================================================
                  SOCIAL MEDIA SHARING (WhatsApp, FB, X, Insta, YouTube)
              ======================================================== */}
              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '2px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-share-alt" style={{ color: '#b71c1c', fontSize: '16px' }}></i>
                  <strong style={{ fontSize: '13.5px', color: '#000000' }}>ਇਸ ਖ਼ਬਰ ਨੂੰ ਸ਼ੇਅਰ ਕਰੋ:</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
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
                    <i className="fa fa-whatsapp" style={{ fontSize: '14px' }}></i> WhatsApp
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#1877F2',
                      color: '#ffffff',
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
                    <i className="fa fa-facebook" style={{ fontSize: '14px' }}></i> Facebook
                  </a>

                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
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
                    <i className="fa fa-twitter" style={{ fontSize: '14px' }}></i> X / Twitter
                  </a>

                  {/* Copy Link / Instagram */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      backgroundColor: '#E1306C',
                      color: '#ffffff',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fa fa-instagram" style={{ fontSize: '14px' }}></i> {copied ? 'ਕਾਪੀ ਹੋ ਗਿਆ!' : 'Instagram'}
                  </button>

                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#FF0000',
                      color: '#ffffff',
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
                    <i className="fa fa-youtube" style={{ fontSize: '14px' }}></i> YouTube
                  </a>
                </div>
              </div>
            </article>

            {/* ========================================================
                ALSO READ / RELATED NEWS (ਸੰਬੰਧਿਤ ਖ਼ਬਰਾਂ)
            ======================================================== */}
            {related && related.length > 0 && (
              <div style={{ marginTop: '35px' }}>
                <div className="module-title" style={{ marginBottom: '18px' }}>
                  <h3 className="title">
                    <span className="bg-1" style={{ backgroundColor: '#1c2d5a' }}>ਇਹ ਵੀ ਪੜ੍ਹੋ (Also Read)</span>
                  </h3>
                  <h3 className="subtitle">ਇਸੇ ਵਿਸ਼ੇ ਨਾਲ ਸੰਬੰਧਿਤ ਹੋਰ ਅਹਿਮ ਖ਼ਬਰਾਂ</h3>
                </div>

                <div className="row">
                  {related.map((relItem) => (
                    <div className="col-sm-4 col-xs-12" key={relItem.id} style={{ marginBottom: '15px' }}>
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ width: '100%', height: '125px', overflow: 'hidden', backgroundColor: '#edf2f7' }}>
                          <Link to={`/news/${relItem.id}`}>
                            <img
                              src={relItem.featuredImage}
                              alt={relItem.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </Link>
                        </div>
                        <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: '#b71c1c', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                            {relItem.category}
                          </span>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: '12.5px',
                              fontWeight: '800',
                              lineHeight: '1.35',
                              color: '#000000',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            <Link to={`/news/${relItem.id}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: '800' }}>
                              {relItem.title}
                            </Link>
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (col-md-4) */}
          <div className="col-md-4 col-sm-12">
            {/* Live TV Widget in sidebar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #b71c1c', paddingBottom: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#000000' }}>
                  <i className="fa fa-television" style={{ color: '#b71c1c', marginRight: '6px' }}></i> ਲਾਈਵ ਟੀਵੀ (Live Stream)
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff', backgroundColor: '#b71c1c', padding: '2px 6px', borderRadius: '3px' }}>
                  ON AIR
                </span>
              </div>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '4px', backgroundColor: '#000' }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/KMWcefrAKLg?autoplay=0"
                  title="Live TV Stream"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              </div>
            </div>

            {/* Editor's Desk Contact */}
            <div
              style={{
                backgroundColor: '#1c2d5a',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '20px',
                marginBottom: '25px'
              }}
            >
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: '#ebb10d' }}>
                ਖ਼ਬਰਾਂ ਭੇਜੋ ਜਾਂ ਸੰਪਰਕ ਕਰੋ
              </h4>
              <p style={{ fontSize: '12.5px', lineHeight: '1.5', color: '#e2e8f0', margin: '0 0 14px' }}>
                ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਜ਼ਮੀਨੀ ਖ਼ਬਰ ਜਾਂ ਜਾਣਕਾਰੀ ਹੈ ਤਾਂ ਸਾਡੀ ਸੰਪਾਦਕੀ ਟੀਮ ਨਾਲ ਸਾਂਝੀ ਕਰੋ।
              </p>
              <Link
                to="/contact"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ebb10d',
                  color: '#111317',
                  padding: '6px 14px',
                  borderRadius: '3px',
                  fontWeight: '800',
                  fontSize: '12px',
                  textDecoration: 'none'
                }}
              >
                ਸੰਪਰਕ ਫਾਰਮ ਭਰੋ <i className="fa fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
