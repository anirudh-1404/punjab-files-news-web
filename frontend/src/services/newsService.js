/**
 * Punjab Files - Real-Time Live Punjabi News & Clean Media Service
 */

const CACHE_KEY = 'punjab_files_live_news_v5';
const CACHE_TTL = 8 * 60 * 1000; // 8 minutes cache

// High quality Punjabi news feeds
const FEEDS = {
  top: 'https://punjabi.abplive.com/home/feed',
  punjab: 'https://punjabi.abplive.com/news/punjab/feed',
  sports: 'https://punjabi.abplive.com/sports/feed',
  world: 'https://punjabi.abplive.com/world/feed',
  entertainment: 'https://punjabi.abplive.com/entertainment/feed',
  bbc: 'https://feeds.bbci.co.uk/punjabi/rss.xml'
};

// Curated high-definition template photos
const FALLBACK_IMAGES = [
  '/img/index_800x400-image01.jpg',
  '/img/index_800x400-image02.jpg',
  '/img/index_800x400-image03.jpg',
  '/img/index_800x400-image04.jpg',
  '/img/index_800x400-image05.jpg',
  '/img/index_800x400-image06.jpg',
  '/img/index_800x400-image07.jpg',
  '/img/index_800x400-image08.jpg',
  '/img/index_800x400-image09.jpg',
  '/img/index_800x400-image10.jpg',
  '/img/index_800x400-image14.jpg',
  '/img/index_800x400-image15.jpg',
  '/img/index_800x400-image18.jpg',
  '/img/index_800x400-image19.jpg',
  '/img/index_800x400-image20.jpg'
];

/**
 * Fetch and parse a single RSS feed
 */
async function fetchFeed(url) {
  try {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.status === 'ok' && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch feed:', url, err);
    return [];
  }
}

/**
 * Clean and extract image URL from item
 */
function extractImage(item, index) {
  if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) {
    let img = item.thumbnail;
    if (img.includes('ichef.bbci.co.uk/ace/ws/240/')) {
      img = img.replace('/ws/240/', '/ws/700/');
    }
    return img;
  }

  if (item.enclosure && item.enclosure.link && item.enclosure.link.startsWith('http')) {
    return item.enclosure.link;
  }

  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

/**
 * Clean title to extract headline and source
 */
function parseTitle(rawTitle) {
  if (!rawTitle) return { title: '', source: 'ਪੰਜਾਬ ਫਾਈਲਜ਼' };
  
  // Strip any HTML tags from title as well
  let title = rawTitle
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();

  const lastHyphen = title.lastIndexOf(' - ');
  if (lastHyphen !== -1) {
    return {
      title: title.substring(0, lastHyphen).trim(),
      source: title.substring(lastHyphen + 3).trim()
    };
  }
  return { title, source: 'ਪੰਜਾਬ ਫਾਈਲਜ਼' };
}

/**
 * 100% Robust HTML & tag stripper for description text
 */
function cleanDescription(rawHtml, fallbackTitle = '') {
  if (!rawHtml) return fallbackTitle;

  // 1. Unescape HTML entities so tags become real <tag>
  let unescaped = rawHtml
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');

  // 2. Strip all HTML tags completely with regex
  let text = unescaped.replace(/<[^>]*>?/gm, ' ');

  // 3. Strip promotional boilerplate text
  text = text
    .replace(/ਨੋਟ:.*?ਲਈ ਸਾਡੇ ਐਪ ਨੂੰ ਡਾਊਨਲੋਡ ਕਰੋ.*?।?/gi, '')
    .replace(/ਜੇ ਤੁਸੀਂ ਵੀਡੀਓ ਦੇਖਣਾ ਚਾਹੁੰਦੇ ਹੋ.*?ਸਬਸਕ੍ਰਾਈਬ ਕਰ ਲਵੋ.*?।?/gi, '')
    .replace(/ABP ਸਾਂਝਾ ਸਾਰੇ ਸੋਸ਼ਲ ਮੀਡੀਆ.*?।?/gi, '')
    .replace(/Published.*?IST/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text || text.length < 15) {
    return fallbackTitle;
  }

  // 4. Truncate cleanly to ~230 characters with ellipsis
  if (text.length > 230) {
    return text.substring(0, 225).trim() + '...';
  }
  return text;
}

/**
 * Format raw RSS items into standardized clean objects
 */
function formatItems(items, defaultCategory = 'ਖ਼ਬਰਾਂ', defaultSource = 'ਪੰਜਾਬ ਫਾਈਲਜ਼') {
  return items.map((item, index) => {
    const { title, source } = parseTitle(item.title);
    const desc = cleanDescription(item.description, title);
    const img = extractImage(item, index);
    
    return {
      id: item.guid || item.link || String(index),
      title,
      source: source === 'ਪੰਜਾਬ ਫਾਈਲਜ਼' ? defaultSource : source,
      desc,
      category: defaultCategory,
      img,
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString()
    };
  });
}

/**
 * Get all live Punjabi news categories
 */
export async function getLivePunjabiNews() {
  // Check local cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }

  // Fetch feeds
  const [topItems, punjabItems, sportsItems, worldItems, bbcItems] = await Promise.all([
    fetchFeed(FEEDS.top),
    fetchFeed(FEEDS.punjab),
    fetchFeed(FEEDS.sports),
    fetchFeed(FEEDS.world),
    fetchFeed(FEEDS.bbc)
  ]);

  const formattedTop = formatItems(topItems, 'ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼', 'ਪੰਜਾਬ ਨਿਊਜ਼');
  const formattedPunjab = formatItems(punjabItems, 'ਪੰਜਾਬ', 'ਪੰਜਾਬ ਸਪੈਸ਼ਲ');
  const formattedSports = formatItems(sportsItems, 'ਖੇਡਾਂ', 'ਸਪੋਰਟਸ ਡੈਸਕ');
  const formattedWorld = formatItems(worldItems, 'ਦੇਸ਼-ਵਿਦੇਸ਼', 'ਕੌਮਾਂਤਰੀ ਡੈਸਕ');
  const formattedBBC = formatItems(bbcItems, 'ਵਿਸ਼ੇਸ਼ ਖ਼ਬਰਾਂ', 'ਬੀਬੀਸੀ ਪੰਜਾਬੀ');

  const combined = {
    breaking: formattedTop.length > 0 ? formattedTop : null,
    punjab: formattedPunjab.length > 0 ? formattedPunjab : null,
    sports: formattedSports.length > 0 ? formattedSports : null,
    world: formattedWorld.length > 0 ? formattedWorld : null,
    bbc: formattedBBC.length > 0 ? formattedBBC : null,
    all: [
      ...formattedTop,
      ...formattedPunjab,
      ...formattedSports,
      ...formattedWorld,
      ...formattedBBC
    ]
  };

  // Cache data
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: combined
      })
    );
  } catch (e) {
    // Ignore storage errors
  }

  return combined;
}
