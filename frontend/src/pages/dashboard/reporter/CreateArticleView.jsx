import React, { useState, useEffect } from 'react';
import { articleAPI, uploadAPI, categoryAPI } from '../../../services/api';
import { createNewArticle } from '../../../services/articleStore';
import { transliterateGurmukhiToEnglish } from '../../../services/slugUtils';

const LANG_OPTIONS = [
  { key: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', desc: 'ਗੁਰਮੁਖੀ ਲਿੱਪੀ ਵਿੱਚ ਖ਼ਬਰ ਲਿਖੋ', flag: '🇮🇳' },
  { key: 'hi', label: 'हिंदी (Hindi)', desc: 'देवनागरी लिपि में समाचार लिखें', flag: '🇮🇳' },
  { key: 'en', label: 'English', desc: 'Write article in English language', flag: '🇬🇧' }
];

const LANG_CONFIG = {
  pa: {
    titleLabel: 'ਖ਼ਬਰ ਦਾ ਸਿਰਲੇਖ (Article Headline / Title in Punjabi)',
    titlePlaceholder: 'ਇੱਥੇ ਪੰਜਾਬੀ ਵਿੱਚ ਮੁੱਖ ਸਿਰਲੇਖ ਲਿਖੋ...',
    excerptLabel: 'ਸੰਖੇਪ ਵੇਰਵਾ (Short Excerpt - 1-2 lines for card summary)',
    excerptPlaceholder: 'ਇਸ ਖ਼ਬਰ ਦੀ ਮੁੱਖ ਲਾਈਨ ਜੋ ਕਾਰਡ ਉੱਤੇ ਨਜ਼ਰ ਆਵੇਗੀ...',
    contentLabel: 'ਪੂਰਾ ਵੇਰਵਾ (Full Article Body in Punjabi)',
    contentPlaceholder: 'ਖ਼ਬਰ ਦੀ ਪੂਰੀ ਡਿਟੇਲ ਇੱਥੇ ਲਿਖੋ...',
    hint: 'ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਖ਼ਬਰ ਲਿਖ ਰਹੇ ਹੋ। ਸਿਰਲੇਖ ਅਤੇ ਵੇਰਵਾ ਗੁਰਮੁਖੀ ਵਿੱਚ ਦਰਜ ਕਰੋ।'
  },
  hi: {
    titleLabel: 'समाचार का शीर्षक (Article Headline / Title in Hindi)',
    titlePlaceholder: 'यहाँ हिंदी में मुख्य समाचार शीर्षक लिखें...',
    excerptLabel: 'संक्षिप्त विवरण (Short Excerpt - 1-2 पंक्तियाँ)',
    excerptPlaceholder: 'इस खबर का संक्षिप्त सार यहाँ लिखें...',
    contentLabel: 'विस्तृत समाचार विवरण (Full Article Body in Hindi)',
    contentPlaceholder: 'खबर का पूरा विस्तृत विवरण यहाँ लिखें...',
    hint: 'आप हिंदी में समाचार लिख रहे हैं। शीर्षक और विवरण देवनागरी लिपि में दर्ज करें।'
  },
  en: {
    titleLabel: 'Article Headline / Title (English)',
    titlePlaceholder: 'Enter main English headline here...',
    excerptLabel: 'Short Summary / Excerpt (1-2 lines for card preview)',
    excerptPlaceholder: 'Enter a concise 1-2 line summary of the article...',
    contentLabel: 'Full Article Content (English)',
    contentPlaceholder: 'Write the complete news article details here...',
    hint: 'You are writing this news article in English. Enter headline and body in English.'
  }
};

export default function CreateArticleView({ user, onArticleCreated }) {
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('punjab');
  const [categories, setCategories] = useState([]);
  const [punjabRegion, setPunjabRegion] = useState('majha');
  const [language, setLanguage] = useState('pa');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [featuredImage, setFeaturedImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Load active categories dynamically
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (isMounted && res && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error('Error fetching categories in CreateArticleView:', e);
      }
    };
    loadCategories();
    window.addEventListener('punjab_categories_updated', loadCategories);
    return () => {
      isMounted = false;
      window.removeEventListener('punjab_categories_updated', loadCategories);
    };
  }, []);

  const currentLang = LANG_CONFIG[language] || LANG_CONFIG.pa;

  const handleMediaFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    const isImg = file.type.startsWith('image/');

    if (!isVid && !isImg) {
      setUploadError('ਸਿਰਫ਼ ਫ਼ੋਟੋਆਂ (JPG, PNG, WEBP, GIF) ਜਾਂ ਵੀਡੀਓਜ਼ (MP4, WEBM, MOV) ਹੀ ਅਪਲੋਡ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।');
      return;
    }

    if (isVid && file.size > 100 * 1024 * 1024) {
      setUploadError('ਵੀਡੀਓ ਦਾ ਸਾਈਜ਼ 100MB ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।');
      return;
    }
    if (isImg && file.size > 15 * 1024 * 1024) {
      setUploadError('ਫ਼ੋਟੋ ਦਾ ਸਾਈਜ਼ 15MB ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।');
      return;
    }

    setUploadError('');
    setUploadingMedia(true);

    try {
      const res = await uploadAPI.uploadMedia(file);
      if (res && res.url) {
        if (isVid || res.mediaType === 'video') {
          setVideoUrl(res.url);
          setMediaType('video');
        } else {
          setFeaturedImage(res.url);
          setMediaType('image');
        }
      }
    } catch (err) {
      setUploadError(err.message || 'ਮੀਡੀਆ ਅਪਲੋਡ ਕਰਨ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ। ਕਲਾਊਡੀਨਰੀ ਅਕਾਊਂਟ ਜਾਂ ਕੁੰਜੀਆਂ ਦੀ ਜਾਂਚ ਕਰੋ।');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setFeedback({
        type: 'error',
        message: 'ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਲੇਖ ਅਤੇ ਖ਼ਬਰ ਦਾ ਵੇਰਵਾ ਲਾਜ਼ਮੀ ਦਰਜ ਕਰੋ (Title and Content are required).'
      });
      return;
    }

    if (mediaType === 'image' && !featuredImage.trim()) {
      setFeedback({
        type: 'error',
        message: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਸਿਸਟਮ ਵਿੱਚੋਂ ਖ਼ਬਰ ਲਈ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ (Please upload an image for the article).'
      });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });

      const res = await articleAPI.createArticle({
        title: title.trim(),
        slug: customSlug.trim() ? customSlug.trim() : undefined,
        content: content.trim(),
        excerpt: excerpt.trim(),
        category,
        punjabRegion: category === 'punjab' ? punjabRegion : null,
        language,
        featuredImage,
        mediaType,
        videoUrl: mediaType === 'video' ? videoUrl : null,
        isBreaking,
        seoTitle: seoTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        status: (user?.role === 'admin' || user?.role === 'editor' || user?.canDirectPublish) ? 'published' : 'pending_editor'
      });

      // Sync to local store if direct published
      try {
        if (user?.role === 'admin' || user?.role === 'editor' || user?.canDirectPublish) {
          createNewArticle({
            title: title.trim(),
            slug: customSlug.trim() ? customSlug.trim() : undefined,
            content: content.trim(),
            excerpt: excerpt.trim(),
            category,
            punjabRegion: category === 'punjab' ? punjabRegion : null,
            language,
            featuredImage,
            isBreaking
          });
        }
      } catch (e) {}

      window.dispatchEvent(new Event('punjab_articles_updated'));

      setFeedback({
        type: 'success',
        message: res.message || 'ਖ਼ਬਰ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸਬਮਿਟ ਹੋ ਗਈ ਹੈ!'
      });

      // Clear fields
      setTitle('');
      setCustomSlug('');
      setContent('');
      setExcerpt('');
      setIsBreaking(false);
      setSeoTitle('');
      setMetaDescription('');

      if (onArticleCreated) {
        onArticleCreated(res.article);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'ਖ਼ਬਰ ਸਬਮਿਟ ਕਰਨ ਵਿੱਚ ਦਿੱਕਤ ਆਈ।'
      });
    } finally {
      setLoading(false);
    }
  };

  const canDirectPublish = Boolean(user?.role === 'admin' || user?.role === 'editor' || user?.canDirectPublish);

  return (
    <div className="admin-cms-card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #b71c1c', paddingBottom: '14px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
            {canDirectPublish ? 'ਨਵੀਂ ਖ਼ਬਰ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ (Direct Publish)' : 'ਨਵੀਂ ਖ਼ਬਰ ਸਬਮਿਟ ਕਰੋ (Submit News for Review)'}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            {canDirectPublish
              ? 'ਤੁਹਾਡੇ ਕੋਲ ਸਿੱਧਾ ਪ੍ਰਕਾਸ਼ਨ ਅਧਿਕਾਰ ਹੈ। ਤੁਹਾਡੇ ਵੱਲੋਂ ਦਰਜ ਕੀਤੀ ਖ਼ਬਰ ਤੁਰੰਤ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲਾਈਵ ਹੋ ਜਾਵੇਗੀ (You have direct publishing privileges. Your article will go live immediately).'
              : 'ਤੁਹਾਡੀ ਖ਼ਬਰ ਸੰਪਾਦਕ (Editor) ਵੱਲੋਂ ਸਮੀਖਿਆ ਅਤੇ ਐਡਮਿਨ ਪ੍ਰਵਾਨਗੀ ਤੋਂ ਬਾਅਦ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲਾਈਵ ਹੋਵੇਗੀ (Your article will go live after review by Editor and approval by Admin).'}
          </p>
        </div>
        <span
          style={{
            backgroundColor: canDirectPublish ? '#1e293b' : '#047857',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '4px'
          }}
        >
          {canDirectPublish ? 'ਸਿੱਧਾ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਨ ਮੋਡ (Direct Publish Mode)' : 'ਸਮੀਖਿਆ ਅਧੀਨ ਮੋਡ (Review Mode)'}
        </span>
      </div>

      {/* Feedback Messages */}
      {feedback.message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            fontSize: '13.5px',
            fontWeight: '600'
          }}
        >
          <i className={`fa ${feedback.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 1. Dedicated Multi-Language Selector Tabs */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 18px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <label style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa fa-language" style={{ color: '#b71c1c', fontSize: '17px' }}></i>
              ਖ਼ਬਰ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ (Select Article Language) <span style={{ color: '#b71c1c' }}>*</span>
            </label>
            <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '4px' }}>
              ਪੱਤਰਕਾਰ ਚੋਣ (Reporter Choice)
            </span>
          </div>

          <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b' }}>
            ਤੁਸੀਂ ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚੋਂ ਆਪਣੀ ਪਸੰਦ ਅਨੁਸਾਰ ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਖ਼ਬਰ ਲਿਖ ਸਕਦੇ ਹੋ:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {LANG_OPTIONS.map((opt) => {
              const isSelected = language === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => setLanguage(opt.key)}
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                    border: isSelected ? '2px solid #b71c1c' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 3px 12px rgba(183, 28, 28, 0.14)' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: isSelected ? '#b71c1c' : '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </span>
                    {isSelected ? (
                      <i className="fa fa-check-circle" style={{ color: '#b71c1c', fontSize: '16px' }}></i>
                    ) : (
                      <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #94a3b8' }}></span>
                    )}
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>
                    {opt.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active selection helper banner */}
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: language === 'hi' ? '#fffbeb' : language === 'en' ? '#f0f9ff' : '#fef2f2',
              border: `1px solid ${language === 'hi' ? '#fde68a' : language === 'en' ? '#bae6fd' : '#fecaca'}`,
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: '600',
              color: language === 'hi' ? '#92400e' : language === 'en' ? '#0369a1' : '#b71c1c',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa fa-info-circle"></i>
            <span>{currentLang.hint}</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
            {currentLang.titleLabel} <span style={{ color: '#b71c1c' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={currentLang.titlePlaceholder}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}
            required
          />
        </div>

        {/* English URL Slug & Live Preview */}
        <div style={{ marginBottom: '18px', backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              🔗 ਅੰਗਰੇਜ਼ੀ URL ਸਿਰਲੇਖ (English URL Slug - Optional)
            </label>
            <span style={{ fontSize: '11px', color: '#64748b' }}>ਆਪਣੇ ਆਪ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬਣੇਗਾ (Auto-generated in English)</span>
          </div>
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="ਉਦਾਹਰਣ: amritsar-smart-city-heritage-street-project"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13.5px', color: '#0f172a', fontFamily: 'monospace' }}
          />
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#0369a1', wordBreak: 'break-all' }}>
            <strong>URL Preview: </strong>
            <span style={{ color: '#0284c7' }}>
              /news/{customSlug.trim() ? transliterateGurmukhiToEnglish(customSlug) : (title.trim() ? transliterateGurmukhiToEnglish(title) : 'your-news-slug')}
            </span>
          </div>
        </div>

        {/* Row: Category & Region */}
        <div style={{ display: 'grid', gridTemplateColumns: category === 'punjab' ? 'repeat(auto-fit, minmax(240px, 1fr))' : '1fr', gap: '16px', marginBottom: '18px' }}>
          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
              ਕੈਟੇਗਰੀ (Category)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13.5px' }}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.namePa} ({cat.nameEn})
                  </option>
                ))
              ) : (
                <>
                  <option value="punjab">ਪੰਜਾਬ (Punjab)</option>
                  <option value="religion">ਧਰਮ (Religion)</option>
                  <option value="world">ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)</option>
                  <option value="sport">ਖੇਡਾਂ (Sports)</option>
                  <option value="health">ਸਿਹਤ (Health)</option>
                  <option value="travel">ਸੈਰ-ਸਪਾਟਾ (Travel)</option>
                  <option value="art-entertainment">ਮਨੋਰੰਜਨ (Entertainment)</option>
                  <option value="politics">ਰਾਜਨੀਤੀ (Politics)</option>
                  <option value="business">ਵਪਾਰ (Business)</option>
                </>
              )}
            </select>
          </div>

          {/* Punjab Region (Conditional) */}
          {category === 'punjab' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#b71c1c', marginBottom: '6px' }}>
                ਪੰਜਾਬ ਖੇਤਰ (Punjab Region)
              </label>
              <select
                value={punjabRegion}
                onChange={(e) => setPunjabRegion(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #b71c1c', borderRadius: '5px', fontSize: '13.5px', backgroundColor: '#fff5f5' }}
              >
                <option value="majha">ਮਾਝਾ (Majha - ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ, ਤਰਨਤਾਰਨ, ਪਠਾਨਕੋਟ)</option>
                <option value="malwa">ਮਾਲਵਾ (Malwa - ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ, ਸੰਗਰੂਰ)</option>
                <option value="doaba">ਦੋਆਬਾ (Doaba - ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ, ਕਪੂਰਥਲਾ, ਨਵਾਂਸ਼ਹਿਰ)</option>
              </select>
            </div>
          )}
        </div>

        {/* Featured Media (Photo or Video) Selector */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <label style={{ margin: 0, fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>
              <i className={`fa ${mediaType === 'video' ? 'fa-video-camera' : 'fa-picture-o'}`} style={{ color: '#b71c1c', marginRight: '6px' }}></i>
              ਮੀਡੀਆ ਅਟੈਚਮੈਂਟ (Media Attachment: Photo / Video)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setMediaType('image')}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: mediaType === 'image' ? '1px solid #b71c1c' : '1px solid #cbd5e1',
                  backgroundColor: mediaType === 'image' ? '#b71c1c' : '#ffffff',
                  color: mediaType === 'image' ? '#ffffff' : '#334155',
                  cursor: 'pointer'
                }}
              >
                <i className="fa fa-picture-o" style={{ marginRight: '4px' }}></i> ਫ਼ੋਟੋ (Photo)
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: mediaType === 'video' ? '1px solid #1c2d5a' : '1px solid #cbd5e1',
                  backgroundColor: mediaType === 'video' ? '#1c2d5a' : '#ffffff',
                  color: mediaType === 'video' ? '#ffffff' : '#334155',
                  cursor: 'pointer'
                }}
              >
                <i className="fa fa-video-camera" style={{ marginRight: '4px' }}></i> ਵੀਡੀਓ (Video)
              </button>
            </div>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#b91c1c', fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa fa-exclamation-circle"></i>
              <span>{uploadError}</span>
            </div>
          )}

          {/* Direct File Upload Drop Zone */}
          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: '#ffffff',
              textAlign: 'center',
              marginBottom: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            {uploadingMedia ? (
              <div style={{ padding: '10px 0' }}>
                <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTop: '3px solid #b71c1c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '8px' }}></div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#b71c1c' }}>
                  {mediaType === 'video' ? 'ਕਲਾਊਡ ਉੱਤੇ ਵੀਡੀਓ ਅਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...' : 'ਕਲਾਊਡ ਉੱਤੇ ਫ਼ੋਟੋ ਅਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Cloudinary automatic compression & optimization in progress
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <i className={`fa ${mediaType === 'video' ? 'fa-video-camera' : 'fa-cloud-upload'}`} style={{ fontSize: '32px', color: '#b71c1c' }}></i>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  {mediaType === 'video'
                    ? 'ਕੰਪਿਊਟਰ ਜਾਂ ਮੋਬਾਈਲ ਤੋਂ ਨਵੀਂ ਵੀਡੀਓ ਅਪਲੋਡ ਕਰੋ (MP4, WEBM, MOV - Max 100MB)'
                    : 'ਕੰਪਿਊਟਰ ਜਾਂ ਮੋਬਾਈਲ ਤੋਂ ਨਵੀਂ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ (JPG, PNG, WEBP, GIF - Max 15MB)'}
                </p>
                <label
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1c2d5a',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <i className="fa fa-folder-open-o" style={{ marginRight: '6px' }}></i>
                  {mediaType === 'video' ? 'ਵੀਡੀਓ ਫਾਈਲ ਚੁਣੋ (Choose Video)' : 'ਫ਼ੋਟੋ ਚੁਣੋ (Choose Image File)'}
                  <input
                    type="file"
                    accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleMediaFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Current Selected Media Preview (Image or Video) */}
          {mediaType === 'video' && videoUrl ? (
            <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: videoUrl.includes('cloudinary') ? '#047857' : '#1c2d5a', color: '#ffffff', padding: '2px 8px', borderRadius: '3px' }}>
                  {videoUrl.includes('cloudinary') ? '✓ Cloudinary Video Hosted' : 'ਵੀਡੀਓ ਲਿੰਕ (Custom URL)'}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>ਵੀਡੀਓ ਪ੍ਰੀਵਿਊ (Video Preview):</span>
              </div>
              <video
                controls
                src={videoUrl}
                style={{ width: '100%', maxHeight: '240px', borderRadius: '4px', backgroundColor: '#000' }}
              />
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="ਜਾਂ ਵੀਡੀਓ ਦਾ ਸਿੱਧਾ URL ਦਰਜ ਕਰੋ (Or enter direct video URL)..."
                style={{ width: '100%', marginTop: '8px', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}
              />
            </div>
          ) : (
            featuredImage ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <img
                    src={featuredImage}
                    alt="Selected preview"
                    style={{ width: '80px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#047857', color: '#ffffff', padding: '1px 6px', borderRadius: '3px' }}>
                        ✓ ਫ਼ੋਟੋ ਅਪਲੋਡ ਹੋਈ (Photo Uploaded)
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                      {featuredImage}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b71c1c',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fa fa-trash"></i> ਹਟਾਓ (Remove)
                </button>
              </div>
            ) : (
              <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', textAlign: 'center', color: '#64748b', fontSize: '12.5px', marginBottom: '10px' }}>
                <i className="fa fa-image" style={{ fontSize: '20px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}></i>
                ਕੋਈ ਫ਼ੋਟੋ ਨਹੀਂ ਚੁਣੀ ਗਈ (No photo selected). ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ <strong>'ਫ਼ੋਟੋ ਚੁਣੋ (Choose Image File)'</strong> 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਆਪਣੇ ਸਿਸਟਮ ਵਿੱਚੋਂ ਫ਼ੋਟੋ ਚੁਣੋ।
              </div>
            )
          )}

          {/* Optional Direct URL Fallback */}
          {mediaType === 'image' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="ਜਾਂ ਬਾਹਰੀ ਫ਼ੋਟੋ ਦਾ ਸਿੱਧਾ ਵੈੱਬ URL ਪਾਓ (External Image URL - Optional)..."
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}
              />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
            {currentLang.excerptLabel}
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder={currentLang.excerptPlaceholder}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13.5px' }}
          />
        </div>

        {/* Content Body */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
            {currentLang.contentLabel} <span style={{ color: '#b71c1c' }}>*</span>
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentLang.contentPlaceholder}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '14px', lineHeight: '1.6', fontFamily: 'inherit' }}
            required
          />
        </div>

        {/* SEO Fields — Collapsible Panel */}
        <div style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Panel Header / Toggle */}
          <div
            onClick={() => setSeoExpanded((p) => !p)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: seoExpanded ? '#f0f9ff' : '#f8fafc',
              borderBottom: seoExpanded ? '1px solid #bae6fd' : 'none',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa fa-search" style={{ color: '#0369a1', fontSize: '14px' }}></i>
              <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>
                🔍 SEO Settings (Google Search Optimization)
              </span>
              <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                Optional
              </span>
            </div>
            <i className={`fa fa-chevron-${seoExpanded ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '12px' }}></i>
          </div>

          {/* Panel Body */}
          {seoExpanded && (
            <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
              <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                <i className="fa fa-info-circle" style={{ marginRight: '5px', color: '#0369a1' }}></i>
                Ye fields Google search mein teri khabar kaisi dikhegi usko control karti hain.
                Khali chorr de toh article ka title aur excerpt automatically use hoga.
              </p>

              {/* SEO Title */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    <i className="fa fa-tag" style={{ color: '#b71c1c', marginRight: '5px' }}></i>
                    SEO Title (Google Search Title)
                  </label>
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: seoTitle.length > 100 ? '#b71c1c' : '#64748b'
                  }}>
                    {seoTitle.length}/120
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={120}
                  placeholder={`Default: "${title.trim() ? title.trim().slice(0, 60) + '...' : 'Your article title'} | Punjab Files"`}
                  style={{
                    width: '100%', padding: '9px 12px',
                    border: '1px solid #cbd5e1', borderRadius: '5px',
                    fontSize: '13.5px', color: '#0f172a'
                  }}
                />
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  Google browser tab aur search result mein blue link ke roop mein dikhai deti hai. (~50-60 characters ideal)
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    <i className="fa fa-align-left" style={{ color: '#b71c1c', marginRight: '5px' }}></i>
                    Meta Description (Google Search Snippet)
                  </label>
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: metaDescription.length > 280 ? '#b71c1c' : metaDescription.length > 160 ? '#d97706' : '#64748b'
                  }}>
                    {metaDescription.length}/320
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={320}
                  placeholder="Google search result mein title ke neeche grey text mein dikhegi. ~150-160 characters ideal hain..."
                  style={{
                    width: '100%', padding: '9px 12px',
                    border: '1px solid #cbd5e1', borderRadius: '5px',
                    fontSize: '13.5px', color: '#0f172a',
                    resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5'
                  }}
                />
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  WhatsApp, Facebook, aur Twitter share preview mein bhi yahi description dikhai deti hai.
                </p>
              </div>

              {/* Live Google Preview */}
              {(seoTitle || title) && (
                <div
                  style={{
                    marginTop: '14px', padding: '12px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: '6px'
                  }}
                >
                  <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Google Search Preview:
                  </p>
                  <div style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ fontSize: '16px', color: '#1a0dab', fontWeight: '400', lineHeight: '1.3' }}>
                      {seoTitle.trim() || `${title.trim().slice(0, 55)}${title.trim().length > 55 ? '...' : ''} | Punjab Files`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#006621', marginTop: '2px' }}>
                      punjabfiles.com/news/{(title.trim() || 'your-news-slug').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#545454', marginTop: '3px', lineHeight: '1.5' }}>
                      {(metaDescription.trim() || (excerpt.trim() || (content.trim() ? content.trim().slice(0, 155) : ''))).slice(0, 155)}{((metaDescription || excerpt || content).length > 155 ? '...' : '')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Breaking News Checkbox */}
        <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="breaking-check"
            checked={isBreaking}
            onChange={(e) => setIsBreaking(e.target.checked)}
            style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#b71c1c' }}
          />
          <label htmlFor="breaking-check" style={{ fontSize: '13.5px', fontWeight: '700', color: '#b71c1c', cursor: 'pointer', margin: 0 }}>
            ਇਸ ਖ਼ਬਰ ਨੂੰ 'ਬਰੇਕਿੰਗ ਨਿਊਜ਼' (Breaking News Alert) ਵਜੋਂ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="admin-cms-submit-btn"
          style={{
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '5px',
            fontSize: '14.5px',
            fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(183, 28, 28, 0.3)'
          }}
        >
          {loading ? (
            <>
              <i className="fa fa-spinner fa-spin"></i> ਸਬਮਿਟ ਹੋ ਰਿਹਾ ਹੈ... (Submitting...)
            </>
          ) : canDirectPublish ? (
            <>
              <i className="fa fa-bolt"></i> ਸਿੱਧਾ ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ (Publish Live Directly)
            </>
          ) : (
            <>
              <i className="fa fa-send"></i> ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲਈ ਭੇਜੋ (Send for Editorial Review)
            </>
          )}
        </button>
      </form>
    </div>
  );
}
