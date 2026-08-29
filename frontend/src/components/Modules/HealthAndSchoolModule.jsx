import React, { useState } from 'react';

const ratesData = {
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.2,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.52,
  RON: 4.58,
  RUB: 91.4,
  INR: 83.5
};

export default function HealthAndSchoolModule() {
  // Currency converter state
  const [amount, setAmount] = useState('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');
  const [convertedText, setConvertedText] = useState('100 USD = 8350.00 INR');

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  // Calendar simple picker state
  const today = new Date();
  const monthNames = [
    'ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ',
    'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'
  ];
  const currentMonthName = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  const daysInMonth = 31;
  const currentDay = today.getDate();

  const handleConvert = (e) => {
    e.preventDefault();
    const val = parseFloat(amount) || 0;
    let inUSD = val;
    if (fromCurr !== 'USD' && ratesData[fromCurr]) {
      inUSD = val / ratesData[fromCurr];
    }
    const result = toCurr === 'USD' ? inUSD : inUSD * (ratesData[toCurr] || 1);
    setConvertedText(`${val} ${fromCurr} = ${result.toFixed(2)} ${toCurr}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeMsg('ਪੰਜਾਬ ਫਾਈਲਜ਼ ਨਿਊਜ਼ਲੈਟਰ ਸਬਸਕ੍ਰਾਈਬ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਬਹੁਤ-ਬਹੁਤ ਧੰਨਵਾਦ!');
      setEmail('');
    }
  };

  return (
    <section className="module">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col Content */}
          <div className="col-md-8">
            <div className="news">
              {/* Health News */}
              <div className="module-title">
                <h3 className="title">
                  <span className="bg-2">ਸਿਹਤ ਖ਼ਬਰਾਂ</span>
                </h3>
                <h3 className="subtitle">ਦੇਖੋ ਤਾਜ਼ਾ ਸਿਹਤ ਤੇ ਤੰਦਰੁਸਤੀ ਰਿਪੋਰਟਾਂ</h3>
              </div>

              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#health">
                    <img className="img-responsive img-full" src="/img/index_800x400-image19.jpg" alt="Health Priorities" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#health">
                        <strong>ਸੂਬਾਈ</strong> ਅਤੇ ਵਿਸ਼ਵ ਪੱਧਰੀ ਸਿਹਤ ਸੁਧਾਰ
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#health">ਸਿਹਤ ਸੰਪਾਦਕੀ ਡੈਸਕ ਵੱਲੋਂ</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>ਅਕਤੂਬਰ 2026
                    </div>
                  </div>
                  <p>
                    <a href="#health" className="external-link">
                      ਸੰਤੁਲਿਤ ਖ਼ੁਰਾਕ, ਕੁਦਰਤੀ ਆਹਾਰ ਅਤੇ ਰੋਜ਼ਾਨਾ ਯੋਗਾ ਰਾਹੀਂ ਬਿਮਾਰੀਆਂ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਦੇ ਉਪਾਅ।
                    </a>
                  </p>
                  <p>
                    <a href="#health" className="external-link">
                      ਪੰਜਾਬ ਭਰ ਦੇ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਅਤਿ-ਆਧੁਨਿਕ ਮਸ਼ੀਨਾਂ ਅਤੇ ਟੈਲੀ-ਮੈਡੀਸਨ ਸਹੂਲਤਾਂ ਦੀ ਸ਼ੁਰੂਆਤ।
                    </a>
                  </p>
                  <div>
                    <a href="#health">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Health Blocks */}
              <div className="news-block">
                {[
                  { title: 'ਸਿਹਤ ਨੀਤੀ ਅਤੇ ਪੌਸ਼ਟਿਕ ਖ਼ੁਰਾਕ', date: '20 ਅਕਤੂਬਰ', img: '/img/index_800x400-image32.jpg' },
                  { title: 'ਮਾਨਸਿਕ ਤੰਦਰੁਸਤੀ ਅਤੇ ਯੋਗਾ', date: '15 ਅਕਤੂਬਰ', img: '/img/index_800x400-image33.jpg' },
                  { title: 'ਮੈਡੀਕਲ ਖੋਜ ਅਤੇ ਨਵੀਆਂ ਤਕਨੀਕਾਂ', date: '13 ਅਕਤੂਬਰ', img: '/img/index_800x400-image34.jpg' },
                  { title: 'ਪੇਂਡੂ ਸਿਹਤ ਜਾਂਚ ਕੈਂਪ', date: '08 ਅਕਤੂਬਰ', img: '/img/index_800x400-image35.jpg' }
                ].map((item, idx) => (
                  <div className="item-block" key={idx}>
                    <div className="item-image">
                      <a className="img-link" href="#health">
                        <img className="img-responsive img-full" src={item.img} alt={item.title} />
                      </a>
                    </div>
                    <div className="item-content">
                      <i className="fa fa-clock-o"></i> <span className="day"> {item.date}</span>
                      <p>
                        <a href="#health">{item.title}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* School Report */}
              <div className="module-title" style={{ marginTop: '30px' }}>
                <h3 className="title">
                  <span className="bg-9">ਸਕੂਲ ਅਤੇ ਸਿੱਖਿਆ</span>
                </h3>
                <h3 className="subtitle">ਦੇਖੋ ਸਿੱਖਿਆ ਜਗਤ ਦੀਆਂ ਤਾਜ਼ਾ ਰਿਪੋਰਟਾਂ</h3>
              </div>

              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#education">
                    <img className="img-responsive img-full" src="/img/index_800x400-image20.jpg" alt="Education Report" />
                  </a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#education">
                        <strong>ਵਿਦਿਆਰਥੀਆਂ</strong> ਲਈ ਡਿਜੀਟਲ ਸਿੱਖਿਆ ਅਤੇ ਹੁਨਰ ਵਿਕਾਸ
                      </a>
                    </h3>
                  </div>
                  <br />
                  <div className="post-meta-elements">
                    <div className="post-meta-author">
                      <i className="fa fa-user"></i>
                      <a href="#education">ਸਿੱਖਿਆ ਡੈਸਕ ਵੱਲੋਂ</a>
                    </div>
                    <div className="post-meta-date">
                      <i className="fa fa-calendar"></i>ਅਕਤੂਬਰ 2026
                    </div>
                  </div>
                  <p>
                    <a href="#education" className="external-link">
                      ਸਰਕਾਰੀ ਅਤੇ ਨਿੱਜੀ ਸਕੂਲਾਂ ਵਿੱਚ ਆਧੁਨਿਕ ਲੈਬਾਂ ਅਤੇ ਖੇਡ ਸਹੂਲਤਾਂ ਨਾਲ ਬੱਚਿਆਂ ਦਾ ਸਰਵਪੱਖੀ ਵਿਕਾਸ।
                    </a>
                  </p>
                  <div>
                    <a href="#education">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 School Blocks */}
              <div className="news-block">
                {[
                  { title: 'ਸਮਾਰਟ ਕਲਾਸਰੂਮ ਅਤੇ ਕੰਪਿਊਟਰ ਸਿੱਖਿਆ', date: '16 ਅਕਤੂਬਰ', img: '/img/index_800x400-image36.jpg' },
                  { title: 'ਯੁਵਾ ਇਨੋਵੇਸ਼ਨ ਤੇ ਵਿਗਿਆਨ ਮੁਕਾਬਲੇ', date: '16 ਅਕਤੂਬਰ', img: '/img/index_800x400-image37.jpg' },
                  { title: 'ਅੰਤਰ-ਸਕੂਲ ਖੇਡ ਮੀਟ ਅਤੇ ਦੌੜਾਂ', date: '20 ਅਕਤੂਬਰ', img: '/img/index_800x400-image38.jpg' },
                  { title: 'ਸੱਭਿਆਚਾਰਕ ਅਤੇ ਭਾਸ਼ਣ ਮੁਕਾਬਲੇ', date: '22 ਅਕਤੂਬਰ', img: '/img/index_800x400-image39.jpg' }
                ].map((item, idx) => (
                  <div className="item-block" key={idx}>
                    <div className="item-image">
                      <a className="img-link" href="#education">
                        <img className="img-responsive img-full" src={item.img} alt={item.title} />
                      </a>
                    </div>
                    <div className="item-content">
                      <i className="fa fa-clock-o"></i> <span className="day">{item.date}</span>
                      <p>
                        <a href="#education">{item.title}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <ul className="pagination" style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'nowrap', marginTop: '20px' }}>
                <li><a href="#page">‹</a></li>
                <li className="active"><a href="#page">1</a></li>
                <li><a href="#page">2</a></li>
                <li><a href="#page">3</a></li>
                <li><a href="#page">4</a></li>
                <li><a href="#page">5</a></li>
                <li><a href="#page">›</a></li>
              </ul>
            </div>
          </div>

          {/* Right 4-col Sidebar */}
          <div className="col-md-4">
            {/* Exchange Rates */}
            <div className="block-title-3">
              <h3>ਮੁਦਰਾ ਵਟਾਂਦਰਾ ਦਰਾਂ</h3>
            </div>
            <div className="currency" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', margin: 0 }}>
                ਬੇਸ ਕਰੰਸੀ: <strong>USD ($)</strong>
              </h3>
              <hr style={{ margin: '8px 0' }} />
              <div className="rates">
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6">
                    <h4>EUR: <span style={{ fontWeight: 'normal' }}>0.92</span></h4>
                    <h4>GBP: <span style={{ fontWeight: 'normal' }}>0.79</span></h4>
                    <h4>JPY: <span style={{ fontWeight: 'normal' }}>154.2</span></h4>
                    <h4>CHF: <span style={{ fontWeight: 'normal' }}>0.88</span></h4>
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6">
                    <h4>INR: <span style={{ fontWeight: 'normal' }}>83.50</span></h4>
                    <h4>CAD: <span style={{ fontWeight: 'normal' }}>1.36</span></h4>
                    <h4>AUD: <span style={{ fontWeight: 'normal' }}>1.52</span></h4>
                    <h4>RUB: <span style={{ fontWeight: 'normal' }}>91.40</span></h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Converter */}
            <div className="block-title-3">
              <h3>ਕਰੰਸੀ ਕਨਵਰਟਰ</h3>
            </div>
            <form className="conversionForm" onSubmit={handleConvert} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              <div className="conversionForm-amount" style={{ marginBottom: '10px' }}>
                <label htmlFor="amount">ਰਕਮ ਦਰਜ ਕਰੋ:</label>
                <input
                  type="number"
                  className="currencyValue form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="conversionForm-currencies" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="from">ਇਸ ਤੋਂ:</label>
                  <select
                    className="form-control"
                    id="from"
                    value={fromCurr}
                    onChange={(e) => setFromCurr(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="to">ਇਸ ਵਿੱਚ:</label>
                  <select
                    className="form-control"
                    id="to"
                    value={toCurr}
                    onChange={(e) => setToCurr(e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>
              <input type="submit" value="ਕਨਵਰਟ ਕਰੋ" className="btn btn-default" style={{ width: '100%', marginBottom: '8px' }} />
              {convertedText && (
                <p className="output" style={{ fontWeight: 'bold', color: '#e52d27', margin: 0, textAlign: 'center' }}>
                  {convertedText}
                </p>
              )}
            </form>

            {/* Calendar Widget */}
            <div className="block-title-3">
              <h3>ਕੈਲੰਡਰ</h3>
            </div>
            <div
              id="calendar"
              style={{
                background: '#fff',
                border: '1px solid #ddd',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#e52d27' }}>
                {currentMonthName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '12px' }}>
                {['ਐਤ', 'ਸੋਮ', 'ਮੰਗਲ', 'ਬੁੱਧ', 'ਵੀਰ', 'ਸ਼ੁੱਕਰ', 'ਸ਼ਨਿੱਚਰ'].map((d) => (
                  <div key={d} style={{ fontWeight: 'bold', color: '#666' }}>{d}</div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isCurrent = dayNum === currentDay;
                  return (
                    <div
                      key={dayNum}
                      style={{
                        padding: '4px 0',
                        borderRadius: '3px',
                        background: isCurrent ? '#e52d27' : 'transparent',
                        color: isCurrent ? '#fff' : '#333',
                        fontWeight: isCurrent ? 'bold' : 'normal'
                      }}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div id="sidebar-newsletter">
              <div className="title-style01">
                <h3>
                  <strong>ਨਿਊਜ਼ਲੈਟਰ</strong>
                </h3>
              </div>
              <div className="sidebar-newsletter-form">
                <form onSubmit={handleSubscribe}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="ਆਪਣਾ ਈਮੇਲ ਐਡਰੈੱਸ ਦਰਜ ਕਰੋ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="input-group-btn">
                      <button type="submit" className="btn btn-success">
                        ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ
                      </button>
                    </span>
                  </div>
                </form>
                {subscribeMsg && (
                  <span id="result" className="alertMsg" style={{ display: 'block', marginTop: '8px', color: 'green', fontSize: '13px' }}>
                    {subscribeMsg}
                  </span>
                )}
              </div>
            </div>

            {/* Stay Connected */}
            <div className="sidebar-social-icons" style={{ marginTop: '25px' }}>
              <div className="title-style01">
                <h3>
                  <strong>ਸਾਡੇ ਨਾਲ</strong> ਜੁੜੋ
                </h3>
              </div>
              <ul>
                <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="facebook"><i className="fa fa-facebook"></i></a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="youtube"><i className="fa fa-youtube"></i></a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="twitter"><i className="fa fa-twitter"></i></a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="linkedin"><i className="fa fa-linkedin"></i></a></li>
                <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="pinterest"><i className="fa fa-pinterest"></i></a></li>
                <li><a href="https://plus.google.com" target="_blank" rel="noreferrer" className="google-plus"><i className="fa fa-google-plus"></i></a></li>
                <li><a href="#rss" className="rss"><i className="fa fa-rss"></i></a></li>
                <li><a href="https://tumblr.com" target="_blank" rel="noreferrer" className="tumblr"><i className="fa fa-tumblr"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
