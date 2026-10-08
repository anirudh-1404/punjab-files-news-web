/**
 * Image Utilities for High-Pixel & Crisp Display
 * Ensures news photos are never blurred, downscaled, or pixelated on any device screen.
 */

/**
 * Returns a high-resolution, uncompressed or optimal delivery URL for an image.
 * If the image is hosted on Cloudinary, it strips any lossy/low-res transformations
 * and delivers the image at highest visual fidelity (q_auto:best, dpr_auto, f_auto).
 * 
 * @param {string} url - Original image URL
 * @param {object} options - Optional configuration { maxWidth, highQuality }
 * @returns {string} High-resolution image URL
 */
export function getHighResImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return '/img/index_800x400-image01.jpg';
  }

  const trimmed = url.trim();
  if (!trimmed) return '/img/index_800x400-image01.jpg';

  // Check if this is a Cloudinary URL
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    // If it's a raw original URL with no transformations (e.g. /image/upload/v123... or /image/upload/punjab_files/...)
    // Add q_auto:best,dpr_auto,f_auto for maximum clarity on retina/high-DPI screens
    const uploadIndex = trimmed.indexOf('/image/upload/');
    const prefix = trimmed.substring(0, uploadIndex + '/image/upload/'.length);
    let suffix = trimmed.substring(uploadIndex + '/image/upload/'.length);

    // Strip any existing lossy downscaling or low quality parameters if present
    suffix = suffix.replace(/^(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9:]+,?|f_[a-z0-9]+,?|dpr_[a-z0-9.]+,?)+\//i, '');

    // For full article detail view, request highest visual quality (q_auto:best) and auto high-DPI (dpr_auto)
    return `${prefix}f_auto,q_auto:best,dpr_auto/${suffix}`;
  }

  return trimmed;
}

/**
 * Returns a 2x retina-ready card thumbnail URL for news grids and modules.
 * Avoids blurriness on mobile & desktop retina screens by serving double resolution.
 * 
 * @param {string} url - Original image URL
 * @param {number} targetWidth - Expected display width in CSS pixels (default: 600)
 * @returns {string} High-DPI thumbnail URL
 */
export function getCardImageUrl(url, targetWidth = 600) {
  if (!url || typeof url !== 'string') {
    return '/img/index_800x400-image01.jpg';
  }

  const trimmed = url.trim();
  if (!trimmed) return '/img/index_800x400-image01.jpg';

  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    const uploadIndex = trimmed.indexOf('/image/upload/');
    const prefix = trimmed.substring(0, uploadIndex + '/image/upload/'.length);
    let suffix = trimmed.substring(uploadIndex + '/image/upload/'.length);

    // Strip previous transformation
    suffix = suffix.replace(/^(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9:]+,?|f_[a-z0-9]+,?|dpr_[a-z0-9.]+,?)+\//i, '');

    // Request high-quality 2x width with c_limit so the photo is never cropped or cut off
    const retinaWidth = Math.min(targetWidth * 2, 1200);
    return `${prefix}c_limit,w_${retinaWidth},f_auto,q_auto:best,dpr_auto/${suffix}`;
  }

  return trimmed;
}
