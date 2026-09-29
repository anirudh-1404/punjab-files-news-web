/**
 * Gurmukhi to English (Roman) Transliteration and Slug Generator
 * Ensures that all article slugs/URLs are 100% clean English ASCII strings.
 */

export const GURMUKHI_WORD_MAP = {
  // Cities & Regions
  'ਅੰਮ੍ਰਿਤਸਰ': 'amritsar',
  'ਲੁਧਿਆਣਾ': 'ludhiana',
  'ਜਲੰਧਰ': 'jalandhar',
  'ਪਟਿਆਲਾ': 'patiala',
  'ਬਠਿੰਡਾ': 'bathinda',
  'ਮੋਹਾਲੀ': 'mohali',
  'ਚੰਡੀਗੜ੍ਹ': 'chandigarh',
  'ਤਰਨਤਾਰਨ': 'tarn-taran',
  'ਤਰਨ-ਤਾਰਨ': 'tarn-taran',
  'ਗੁਰਦਾਸਪੁਰ': 'gurdaspur',
  'ਹੁਸ਼ਿਆਰਪੁਰ': 'hoshiarpur',
  'ਕਪੂਰਥਲਾ': 'kapurthala',
  'ਸੰਗਰੂਰ': 'sangrur',
  'ਬਰਨਾਲਾ': 'barnala',
  'ਮਾਨਸਾ': 'mansa',
  'ਫ਼ਰੀਦਕੋਟ': 'faridkot',
  'ਫਰੀਦਕੋਟ': 'faridkot',
  'ਮੋਗਾ': 'moga',
  'ਫ਼ਿਰੋਜ਼ਪੁਰ': 'ferozepur',
  'ਫਿਰੋਜ਼ਪੁਰ': 'ferozepur',
  'ਫ਼ਾਜ਼ਿਲਕਾ': 'fazilka',
  'ਫਾਜ਼ਿਲਕਾ': 'fazilka',
  'ਮੁਕਤਸਰ': 'muktsar',
  'ਰੂਪਨਗਰ': 'rupnagar',
  'ਰੋਪੜ': 'ropar',
  'ਫ਼ਤਹਿਗੜ੍ਹ': 'fatehgarh',
  'ਫਤਹਿਗੜ੍ਹ': 'fatehgarh',
  'ਸਾਹਿਬ': 'sahib',
  'ਪੰਜਾਬ': 'punjab',
  'ਮਾਝਾ': 'majha',
  'ਮਾਲਵਾ': 'malwa',
  'ਦੋਆਬਾ': 'doaba',
  'ਦਿੱਲੀ': 'delhi',
  'ਕੈਨੇਡਾ': 'canada',
  'ਅਮਰੀਕਾ': 'america',
  'ਇੰਡੀਆ': 'india',
  'ਭਾਰਤ': 'india',
  'ਇੰਗਲੈਂਡ': 'uk',
  'ਲੰਡਨ': 'london',

  // Common News Terms & Concepts
  'ਸਮਾਰਟ': 'smart',
  'ਸਿਟੀ': 'city',
  'ਪ੍ਰਾਜੈਕਟ': 'project',
  'ਪ੍ਰੋਜੈਕਟ': 'project',
  'ਹੈਰੀਟੇਜ': 'heritage',
  'ਸਟਰੀਟ': 'street',
  'ਸੁੰਦਰੀਕਰਨ': 'beautification',
  'ਈ-ਬੱਸ': 'e-bus',
  'ਬੱਸ': 'bus',
  'ਸੇਵਾ': 'service',
  'ਸੇਵਾਵਾਂ': 'services',
  'ਨਵਾਂ': 'new',
  'ਨਵੀਂ': 'new',
  'ਨਵੇਂ': 'new',
  'ਪੜ੍ਹਾਅ': 'phase',
  'ਸ਼ੁਰੂ': 'started',
  'ਐਲਾਨ': 'announcement',
  'ਸਰਕਾਰ': 'government',
  'ਮੁੱਖ': 'chief',
  'ਮੰਤਰੀ': 'minister',
  'ਮੁੱਖਮੰਤਰੀ': 'cm',
  'ਵਿਧਾਨ': 'vidhan',
  'ਸਭਾ': 'sabha',
  'ਪੁਲਿਸ': 'police',
  'ਕਿਸਾਨ': 'farmers',
  'ਕਿਸਾਨਾਂ': 'farmers',
  'ਖੇਤੀਬਾੜੀ': 'agriculture',
  'ਖ਼ਬਰਾਂ': 'news',
  'ਖ਼ਬਰ': 'news',
  'ਖਬਰਾਂ': 'news',
  'ਖਬਰ': 'news',
  'ਤਾਜ਼ਾ': 'latest',
  'ਵੱਡੀ': 'breaking',
  'ਲਾਈਵ': 'live',
  'ਅਪਡੇਟ': 'update',
  'ਅਲਰਟ': 'alert',
  'ਸਿਹਤ': 'health',
  'ਸਿੱਖਿਆ': 'education',
  'ਸਕੂਲ': 'school',
  'ਕਾਲਜ': 'college',
  'ਹਸਪਤਾਲ': 'hospital',
  'ਦਰਬਾਰ': 'darbar',
  'ਮੁੱਖਵਾਕ': 'mukhwak',
  'ਹੁਕਮਨਾਮਾ': 'hukamnama',
  'ਗੁਰਦੁਆਰਾ': 'gurdwara',
  'ਸੱਚਖੰਡ': 'sachkhand',
  'ਸ੍ਰੀ': 'sri',
  'ਹਰਿਮੰਦਰ': 'harmandir',
  'ਮਨੋਰੰਜਨ': 'entertainment',
  'ਸੈਰ-ਸਪਾਟਾ': 'tourism',
  'ਸੈਰ': 'travel',
  'ਖੇਡਾਂ': 'sports',
  'ਮੌਸਮ': 'weather',
  'ਮੀਂਹ': 'rain',
  'ਗਰਮੀ': 'heat',
  'ਠੰਢ': 'cold',
  'ਹੜ੍ਹ': 'flood',
  'ਅੱਗ': 'fire',
  'ਹਾਦਸਾ': 'accident',
  'ਕਤਲ': 'murder',
  'ਗ੍ਰਿਫ਼ਤਾਰ': 'arrested',
  'ਗ੍ਰਿਫਤਾਰ': 'arrested',
  'ਅਤੇ': 'and',
  'ਦੇ': 'de',
  'ਦਾ': 'da',
  'ਦੀ': 'di',
  'ਵਿੱਚ': 'in',
  'ਨੂੰ': 'nu',
  'ਨੇ': 'ne',
  'ਤੋਂ': 'from',
  'ਲਈ': 'for',
  'ਤੇ': 'on',
  'ਨਾਲ': 'with'
};

const CHAR_MAP = {
  // Independent Vowels
  'ੳ': 'u', 'ਅ': 'a', 'ਆ': 'aa', 'ਇ': 'i', 'ਈ': 'ee', 'ਉ': 'u', 'ਊ': 'oo', 'ਏ': 'e', 'ਐ': 'ai', 'ਓ': 'o', 'ਔ': 'au',
  // Consonants
  'ਕ': 'k', 'ਖ': 'kh', 'ਗ': 'g', 'ਘ': 'gh', 'ਙ': 'ng',
  'ਚ': 'ch', 'ਛ': 'chh', 'ਜ': 'j', 'ਝ': 'jh', 'ਞ': 'ny',
  'ਟ': 't', 'ਠ': 'th', 'ਡ': 'd', 'ਢ': 'dh', 'ਣ': 'n',
  'ਤ': 't', 'ਥ': 'th', 'ਦ': 'd', 'ਧ': 'dh', 'ਨ': 'n',
  'ਪ': 'p', 'ਫ': 'ph', 'ਬ': 'b', 'ਭ': 'bh', 'ਮ': 'm',
  'ਯ': 'y', 'ਰ': 'r', 'ਲ': 'l', 'ਲ਼': 'l', 'ਵ': 'v', 'ੜ': 'r',
  'ਸ਼': 'sh', 'ਖ਼': 'kh', 'ਗ਼': 'gh', 'ਜ਼': 'z', 'ਫ਼': 'f',
  // Matras (Vowel signs)
  'ਾ': 'a', 'ਿ': 'i', 'ੀ': 'ee', 'ੁ': 'u', 'ੂ': 'oo', 'ੇ': 'e', 'ੈ': 'ai', 'ੋ': 'o', 'ੌ': 'au',
  'ੰ': 'n', 'ਂ': 'n', 'ੱ': '', '੍': '', 'ੴ': 'ik-onkar'
};

/**
 * Transliterates Gurmukhi text into English / Roman script.
 */
export function transliterateGurmukhiToEnglish(text) {
  if (!text || typeof text !== 'string') return '';

  const words = text
    .replace(/[^\w\s\u0A00-\u0A7F-]/g, ' ')
    .trim()
    .split(/\s+/);

  const translatedWords = words.map((w) => {
    const cleanWord = w.trim();
    if (!cleanWord) return '';

    if (GURMUKHI_WORD_MAP[cleanWord]) {
      return GURMUKHI_WORD_MAP[cleanWord];
    }

    if (/^[a-zA-Z0-9-]+$/.test(cleanWord)) {
      return cleanWord.toLowerCase();
    }

    let res = '';
    for (let i = 0; i < cleanWord.length; i++) {
      const ch = cleanWord[i];
      if (CHAR_MAP[ch] !== undefined) {
        res += CHAR_MAP[ch];
      } else if (/[a-zA-Z0-9]/.test(ch)) {
        res += ch.toLowerCase();
      }
    }
    return res;
  });

  return translatedWords
    .filter(Boolean)
    .join('-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates an SEO-friendly, 100% English slug.
 */
export function generateEnglishSlug(text, customSlug = '') {
  if (customSlug && typeof customSlug === 'string' && customSlug.trim()) {
    const sanitized = transliterateGurmukhiToEnglish(customSlug);
    if (sanitized) return sanitized;
  }

  const baseEnglish = transliterateGurmukhiToEnglish(text || 'news');
  const words = baseEnglish.split('-').filter(Boolean);
  const conciseSlug = words.slice(0, 10).join('-') || 'news-update';
  const timestampSuffix = Date.now().toString(36);

  return `${conciseSlug}-${timestampSuffix}`;
}
