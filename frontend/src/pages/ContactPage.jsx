import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖਾਨੇ ਭਰੋ (Please fill in all fields).');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      await contactAPI.submitMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim()
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err.message || 'ਸੁਨੇਹਾ ਭੇਜਣ ਵਿੱਚ ਖ਼ਾਮੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ backgroundColor: '#f8fafc', padding: '30px 0 60px' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
          <Link to="/" style={{ color: '#1c2d5a', textDecoration: 'none', fontWeight: '600' }}>
            ਮੁੱਖ ਪੰਨਾ
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#b71c1c', fontWeight: '700' }}>ਸੰਪਰਕ ਕਰੋ (Contact Us)</span>
        </div>

        {/* Page Title */}
        <div className="module-title" style={{ marginBottom: '24px' }}>
          <h3 className="title">
            <span className="bg-1" style={{ backgroundColor: '#b71c1c' }}>ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ</span>
          </h3>
          <h3 className="subtitle">ਪੰਜਾਬ ਫਾਈਲਜ਼ ਨਿਊਜ਼ ਨੈੱਟਵਰਕ ਸੰਪਾਦਕੀ ਡੈਸਕ ਅਤੇ ਦਫ਼ਤਰ ਜਾਣਕਾਰੀ</h3>
        </div>

        <div className="row">
          {/* Left Column: Contact Form */}
          <div className="col-md-7 col-sm-12" style={{ marginBottom: '25px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '28px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <h4 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#000000' }}>
                ਸੁਨੇਹਾ ਜਾਂ ਖ਼ਬਰ ਭੇਜੋ (Send Us a Message)
              </h4>

              {submitted && (
                <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '14px 18px', borderRadius: '6px', marginBottom: '20px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-check-circle" style={{ fontSize: '18px' }}></i>
                  <span>ਧੰਨਵਾਦ! ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਿਆ ਹੈ। ਸਾਡੀ ਸੰਪਾਦਕੀ ਟੀਮ ਜਲਦ ਸੰਪਰਕ ਕਰੇਗੀ।</span>
                </div>
              )}

              {errorMsg && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-exclamation-circle" style={{ fontSize: '16px' }}></i>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '7px' }}>
                    ਪੂਰਾ ਨਾਂਅ (Full Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="ਤੁਹਾਡਾ ਨਾਂਅ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b71c1c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(183, 28, 28, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '7px' }}>
                    ਈਮੇਲ ਪਤਾ (Email Address) *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b71c1c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(183, 28, 28, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Contact Number */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '7px' }}>
                    ਸੰਪਰਕ ਨੰਬਰ (Contact Number) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b71c1c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(183, 28, 28, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '7px' }}>
                    ਸੁਨੇਹਾ ਜਾਂ ਖ਼ਬਰ ਦਾ ਵੇਰਵਾ (Message / News Details) *
                  </label>
                  <textarea
                    rows="6"
                    placeholder="ਆਪਣਾ ਸੁਝਾਅ, ਖ਼ਬਰ ਜਾਂ ਸ਼ਿਕਾਇਤ ਇੱਥੇ ਲਿਖੋ..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b71c1c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(183, 28, 28, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#b71c1c',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontSize: '14.5px',
                    fontWeight: '800',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.75 : 1,
                    boxShadow: '0 2px 6px rgba(183, 28, 28, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {submitting ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i>
                      <span>ਸੁਨੇਹਾ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-paper-plane"></i>
                      <span>ਸੁਨੇਹਾ ਭੇਜੋ (Submit Query)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Office Details */}
          <div className="col-md-5 col-sm-12">
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                marginBottom: '20px'
              }}
            >
              <h4 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '800', color: '#1c2d5a', borderBottom: '2px solid #ebb10d', paddingBottom: '6px' }}>
                ਦਫ਼ਤਰ ਸੰਪਰਕ ਜਾਣਕਾਰੀ (Head Bureau)
              </h4>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa fa-map-marker" style={{ fontSize: '16px' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#000000', display: 'block' }}>Head Office Address (ਮੁੱਖ ਦਫ਼ਤਰ)</strong>
                  <span style={{ fontSize: '13px', color: '#111111', lineHeight: '1.5', fontWeight: '600' }}>
                    SCO 106, 4th Floor, District Shopping Center,<br />
                    Ranjit Avenue, Amritsar - 143001, Punjab, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa fa-envelope-o" style={{ fontSize: '15px' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#000000', display: 'block' }}>ਈਮੇਲ ਸੰਪਰਕ (Email)</strong>
                  <a href="mailto:info@punjabfiles.com" style={{ fontSize: '13px', color: '#1c2d5a', fontWeight: '700', textDecoration: 'none', display: 'block' }}>
                    info@punjabfiles.com
                  </a>
                  <a href="mailto:advt@punjabfiles.com" style={{ fontSize: '13px', color: '#b71c1c', fontWeight: '700', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                    advt@punjabfiles.com <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>(ਇਸ਼ਤਿਹਾਰ / Ads)</span>
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fa fa-phone" style={{ fontSize: '15px' }}></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#000000', display: 'block' }}>24x7 ਨਿਊਜ਼ ਹੈਲਪਲਾਈਨ (Phone)</strong>
                  <a href="tel:+918909396233" style={{ fontSize: '14px', color: '#b71c1c', fontWeight: '800', textDecoration: 'none' }}>
                    +91 89093 96233
                  </a>
                </div>
              </div>

              {/* Advertisement Queries Call Box */}
              <div style={{ backgroundColor: '#fffbeb', border: '1.5px dashed #f59e0b', borderRadius: '6px', padding: '12px 14px', marginBottom: 0 }}>
                <strong style={{ fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <i className="fa fa-bullhorn"></i> ਇਸ਼ਤਿਹਾਰਾਂ ਲਈ ਸੰਪਰਕ (Advertisement Queries)
                </strong>
                <p style={{ fontSize: '12px', color: '#451a03', margin: '0 0 6px', lineHeight: '1.45' }}>
                  ਵੈੱਬਸਾਈਟ ਅਤੇ ਵੈੱਬ ਚੈਨਲ 'ਤੇ ਇਸ਼ਤਿਹਾਰ ਦੇਣ ਲਈ ਸਾਡੀ ਮਾਰਕੀਟਿੰਗ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ:
                </p>
                <div style={{ fontSize: '12.5px', color: '#111827', fontWeight: '700' }}>
                  <span>ਮੋਬਾਈਲ: </span>
                  <a href="tel:+918909396233" style={{ color: '#b71c1c', textDecoration: 'none', marginRight: '10px' }}>+91 89093 96233</a>
                </div>
                <div style={{ fontSize: '12px', color: '#111827', marginTop: '3px' }}>
                  <span>ਈਮੇਲ: </span>
                  <a href="mailto:advt@punjabfiles.com" style={{ color: '#1c2d5a', fontWeight: '700', textDecoration: 'none', marginRight: '6px' }}>advt@punjabfiles.com</a>
                  |
                  <a href="mailto:info@punjabfiles.com" style={{ color: '#1c2d5a', fontWeight: '700', textDecoration: 'none', marginLeft: '6px' }}>info@punjabfiles.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
