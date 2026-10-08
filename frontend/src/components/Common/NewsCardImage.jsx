import React from 'react';
import { getCardImageUrl } from '../../services/imageUtils';

/**
 * NewsCardImage: High-fidelity image component for news cards & modules
 * Ensures photos are NEVER cropped or cut off, regardless of aspect ratio (portrait, square, or landscape).
 * Uses a crisp foreground image (object-fit: contain) over an ambient blurred background.
 */
export default function NewsCardImage({
  src,
  alt = '',
  height = '175px',
  fallbackSrc = '/img/index_370x185-image01.jpg',
  className = '',
  style = {}
}) {
  const imageUrl = getCardImageUrl(src, 400);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        overflow: 'hidden',
        backgroundColor: '#0a0f1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      className={`news-card-image-wrap ${className}`}
    >
      {/* 1. Ambient blurred background matching the photo colors */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackSrc;
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(16px) brightness(0.6)',
          transform: 'scale(1.25)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />

      {/* 2. Main uncropped photo: 100% visible, zero faces or heads cut off */}
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackSrc;
        }}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          transition: 'transform 0.3s ease',
          imageRendering: '-webkit-optimize-contrast'
        }}
      />
    </div>
  );
}
