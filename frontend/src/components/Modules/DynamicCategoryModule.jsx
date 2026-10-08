import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, articleAPI } from '../../services/api';
import { formatArticleDate } from '../../services/dateUtils';
import { useLanguage } from '../../context/LanguageContext';
import NewsCardImage from '../Common/NewsCardImage';

// Core hardcoded homepage module slugs that already have dedicated sections
const CORE_SLUGS = new Set([
  'punjab',
  'world',
  'sport',
  'health',
  'travel',
  'art-entertainment',
  'religion'
]);

export default function DynamicCategoryModule() {
  const { language } = useLanguage();
  const [customSections, setCustomSections] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDynamicCategoriesAndNews = async () => {
      try {
        const catRes = await categoryAPI.getAll();
        const allCats = Array.isArray(catRes?.data) ? catRes.data : [];

        // Filter active categories that do NOT have a hardcoded homepage module
        const dynamicCats = allCats.filter(
          (c) => c.isActive !== false && !CORE_SLUGS.has(c.slug)
        );

        if (dynamicCats.length === 0) {
          if (isMounted) setCustomSections([]);
          return;
        }

        // Fetch up to 4 articles for each dynamic category
        const sectionPromises = dynamicCats.map(async (cat) => {
          try {
            const artRes = await articleAPI.getPublished({
              category: cat.slug,
              limit: 4,
              language
            });
            const articles = Array.isArray(artRes?.data) ? artRes.data : [];
            return {
              category: cat,
              articles
            };
          } catch (err) {
            return { category: cat, articles: [] };
          }
        });

        const results = await Promise.all(sectionPromises);
        // Only keep categories that have at least 1 published article
        const activeSections = results.filter((r) => r.articles.length > 0);

        if (isMounted) {
          setCustomSections(activeSections);
        }
      } catch (err) {
        console.error('Failed to load dynamic categories on homepage:', err);
      }
    };

    loadDynamicCategoriesAndNews();

    const handleUpdate = () => loadDynamicCategoriesAndNews();
    window.addEventListener('punjab_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('punjab_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language]);

  if (customSections.length === 0) {
    return null;
  }

  return (
    <>
      {customSections.map(({ category, articles }) => (
        <section
          key={category.slug}
          className="module dynamic-category-module"
          id={category.slug}
          style={{
            backgroundColor: '#ffffff',
            paddingTop: '16px',
            paddingBottom: '22px',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div className="container">
            {/* Header Row */}
            <div
              className="module-header-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '16px',
                borderBottom: '2px solid #b71c1c',
                paddingBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '800',
                    letterSpacing: '0.5px'
                  }}
                >
                  <i className={`fa ${category.icon || 'fa-tag'}`} style={{ marginRight: '6px' }}></i>
                  {category.namePa}
                </span>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>
                  {category.namePa} {category.nameEn ? `(${category.nameEn})` : ''} ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਖ਼ਬਰਾਂ
                </h3>
              </div>

              <Link
                to={`/category/${category.slug}`}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#b71c1c',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#fee2e2',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਦੇਖੋ (View All)</span>
                <i className="fa fa-angle-right" style={{ fontSize: '13px' }}></i>
              </Link>
            </div>

            {/* 4-Column Responsive Grid */}
            <div className="row">
              {articles.map((item, index) => {
                const articleId = item.slug || item._id;
                const linkHref = `/news/${articleId}`;

                return (
                  <div className="col-md-3 col-sm-6 col-xs-12" key={articleId || index} style={{ marginBottom: '18px' }}>
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Image Container with NewsCardImage (never cropped) */}
                      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                        <Link to={linkHref} style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                          <NewsCardImage
                            src={item.featuredImage}
                            alt={item.title}
                            height="175px"
                            fallbackSrc="/img/index_800x400-image01.jpg"
                          />
                        </Link>
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            backgroundColor: '#b71c1c',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '2px 7px',
                            borderRadius: '3px',
                            zIndex: 2
                          }}
                        >
                          {category.namePa}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa fa-clock-o"></i>
                            <span>{item.publishedAt ? formatArticleDate(item.publishedAt, language) : 'ਤਾਜ਼ਾ'}</span>
                          </div>

                          <h4 style={{ margin: '0 0 8px', fontSize: '14.5px', lineHeight: '1.4', fontWeight: '700' }}>
                            <Link
                              to={linkHref}
                              style={{
                                color: '#111827',
                                textDecoration: 'none',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {item.title}
                            </Link>
                          </h4>

                          <p
                            style={{
                              margin: '0',
                              fontSize: '12px',
                              color: '#64748b',
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.excerpt || (item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 90) + '...' : '')}
                          </p>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '10px' }}>
                          <Link
                            to={linkHref}
                            style={{
                              color: '#b71c1c',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>ਪੂਰੀ ਖ਼ਬਰ ਪੜ੍ਹੋ</span>
                            <i className="fa fa-angle-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
