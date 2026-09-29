import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * RichTextEditor Component
 * Clean, focused WYSIWYG text editor with:
 * - Bold, Italic, Underline, Strikethrough
 * - Bullet List, Numbered List, Blockquote
 * - Alignments (Left, Center, Right, Justify)
 * - Hyperlinks (Insert Link Modal via React Portal & Remove Link)
 * - Horizontal Divider, Clear Formatting, Undo, Redo
 * - Word & Character Counters
 */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'ਇੱਥੇ ਖ਼ਬਰ ਦਾ ਪੂਰਾ ਵੇਰਵਾ ਲਿਖੋ...',
  minHeight = '280px'
}) {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRef = useRef(null);

  // Sync internal HTML content from outside value prop only when it differs
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Notify parent on content change
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If it's just a blank <p><br></p> or <br>, treat as empty
      const isCleanEmpty = html === '<br>' || html === '<p><br></p>' || html.trim() === '';
      const finalVal = isCleanEmpty ? '' : html;
      if (onChange) onChange(finalVal);
    }
  }, [onChange]);

  // Execute standard formatting commands
  const execCmd = (command, cmdValue = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, cmdValue);
    handleInput();
  };

  // Open link modal and save current selection
  const openLinkModal = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      const selectedText = sel.toString();
      setLinkText(selectedText || '');
    } else {
      savedSelectionRef.current = null;
      setLinkText('');
    }
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Apply link
  const applyLink = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }

    let validUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Restore saved selection
    const sel = window.getSelection();
    if (savedSelectionRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }

    const displayText = linkText.trim() || validUrl;

    if (sel && sel.rangeCount > 0 && sel.toString().length > 0) {
      // User had selected text
      if (linkText.trim() && linkText.trim() !== sel.toString()) {
        const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color: #b71c1c; text-decoration: underline;">${displayText}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      } else {
        document.execCommand('createLink', false, validUrl);
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll(`a[href="${validUrl}"]`);
          links.forEach((a) => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            a.style.color = '#b71c1c';
            a.style.textDecoration = 'underline';
          });
        }
      }
    } else {
      // No text was selected: insert anchor with displayText
      const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color: #b71c1c; text-decoration: underline;">${displayText}</a>&nbsp;`;
      document.execCommand('insertHTML', false, linkHtml);
    }

    setShowLinkModal(false);
    handleInput();
  };

  const removeLink = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    execCmd('unlink');
  };

  // Calculate live stats
  const textOnly = (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordsCount = textOnly ? textOnly.split(/\s+/).length : 0;
  const charsCount = textOnly.length;

  return (
    <div
      className="punjab-rich-editor"
      style={{
        border: '1.5px solid #cbd5e1',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* 1. TOP TOOLBAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 10px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          userSelect: 'none'
        }}
      >
        {/* Basic Formats */}
        <ToolbarButton
          icon="fa-bold"
          title="ਮੋਟਾ (Bold - Ctrl+B)"
          onClick={() => execCmd('bold')}
        />
        <ToolbarButton
          icon="fa-italic"
          title="ਤਿਰਛਾ (Italic - Ctrl+I)"
          onClick={() => execCmd('italic')}
        />
        <ToolbarButton
          icon="fa-underline"
          title="ਹੇਠਾਂ ਲਾਈਨ (Underline - Ctrl+U)"
          onClick={() => execCmd('underline')}
        />
        <ToolbarButton
          icon="fa-strikethrough"
          title="ਕੱਟਿਆ ਹੋਇਆ (Strikethrough)"
          onClick={() => execCmd('strikeThrough')}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

        {/* Lists & Quotes */}
        <ToolbarButton
          icon="fa-list-ul"
          title="ਬਿੰਦੀਆਂ ਵਾਲੀ ਸੂਚੀ (Bullet List)"
          onClick={() => execCmd('insertUnorderedList')}
        />
        <ToolbarButton
          icon="fa-list-ol"
          title="ਨੰਬਰਾਂ ਵਾਲੀ ਸੂਚੀ (Numbered List)"
          onClick={() => execCmd('insertOrderedList')}
        />
        <ToolbarButton
          icon="fa-quote-left"
          title="ਵਿਸ਼ੇਸ਼ ਕੋਟੇਸ਼ਨ (Blockquote)"
          onClick={() => execCmd('formatBlock', '<blockquote>')}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

        {/* Alignments */}
        <ToolbarButton
          icon="fa-align-left"
          title="ਖੱਬੇ ਪਾਸੇ (Align Left)"
          onClick={() => execCmd('justifyLeft')}
        />
        <ToolbarButton
          icon="fa-align-center"
          title="ਵਿਚਕਾਰ (Align Center)"
          onClick={() => execCmd('justifyCenter')}
        />
        <ToolbarButton
          icon="fa-align-right"
          title="ਸੱਜੇ ਪਾਸੇ (Align Right)"
          onClick={() => execCmd('justifyRight')}
        />
        <ToolbarButton
          icon="fa-align-justify"
          title="ਬਰਾਬਰ ਪਾਸੇ (Justify)"
          onClick={() => execCmd('justifyFull')}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

        {/* Link Tools */}
        <ToolbarButton
          icon="fa-link"
          title="ਲਿੰਕ ਜੋੜੋ (Insert Hyperlink)"
          onClick={openLinkModal}
        />
        <ToolbarButton
          icon="fa-unlink"
          title="ਲਿੰਕ ਹਟਾਓ (Remove Link)"
          onClick={removeLink}
        />
        <ToolbarButton
          icon="fa-minus"
          title="ਲਾਈਨ ਡਿਵਾਈਡਰ (Horizontal Rule)"
          onClick={() => execCmd('insertHorizontalRule')}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

        {/* Clear Formatting & Undo/Redo */}
        <ToolbarButton
          icon="fa-eraser"
          title="ਸਾਰਾ ਸਟਾਈਲ ਸਾਫ਼ ਕਰੋ (Clear Formatting)"
          onClick={() => execCmd('removeFormat')}
        />
        <ToolbarButton
          icon="fa-undo"
          title="ਵਾਪਸ ਕਰੋ (Undo)"
          onClick={() => execCmd('undo')}
        />
        <ToolbarButton
          icon="fa-repeat"
          title="ਮੁੜ ਕਰੋ (Redo)"
          onClick={() => execCmd('redo')}
        />
      </div>

      {/* 2. EDITOR BODY AREA */}
      <div style={{ position: 'relative' }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{
            minHeight,
            padding: '16px 18px',
            outline: 'none',
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#0f172a',
            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', 'Roboto', sans-serif",
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
          data-placeholder={placeholder}
        />
      </div>

      {/* 3. BOTTOM STATUS & WORD COUNT BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 14px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          fontSize: '11.5px',
          color: '#64748b'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa fa-pencil" style={{ color: '#b71c1c' }}></i>
          <span>ਪੰਜਾਬੀ ਟੈਕਸਟ ਐਡੀਟਰ (Punjab Files Rich Editor)</span>
        </span>

        <span style={{ display: 'flex', gap: '14px', fontWeight: '600' }}>
          <span>ਸ਼ਬਦ (Words): <strong>{wordsCount}</strong></span>
          <span>ਅੱਖਰ (Characters): <strong>{charsCount}</strong></span>
        </span>
      </div>

      {/* 4. MODAL FOR INSERTING LINK (Rendered in React Portal to prevent nested form submissions) */}
      {showLinkModal && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999999,
            padding: '16px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowLinkModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa fa-link" style={{ color: '#b71c1c' }}></i>
                ਲਿੰਕ ਜੋੜੋ (Insert Hyperlink)
              </h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLinkModal(false);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body (NO nested form tag) */}
            <div style={{ padding: '18px 20px 20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਵੈੱਬ ਪਤਾ / URL (Web Address) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      applyLink(e);
                    }
                  }}
                  placeholder="https://example.com"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਲਿੰਕ ਟੈਕਸਟ (Display Text - Optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      applyLink(e);
                    }
                  }}
                  placeholder="ਲਿੰਕ ਉੱਤੇ ਦਿਸਣ ਵਾਲਾ ਟੈਕਸਟ..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLinkModal(false);
                  }}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  ਰੱਦ ਕਰੋ (Cancel)
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  style={{
                    backgroundColor: '#b71c1c',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(183,28,28,0.3)'
                  }}
                >
                  ਲਿੰਕ ਲਗਾਓ (Apply Link)
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Small helper button for editor toolbar
function ToolbarButton({ icon, title, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        if (e) {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        }
        if (onClick) onClick(e);
      }}
      disabled={disabled}
      title={title}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 8px',
        color: disabled ? '#cbd5e1' : '#334155',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '13.5px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s ease, color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#e2e8f0';
          e.currentTarget.style.color = '#0f172a';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#334155';
        }
      }}
    >
      <i className={`fa ${icon}`}></i>
    </button>
  );
}
