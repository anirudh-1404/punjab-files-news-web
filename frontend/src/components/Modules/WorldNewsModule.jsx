import React from 'react';

export default function WorldNewsModule() {
  return (
    <section className="module highlight">
      <div className="container">
        <div className="module-title">
          <h3 className="title">
            <span className="bg-1">ਦੇਸ਼-ਵਿਦੇਸ਼</span>
          </h3>
          <h3 className="subtitle">ਦੇਖੋ ਤਾਜ਼ਾ ਅਤੇ ਵੱਡੀਆਂ ਖ਼ਬਰਾਂ</h3>
        </div>
        <div className="row no-gutter">
          {/* Column 1 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {/* Item 1 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#news">
                    <img className="img-responsive img-full" src="/img/index_800x400-image01.jpg" alt="Global Summit" />
                  </a>
                  <span>
                    <a className="label-1" href="#news">ਖ਼ਬਰਾਂ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#news">
                        <strong>ਵਿਸ਼ਵ</strong> ਸੰਮੇਲਨ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#news" className="external-link">
                      ਕੌਮਾਂਤਰੀ ਪੱਧਰ 'ਤੇ ਆਰਥਿਕ ਸਹਿਯੋਗ ਅਤੇ ਵਪਾਰਕ ਸਾਂਝ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ ਲਈ ਅਹਿਮ ਸਮਝੌਤਾ।
                    </a>
                  </p>
                  <p>
                    <a href="#news" className="external-link">
                      ਵੱਖ-ਵੱਖ ਦੇਸ਼ਾਂ ਦੇ ਡੈਲੀਗੇਟਾਂ ਨੇ ਟਿਕਾਊ ਵਿਕਾਸ ਅਤੇ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਨੀਤੀਆਂ 'ਤੇ ਦਿੱਤਾ ਜ਼ੋਰ।
                    </a>
                  </p>
                  <div>
                    <a href="#news">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#politics">
                    <img className="img-responsive img-full" src="/img/index_800x400-image02.jpg" alt="Diplomatic Assembly" />
                  </a>
                  <span>
                    <a className="label-3" href="#politics">ਰਾਜਨੀਤੀ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#politics">
                        <strong>ਸਿਆਸੀ</strong> ਸਰਗਰਮੀਆਂ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#politics" className="external-link">
                      ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ ਦੌਰਾਨ ਜਨਤਕ ਮੁੱਦਿਆਂ ਅਤੇ ਬਜਟ ਅਲਾਟਮੈਂਟ 'ਤੇ ਵਿਸਥਾਰਪੂਰਵਕ ਚਰਚਾ।
                    </a>
                  </p>
                  <p>
                    <a href="#politics" className="external-link">
                      ਲੋਕ ਨੁਮਾਇੰਦਿਆਂ ਨੇ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਨੂੰ ਤੇਜ਼ ਕਰਨ ਦੀ ਮੰਗ ਕੀਤੀ।
                    </a>
                  </p>
                  <div>
                    <a href="#politics">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {/* Item 3 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#tech">
                    <img className="img-responsive img-full" src="/img/index_800x400-image03.jpg" alt="Space Science" />
                  </a>
                  <span>
                    <a className="label-5" href="#tech">ਵਿਗਿਆਨ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#tech">
                        <strong>ਪੁਲਾੜ</strong> ਅਤੇ ਤਕਨਾਲੋਜੀ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#tech" className="external-link">
                      ਵਿਗਿਆਨੀਆਂ ਵੱਲੋਂ ਨਵੇਂ ਪੁਲਾੜ ਮਿਸ਼ਨ ਦੀ ਸਫ਼ਲ ਸ਼ੁਰੂਆਤ, ਖਗੋਲ ਵਿਗਿਆਨ ਵਿੱਚ ਨਵਾਂ ਇਤਿਹਾਸ।
                    </a>
                  </p>
                  <p>
                    <a href="#tech" className="external-link">
                      ਆਧੁਨਿਕ ਸੈਟੇਲਾਈਟ ਰਾਹੀਂ ਮੌਸਮ ਅਤੇ ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ ਦੀ ਅਗਾਊਂ ਜਾਣਕਾਰੀ ਮਿਲਣਾ ਹੋਵੇਗਾ ਆਸਾਨ।
                    </a>
                  </p>
                  <div>
                    <a href="#tech">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#health">
                    <img className="img-responsive img-full" src="/img/index_800x400-image04.jpg" alt="Global Health" />
                  </a>
                  <span>
                    <a className="label-2" href="#health">ਸਿਹਤ</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#health">
                        <strong>ਸਿਹਤ</strong> ਸੰਭਾਲ ਪ੍ਰੋਗਰਾਮ
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#health" className="external-link">
                      ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮੈਡੀਕਲ ਸਹੂਲਤਾਂ ਦਾ ਵਿਸਥਾਰ, ਮਾਹਿਰ ਡਾਕਟਰਾਂ ਵੱਲੋਂ ਮੁਫ਼ਤ ਜਾਂਚ ਕੈਂਪ।
                    </a>
                  </p>
                  <p>
                    <a href="#health" className="external-link">
                      ਸਿਹਤ ਮਾਹਿਰਾਂ ਨੇ ਚੰਗੀ ਖ਼ੁਰਾਕ ਅਤੇ ਰੋਜ਼ਾਨਾ ਕਸਰਤ ਨੂੰ ਰੋਗਾਂ ਤੋਂ ਬਚਾਅ ਲਈ ਜ਼ਰੂਰੀ ਦੱਸਿਆ।
                    </a>
                  </p>
                  <div>
                    <a href="#health">
                      <span className="read-more">ਹੋਰ ਪੜ੍ਹੋ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
