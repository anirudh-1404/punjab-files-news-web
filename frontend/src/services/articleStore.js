/**
 * Punjab Files News - Centralized Article & Breaking News Data Store
 * Clean dynamic store with zero dummy/static articles.
 * Driven 100% by the Admin CMS and Backend Database.
 */

const STORAGE_KEY = 'punjab_files_articles_clean_v2';
const BREAKING_KEY = 'punjab_files_breaking_clean_v2';

export const INITIAL_ARTICLES = [];

export const INITIAL_BREAKING = [
  { id: 'b-live-tag', tag: 'ਪੰਜਾਬ ਫਾਈਲਜ਼', text: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ 24 ਘੰਟੇ ਲਾਈਵ ਅੱਪਡੇਟ ਅਤੇ ਤਾਜ਼ਾ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਦਾ ਸਿਲਸਿਲਾ ਜਾਰੀ।' }
];

/**
 * Storage Helpers
 */
export function getStoredArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveArticles(articles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to persist articles:', e);
  }
}

export function getStoredBreaking() {
  try {
    const raw = localStorage.getItem(BREAKING_KEY);
    if (!raw) {
      return INITIAL_BREAKING;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BREAKING;
  } catch (e) {
    return INITIAL_BREAKING;
  }
}

export function saveBreaking(items) {
  try {
    localStorage.setItem(BREAKING_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist breaking news:', e);
  }
}

/**
 * Public Query Methods
 */
export function getAllArticles(filter = {}) {
  const articles = getStoredArticles();
  return articles.filter((a) => {
    if (filter.language && a.language !== filter.language) return false;
    if (filter.category && filter.category !== 'all' && a.category !== filter.category) return false;
    if (filter.punjabRegion && filter.punjabRegion !== 'all' && a.punjabRegion !== filter.punjabRegion) return false;
    if (filter.status && a.status !== filter.status) return false;
    return true;
  });
}

export function getArticleById(id) {
  const articles = getStoredArticles();
  return articles.find((a) => a.id === id || a.slug === id);
}

export function getReadersChoiceTop10() {
  const articles = getStoredArticles();
  return [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
}

export function getRelatedArticles(currentId, category, limit = 4) {
  const articles = getStoredArticles();
  return articles
    .filter((a) => a.id !== currentId && (category ? a.category === category : true))
    .slice(0, limit);
}

export function incrementArticleViews(id) {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === id || a.slug === id);
  if (index !== -1) {
    articles[index].views = (articles[index].views || 0) + 1;
    saveArticles(articles);
    return articles[index].views;
  }
  return 0;
}

/**
 * CMS Publishing Methods
 */
export function createNewArticle(data) {
  const articles = getStoredArticles();
  const slug = (data.slug || data.title || 'news-article')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Date.now().toString(36);

  const newArticle = {
    id: 'art-' + Date.now(),
    title: data.title,
    slug: slug,
    category: data.category || 'punjab',
    punjabRegion: data.punjabRegion || (data.category === 'punjab' ? 'majha' : undefined),
    language: data.language || 'pa',
    author: data.author || 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ਡੈਸਕ',
    publicationDate: data.publicationDate || new Date().toLocaleDateString('pa-IN'),
    publicationTime: data.publicationTime || 'ਹੁਣੇ-ਹੁਣੇ',
    featuredImage: data.featuredImage || '/img/index_800x400-image01.jpg',
    excerpt: data.excerpt || (data.content ? data.content.substring(0, 120) + '...' : ''),
    content: data.content || '',
    isBreaking: Boolean(data.isBreaking),
    views: 1,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  articles.unshift(newArticle);
  saveArticles(articles);

  // If flagged as breaking, automatically add to breaking news ticker
  if (newArticle.isBreaking) {
    const breaking = getStoredBreaking();
    breaking.unshift({
      id: 'b-' + Date.now(),
      tag: newArticle.category === 'punjab' ? (newArticle.punjabRegion || 'ਪੰਜਾਬ') : 'ਬ੍ਰੇਕਿੰਗ',
      text: newArticle.title
    });
    saveBreaking(breaking);
  }

  return newArticle;
}

export function updateArticle(id, updatedFields) {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };

  saveArticles(articles);
  return articles[index];
}

export function deleteArticle(id) {
  const articles = getStoredArticles();
  const filtered = articles.filter((a) => a.id !== id);
  saveArticles(filtered);
  return true;
}
