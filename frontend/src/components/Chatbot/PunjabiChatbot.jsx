import React, { useState, useRef, useEffect } from 'react';
import turbanMascot from '../../assets/turban-mascot.jpg';

const PRESET_ANSWERS = {
  mukhwak: "ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ) ਸੋਰਠਿ ਮਹਲਾ ੫, ਅੰਗ ੬੫੪ 'ਤੇ ਸੁਸ਼ੋਭਿਤ ਹੈ। ਤੁਸੀਂ ਹੋਮਪੇਜ 'ਤੇ ਖੱਬੇ ਪਾਸੇ ਦਿੱਤੇ ਸੈਕਸ਼ਨ ਤੋਂ ਪੂਰੀ ਵਿਆਖਿਆ ਪੜ੍ਹ ਸਕਦੇ ਹੋ।",
  regions: "ਪੰਜਾਬ ਸੈਕਸ਼ਨ ਵਿੱਚ ਤਿੰਨੋਂ ਖਿੱਤਿਆਂ—ਮਾਝਾ (ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ), ਮਾਲਵਾ (ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ) ਅਤੇ ਦੋਆਬਾ (ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ) ਦੀਆਂ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਵੱਖ-ਵੱਖ ਫਿਲਟਰ ਕਰਕੇ ਦੇਖੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।",
  publish: 'ਜੇਕਰ ਤੁਸੀਂ ਪੱਤਰਕਾਰ ਜਾਂ ਪ੍ਰਕਾਸ਼ਕ ਹੋ ਤਾਂ ਉੱਪਰ ਦਿੱਤੇ ਸਟਾਫ਼ ਲੌਗਇਨ ਰਾਹੀਂ ਜਾਂ /admin \'ਤੇ ਜਾ ਕੇ ਨਵੀਂ ਖ਼ਬਰ ਤੁਰੰਤ ਲਾਈਵ ਕਰ ਸਕਦੇ ਹੋ। ਆਮ ਪਾਠਕ ਸੰਪਰਕ ਫਾਰਮ ਰਾਹੀਂ ਵੀ ਖ਼ਬਰ ਭੇਜ ਸਕਦੇ ਹਨ।',
  livetv: "ਲਾਈਵ ਟੀਵੀ ਦੇਖਣ ਲਈ ਹੋਮਪੇਜ ਦੇ ਸਭ ਤੋਂ ਉੱਪਰਲੇ ਸੈਕਸ਼ਨ ਵਿੱਚ 24x7 ਸਮਾਰਟ ਟੀਵੀ ਪਲੇਅਰ ਲਾਈਵ ਚੱਲ ਰਿਹਾ ਹੈ।"
};

export default function PunjabiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCloud, setShowCloud] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! 🙏 ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ? ਤੁਸੀਂ ਮੁੱਖ ਵਾਕ, ਪੰਜਾਬ ਦੇ ਖਿੱਤਿਆਂ, ਖ਼ਬਰਾਂ ਜਾਂ ਲਾਈਵ ਟੀਵੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    // User message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputVal('');

    // Determine Bot Response
    setTimeout(() => {
      let reply = 'ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੈਨੂੰ ਇਸ ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਸਾਡੇ ਸੰਪਰਕ ਪੰਨੇ ਤੋਂ ਸੰਪਾਦਕੀ ਟੀਮ ਨਾਲ ਸਿੱਧਾ ਰਾਬਤਾ ਕਾਇਮ ਕਰ ਸਕਦੇ ਹੋ।';
      const lower = text.toLowerCase();

      if (lower.includes('ਮੁੱਖ ਵਾਕ') || lower.includes('ਹੁਕਮਨਾਮਾ') || lower.includes('ਦਰਬਾਰ ਸਾਹਿਬ') || lower.includes('mukhwak')) {
        reply = PRESET_ANSWERS.mukhwak;
      } else if (lower.includes('ਮਾਝਾ') || lower.includes('ਮਾਲਵਾ') || lower.includes('ਦੋਆਬਾ') || lower.includes('ਖਿੱਤਾ') || lower.includes('region')) {
        reply = PRESET_ANSWERS.regions;
      } else if (lower.includes('ਖ਼ਬਰ') || lower.includes('ਪ੍ਰਕਾਸ਼ਕ') || lower.includes('ਭੇਜੋ') || lower.includes('publish') || lower.includes('ਲਿਖਣੀ')) {
        reply = PRESET_ANSWERS.publish;
      } else if (lower.includes('ਲਾਈਵ') || lower.includes('ਟੀਵੀ') || lower.includes('live') || lower.includes('tv')) {
        reply = PRESET_ANSWERS.livetv;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 550);
  };

  return (
    <div className="punjabi-chatbot-container" style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 99990 }}>
      {/* Embedded CSS for smooth cloud floating */}
      <style>{`
        @keyframes floatSpeechCloud {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>

      {/* Floating Turban Mascot + Speech Cloud */}
      {!isOpen && (
        <div
          className="turban-chatbot-trigger"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            position: 'relative'
          }}
        >
          {/* Speech Cloud Bubble */}
          {showCloud && (
            <div
              onClick={() => setIsOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '10px 14px 11px',
                borderRadius: '16px',
                border: '2px solid #ebb10d',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer',
                marginBottom: '10px',
                maxWidth: '220px',
                position: 'relative',
                fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif",
                lineHeight: '1.4',
                animation: 'floatSpeechCloud 2.8s ease-in-out infinite',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(235, 177, 13, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)';
              }}
            >
              {/* Dismiss Cross */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCloud(false);
                }}
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '13px',
                  lineHeight: '1',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title="ਬੰਦ ਕਰੋ"
              >
                ×
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b71c1c', fontSize: '11.5px', marginBottom: '2px' }}>
                <span>ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ!</span>
                <span>🙏</span>
              </div>
              <div style={{ color: '#0f172a' }}>
                ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?
              </div>

              {/* Triangle Tail of Speech Bubble */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '28px',
                  width: 0,
                  height: 0,
                  borderLeft: '9px solid transparent',
                  borderRight: '9px solid transparent',
                  borderTop: '10px solid #ebb10d'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-7px',
                  right: '29px',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #ffffff'
                }}
              />
            </div>
          )}

          {/* Turban Guy Character Button (Namaste pose) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="ਓਪਨ ਪੰਜਾਬੀ ਸਹਾਇਕ ਚੈਟਬਾਕਸ"
            style={{
              position: 'relative',
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              padding: 0,
              border: '3px solid #ebb10d',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 25px rgba(28, 45, 90, 0.35)',
              cursor: 'pointer',
              overflow: 'visible',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(183, 28, 28, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(28, 45, 90, 0.35)';
            }}
          >
            {/* Mascot Image */}
            <img
              src={turbanMascot}
              alt="Punjabi Mascot Namaste"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 10%',
                display: 'block'
              }}
            />

            {/* Online Pulse Dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '3px',
                width: '15px',
                height: '15px',
                backgroundColor: '#22c55e',
                border: '2.5px solid #ffffff',
                borderRadius: '50%',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)'
              }}
            />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '330px',
            maxWidth: 'calc(100vw - 30px)',
            height: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 14px 40px rgba(0,0,0,0.28)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={turbanMascot}
                alt="ਪੰਜਾਬੀ ਸਹਾਇਕ"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  border: '2px solid #ebb10d',
                  backgroundColor: '#ffffff'
                }}
              />
              <div>
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                  ਪੰਜਾਬੀ ਸਹਾਇਕ (Punjabi Sahayak)
                </h5>
                <span style={{ fontSize: '11px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                  ਆਨਲਾਈਨ ਸਹਾਇਕ
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              title="ਮਿਨੀਮਾਈਜ਼ ਕਰੋ"
            >
              ×
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', display: 'flex', gap: '5px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <button
              type="button"
              onClick={() => handleSend('ਮੁੱਖ ਵਾਕ ਬਾਰੇ ਦੱਸੋ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ਮੁੱਖ ਵਾਕ?
            </button>
            <button
              type="button"
              onClick={() => handleSend('ਪੰਜਾਬ ਦੇ ਖਿੱਤੇ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ਮਾਝਾ/ਮਾਲਵਾ/ਦੋਆਬਾ?
            </button>
            <button
              type="button"
              onClick={() => handleSend('ਖ਼ਬਰ ਕਿਵੇਂ ਲਗਾਈਏ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ਖ਼ਬਰ ਭੇਜਣੀ?
            </button>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px'
                }}
              >
                {m.sender === 'bot' && (
                  <img
                    src={turbanMascot}
                    alt=""
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center 10%',
                      border: '1px solid #ebb10d',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  />
                )}
                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? '#b71c1c' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    lineHeight: '1.45',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
          >
            <input
              type="text"
              placeholder="ਕੁਝ ਵੀ ਪੁੱਛੋ (Ask anything)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '11px 12px', fontSize: '13px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#b71c1c',
                color: '#fff',
                border: 'none',
                padding: '0 16px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="ਭੇਜੋ"
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
