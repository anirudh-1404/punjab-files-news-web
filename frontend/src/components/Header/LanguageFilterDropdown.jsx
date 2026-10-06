import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageFilterDropdown({ isCompact = false }) {
  const { language, setLanguage, languages, activeLangObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="header-language-filter-dropdown notranslate"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        zIndex: 10010
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="ਖ਼ਬਰਾਂ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ (Select News Language)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: isCompact ? '6px' : '8px',
          backgroundColor: '#ffffff',
          color: '#1c2d5a',
          border: isOpen ? '1.5px solid #b71c1c' : '1.5px solid #cbd5e1',
          borderRadius: isCompact ? '6px' : '8px',
          padding: isCompact ? '4px 8px' : '8px 14px',
          fontSize: isCompact ? '11.5px' : '13px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(183, 28, 28, 0.12), 0 2px 6px rgba(0,0,0,0.06)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.18s ease-in-out'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#b71c1c';
            e.currentTarget.style.boxShadow = '0 3px 8px rgba(183, 28, 28, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
          }
        }}
      >
        <div
          style={{
            width: isCompact ? '18px' : '24px',
            height: isCompact ? '18px' : '24px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            color: '#b71c1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isCompact ? '10px' : '13px',
            flexShrink: 0
          }}
        >
          <i className="fa fa-language"></i>
        </div>

        <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
          {!isCompact && (
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: '800',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              ਖ਼ਬਰਾਂ ਦੀ ਭਾਸ਼ਾ
            </span>
          )}
          <span
            style={{
              display: 'block',
              fontSize: isCompact ? '12px' : '13px',
              fontWeight: '800',
              color: '#1c2d5a'
            }}
          >
            {activeLangObj.label}
          </span>
        </div>

        <i
          className="fa fa-chevron-down"
          style={{
            fontSize: isCompact ? '9px' : '11px',
            color: '#94a3b8',
            marginLeft: '2px',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        ></i>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: isCompact ? 'auto' : 0,
            right: isCompact ? 0 : 'auto',
            minWidth: '185px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 28px -4px rgba(28, 45, 90, 0.16), 0 4px 12px rgba(0,0,0,0.06)',
            padding: '6px',
            zIndex: 10020,
            animation: 'fadeInMenu 0.15s ease-out'
          }}
        >
          <div
            style={{
              padding: '6px 10px 4px',
              fontSize: '10.5px',
              fontWeight: '800',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '4px'
            }}
          >
            ਭਾਸ਼ਾ ਚੁਣੋ (Choose Language)
          </div>

          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <div
                key={item.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectLanguage(item.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isSelected ? '800' : '600',
                  color: isSelected ? '#b71c1c' : '#334155',
                  backgroundColor: isSelected ? '#fef2f2' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#334155';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#b71c1c' : '#cbd5e1',
                      display: 'inline-block'
                    }}
                  ></span>
                  <span>{item.label}</span>
                </div>

                {isSelected ? (
                  <i
                    className="fa fa-check"
                    style={{
                      color: '#b71c1c',
                      fontSize: '12px',
                      fontWeight: '900'
                    }}
                  ></i>
                ) : (
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '700' }}>
                    {item.code.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
