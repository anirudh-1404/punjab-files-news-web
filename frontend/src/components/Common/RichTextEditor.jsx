import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * RichTextEditor Component
 * Full-featured WYSIWYG text editor with:
 * - Bold, Italic, Underline, Strikethrough
 * - Headings (H2, H3, Paragraph)
 * - Lists (Bullet, Numbered)
 * - Blockquote
 * - Hyperlink (Add / Remove) with styled URL modal
 * - Text Alignments (Left, Center, Right, Justify)
 * - Horizontal Divider, Undo, Redo, Clear Formatting
 * - Raw HTML Source Toggle (<>)
 * - Word & Character Count
 */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'ਇੱਥੇ ਖ਼ਬਰ ਦਾ ਪੂਰਾ ਵੇਰਵਾ ਲਿਖੋ...',
  minHeight = '280px'
}) {
  const editorRef = useRef(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value || '');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRef = useRef(null);

  // Sync internal HTML content from outside value prop only when it differs
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setSourceCode(value || '');
  }, [value, isSourceMode]);

  // Notify parent on content change
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If it's just a blank <p><br></p> or <br>, treat as empty
      const isCleanEmpty = html === '<br>' || html === '<p><br></p>' || html.trim() === '';
      const finalVal = isCleanEmpty ? '' : html;
      setSourceCode(finalVal);
      if (onChange) onChange(finalVal);
    }
  }, [onChange]);

  // Execute standard formatting commands
  const execCmd = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
  };

  // Open link modal and save current selection
  const openLinkModal = () => {
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
    if (e) e.preventDefault();
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

    if (linkText && sel && sel.toString() !== linkText) {
      const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color: #b71c1c; text-decoration: underline;">${linkText}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, validUrl);
      // Ensure target="_blank" on newly created links
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

    setShowLinkModal(false);
    handleInput();
  };

  const removeLink = () => {
    execCmd('unlink');
  };

  // Toggle Source Mode
  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching from HTML source to WYSIWYG
      setIsSourceMode(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = sourceCode;
          editorRef.current.focus();
        }
      }, 20);
      if (onChange) onChange(sourceCode);
    } else {
      // Switching from WYSIWYG to HTML source
      const currentHtml = editorRef.current ? editorRef.current.innerHTML : value;
      setSourceCode(currentHtml || '');
      setIsSourceMode(true);
    }
  };

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSourceCode(val);
    if (onChange) onChange(val);
  };

  // Calculate live stats
  const textOnly = (sourceCode || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
        {/* Headings Dropdown */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') execCmd('formatBlock', '<p>');
            else if (val === 'h2') execCmd('formatBlock', '<h2>');
            else if (val === 'h3') execCmd('formatBlock', '<h3>');
            e.target.value = '';
          }}
          disabled={isSourceMode}
          style={{
            padding: '5px 8px',
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#334155',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '5px',
            cursor: isSourceMode ? 'not-allowed' : 'pointer',
            marginRight: '4px'
          }}
          title="ਸਿਰਲੇਖ ਸ਼ੈਲੀ (Heading / Style)"
        >
          <option value="">ਟੈਕਸਟ ਸਟਾਈਲ (Normal Text)</option>
          <option value="p">ਪੈਰਾਗ੍ਰਾਫ਼ (Paragraph)</option>
          <option value="h2">ਵੱਡਾ ਸਿਰਲੇਖ (Heading 2)</option>
          <option value="h3">ਛੋਟਾ ਸਿਰਲੇਖ (Heading 3)</option>
        </select>

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 3px' }} />

        {/* Basic Formats */}
        <ToolbarButton
          icon="fa-bold"
          title="ਮੋਟਾ (Bold - Ctrl+B)"
          onClick={() => execCmd('bold')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-italic"
          title="ਤਿਰਛਾ (Italic - Ctrl+I)"
          onClick={() => execCmd('italic')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-underline"
          title="ਹੇਠਾਂ ਲਾਈਨ (Underline - Ctrl+U)"
          onClick={() => execCmd('underline')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-strikethrough"
          title="ਕੱਟਿਆ ਹੋਇਆ (Strikethrough)"
          onClick={() => execCmd('strikeThrough')}
          disabled={isSourceMode}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 3px' }} />

        {/* Lists */}
        <ToolbarButton
          icon="fa-list-ul"
          title="ਬਿੰਦੀਆਂ ਵਾਲੀ ਸੂਚੀ (Bullet List)"
          onClick={() => execCmd('insertUnorderedList')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-list-ol"
          title="ਨੰਬਰਾਂ ਵਾਲੀ ਸੂਚੀ (Numbered List)"
          onClick={() => execCmd('insertOrderedList')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-quote-left"
          title="ਵਿਸ਼ੇਸ਼ ਕੋਟੇਸ਼ਨ (Blockquote)"
          onClick={() => execCmd('formatBlock', '<blockquote>')}
          disabled={isSourceMode}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 3px' }} />

        {/* Alignments */}
        <ToolbarButton
          icon="fa-align-left"
          title="ਖੱਬੇ ਪਾਸੇ (Align Left)"
          onClick={() => execCmd('justifyLeft')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-align-center"
          title="ਵਿਚਕਾਰ (Align Center)"
          onClick={() => execCmd('justifyCenter')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-align-right"
          title="ਸੱਜੇ ਪਾਸੇ (Align Right)"
          onClick={() => execCmd('justifyRight')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-align-justify"
          title="ਬਰਾਬਰ ਪਾਸੇ (Justify)"
          onClick={() => execCmd('justifyFull')}
          disabled={isSourceMode}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 3px' }} />

        {/* Link Tools */}
        <ToolbarButton
          icon="fa-link"
          title="ਲਿੰਕ ਜੋੜੋ (Insert Hyperlink)"
          onClick={openLinkModal}
          disabled={isSourceMode}
          highlight={false}
        />
        <ToolbarButton
          icon="fa-unlink"
          title="ਲਿੰਕ ਹਟਾਓ (Remove Link)"
          onClick={removeLink}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-minus"
          title="ਲਾਈਨ ਡਿਵਾਈਡਰ (Horizontal Rule)"
          onClick={() => execCmd('insertHorizontalRule')}
          disabled={isSourceMode}
        />

        <div style={{ width: '1px', height: '22px', backgroundColor: '#e2e8f0', margin: '0 3px' }} />

        {/* Clear & Undo/Redo */}
        <ToolbarButton
          icon="fa-eraser"
          title="ਸਾਰਾ ਸਟਾਈਲ ਸਾਫ਼ ਕਰੋ (Clear Formatting)"
          onClick={() => execCmd('removeFormat')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-undo"
          title="ਵਾਪਸ ਕਰੋ (Undo)"
          onClick={() => execCmd('undo')}
          disabled={isSourceMode}
        />
        <ToolbarButton
          icon="fa-repeat"
          title="ਮੁੜ ਕਰੋ (Redo)"
          onClick={() => execCmd('redo')}
          disabled={isSourceMode}
        />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Source Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleSourceMode}
          title={isSourceMode ? 'ਵਿਜ਼ੂਅਲ ਐਡੀਟਰ ਵੇਖੋ (Switch to Visual WYSIWYG)' : 'HTML ਕੋਡ ਵੇਖੋ / ਐਡਿਟ ਕਰੋ (View/Edit HTML Source)'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isSourceMode ? '#1c2d5a' : '#ffffff',
            color: isSourceMode ? '#ffffff' : '#334155',
            border: '1px solid #cbd5e1',
            borderRadius: '5px',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa fa-code" style={{ fontSize: '13px' }}></i>
          <span>{isSourceMode ? 'ਵਿਜ਼ੂਅਲ (Visual)' : 'HTML'}</span>
        </button>
      </div>

      {/* 2. EDITOR BODY AREA */}
      <div style={{ position: 'relative' }}>
        {isSourceMode ? (
          <textarea
            value={sourceCode}
            onChange={handleSourceChange}
            placeholder="<div>Enter raw HTML here...</div>"
            style={{
              width: '100%',
              minHeight,
              padding: '16px',
              border: 'none',
              outline: 'none',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#0f172a',
              backgroundColor: '#f8fafc',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        ) : (
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
        )}
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

      {/* 4. MODAL FOR INSERTING LINK */}
      {showLinkModal && (
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
          onClick={() => setShowLinkModal(false)}
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
                onClick={() => setShowLinkModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={applyLink} style={{ padding: '18px 20px 20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  ਵੈੱਬ ਪਤਾ / URL (Web Address) <span style={{ color: '#b71c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
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
                  required
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
                  onClick={() => setShowLinkModal(false)}
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
                  type="submit"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper button for editor toolbar
function ToolbarButton({ icon, title, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
