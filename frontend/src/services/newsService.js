/**
 * Punjab Files - Live Punjabi News Fetching Service
 * Aggregates real-time live Punjabi news from Google News Punjabi & BBC Punjabi
 */

const CACHE_KEY = 'punjab_files_live_news_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

// RSS Endpoints for Punjabi News
const FEEDS = {
  top: 'https://news.google.com/rss?hl=pa&gl=IN&ceid=IN:pa',
  punjab: 'https://news.google.com/rss/search?q=%E0%A8%AA%E0%A9%B0%E0%A8%9C%E0%A8%BE%E0%A8%AC&hl=pa&gl=IN&ceid=IN:pa',
  world: 'https://news.google.com/rss/search?q=%E0%A8%A6%E0%A9%87%E0%A8%B8%E0%A8%BC-%E0%A8%B5%E0%A8%BF%E0%A8%A6%E0%A9%87%E0%A8%B8%E0%A8%BC&hl=pa&gl=IN&ceid=IN:pa',
  sports: 'https://news.google.com/rss/search?q=%E0%A8%96%E0%A9%87%E0%A8%A1%E0%A8%BE%E0%A8%82&hl=pa&gl=IN&ceid=IN:pa',
  bbc: 'https://feeds.bbci.co.uk/punjabi/rss.xml'
};

// Fallback image pool from template assets
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
  '/img/index_800x400-image15.jpg'
];

/**
 * Fetch a single RSS feed via rss2json API
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
 * Clean title to extract headline and source name
 */
function parseTitle(rawTitle) {
  if (!rawTitle) return { title: '', source: 'ਪੰਜਾਬ ਫਾਈਲਜ਼' };
  const lastHyphen = rawTitle.lastIndexOf(' - ');
  if (lastHyphen !== -1) {
    return {
      title: rawTitle.substring(0, lastHyphen).trim(),
      source: rawTitle.substring(lastHyphen + 3).trim()
    };
  }
  return { title: rawTitle.trim(), source: 'ਪੰਜਾਬ ਫਾਈਲਜ਼' };
}

/**
 * Strip HTML tags from description
 */
function cleanDescription(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}

/**
 * Format raw RSS items into standardized news objects
 */
function formatItems(items, defaultCategory = 'ਖ਼ਬਰਾਂ') {
  return items.map((item, index) => {
    const { title, source } = parseTitle(item.title);
    const desc = cleanDescription(item.description) || title;
    const thumbnail = item.thumbnail || (item.enclosure && item.enclosure.link) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    
    return {
      id: item.guid || item.link || String(index),
      title,
      source,
      desc,
      category: defaultCategory,
      img: thumbnail,
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString()
    };
  });
}

/**
 * Get all live Punjabi news categories (with cache)
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

  // Fetch all feeds in parallel
  const [topItems, punjabItems, worldItems, sportsItems, bbcItems] = await Promise.all([
    fetchFeed(FEEDS.top),
    fetchFeed(FEEDS.punjab),
    fetchFeed(FEEDS.world),
    fetchFeed(FEEDS.sports),
    fetchFeed(FEEDS.bbc)
  ]);

  const formattedTop = formatItems(topItems, 'ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼');
  const formattedPunjab = formatItems(punjabItems, 'ਪੰਜਾਬ');
  const formattedWorld = formatItems(worldItems, 'ਦੇਸ਼-ਵਿਦੇਸ਼');
  const formattedSports = formatItems(sportsItems, 'ਖੇਡਾਂ');
  const formattedBBC = formatItems(bbcItems, 'ਵਿਸ਼ੇਸ਼ ਖ਼ਬਰਾਂ');

  const combined = {
    breaking: formattedTop.length > 0 ? formattedTop : null,
    punjab: formattedPunjab.length > 0 ? formattedPunjab : null,
    world: formattedWorld.length > 0 ? formattedWorld : null,
    sports: formattedSports.length > 0 ? formattedSports : null,
    bbc: formattedBBC.length > 0 ? formattedBBC : null,
    all: [...formattedTop, ...formattedPunjab, ...formattedWorld, ...formattedSports, ...formattedBBC]
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
