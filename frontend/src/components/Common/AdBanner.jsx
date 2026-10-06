import React, { useState, useEffect } from 'react';
import { adAPI } from '../../services/api';

export default function AdBanner({
  slot,
  className = '',
  style = {},
  containerStyle = {},
  containerClassName = ''
}) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSlotAd = async () => {
    if (!slot) return;
    try {
      setLoading(true);
      const res = await adAPI.getActive({ slot });
      if (res?.data && res.data.length > 0) {
        setAd(res.data[0]);
      } else {
        setAd(null);
      }
    } catch (err) {
      setAd(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotAd();

    const handleUpdate = () => {
      fetchSlotAd();
    };

    window.addEventListener('punjab_ads_updated', handleUpdate);
    return () => {
      window.removeEventListener('punjab_ads_updated', handleUpdate);
    };
  }, [slot]);

  const handleClick = () => {
    if (ad?._id) {
      adAPI.trackClick(ad._id);
    }
  };

  // If loading or no active ad found, completely hide the section (no empty boxes)
  if (loading || !ad || !ad.imageUrl) {
    return null;
  }

  const isLink = Boolean(ad.targetUrl && ad.targetUrl.trim());

  const content = (
    <div
      className={`punjab-ad-banner ${className}`}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        backgroundColor: '#0f172a',
        textAlign: 'center',
        ...style
      }}
    >
      {/* Subtle Sponsor Indicator Pill */}
      <span
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#cbd5e1',
          fontSize: '9px',
          fontWeight: '800',
          padding: '1px 5px',
          borderRadius: '3px',
          letterSpacing: '0.4px',
          zIndex: 2,
          backdropFilter: 'blur(3px)'
        }}
      >
        ਇਸ਼ਤਿਹਾਰ • AD
      </span>

      <img
        src={ad.imageUrl}
        alt={ad.title || 'Punjab Files Advertisement'}
        loading="lazy"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: slot.includes('halfpage') ? '600px' : '320px',
          objectFit: 'cover',
          display: 'block',
          margin: '0 auto',
          transition: 'transform 0.25s ease'
        }}
        onMouseEnter={(e) => {
          if (isLink) e.currentTarget.style.transform = 'scale(1.01)';
        }}
        onMouseLeave={(e) => {
          if (isLink) e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </div>
  );

  const bannerElement = isLink ? (
    <a
      href={ad.targetUrl}
      target={ad.openInNewTab !== false ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={{ textDecoration: 'none', display: 'block' }}
      title={ad.title}
    >
      {content}
    </a>
  ) : (
    content
  );

  if (containerClassName || Object.keys(containerStyle).length > 0) {
    return (
      <div className={containerClassName} style={containerStyle}>
        {bannerElement}
      </div>
    );
  }

  return bannerElement;
}
