/**
 * Date formatting utility for Punjab Files News Portal
 * Provides robust Punjabi, Hindi, and English date formatting
 * Eliminates browser ICU quirks (like '2026 M09 8')
 */

const PUNJABI_MONTHS = [
  'ਜਨਵਰੀ',   // Jan
  'ਫ਼ਰਵਰੀ',   // Feb
  'ਮਾਰਚ',     // Mar
  'ਅਪ੍ਰੈਲ',   // Apr
  'ਮਈ',      // May
  'ਜੂਨ',      // Jun
  'ਜੁਲਾਈ',    // Jul
  'ਅਗਸਤ',    // Aug
  'ਸਤੰਬਰ',   // Sep
  'ਅਕਤੂਬਰ',   // Oct
  'ਨਵੰਬਰ',   // Nov
  'ਦਸੰਬਰ'    // Dec
];

const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format date to clean localized string
 * @param {string|Date} dateInput
 * @param {string} lang - 'pa' | 'hi' | 'en'
 * @returns {string} e.g. "8 ਸਤੰਬਰ, 2026"
 */
export function formatArticleDate(dateInput, lang = 'pa') {
  if (!dateInput) return 'ਅੱਜ';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'ਅੱਜ';

  const day = d.getDate();
  const monthIdx = d.getMonth();
  const year = d.getFullYear();

  if (lang === 'hi') {
    return `${day} ${HINDI_MONTHS[monthIdx]}, ${year}`;
  }
  if (lang === 'en') {
    return `${day} ${ENGLISH_MONTHS[monthIdx]}, ${year}`;
  }
  return `${day} ${PUNJABI_MONTHS[monthIdx]}, ${year}`;
}

/**
 * Format time to 12-hour AM/PM format
 * @param {string|Date} dateInput
 * @returns {string} e.g. "09:30 PM"
 */
export function formatArticleTime(dateInput) {
  if (!dateInput) return 'ਹੁਣੇ';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'ਹੁਣੇ';

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedHours = hours < 10 ? '0' + hours : hours;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
