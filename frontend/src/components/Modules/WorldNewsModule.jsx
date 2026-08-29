import React from 'react';

export default function WorldNewsModule() {
  return (
    <section className="module highlight">
      <div className="container">
        <div className="module-title">
          <h3 className="title">
            <span className="bg-1">World News</span>
          </h3>
          <h3 className="subtitle">Watch the latest news</h3>
        </div>
        <div className="row no-gutter">
          {/* Column 1 */}
          <div className="col-sm-6 col-md-6">
            <div className="news">
              {/* Item 1 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#news">
                    <img className="img-responsive img-full" src="/img/index_800x400-image01.jpg" alt="Migrant Crisis" />
                  </a>
                  <span>
                    <a className="label-1" href="#news">News</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#news">
                        <strong>Global</strong> Summit
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#news" className="external-link">
                      The international council establishes landmark framework on humanitarian relief.
                    </a>
                  </p>
                  <p>
                    <a href="#news" className="external-link">
                      Key delegates emphasize sustainable partnerships and long-term socio-economic stability.
                    </a>
                  </p>
                  <div>
                    <a href="#news">
                      <span className="read-more">News</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="item">
                <div className="item-image-1">
                  <a className="img-link" href="#politics">
                    <img className="img-responsive img-full" src="/img/index_800x400-image02.jpg" alt="Diplomatic Delegation" />
                  </a>
                  <span>
                    <a className="label-3" href="#politics">Politics</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#politics">
                        <strong>Diplomatic</strong> Assembly
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#politics" className="external-link">
                      Leadership addresses national concerns during the annual multilateral conference.
                    </a>
                  </p>
                  <p>
                    <a href="#politics" className="external-link">
                      Civil society leaders stress transparent governance and institutional responsiveness.
                    </a>
                  </p>
                  <div>
                    <a href="#politics">
                      <span className="read-more">Politics</span>
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
                    <a className="label-5" href="#tech">Science</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#tech">
                        <strong>Space</strong> &amp; Astronomy
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#tech" className="external-link">
                      Observatories across continents record rare solar phenomena with high precision.
                    </a>
                  </p>
                  <p>
                    <a href="#tech" className="external-link">
                      Astronomers highlight insights gained from latest deep space atmospheric mapping.
                    </a>
                  </p>
                  <div>
                    <a href="#tech">
                      <span className="read-more">Tech-Science</span>
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
                    <a className="label-2" href="#health">Health</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#health">
                        <strong>Global</strong> Health Initiatives
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#health" className="external-link">
                      Medical advancements expand healthcare accessibility in rural communities.
                    </a>
                  </p>
                  <p>
                    <a href="#health" className="external-link">
                      Health advocates reiterate priority access to nutrition and preventative medicine.
                    </a>
                  </p>
                  <div>
                    <a href="#health">
                      <span className="read-more">Health</span>
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
