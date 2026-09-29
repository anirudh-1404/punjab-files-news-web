import React, { useEffect } from 'react';

/**
 * Reusable ActionModal component to replace native browser window.alert() and window.confirm()
 * Props:
 *  - isOpen (boolean): whether modal is displayed
 *  - type ('confirm' | 'alert' | 'error' | 'success' | 'info')
 *  - title (string): modal heading
 *  - message (string): description message (supports \n newlines)
 *  - confirmLabel (string, optional): label for confirm button
 *  - cancelLabel (string, optional): label for cancel button
 *  - confirmColor (string, optional): background color for confirm button
 *  - onConfirm (function): called on confirmation
 *  - onClose (function): called on cancel or dismiss
 */
export default function ActionModal({
  isOpen,
  type = 'alert',
  title,
  message,
  confirmLabel,
  cancelLabel = 'ਰੱਦ ਕਰੋ (Cancel)',
  confirmColor,
  onConfirm,
  onClose
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isConfirm = type === 'confirm';
  const isError = type === 'error';
  const isSuccess = type === 'success';

  let iconClass = 'fa-info-circle';
  let iconColor = '#2563eb';
  let iconBg = '#eff6ff';
  let defaultBtnBg = '#1c2d5a';
  let defaultConfirmText = 'ਠੀਕ ਹੈ (OK)';

  if (isConfirm) {
    iconClass = 'fa-exclamation-triangle';
    iconColor = '#b71c1c';
    iconBg = '#fee2e2';
    defaultBtnBg = '#b71c1c';
    defaultConfirmText = 'ਹਾਂ, ਡਿਲੀਟ ਕਰੋ (Yes, Delete)';
  } else if (isError) {
    iconClass = 'fa-times-circle';
    iconColor = '#dc2626';
    iconBg = '#fee2e2';
    defaultBtnBg = '#dc2626';
    defaultConfirmText = 'ਬੰਦ ਕਰੋ (Close)';
  } else if (isSuccess) {
    iconClass = 'fa-check-circle';
    iconColor = '#16a34a';
    iconBg = '#dcfce7';
    defaultBtnBg = '#16a34a';
    defaultConfirmText = 'ਠੀਕ ਹੈ (Done)';
  }

  const handleBackdropClick = () => {
    if (!isConfirm) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999999,
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'popupScaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 22px 14px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <i className={`fa ${iconClass}`} style={{ color: iconColor, fontSize: '18px' }}></i>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '16.5px',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.2px',
              flex: 1
            }}
          >
            {title || (isConfirm ? 'ਪੁਸ਼ਟੀ ਕਰੋ (Confirmation)' : 'ਸੂਚਨਾ (Notice)')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px 22px 22px' }}>
          <p
            style={{
              margin: '0 0 22px',
              fontSize: '13.5px',
              color: '#334155',
              lineHeight: '1.7',
              whiteSpace: 'pre-line'
            }}
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {isConfirm && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '7px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                {cancelLabel}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isConfirm && onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
              style={{
                backgroundColor: confirmColor || defaultBtnBg,
                border: 'none',
                borderRadius: '7px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                transition: 'opacity 0.15s ease'
              }}
            >
              {confirmLabel || defaultConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
