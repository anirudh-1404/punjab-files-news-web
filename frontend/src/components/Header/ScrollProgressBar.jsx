import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${scrollProgress}%`,
        background: 'linear-gradient(90deg, #b71c1c 0%, #ebb10d 50%, #e11d48 100%)',
        boxShadow: '0 0 10px rgba(183, 28, 28, 0.6)',
        zIndex: 999999,
        transition: 'width 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
        pointerEvents: 'none'
      }}
    />
  );
}
