// Google Translate Programmatic Integration Service

/**
 * Sets the googtrans cookie for Google Translate
 * @param {string} lang - 'pa', 'hi', or 'en'
 */
export function setGoogleTranslateCookie(lang) {
  if (typeof window === 'undefined') return;

  const hostname = window.location.hostname;
  const cookieValue = lang === 'pa' ? '/pa/pa' : `/pa/${lang}`;

  // Clear previous root & domain cookies
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

  // Set new cookie across root and domain
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;
}

/**
 * Programmatically triggers Google Translate without showing Google UI
 * @param {string} lang - 'pa', 'hi', or 'en'
 */
export function triggerGoogleTranslate(lang) {
  if (typeof window === 'undefined') return;

  setGoogleTranslateCookie(lang);

  // If returning to native Punjabi, a quick reload is cleanest to reset Google DOM mutations
  if (lang === 'pa') {
    setTimeout(() => {
      window.location.reload();
    }, 100);
    return;
  }

  // Attempt in-place select change if Google Translate combo exists
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change'));
  } else {
    // If combo is not yet in DOM, reload will apply the googtrans cookie
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }
}
