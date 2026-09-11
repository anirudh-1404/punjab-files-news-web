import React, { useState, useRef, useEffect } from 'react';

const PRESET_ANSWERS = {
  mukhwak: "ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ) ਸੋਰਠਿ ਮਹਲਾ ੫, ਅੰਗ ੬੫੪ 'ਤੇ ਸੁਸ਼ੋਭਿਤ ਹੈ। ਤੁਸੀਂ ਹੋਮਪੇਜ 'ਤੇ ਖੱਬੇ ਪਾਸੇ ਦਿੱਤੇ ਸੈਕਸ਼ਨ ਤੋਂ ਪੂਰੀ ਵਿਆਖਿਆ ਪੜ੍ਹ ਸਕਦੇ ਹੋ।",
  regions: "ਪੰਜਾਬ ਸੈਕਸ਼ਨ ਵਿੱਚ ਤਿੰਨੋਂ ਖਿੱਤਿਆਂ—ਮਾਝਾ (ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ), ਮਾਲਵਾ (ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ) ਅਤੇ ਦੋਆਬਾ (ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ) ਦੀਆਂ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਵੱਖ-ਵੱਖ ਫਿਲਟਰ ਕਰਕੇ ਦੇਖੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।",
  publish: 'ਜੇਕਰ ਤੁਸੀਂ ਪੱਤਰਕਾਰ ਜਾਂ ਪ੍ਰਕਾਸ਼ਕ ਹੋ ਤਾਂ ਉੱਪਰ ਦਿੱਤੇ "ਪ੍ਰਕਾਸ਼ਕ" ਲਿੰਕ ਜਾਂ /admin \'ਤੇ ਜਾ ਕੇ ਨਵੀਂ ਖ਼ਬਰ ਤੁਰੰਤ ਲਾਈਵ ਕਰ ਸਕਦੇ ਹੋ। ਆਮ ਪਾਠਕ ਸੰਪਰਕ ਫਾਰਮ ਰਾਹੀਂ ਵੀ ਖ਼ਬਰ ਭੇਜ ਸਕਦੇ ਹਨ।',
  livetv: "ਲਾਈਵ ਟੀਵੀ ਦੇਖਣ ਲਈ ਹੋਮਪੇਜ ਦੇ ਸਭ ਤੋਂ ਉੱਪਰਲੇ ਸੈਕਸ਼ਨ ਵਿੱਚ 24x7 ਸਮਾਰਟ ਟੀਵੀ ਪਲੇਅਰ ਲਾਈਵ ਚੱਲ ਰਿਹਾ ਹੈ।"
};

export default function PunjabiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਪੰਜਾਬ ਫਾਈਲਜ਼ ਦਾ ਡਿਜੀਟਲ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?'
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
      } else if (lower.includes('ਖ਼ਬਰ') || lower.includes('ਪ੍ਰਕਾਸ਼ਕ') || lower.includes('ਭੇਜੋ') || lower.includes('publish')) {
        reply = PRESET_ANSWERS.publish;
      } else if (lower.includes('ਲਾਈਵ') || lower.includes('ਟੀਵੀ') || lower.includes('live') || lower.includes('tv')) {
        reply = PRESET_ANSWERS.livetv;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="punjabi-chatbot-container" style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 99990 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: '2px solid #ebb10d',
            borderRadius: '50px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(183, 28, 28, 0.45)',
            transition: 'transform 0.2s',
            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#4ade80',
              borderRadius: '50%',
              display: 'inline-block'
            }}
          ></span>
          <i className="fa fa-comments-o" style={{ fontSize: '16px' }}></i>
          <span style={{ fontSize: '13px', fontWeight: '800' }}>ਪੰਜਾਬੀ ਸਹਾਇਕ</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '320px',
            maxWidth: 'calc(100vw - 30px)',
            height: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
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
              backgroundColor: '#1c2d5a',
              color: '#ffffff',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #ebb10d'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#fff' }}>
                PF
              </div>
              <div>
                <h5 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                  ਪੰਜਾਬ ਫਾਈਲਜ਼ ਸਹਾਇਕ
                </h5>
                <span style={{ fontSize: '10px', color: '#4ade80' }}>● ਆਨਲਾਈਨ</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', display: 'flex', gap: '5px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <button
              type="button"
              onClick={() => handleSend('ਮੁੱਖ ਵਾਕ ਬਾਰੇ ਦੱਸੋ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer' }}
            >
              ਮੁੱਖ ਵਾਕ?
            </button>
            <button
              type="button"
              onClick={() => handleSend('ਪੰਜਾਬ ਦੇ ਖਿੱਤੇ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer' }}
            >
              ਮਾਝਾ/ਮਾਲਵਾ/ਦੋਆਬਾ?
            </button>
            <button
              type="button"
              onClick={() => handleSend('ਖ਼ਬਰ ਕਿਵੇਂ ਲਗਾਈਏ')}
              style={{ fontSize: '10.5px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '3px 8px', cursor: 'pointer' }}
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
                  backgroundColor: m.sender === 'user' ? '#b71c1c' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#000000',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  lineHeight: '1.45',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                {m.text}
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
              style={{ flex: 1, border: 'none', padding: '10px 12px', fontSize: '12.5px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#b71c1c',
                color: '#fff',
                border: 'none',
                padding: '0 14px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
