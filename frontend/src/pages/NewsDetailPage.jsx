import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { getArticleById, incrementArticleViews, getRelatedArticles } from '../services/articleStore';
import { formatArticleDate, formatArticleTime } from '../services/dateUtils';
import { getHighResImageUrl } from '../services/imageUtils';
import AdBanner from '../components/Common/AdBanner';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function fetchArticle() {
      setLoading(true);
      try {
        // 1. Try Backend API first (handles MongoDB _id or Gurmukhi/URL slug)
        const res = await articleAPI.getBySlug(id);
        if (isMounted && res && res.data) {
          const apiArt = res.data;
          let pubDate = 'ਅੱਜ';
          let pubTime = 'ਹੁਣੇ';
          if (apiArt.publishedAt || apiArt.createdAt) {
            const rawDate = apiArt.publishedAt || apiArt.createdAt;
            pubDate = formatArticleDate(rawDate, apiArt.language || 'pa');
            pubTime = formatArticleTime(rawDate);
          }

          // Seamlessly update browser address bar to clean English URL if needed
          if (apiArt.slug) {
            try {
              const currentPath = decodeURIComponent(window.location.pathname);
              const expectedPath = `/news/${apiArt.slug}`;
              if (currentPath !== expectedPath) {
                window.history.replaceState(null, '', expectedPath);
              }
            } catch {}
          }

          setArticle({
            id: apiArt.slug || apiArt._id,
            slug: apiArt.slug || apiArt._id,
            _id: apiArt._id,
            title: apiArt.title,
            category: apiArt.category,
            punjabRegion: apiArt.punjabRegion,
            content: apiArt.content,
            excerpt: apiArt.excerpt,
            author: apiArt.authorName || 'ਸੰਪਾਦਕੀ ਡੈਸਕ',
            publicationDate: pubDate,
            publicationTime: pubTime,
            views: apiArt.views || 1,
            featuredImage: apiArt.featuredImage || '/img/index_800x400-image01.jpg',
            mediaType: apiArt.mediaType || (apiArt.videoUrl ? 'video' : 'image'),
            videoUrl: apiArt.videoUrl || null,
            isBreaking: apiArt.isBreaking,
            seoTitle: apiArt.seoTitle || null,
            metaDescription: apiArt.metaDescription || null
          });

          // Fetch related articles from backend (strictly other articles in the same category)
          try {
            const relRes = await articleAPI.getPublished({ category: apiArt.category, limit: 10 });
            const currentMongoId = String(apiArt._id || '').trim();
            const currentSlug = String(apiArt.slug || '').trim().toLowerCase();
            const currentTitle = String(apiArt.title || '').trim().toLowerCase();
            const currentIdParam = String(id || '').trim().toLowerCase();

            let filteredRel = [];
            if (relRes && Array.isArray(relRes.data)) {
              filteredRel = relRes.data
                .filter(item => {
                  const itemMongoId = String(item._id || '').trim();
                  const itemSlug = String(item.slug || '').trim().toLowerCase();
                  const itemTitle = String(item.title || '').trim().toLowerCase();

                  // Strictly exclude current article
                  if (currentMongoId && itemMongoId === currentMongoId) return false;
                  if (currentSlug && itemSlug === currentSlug) return false;
                  if (currentTitle && itemTitle === currentTitle) return false;
                  if (currentIdParam && (itemSlug === currentIdParam || itemMongoId === currentIdParam)) return false;
                  return true;
                })
                .slice(0, 3)
                .map(item => ({
                  id: item.slug || item._id,
                  title: item.title,
                  category: item.category,
                  featuredImage: item.featuredImage || '/img/index_800x400-image01.jpg'
                }));
            }

            if (isMounted) {
              if (filteredRel.length > 0) {
                setRelated(filteredRel);
              } else {
                const localRel = getRelatedArticles(id, apiArt.category, 3, currentTitle, currentSlug, currentMongoId);
                setRelated(localRel);
              }
            }
          } catch {
            if (isMounted) {
              const localRel = getRelatedArticles(id, apiArt.category, 3, apiArt.title, apiArt.slug, apiArt._id);
              setRelated(localRel);
            }
          }

          setLoading(false);
          return;
        }
      } catch (err) {
        // Backend lookup had no match, fallback to local store
      }

      // 2. Fallback to local store
      const found = getArticleById(id);
      if (isMounted && found) {
        if (found.slug) {
          try {
            const currentPath = decodeURIComponent(window.location.pathname);
            const expectedPath = `/news/${found.slug}`;
            if (currentPath !== expectedPath) {
              window.history.replaceState(null, '', expectedPath);
            }
          } catch {}
        }
        setArticle(found);
        incrementArticleViews(found.id);
        const rel = getRelatedArticles(found.id || found.slug || id, found.category, 3, found.title, found.slug, found._id);
        setRelated(rel);
      }
      if (isMounted) setLoading(false);
    }

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Dynamic Open Graph, Twitter Cards, and SEO Meta Tags for Social Media Previews
  useEffect(() => {
    if (!article) return;

    const originalTitle = document.title;
    // SEO Title: use custom seoTitle if set, otherwise fallback to article title
    const effectiveSeoTitle = article.seoTitle
      ? article.seoTitle
      : `${article.title} | ਪੰਜਾਬ ਫਾਈਲਜ਼ (Punjab Files)`;
    document.title = effectiveSeoTitle;

    // Meta Description: use custom metaDescription if set, otherwise fallback to excerpt or content snippet
    const effectiveDesc = article.metaDescription
      || article.excerpt
      || (article.content ? article.content.slice(0, 160) : '')
      || article.title;

    const appliedTags = [];
    const setOrUpdateMeta = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      let created = false;
      let prevContent = null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
        created = true;
      } else {
        prevContent = el.getAttribute('content');
      }
      el.setAttribute('content', content);
      appliedTags.push({ el, created, prevContent, attrName, attrValue });
    };

    const currentUrl = window.location.href;
    const desc = article.excerpt || (article.content ? article.content.slice(0, 160) : '') || article.title;
    let imgUrl = article.featuredImage || '/img/index_800x400-image01.jpg';
    if (imgUrl.includes('res.cloudinary.com') && imgUrl.includes('/image/upload/')) {
      const uploadIdx = imgUrl.indexOf('/image/upload/');
      const prefix = imgUrl.substring(0, uploadIdx + '/image/upload/'.length);
      let suffix = imgUrl.substring(uploadIdx + '/image/upload/'.length);
      suffix = suffix.replace(/^(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9:]+,?|f_[a-z0-9]+,?|dpr_[a-z0-9.]+,?)+\//i, '');
      imgUrl = `${prefix}c_fill,w_1200,h_630,g_auto,f_jpg,q_auto:best/${suffix}`;
    } else if (imgUrl.startsWith('/')) {
      imgUrl = `${window.location.origin}${imgUrl}`;
    }

    // Standard SEO
    setOrUpdateMeta('name', 'description', effectiveDesc);

    // OpenGraph (Facebook, WhatsApp, LinkedIn)
    setOrUpdateMeta('property', 'og:type', 'article');
    setOrUpdateMeta('property', 'og:site_name', 'Punjab Files');
    setOrUpdateMeta('property', 'og:title', article.title);
    setOrUpdateMeta('property', 'og:description', desc);
    setOrUpdateMeta('property', 'og:url', currentUrl);
    setOrUpdateMeta('property', 'og:image', imgUrl);
    setOrUpdateMeta('property', 'og:image:secure_url', imgUrl);
    setOrUpdateMeta('property', 'og:image:width', '1200');
    setOrUpdateMeta('property', 'og:image:height', '630');
    setOrUpdateMeta('property', 'og:image:type', 'image/jpeg');
    setOrUpdateMeta('property', 'og:image:alt', article.title);

    // Twitter / X Card
    setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
    setOrUpdateMeta('name', 'twitter:title', article.title);
    setOrUpdateMeta('name', 'twitter:description', desc);
    setOrUpdateMeta('name', 'twitter:image', imgUrl);

    return () => {
      document.title = originalTitle;
      appliedTags.forEach(({ el, created, prevContent }) => {
        if (created) {
          if (el.parentNode) el.parentNode.removeChild(el);
        } else if (prevContent !== null) {
          el.setAttribute('content', prevContent);
        }
      });
    };
  }, [article]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '90px 15px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #b71c1c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }}></div>
        <h4 style={{ color: '#000000', fontWeight: '800', fontFamily: "'Mukta Mahee', sans-serif" }}>ਖ਼ਬਰ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...</h4>
      </div>
    );
  }

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

  const articleKey = article.slug || article._id || id;
  const shareUrl = `${window.location.origin}/news/${articleKey}`;
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

        {/* Top Article Ad Banner */}
        <AdBanner slot="article_top_banner" containerStyle={{ marginBottom: '20px' }} />

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

              {/* Featured Media (Photo or Video Player) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  backgroundColor: '#000'
                }}
              >
                {article.videoUrl || article.mediaType === 'video' ? (
                  <video
                    controls
                    playsInline
                    src={article.videoUrl || article.featuredImage}
                    poster={article.featuredImage && !article.featuredImage.endsWith('.mp4') ? article.featuredImage : undefined}
                    style={{ width: '100%', maxHeight: '480px', display: 'block', backgroundColor: '#000000' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={getHighResImageUrl(article.featuredImage)}
                    alt={article.title}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '620px',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                      imageRendering: '-webkit-optimize-contrast',
                      backgroundColor: '#0a0f1d'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/index_800x400-image01.jpg';
                    }}
                  />
                )}
              </div>

              {/* Full Article Content */}
              <div
                className="article-body-text article-rich-content"
                style={{
                  fontSize: '16.5px',
                  lineHeight: '1.8',
                  color: '#111111',
                  fontWeight: '500',
                  fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
                }}
              >
                {article.content && /<[a-z][\s\S]*>/i.test(article.content) ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  (article.content || '').split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ marginBottom: '18px', textAlign: 'justify' }}>
                      {paragraph}
                    </p>
                  ))
                )}
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
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <i className="fa fa-whatsapp" style={{ fontSize: '15px' }}></i> WhatsApp
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#1877F2',
                      color: '#ffffff',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <i className="fa fa-facebook" style={{ fontSize: '15px' }}></i> Facebook
                  </a>

                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <i className="fa fa-twitter" style={{ fontSize: '14px' }}></i> X / Twitter
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#229ED9',
                      color: '#ffffff',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <i className="fa fa-paper-plane" style={{ fontSize: '13px' }}></i> Telegram
                  </a>

                  {/* Dedicated Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      backgroundColor: copied ? '#15803d' : '#334155',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                    title="ਲਿੰਕ ਕਾਪੀ ਕਰੋ"
                  >
                    <i className={copied ? "fa fa-check" : "fa fa-link"} style={{ fontSize: '14px' }}></i>
                    <span>{copied ? 'ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ!' : 'ਲਿੰਕ ਕਾਪੀ ਕਰੋ'}</span>
                  </button>

                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#FF0000',
                      color: '#ffffff',
                      padding: '6px 13px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <i className="fa fa-youtube-play" style={{ fontSize: '15px' }}></i> YouTube
                  </a>
                </div>
              </div>
            </article>

            {/* Bottom Article Ad Banner */}
            <AdBanner
              slot="article_bottom_banner"
              containerStyle={{ marginTop: '25px', marginBottom: '10px' }}
            />

            {/* ========================================================
                ALSO READ / RELATED NEWS (ਸੰਬੰਧਿਤ ਖ਼ਬਰਾਂ)
            ======================================================== */}
            {(() => {
              const displayRelated = (related || []).filter((relItem) => {
                if (!article) return false;
                const curId = String(article.id || '').trim().toLowerCase();
                const curSlug = String(article.slug || '').trim().toLowerCase();
                const curMongoId = String(article._id || '').trim().toLowerCase();
                const curTitle = String(article.title || '').trim().toLowerCase();
                const urlId = String(id || '').trim().toLowerCase();

                const relId = String(relItem.id || relItem.slug || '').trim().toLowerCase();
                const relTitle = String(relItem.title || '').trim().toLowerCase();

                if (relId && (relId === curId || relId === curSlug || relId === curMongoId || relId === urlId)) {
                  return false;
                }
                if (relTitle && curTitle && relTitle === curTitle) {
                  return false;
                }
                return true;
              });

              if (displayRelated.length === 0) return null;

              return (
                <div style={{ marginTop: '35px' }}>
                  <div className="module-title" style={{ marginBottom: '18px' }}>
                    <h3 className="title">
                      <span className="bg-1" style={{ backgroundColor: '#1c2d5a' }}>ਇਹ ਵੀ ਪੜ੍ਹੋ (Also Read)</span>
                    </h3>
                    <h3 className="subtitle">ਇਸੇ ਵਿਸ਼ੇ ਨਾਲ ਸੰਬੰਧਿਤ ਹੋਰ ਅਹਿਮ ਖ਼ਬਰਾਂ</h3>
                  </div>

                  <div className="row">
                    {displayRelated.map((relItem) => (
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
              );
            })()}
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
                  src="https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=0"
                  title="Live TV Stream"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              </div>
            </div>

            {/* Sidebar Ad Banner (300x250 Rectangle) */}
            <AdBanner
              slot="sidebar_rectangle"
              containerStyle={{ marginBottom: '25px' }}
            />

            {/* Editor's Desk Contact */}
            <div
              className="editors-desk-contact"
              style={{
                backgroundColor: '#1c2d5a',
                borderRadius: '8px',
                padding: '22px 20px',
                marginBottom: '25px',
                boxShadow: '0 4px 14px rgba(28, 45, 90, 0.25)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h4
                className="editors-desk-title"
                style={{
                  margin: '0 0 10px',
                  fontSize: '17px',
                  fontWeight: '800',
                  color: '#ffffff'
                }}
              >
                ਖ਼ਬਰਾਂ ਭੇਜੋ ਜਾਂ ਸੰਪਰਕ ਕਰੋ
              </h4>
              <p
                className="editors-desk-desc"
                style={{
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#f1f5f9',
                  margin: '0 0 16px'
                }}
              >
                ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਜ਼ਮੀਨੀ ਖ਼ਬਰ ਜਾਂ ਜਾਣਕਾਰੀ ਹੈ ਤਾਂ ਸਾਡੀ ਸੰਪਾਦਕੀ ਟੀਮ ਨਾਲ ਸਾਂਝੀ ਕਰੋ।
              </p>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ebb10d',
                  color: '#0f172a',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <span>ਸੰਪਰਕ ਫ਼ਾਰਮ ਭਰੋ</span> <i className="fa fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
