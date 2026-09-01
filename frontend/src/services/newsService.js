/**
 * Punjab Files - Real-Time Live Punjabi News & High-Res Images Service
 * Fetches verified live Punjabi news with authentic real photos from ABP Sanjha & BBC Punjabi
 */

const CACHE_KEY = 'punjab_files_live_news_v2';
const CACHE_TTL = 8 * 60 * 1000; // 8 minutes cache

// High quality Punjabi news feeds with real attached image media
const FEEDS = {
  top: 'https://punjabi.abplive.com/home/feed',
  punjab: 'https://punjabi.abplive.com/news/punjab/feed',
  sports: 'https://punjabi.abplive.com/sports/feed',
  world: 'https://punjabi.abplive.com/world/feed',
  entertainment: 'https://punjabi.abplive.com/entertainment/feed',
  bbc: 'https://feeds.bbci.co.uk/punjabi/rss.xml',
  google: 'https://news.google.com/rss?hl=pa&gl=IN&ceid=IN:pa'
};

// Curated authentic Punjab fallback images
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
 * Fetch and parse a single RSS feed via rss2json API
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
 * Extract image URL from item thumbnail, enclosure, or HTML content
 */
function extractImage(item, index) {
  // 1. Direct thumbnail
  if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) {
    let img = item.thumbnail;
    if (img.includes('ichef.bbci.co.uk/ace/ws/240/')) {
      img = img.replace('/ws/240/', '/ws/700/');
    }
    return img;
  }

  // 2. Enclosure
  if (item.enclosure && item.enclosure.link && item.enclosure.link.startsWith('http')) {
    return item.enclosure.link;
  }

  // 3. Regex search for <img> inside description or content
  const html = (item.description || '') + (item.content || '');
  const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  // 4. Fallback from curated templates
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
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
 * Format raw RSS items into standardized news objects with real images
 */
function formatItems(items, defaultCategory = 'ਖ਼ਬਰਾਂ', defaultSource = 'ਪੰਜਾਬ ਫਾਈਲਜ਼') {
  return items.map((item, index) => {
    const { title, source } = parseTitle(item.title);
    const desc = cleanDescription(item.description) || title;
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
 * Get all live Punjabi news categories with real images (with cache)
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
