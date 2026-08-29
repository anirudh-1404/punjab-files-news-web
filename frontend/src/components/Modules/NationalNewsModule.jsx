import React from 'react';

const newsfeedItems = [
  {
    title: 'ਪੰਜਾਬੀ ਕਲਾ ਅਤੇ ਸੱਭਿਆਚਾਰ',
    desc: 'ਪੰਜਾਬੀ ਨਾਟਕਾਂ ਅਤੇ ਲੋਕ ਕਲਾ ਦਾ ਕੌਮਾਂਤਰੀ ਪੱਧਰ ’ਤੇ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਦਰਸ਼ਨ...',
    img: '/img/index_370x185-image01.jpg'
  },
  {
    title: 'ਸੂਰਜੀ ਊਰਜਾ ਅਤੇ ਖੇਤੀਬਾੜੀ',
    desc: 'ਨਵੇਂ ਸੋਲਰ ਪ੍ਰੋਜੈਕਟਾਂ ਨਾਲ ਕਿਸਾਨਾਂ ਦੀ ਬਿਜਲੀ ਲਾਗਤ ਵਿੱਚ ਵੱਡੀ ਕਮੀ...',
    img: '/img/index_370x185-image02.jpg'
  },
  {
    title: 'ਨੌਜਵਾਨ ਅਤੇ ਉੱਚ ਸਿੱਖਿਆ',
    desc: 'ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਮੁਫ਼ਤ ਹੁਨਰ ਵਿਕਾਸ ਅਤੇ ਕੰਪਿਊਟਰ ਸਿਖਲਾਈ ਕੇਂਦਰ...',
    img: '/img/index_370x185-image03.jpg'
  },
  {
    title: 'ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਅਤੇ ਸੜਕਾਂ',
    desc: 'ਨਵੇਂ ਐਕਸਪ੍ਰੈਸਵੇਅ ਅਤੇ ਹਾਈਵੇਅ ਪ੍ਰਾਜੈਕਟਾਂ ਨਾਲ ਵਪਾਰ ਵਿੱਚ ਤੇਜ਼ੀ...',
    img: '/img/index_370x185-image04.jpg'
  },
  {
    title: 'ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾਵਾਂ',
    desc: 'ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਮੁਫ਼ਤ ਦਵਾਈਆਂ ਅਤੇ ਲੈਬ ਟੈਸਟ...',
    img: '/img/index_370x185-image05.jpg'
  },
  {
    title: 'ਨਵੇਂ ਕਾਰੋਬਾਰ ਅਤੇ ਸਟਾਰਟਅੱਪ',
    desc: 'ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਵੱਲੋਂ ਖੇਤੀ ਅਤੇ ਤਕਨੀਕੀ ਖੇਤਰ ਵਿੱਚ ਨਵੇਂ ਉੱਦਮ...',
    img: '/img/index_370x185-image06.jpg'
  }
];

export default function NationalNewsModule() {
  return (
    <section className="module">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-column content */}
          <div className="col-md-8">
            <div className="news">
              <div className="module-title">
                <h3 className="title">
                  <span className="bg-11">ਰਾਸ਼ਟਰੀ ਤੇ ਸੂਬਾਈ ਖ਼ਬਰਾਂ</span>
                </h3>
                <h3 className="subtitle">ਵਿਸਥਾਰਪੂਰਵਕ ਤਾਜ਼ਾ ਸਮਾਚਾਰ</h3>
              </div>

              {/* Item 1 */}
              <div className="item">
                <div className="item-image-2">
                  <a className="img-link" href="#politics">
                    <img className="img-responsive img-full" src="/img/index_800x400-image05.jpg" alt="National Politics" />
                  </a>
                  <span>
                    <a className="label-2" href="#politics">ਰਾਜਨੀਤੀ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#politics">
                        <strong>ਵਿਧਾਨ ਸਭਾ</strong> ਦੇ ਅਹਿਮ ਫ਼ੈਸਲੇ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#politics">
                      ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੇ ਵਿਸਥਾਰ ਅਤੇ ਨਿਰਵਿਘਨ ਬਿਜਲੀ ਸਪਲਾਈ ਲਈ ਵੱਡਾ ਬਜਟ ਮਨਜ਼ੂਰ।
                    </a>
                  </p>
                  <p>
                    <a href="#politics" className="external-link">
                      ਸਰਕਾਰੀ ਨੁਮਾਇੰਦਿਆਂ ਨੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਨੂੰ ਸਮੇਂ ਸਿਰ ਮੁਕੰਮਲ ਕਰਨ ਦੀ ਦਿੱਤੀ ਹਦਾਇਤ।
                    </a>
                  </p>
                  <div>
                    <a href="#politics">
                      <span className="read-more">ਰਾਜਨੀਤੀ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="item">
                <div className="item-image-2">
                  <a className="img-link" href="#news">
                    <img className="img-responsive img-full" src="/img/index_800x400-image06.jpg" alt="Community Progress" />
                  </a>
                  <span>
                    <a className="label-1" href="#news">ਖ਼ਬਰਾਂ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#news">
                        <strong>ਪੇਂਡੂ</strong> ਵਿਕਾਸ ਅਤੇ ਸੁਧਾਰ ਯੋਜਨਾਵਾਂ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#news" className="external-link">
                      ਪਿੰਡਾਂ ਵਿੱਚ ਸਾਫ਼ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਅਤੇ ਸੋਲਰ ਸਟਰੀਟ ਲਾਈਟਾਂ ਲਗਾਉਣ ਦਾ ਕੰਮ ਤੇਜ਼ੀ ਨਾਲ ਸ਼ੁਰੂ।
                    </a>
                  </p>
                  <p>
                    <a href="#news" className="external-link">
                      ਪੰਚਾਇਤਾਂ ਨੂੰ ਸਿੱਧੇ ਵਿਕਾਸ ਫੰਡ ਜਾਰੀ, ਲੋਕਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੇ ਹੱਲ ਲਈ ਸਿੰਗਲ ਵਿੰਡੋ ਸਿਸਟਮ।
                    </a>
                  </p>
                  <div>
                    <a href="#news">
                      <span className="read-more">ਪੰਜਾਬ ਫਾਈਲਜ਼</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="item">
                <div className="item-image-2">
                  <a className="img-link" href="#business">
                    <img className="img-responsive img-full" src="/img/index_800x400-image07.jpg" alt="Economic Outlook" />
                  </a>
                  <span>
                    <a className="label-5" href="#business">ਆਰਥਿਕਤਾ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#business">
                        <strong>ਕਾਰੋਬਾਰ</strong> ਅਤੇ ਨਵੇਂ ਉਦਯੋਗਿਕ ਮੌਕੇ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#business" className="external-link">
                      ਪੰਜਾਬ ਵਿੱਚ ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ ਅਤੇ ਟੈਕਸਟਾਈਲ ਉਦਯੋਗਾਂ ਨੂੰ ਮਿਲੇਗਾ ਵਿਸ਼ੇਸ਼ ਉਤਸ਼ਾਹ।
                    </a>
                  </p>
                  <p>
                    <a href="#business" className="external-link">
                      ਆਰਥਿਕ ਮਾਹਿਰਾਂ ਅਨੁਸਾਰ ਨਵੇਂ ਨਿਵੇਸ਼ ਨਾਲ ਸਥਾਨਕ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਵਿੱਚ ਵੱਡਾ ਵਾਧਾ ਹੋਵੇਗਾ।
                    </a>
                  </p>
                  <div>
                    <a href="#business">
                      <span className="read-more">ਲਾਈਵ ਦੇਖੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="item">
                <div className="item-image-2">
                  <a className="img-link" href="#business">
                    <img className="img-responsive img-full" src="/img/index_800x400-image08.jpg" alt="Technology in Business" />
                  </a>
                  <a className="label-6" href="#business">ਵਪਾਰ</a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#business">
                        <strong>ਡਿਜੀਟਲ</strong> ਤਕਨਾਲੋਜੀ ਅਤੇ ਆਨਲਾਈਨ ਵਪਾਰ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#business" className="external-link">
                      ਛੋਟੇ ਦੁਕਾਨਦਾਰਾਂ ਅਤੇ ਕਿਸਾਨਾਂ ਲਈ ਆਨਲਾਈਨ ਮੰਡੀ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਸਿੱਧੀ ਵਿਕਰੀ ਦੀ ਸਹੂਲਤ।
                    </a>
                  </p>
                  <p>
                    <a href="#business" className="external-link">
                      ਡਿਜੀਟਲ ਪੇਮੈਂਟ ਅਤੇ ਈ-ਕਾਮਰਸ ਨਾਲ ਪੇਂਡੂ ਕਾਰੋਬਾਰੀਆਂ ਨੂੰ ਵਿਸ਼ਵ ਪੱਧਰੀ ਬਾਜ਼ਾਰ ਮੁਹੱਈਆ।
                    </a>
                  </p>
                  <div>
                    <a href="#business">
                      <span className="read-more">ਵਪਾਰ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4-column sidebar */}
          <div className="col-md-4">
            <div className="sidebar-add-place">
              <a href="#" target="_blank" rel="noreferrer">
                <img src="/img/banner_400x270.jpg" alt="Sidebar Ad" style={{ width: '100%', height: 'auto' }} />
              </a>
            </div>

            <div className="block-title-1">
              <h3>
                <a href="#feed">
                  <strong>ਪੰਜਾਬ ਫਾਈਲਜ਼</strong> ਫੀਡ
                </a>
              </h3>
            </div>

            <div className="sidebar-newsfeed">
              <div className="newsfeed-3">
                <ul>
                  {newsfeedItems.map((item, idx) => (
                    <li key={idx}>
                      <div className="item">
                        <div className="item-image">
                          <a className="img-link" href="#feed">
                            <img className="img-responsive img-full" src={item.img} alt={item.title} />
                          </a>
                        </div>
                        <div className="item-content">
                          <h4 className="ellipsis">
                            <a href="#feed">{item.title}</a>
                          </h4>
                          <p className="ellipsis">
                            <a href="#feed">{item.desc}</a>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
