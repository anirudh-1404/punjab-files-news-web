/**
 * Punjab Files News - Centralized Article & Breaking News Data Store
 * Supports multi-lingual articles, region filtering, view counting, and CMS publishing
 */

const STORAGE_KEY = 'punjab_files_articles_v1';
const BREAKING_KEY = 'punjab_files_breaking_v1';

export const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ: ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਮਨਜ਼ੂਰੀ, ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਨਵੀਆਂ ਸਹੂਲਤਾਂ',
    slug: 'amritsar-heritage-street-revamp-project',
    category: 'punjab',
    punjabRegion: 'majha',
    language: 'pa',
    author: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
    publicationDate: '10 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 09:15 ਵਜੇ',
    featuredImage: '/img/index_800x400-image01.jpg',
    excerpt: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਆਉਣ ਵਾਲੇ ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੇ ਸ਼ਰਧਾਲੂਆਂ ਦੀ ਸਹੂਲਤ ਲਈ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਬੰਧ ਮੁਕੰਮਲ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।',
    content: `ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਵਿਰਾਸਤੀ ਮਾਰਗ (Heritage Street) ਦੇ ਨਵੀਨੀਕਰਨ ਲਈ ਪੰਜਾਬ ਸਰਕਾਰ ਅਤੇ ਸਥਾਨਕ ਪ੍ਰਸ਼ਾਸਨ ਵੱਲੋਂ ਨਵੇਂ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਹਰੀ ਝੰਡੀ ਦੇ ਦਿੱਤੀ ਗਈ ਹੈ। ਇਸ ਪ੍ਰੋਜੈਕਟ ਤਹਿਤ ਪੈਦਲ ਚੱਲਣ ਵਾਲੇ ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਛਾਂਦਾਰ ਰਸਤੇ, ਸਾਫ਼ ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੇ ਕੂਲਰ, ਆਧੁਨਿਕ ਬੈਠਣ ਵਾਲੇ ਬੈਂਚ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਸੂਚਨਾ ਕੇਂਦਰ ਸਥਾਪਤ ਕੀਤੇ ਜਾਣਗੇ।

ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ ਦੇ ਅਧਿਕਾਰੀਆਂ ਨੇ ਦੱਸਿਆ ਕਿ ਸ਼ਹਿਰ ਦੀ ਟ੍ਰੈਫਿਕ ਵਿਵਸਥਾ ਨੂੰ ਸੁਚਾਰੂ ਬਣਾਉਣ ਲਈ ਈ-ਰਿਕਸ਼ਾ ਲਈ ਵਿਸ਼ੇਸ਼ ਲੇਨ ਤਿਆਰ ਕੀਤੀ ਜਾਵੇਗੀ। ਇਸ ਤੋਂ ਇਲਾਵਾ ਵਾਤਾਵਰਨ ਨੂੰ ਪ੍ਰਦੂਸ਼ਣ ਮੁਕਤ ਰੱਖਣ ਲਈ ਵੱਡੇ ਪੱਧਰ 'ਤੇ ਰੁੱਖ-ਬੂਟੇ ਲਗਾਉਣ ਦੀ ਮੁਹਿੰਮ ਵੀ ਸ਼ੁਰੂ ਕੀਤੀ ਗਈ ਹੈ। ਸ਼ਰਧਾਲੂਆਂ ਨੇ ਇਸ ਉਪਰਾਲੇ ਦਾ ਭਰਵਾਂ ਸਵਾਗਤ ਕੀਤਾ ਹੈ।`,
    isBreaking: true,
    views: 2450,
    status: 'published',
    createdAt: new Date('2026-09-10T03:45:00Z').toISOString()
  },
  {
    id: 'art-2',
    title: 'ਲੁਧਿਆਣਾ ਤੇ ਬਠਿੰਡਾ: ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨਾਲ ਹਜ਼ਾਰਾਂ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਖੁੱਲ੍ਹਣਗੇ ਰਾਹ',
    slug: 'ludhiana-bathinda-new-industrial-policy-jobs',
    category: 'punjab',
    punjabRegion: 'malwa',
    language: 'pa',
    author: 'ਅਮਨਦੀਪ ਕੌਰ',
    publicationDate: '10 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 08:50 ਵਜੇ',
    featuredImage: '/img/index_800x400-image02.jpg',
    excerpt: 'ਟੈਕਸਟਾਈਲ ਅਤੇ ਆਟੋ ਪਾਰਟਸ ਸਨਅਤਾਂ ਨੂੰ ਨਿਵੇਸ਼ ਲਈ ਵਿਸ਼ੇਸ਼ ਛੋਟਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇਣ ਦਾ ਵੱਡਾ ਫ਼ੈਸਲਾ।',
    content: `ਪੰਜਾਬ ਵਿੱਚ ਸਨਅਤੀ ਵਿਕਾਸ ਨੂੰ ਹੁਲਾਰਾ ਦੇਣ ਲਈ ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨੂੰ ਲਾਗੂ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਸ ਨੀਤੀ ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਲਾਭ ਮਾਲਵਾ ਖੇਤਰ ਦੇ ਲੁਧਿਆਣਾ ਅਤੇ ਬਠਿੰਡਾ ਜ਼ਿਲ੍ਹਿਆਂ ਨੂੰ ਮਿਲਣ ਦੀ ਉਮੀਦ ਹੈ। ਨਵੀਂ ਨੀਤੀ ਤਹਿਤ ਨਿਵੇਸ਼ਕਾਂ ਨੂੰ ਸਿੰਗਲ ਵਿੰਡੋ ਕਲੀਅਰੈਂਸ ਅਤੇ ਬਿਜਲੀ ਦਰਾਂ 'ਤੇ ਵਿਸ਼ੇਸ਼ ਰਿਆਇਤਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ।

ਉਦਯੋਗ ਮੰਤਰੀ ਨੇ ਕਿਹਾ ਕਿ ਆਉਣ ਵਾਲੇ 6 ਮਹੀਨਿਆਂ ਦੌਰਾਨ ਸੂਬੇ ਵਿੱਚ 25,000 ਤੋਂ ਵੱਧ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਿੱਧੇ ਅਤੇ ਅਸਿੱਧੇ ਤੌਰ 'ਤੇ ਨੌਕਰੀਆਂ ਮਿਲਣਗੀਆਂ। ਸਥਾਨਕ ਕਾਲਜਾਂ ਦੇ ਤਕਨੀਕੀ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਇੰਡਸਟਰੀ ਅਨੁਸਾਰ ਸਿਖਲਾਈ ਦੇਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਕਿੱਲ ਡਿਵੈਲਪਮੈਂਟ ਸੈਂਟਰ ਵੀ ਖੋਲ੍ਹੇ ਜਾ ਰਹੇ ਹਨ।`,
    isBreaking: false,
    views: 2180,
    status: 'published',
    createdAt: new Date('2026-09-10T03:20:00Z').toISOString()
  },
  {
    id: 'art-3',
    title: 'ਜਲੰਧਰ: ਸਪੋਰਟਸ ਇੰਡਸਟਰੀ ਲਈ ਵਿਸ਼ੇਸ਼ ਕਲੱਸਟਰ ਪ੍ਰਾਜੈਕਟ ਸ਼ੁਰੂ, ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਵਿੱਚ ਵਾਧਾ',
    slug: 'jalandhar-sports-industry-cluster-project',
    category: 'punjab',
    punjabRegion: 'doaba',
    language: 'pa',
    author: 'ਜਸਵੀਰ ਸਿੰਘ ਸੰਧੂ',
    publicationDate: '10 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 08:10 ਵਜੇ',
    featuredImage: '/img/index_800x400-image03.jpg',
    excerpt: 'ਵਿਸ਼ਵ ਪ੍ਰਸਿੱਧ ਖੇਡ ਸਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਨਿਰਮਾਤਾਵਾਂ ਨੂੰ ਵਿਸ਼ਵ ਪੱਧਰੀ ਟੈਸਟਿੰਗ ਲੈਬ ਅਤੇ ਕੱਚੇ ਮਾਲ ਦੀ ਸੁਵਿਧਾ ਮਿਲੇਗੀ।',
    content: `ਦੋਆਬਾ ਦੇ ਪ੍ਰਮੁੱਖ ਸ਼ਹਿਰ ਜਲੰਧਰ ਵਿੱਚ ਸਪੋਰਟਸ ਸਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਉਦਯੋਗਾਂ ਲਈ ਨਵਾਂ ਅਤਿ-ਆਧੁਨਿਕ ਟੈਸਟਿੰਗ ਕਲੱਸਟਰ ਸਥਾਪਤ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਸ ਪ੍ਰਾਜੈਕਟ ਨਾਲ ਜਲੰਧਰ ਤੋਂ ਕ੍ਰਿਕਟ ਬੈਟ, ਫੁੱਟਬਾਲ, ਹਾਕੀ ਸਟਿਕਸ ਅਤੇ ਹੋਰ ਖੇਡ ਉਪਕਰਨਾਂ ਦਾ ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਦੁੱਗਣਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।

ਕਲੱਸਟਰ ਡਾਇਰੈਕਟਰ ਨੇ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਕਿ ਵਿਦੇਸ਼ੀ ਬਾਜ਼ਾਰਾਂ ਦੇ ਮਿਆਰ ਅਨੁਸਾਰ ਕੁਆਲਿਟੀ ਕੰਟਰੋਲ ਲਾਜ਼ਮੀ ਕੀਤਾ ਗਿਆ ਹੈ ਜਿਸ ਨਾਲ ਸਥਾਨਕ ਉਤਪਾਦਾਂ ਨੂੰ ਗਲੋਬਲ ਪੱਧਰ 'ਤੇ ਵੱਡੀ ਮਾਨਤਾ ਮਿਲੇਗੀ।`,
    isBreaking: false,
    views: 1940,
    status: 'published',
    createdAt: new Date('2026-09-10T02:40:00Z').toISOString()
  },
  {
    id: 'art-4',
    title: 'ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖਵਾਕ: ਗੁਰੂ ਕਿਰਪਾ ਨਾਲ ਜੀਵਨ ਵਿੱਚ ਆਨੰਦ',
    slug: 'sri-darbar-sahib-amrit-vele-da-mukhwak-today',
    category: 'religion',
    language: 'pa',
    author: 'ਸੰਪਾਦਕੀ ਧਰਮ ਡੈਸਕ',
    publicationDate: '10 ਸਤੰਬਰ 2026',
    publicationTime: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ 04:30 ਵਜੇ',
    featuredImage: '/img/darbar-sahib-mukhwak.jpg',
    excerpt: 'ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ ॥ ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥ ਅੰਗ ੬੫੪',
    content: `ਅੱਜ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ ਆਇਆ ਪਵਿੱਤਰ ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ) ਸੋਰਠਿ ਮਹਲਾ ੫, ਪਵਿੱਤਰ ਅੰਗ ੬੫੪ 'ਤੇ ਸੁਸ਼ੋਭਿਤ ਹੈ।

ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ
ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥
ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥
ਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥
ਅਪਨੇ ਸੇਵਕ ਕੀ ਆਪੇ ਰਾਖੈ ਨਿਮਖ ਨ ਬਿਸਰੈ ਸਾਸਾ ॥
ਹਰਿ ਕਾ ਨਾਮੁ ਜਪਹੁ ਮੇਰੇ ਮੀਤਾ ਨਾਨਕ ਕੀ ਅਰਦਾਸਾ ॥੨॥

ਪੰਜਾਬੀ ਵਿਆਖਿਆ:
ਹੇ ਭਾਈ! ਜਿਸ ਮਨੁੱਖ ਨੂੰ ਵੱਡੇ ਭਾਗਾਂ ਨਾਲ ਪੂਰਾ ਗੁਰੂ ਮਿਲ ਪੈਂਦਾ ਹੈ, ਉਸ ਦੇ ਮਨ ਵਿੱਚ ਆਤਮਕ ਜੀਵਨ ਦੀ ਸੂਝ ਦਾ ਚਾਨਣ ਹੋ ਜਾਂਦਾ ਹੈ। ਉਸ ਨੂੰ ਆਪਣੇ ਮਾਲਕ-ਪ੍ਰਭੂ ਦਾ ਪੱਕਾ ਭਰੋਸਾ ਬਣ ਜਾਂਦਾ ਹੈ। ਕੋਈ ਹੋਰ ਦੁਨਿਆਵੀ ਡਰ ਉਸ ਨੂੰ ਡੁਲਾ ਨਹੀਂ ਸਕਦਾ। ਪਰਮਾਤਮਾ ਆਪਣੇ ਸੇਵਕਾਂ ਦੀ ਖ਼ੁਦ ਰੱਖਿਆ ਕਰਦਾ ਹੈ।`,
    isBreaking: false,
    views: 3120,
    status: 'published',
    createdAt: new Date('2026-09-10T01:00:00Z').toISOString()
  },
  {
    id: 'art-5',
    title: 'ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਤੇ ਕੀਰਤਪੁਰ ਸਾਹਿਬ: ਇਤਿਹਾਸਕ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬਾਨ ਦੇ ਸੁੰਦਰੀਕਰਨ ਦਾ ਕਾਰਜ ਆਰੰਭ',
    slug: 'anandpur-sahib-historic-gurdwaras-restoration',
    category: 'religion',
    language: 'pa',
    author: 'ਤਰਲੋਚਨ ਸਿੰਘ',
    publicationDate: '9 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸ਼ਾਮ 06:15 ਵਜੇ',
    featuredImage: '/img/index_800x400-image04.jpg',
    excerpt: 'ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ ਵੱਲੋਂ ਪੁਰਾਤਨ ਵਿਰਾਸਤੀ ਇਮਾਰਤਸਾਜ਼ੀ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਲਈ ਮਾਹਿਰ ਟੀਮਾਂ ਤਾਇਨਾਤ।',
    content: `ਖਾਲਸੇ ਦੀ ਪਵਿੱਤਰ ਜਨਮ ਭੂਮੀ ਤਖ਼ਤ ਸ੍ਰੀ ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ, ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਵਿਖੇ ਸ਼ਰਧਾਲੂਆਂ ਦੀ ਆਮਦ ਨੂੰ ਮੁੱਖ ਰੱਖਦਿਆਂ ਵਿਸ਼ੇਸ਼ ਵਿਕਾਸ ਕਾਰਜ ਸ਼ੁਰੂ ਕੀਤੇ ਗਏ ਹਨ। ਸ਼੍ਰੋਮਣੀ ਕਮੇਟੀ ਵੱਲੋਂ ਇਤਿਹਾਸਕ ਸਰੋਵਰਾਂ ਦੀ ਸਫ਼ਾਈ ਅਤੇ ਆਲੇ-ਦੁਆਲੇ ਸੰਗਮਰਮਰ ਦੀ ਮੁਰੰਮਤ ਦਾ ਕੰਮ ਜ਼ੋਰਾਂ 'ਤੇ ਚੱਲ ਰਿਹਾ ਹੈ।

ਇਸੇ ਤਰ੍ਹਾਂ ਕੀਰਤਪੁਰ ਸਾਹਿਬ ਵਿਖੇ ਵੀ ਪੁਰਾਤਨ ਦਰਸ਼ਨ ਦੀਦਾਰਿਆਂ ਦੀ ਮਹਿਮਾ ਕਾਇਮ ਰੱਖਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਗਾਈਡਾਂ ਅਤੇ ਆਡੀਓ ਟੂਰ ਦੀ ਵਿਵਸਥਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।`,
    isBreaking: false,
    views: 1820,
    status: 'published',
    createdAt: new Date('2026-09-09T18:00:00Z').toISOString()
  },
  {
    id: 'art-6',
    title: 'ਕੌਮਾਂਤਰੀ ਪੰਜਾਬੀ ਡਾਇਸਪੋਰਾ: ਕੈਨੇਡਾ ਤੇ ਯੂਕੇ ਵਿੱਚ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਨੇ ਮਾਰੀਆਂ ਮੱਲਾਂ',
    slug: 'punjabi-diaspora-achievements-canada-uk',
    category: 'world',
    language: 'pa',
    author: 'ਹਰਪ੍ਰੀਤ ਕੌਰ ਲੰਡਨ',
    publicationDate: '9 ਸਤੰਬਰ 2026',
    publicationTime: 'ਦੁਪਹਿਰ 03:30 ਵਜੇ',
    featuredImage: '/img/index_800x400-image05.jpg',
    excerpt: 'ਵਿਦੇਸ਼ਾਂ ਵਿੱਚ ਵਸਦੇ ਪੰਜਾਬੀ ਵਿਗਿਆਨੀਆਂ ਅਤੇ ਉੱਦਮੀਆਂ ਨੇ ਸਿਲੀਕਾਨ ਵੈਲੀ ਅਤੇ ਬ੍ਰਿਟਿਸ਼ ਪਾਰਲੀਮੈਂਟ ਵਿੱਚ ਮਾਣ ਵਧਾਇਆ।',
    content: `ਵਿਦੇਸ਼ਾਂ ਵਿੱਚ ਵਸਦੇ ਪੰਜਾਬੀਆਂ ਨੇ ਇੱਕ ਵਾਰ ਫਿਰ ਆਪਣੀ ਮਿਹਨਤ ਅਤੇ ਕਾਬਲੀਅਤ ਦਾ ਲੋਹਾ ਮਨਵਾਇਆ ਹੈ। ਕੈਨੇਡਾ ਦੇ ਟੋਰਾਂਟੋ ਵਿੱਚ ਹੋਏ ਸਾਲਾਨਾ ਉੱਦਮੀ ਸੰਮੇਲਨ ਦੌਰਾਨ ਤਿੰਨ ਪੰਜਾਬੀ ਮੂਲ ਦੇ ਸਾਫਟਵੇਅਰ ਇੰਜੀਨੀਅਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਨਵੀਨਤਮ ਆਰਟੀਫੀਸ਼ੀਅਲ ਇੰਟੈਲੀਜੈਂਸ ਪ੍ਰੋਜੈਕਟ ਲਈ ਸਨਮਾਨਿਤ ਕੀਤਾ ਗਿਆ।

ਉਧਰ ਯੂਕੇ ਵਿੱਚ ਵੀ ਸਿਹਤ ਖੇਤਰ ਵਿੱਚ ਨਵੀਆਂ ਖੋਜਾਂ ਕਰਨ ਵਾਲੀ ਪੰਜਾਬੀ ਮਹਿਲਾ ਡਾਕਟਰ ਨੂੰ ਬ੍ਰਿਟਿਸ਼ ਮੈਡੀਕਲ ਐਸੋਸੀਏਸ਼ਨ ਵੱਲੋਂ ਲਾਈਫ ਟਾਈਮ ਅਚੀਵਮੈਂਟ ਐਵਾਰਡ ਨਾਲ ਨਿਵਾਜਿਆ ਗਿਆ ਹੈ।`,
    isBreaking: false,
    views: 1650,
    status: 'published',
    createdAt: new Date('2026-09-09T15:00:00Z').toISOString()
  },
  {
    id: 'art-7',
    title: '‘ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ’ ਦਾ ਚੌਥਾ ਸੀਜ਼ਨ ਧੂਮਧਾਮ ਨਾਲ ਸ਼ੁਰੂ, ਹਜ਼ਾਰਾਂ ਖਿਡਾਰੀ ਮੈਦਾਨ ਵਿੱਚ',
    slug: 'khedan-watan-punjab-diyan-season-4',
    category: 'sports',
    language: 'pa',
    author: 'ਬਲਵਿੰਦਰ ਸਿੰਘ ਖੇਡ ਡੈਸਕ',
    publicationDate: '9 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸ਼ਾਮ 05:00 ਵਜੇ',
    featuredImage: '/img/index_800x400-image06.jpg',
    excerpt: 'ਪਿੰਡਾਂ ਤੋਂ ਲੈ ਕੇ ਸੂਬਾ ਪੱਧਰ ਤੱਕ ਕਬੱਡੀ, ਕੁਸ਼ਤੀ, ਅਥਲੈਟਿਕਸ ਅਤੇ ਵਾਲੀਬਾਲ ਦੇ ਸ਼ਾਨਦਾਰ ਮੁਕਾਬਲੇ।',
    content: `ਪੰਜਾਬ ਸਰਕਾਰ ਦੇ ਖੇਡ ਵਿਭਾਗ ਵੱਲੋਂ ਕਰਵਾਈਆਂ ਜਾ ਰਹੀਆਂ ‘ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ’ ਦੇ ਚੌਥੇ ਸੀਜ਼ਨ ਦਾ ਉਦਘਾਟਨ ਸ਼ਾਨਦਾਰ ਮਾਰਚ ਪਾਸਟ ਨਾਲ ਹੋਇਆ। ਇਸ ਵਾਰ 30 ਤੋਂ ਵੱਧ ਖੇਡਾਂ ਸ਼ਾਮਲ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਅੰਡਰ-14 ਤੋਂ ਲੈ ਕੇ 60 ਸਾਲ ਤੋਂ ਉੱਪਰ ਦੇ ਬਜ਼ੁਰਗਾਂ ਦੇ ਵਰਗ ਵੀ ਰੱਖੇ ਗਏ ਹਨ।

ਖੇਡ ਮੰਤਰੀ ਨੇ ਐਲਾਨ ਕੀਤਾ ਕਿ ਜੇਤੂ ਖਿਡਾਰੀਆਂ ਨੂੰ ਕਰੋੜਾਂ ਰੁਪਏ ਦੇ ਨਕਦ ਇਨਾਮ ਅਤੇ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ ਵਿੱਚ ਰਾਖਵਾਂਕਰਨ ਦਿੱਤਾ ਜਾਵੇਗਾ। ਪਿੰਡਾਂ ਵਿੱਚ ਖੇਡ ਮੈਦਾਨਾਂ ਦੀ ਮੁਰੰਮਤ ਲਈ ਵਿਸ਼ੇਸ਼ ਗ੍ਰਾਂਟਾਂ ਜਾਰੀ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।`,
    isBreaking: false,
    views: 1530,
    status: 'published',
    createdAt: new Date('2026-09-09T17:00:00Z').toISOString()
  },
  {
    id: 'art-8',
    title: 'ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ',
    slug: 'punjab-vidhan-sabha-public-welfare-bills-passed',
    category: 'politics',
    language: 'pa',
    author: 'ਰਾਜਨੀਤਿਕ ਵਿਸ਼ਲੇਸ਼ਕ',
    publicationDate: '8 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸ਼ਾਮ 04:20 ਵਜੇ',
    featuredImage: '/img/index_800x400-image07.jpg',
    excerpt: 'ਸੂਬੇ ਦੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਨਵੇਂ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਬਜਟ ਅਲਾਟ ਕੀਤਾ ਗਿਆ।',
    content: `ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਦੇ ਮੌਨਸੂਨ ਸੈਸ਼ਨ ਦੌਰਾਨ ਕਿਸਾਨਾਂ ਦੀ ਭਲਾਈ, ਨਹਿਰੀ ਪਾਣੀ ਦੇ ਵਿਸਥਾਰ ਅਤੇ ਸਿਹਤ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ ਸੰਬੰਧੀ ਕਈ ਅਹਿਮ ਬਿੱਲਾਂ ਨੂੰ ਸਰਬਸੰਮਤੀ ਨਾਲ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ ਗਈ।

ਵਿਰੋਧੀ ਧਿਰ ਵੱਲੋਂ ਉਠਾਏ ਗਏ ਮੁੱਦਿਆਂ 'ਤੇ ਮੁੱਖ ਮੰਤਰੀ ਨੇ ਵਿਸਥਾਰਪੂਰਵਕ ਜਵਾਬ ਦਿੰਦਿਆਂ ਸੂਬੇ ਦੇ ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ ਨੂੰ ਮਜ਼ਬੂਤ ਦੱਸਿਆ। ਉਨ੍ਹਾਂ ਭਰੋਸਾ ਦਿੱਤਾ ਕਿ ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਵਿਕਾਸ ਲਈ ਵਿਸ਼ੇਸ਼ ਪੈਕੇਜ ਜਾਰੀ ਕੀਤਾ ਜਾਵੇਗਾ।`,
    isBreaking: false,
    views: 1720,
    status: 'published',
    createdAt: new Date('2026-09-08T16:00:00Z').toISOString()
  },
  {
    id: 'art-9',
    title: 'ਗੁਰਦਾਸਪੁਰ ਤੇ ਤਰਨਤਾਰਨ: ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ',
    slug: 'gurdaspur-tarn-taran-canal-water-restored',
    category: 'punjab',
    punjabRegion: 'majha',
    language: 'pa',
    author: 'ਸੁਖਦੇਵ ਸਿੰਘ ਤਰਨਤਾਰਨ',
    publicationDate: '8 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 11:30 ਵਜੇ',
    featuredImage: '/img/index_800x400-image08.jpg',
    excerpt: 'ਨਹਿਰੀ ਵਿਭਾਗ ਵੱਲੋਂ ਟੇਲਾਂ ਤੱਕ ਪਾਣੀ ਪਹੁੰਚਾਉਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਨਿਗਰਾਨ ਟੀਮਾਂ ਤਾਇਨਾਤ।',
    content: `ਸਰਹੱਦੀ ਕਿਸਾਨਾਂ ਦੀ ਲੰਮੇ ਸਮੇਂ ਤੋਂ ਚੱਲੀ ਆ ਰਹੀ ਮੰਗ ਨੂੰ ਪੂਰਾ ਕਰਦਿਆਂ ਨਹਿਰੀ ਵਿਭਾਗ ਨੇ ਅੱਪਰ ਬਾਰੀ ਦੁਆਬ ਨਹਿਰ (UBDC) ਰਾਹੀਂ ਟੇਲਾਂ ਤੱਕ ਪਾਣੀ ਪਹੁੰਚਾਉਣਾ ਯਕੀਨੀ ਬਣਾਇਆ ਹੈ।

ਤਰਨਤਾਰਨ ਦੇ ਪਿੰਡਾਂ ਵਿੱਚ ਕਿਸਾਨਾਂ ਨੇ ਦੱਸਿਆ ਕਿ ਝੋਨੇ ਅਤੇ ਹੋਰ ਸਾਉਣੀ ਫ਼ਸਲਾਂ ਲਈ ਇਹ ਪਾਣੀ ਵਰਦਾਨ ਸਾਬਤ ਹੋਵੇਗਾ ਜਿਸ ਨਾਲ ਧਰਤੀ ਹੇਠਲੇ ਪਾਣੀ ਦੀ ਬੱਚਤ ਹੋਵੇਗੀ।`,
    isBreaking: false,
    views: 1410,
    status: 'published',
    createdAt: new Date('2026-09-08T11:00:00Z').toISOString()
  },
  {
    id: 'art-10',
    title: 'ਪਟਿਆਲਾ ਤੇ ਸੰਗਰੂਰ: ਖੇਤੀਬਾੜੀ ਖੋਜ ਕੇਂਦਰ ਵੱਲੋਂ ਸਾਉਣੀ ਦੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਨਵੀਂ ਐਡਵਾਈਜ਼ਰੀ ਜਾਰੀ',
    slug: 'patiala-sangrur-pau-kharif-crops-advisory',
    category: 'punjab',
    punjabRegion: 'malwa',
    language: 'pa',
    author: 'ਡਾ. ਕੁਲਦੀਪ ਸਿੰਘ ਪੀ.ਏ.ਯੂ.',
    publicationDate: '8 ਸਤੰਬਰ 2026',
    publicationTime: 'ਦੁਪਹਿਰ 01:15 ਵਜੇ',
    featuredImage: '/img/index_800x400-image09.jpg',
    excerpt: 'ਮਾਹਿਰਾਂ ਨੇ ਕਿਸਾਨਾਂ ਨੂੰ ਘੱਟ ਪਾਣੀ ਵਾਲੀਆਂ ਕਿੱਸਮਾਂ ਅਪਣਾਉਣ ਅਤੇ ਤੁਪਕਾ ਸਿੰਜਾਈ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੱਤੀ।',
    content: `ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਲੁਧਿਆਣਾ ਅਤੇ ਪਟਿਆਲਾ ਖੇਤੀ ਖੋਜ ਕੇਂਦਰ ਨੇ ਕਿਸਾਨਾਂ ਲਈ ਮੌਸਮ ਵਿੱਚ ਆ ਰਹੇ ਬਦਲਾਵਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਿਆਂ ਵਿਸ਼ੇਸ਼ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਜਾਰੀ ਕੀਤੇ ਹਨ।

ਮਾਹਿਰਾਂ ਨੇ ਸਲਾਹ ਦਿੱਤੀ ਹੈ ਕਿ ਫ਼ਸਲਾਂ 'ਤੇ ਬੇਲੋੜੀ ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਸਪਰੇਅ ਤੋਂ ਗੁਰੇਜ਼ ਕੀਤਾ ਜਾਵੇ ਅਤੇ ਮਿੱਟੀ ਦੀ ਪਰਖ ਰਿਪੋਰਟ ਦੇ ਆਧਾਰ 'ਤੇ ਹੀ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਜਾਵੇ।`,
    isBreaking: false,
    views: 1290,
    status: 'published',
    createdAt: new Date('2026-09-08T13:00:00Z').toISOString()
  },
  {
    id: 'art-11',
    title: 'ਹੁਸ਼ਿਆਰਪੁਰ ਤੇ ਕਪੂਰਥਲਾ: ਵਾਤਾਵਰਨ ਸੰਭਾਲ ਮੁਹਿੰਮ ਤਹਿਤ ਲੱਖਾਂ ਬੂਟੇ ਲਗਾਉਣ ਦਾ ਟੀਚਾ',
    slug: 'hoshiarpur-kapurthala-green-punjab-mission',
    category: 'punjab',
    punjabRegion: 'doaba',
    language: 'pa',
    author: 'ਮਨਪ੍ਰੀਤ ਕੌਰ',
    publicationDate: '7 ਸਤੰਬਰ 2026',
    publicationTime: 'ਸਵੇਰੇ 10:00 ਵਜੇ',
    featuredImage: '/img/index_800x400-image10.jpg',
    excerpt: 'ਪਿੰਡਾਂ ਅਤੇ ਨਹਿਰਾਂ ਦੇ ਕਿਨਾਰੇ ਹਰਿਆਵਲ ਵਧਾਉਣ ਲਈ ਸਮਾਜ ਸੇਵੀ ਸੰਸਥਾਵਾਂ ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਵੱਡਾ ਸਹਿਯੋਗ।',
    content: `ਸ਼ਿਵਾਲਿਕ ਦੀਆਂ ਪਹਾੜੀਆਂ ਦੀ ਗੋਦ ਵਿੱਚ ਵਸੇ ਹੁਸ਼ਿਆਰਪੁਰ ਅਤੇ ਇਤਿਹਾਸਕ ਸ਼ਹਿਰ ਕਪੂਰਥਲਾ ਵਿੱਚ ਵਣ ਵਿਭਾਗ ਵੱਲੋਂ ‘ਗ੍ਰੀਨ ਪੰਜਾਬ ਮਿਸ਼ਨ’ ਤਹਿਤ ਵਿਸ਼ਾਲ ਬੂਟੇ ਲਗਾਉਣ ਦੀ ਮੁਹਿੰਮ ਵਿੱਢੀ ਗਈ ਹੈ।

ਸਕੂਲਾਂ ਅਤੇ ਕਾਲਜਾਂ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਵੱਲੋਂ ਹਰ ਪਿੰਡ ਵਿੱਚ ਨਿੰਮ, ਟਾਹਲੀ, ਪਿੱਪਲ ਅਤੇ ਬੋਹੜ ਦੇ ਰਵਾਇਤੀ ਰੁੱਖ ਲਗਾਏ ਜਾ ਰਹੇ ਹਨ। ਸਮਾਜ ਸੇਵੀ ਸੰਸਥਾਵਾਂ ਨੇ ਇਨ੍ਹਾਂ ਬੂਟਿਆਂ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਦਾ ਜ਼ਿੰਮਾ ਲਿਆ ਹੈ।`,
    isBreaking: false,
    views: 1150,
    status: 'published',
    createdAt: new Date('2026-09-07T10:00:00Z').toISOString()
  },
  {
    id: 'art-12',
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਕੈਂਪ ਅਤੇ ਦਵਾਈਆਂ ਦੀ ਸਹੂਲਤ',
    slug: 'rural-health-mission-punjab-mobile-vans',
    category: 'health',
    language: 'pa',
    author: 'ਸਿਹਤ ਰਿਪੋਰਟਰ',
    publicationDate: '7 ਸਤੰਬਰ 2026',
    publicationTime: 'ਦੁਪਹਿਰ 12:00 ਵਜੇ',
    featuredImage: '/img/index_800x400-image14.jpg',
    excerpt: 'ਸਿਹਤ ਵਿਭਾਗ ਵੱਲੋਂ ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਮਰੀਜ਼ਾਂ ਦੀ ਮੁਫ਼ਤ ਜਾਂਚ ਅਤੇ ਟੈਸਟ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।',
    content: `ਪੰਜਾਬ ਦੇ ਦੂਰ-ਦੁਰਾਡੇ ਪਿੰਡਾਂ ਵਿੱਚ ਮਿਆਰੀ ਸਿਹਤ ਸਹੂਲਤਾਂ ਪਹੁੰਚਾਉਣ ਲਈ ਸਰਕਾਰ ਵੱਲੋਂ 100 ਨਵੀਆਂ ਮੋਬਾਈਲ ਹੈਲਥ ਕਲੀਨਿਕ ਵੈਨਾਂ ਨੂੰ ਰਵਾਨਾ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਨ੍ਹਾਂ ਵੈਨਾਂ ਵਿੱਚ ਐਮ.ਬੀ.ਬੀ.ਐਸ. ਡਾਕਟਰ, ਲੈਬ ਟੈਕਨੀਸ਼ੀਅਨ ਅਤੇ ਮੁਫ਼ਤ ਦਵਾਈਆਂ ਉਪਲਬਧ ਹਨ।

ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਬਜ਼ੁਰਗਾਂ ਅਤੇ ਔਰਤਾਂ ਲਈ ਸ਼ੂਗਰ, ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਤੇ ਅੱਖਾਂ ਦੀ ਜਾਂਚ ਦੇ ਕੈਂਪ ਲਗਾਏ ਜਾ ਰਹੇ ਹਨ। ਪੇਂਡੂ ਲੋਕਾਂ ਨੇ ਇਸ ਕਦਮ ਦੀ ਭਰਪੂਰ ਸ਼ਲਾਘਾ ਕੀਤੀ ਹੈ।`,
    isBreaking: false,
    views: 1380,
    status: 'published',
    createdAt: new Date('2026-09-07T12:00:00Z').toISOString()
  }
];

export const INITIAL_BREAKING = [
  { id: 'b-1', tag: 'ਪੰਜਾਬ', text: 'ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ 24 ਘੰਟੇ ਲਾਈਵ ਅੱਪਡੇਟ ਅਤੇ ਤਾਜ਼ਾ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਦਾ ਸਿਲਸਿਲਾ ਜਾਰੀ।' },
  { id: 'b-2', tag: 'ਮਾਝਾ', text: 'ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਸਾਹਿਬ ਵਿਖੇ ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਹਰੀ ਝੰਡੀ।' },
  { id: 'b-3', tag: 'ਮਾਲਵਾ', text: 'ਲੁਧਿਆਣਾ ਅਤੇ ਬਠਿੰਡਾ ਵਿੱਚ ਉਦਯੋਗਿਕ ਵਿਕਾਸ ਅਤੇ ਰੁਜ਼ਗਾਰ ਲਈ ਨਵੀਂ ਵਿਸ਼ੇਸ਼ ਨੀਤੀ ਦਾ ਐਲਾਨ।' },
  { id: 'b-4', tag: 'ਦੋਆਬਾ', text: 'ਜਲੰਧਰ ਅਤੇ ਹੁਸ਼ਿਆਰਪੁਰ ਵਿੱਚ ਖੇਡ ਉਦਯੋਗ ਨੂੰ ਹੁਲਾਰਾ ਦੇਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਗ੍ਰਾਂਟ ਮਨਜ਼ੂਰ।' },
  { id: 'b-5', tag: 'ਧਰਮ', text: 'ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ ਰੋਜ਼ਾਨਾ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਮੁੱਖ ਵਾਕ ਵੈੱਬਸਾਈਟ ’ਤੇ ਉਪਲਬਧ।' }
];

/**
 * Storage Helpers
 */
export function getStoredArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
  } catch (e) {
    return INITIAL_ARTICLES;
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
      localStorage.setItem(BREAKING_KEY, JSON.stringify(INITIAL_BREAKING));
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
