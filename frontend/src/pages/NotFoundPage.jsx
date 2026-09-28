import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ | Punjab Files';
    window.scrollTo(0, 0);
  }, []);

  const popularLinks = [
    { label: 'ਪੰਜਾਬ ਖ਼ਬਰਾਂ (Punjab News)', path: '/category/punjab' },
    { label: 'ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਮੁੱਖ ਵਾਕ', path: '/' },
    { label: 'ਖੇਡਾਂ (Sports)', path: '/category/sports' },
    { label: 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)', path: '/category/world' },
    { label: 'ਮਨੋਰੰਜਨ (Entertainment)', path: '/category/entertainment' },
    { label: 'ਸੰਪਰਕ ਕਰੋ (Contact Bureau)', path: '/contact' }
  ];

  return (
    <main
      id="not-found-page"
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '70vh',
        padding: '60px 15px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '45px 35px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Big 404 Badge */}
        <div
          style={{
            display: 'inline-block',
            fontSize: '80px',
            fontWeight: '900',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #b71c1c 0%, #ebb10d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            marginBottom: '15px'
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 12px',
            lineHeight: '1.4'
          }}
        >
          ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ (Page Not Found)
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.6',
            maxWidth: '520px',
            margin: '0 auto 28px'
          }}
        >
          ਮਾਫ਼ ਕਰਨਾ, ਜਿਸ ਖ਼ਬਰ ਜਾਂ ਪੰਨੇ ਦੀ ਤੁਸੀਂ ਭਾਲ ਕਰ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਹੈ, ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ ਜਾਂ ਇਸਦਾ ਪਤਾ (URL) ਬਦਲ ਚੁੱਕਾ ਹੈ।
        </p>

        {/* Main CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '35px'
          }}
        >
          <Link
            to="/"
            style={{
              backgroundColor: '#b71c1c',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(183, 28, 28, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#991b1b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#b71c1c';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <i className="fa fa-home"></i>
            <span>ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਜਾਓ (Home)</span>
          </Link>

          <Link
            to="/search"
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e293b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0f172a';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <i className="fa fa-search"></i>
            <span>ਖ਼ਬਰਾਂ ਖੋਜੋ (Search News)</span>
          </Link>

          <Link
            to="/contact"
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              padding: '11px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#b71c1c';
              e.currentTarget.style.color = '#b71c1c';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <i className="fa fa-envelope-o"></i>
            <span>ਸੰਪਰਕ ਕਰੋ (Contact)</span>
          </Link>
        </div>

        {/* Popular Categories Shortcut */}
        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '25px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '700',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '14px'
            }}
          >
            ਪ੍ਰਮੁੱਖ ਸੈਕਸ਼ਨ (Popular Sections)
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {popularLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                style={{
                  fontSize: '12.5px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#b71c1c';
                  e.currentTarget.style.color = '#b71c1c';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
