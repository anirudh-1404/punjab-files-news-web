import React from 'react';

const newsfeedItems = [
  {
    title: 'From propaganda to pop artist',
    desc: 'A gift for drawing led to a prestigious career as celebrated artist...',
    img: '/img/index_370x185-image01.jpg'
  },
  {
    title: 'Clean Energy & Regional Growth',
    desc: 'New green energy projects promise sustainable power generation...',
    img: '/img/index_370x185-image02.jpg'
  },
  {
    title: 'Youth & Higher Education',
    desc: 'Empowering students through advanced skill training programs...',
    img: '/img/index_370x185-image03.jpg'
  },
  {
    title: 'Infrastructure Developments',
    desc: 'Highway expansion accelerates commerce across state borders...',
    img: '/img/index_370x185-image04.jpg'
  },
  {
    title: 'Public Health Care Outreaches',
    desc: 'Healthcare camps offer free diagnostics and specialist care...',
    img: '/img/index_370x185-image05.jpg'
  },
  {
    title: 'How To Succeed In Modern Markets',
    desc: 'Strategies for establishing entrepreneurial ventures in emerging sectors...',
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
                  <span className="bg-11">National News</span>
                </h3>
                <h3 className="subtitle">Latest News in details</h3>
              </div>

              {/* Item 1 */}
              <div className="item">
                <div className="item-image-2">
                  <a className="img-link" href="#politics">
                    <img className="img-responsive img-full" src="/img/index_800x400-image05.jpg" alt="National Politics" />
                  </a>
                  <span>
                    <a className="label-2" href="#politics">Politics</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#politics">
                        <strong>Legislative</strong> Assembly Reforms
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#politics">
                      Key legislation regarding agricultural welfare and rural development receives broad parliamentary backing.
                    </a>
                  </p>
                  <p>
                    <a href="#politics" className="external-link">
                      Ministerial leaders affirm commitments toward transparent resource distribution and fast-track implementation.
                    </a>
                  </p>
                  <div>
                    <a href="#politics">
                      <span className="read-more">Politics</span>
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
                    <a className="label-1" href="#news">News</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#news">
                        <strong>Community</strong> Development Initiatives
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#news" className="external-link">
                      Civic authorities unveil state-of-the-art citizen centers to streamline municipal services.
                    </a>
                  </p>
                  <p>
                    <a href="#news" className="external-link">
                      Residents welcome digital grievance redressing portals designed for quick response.
                    </a>
                  </p>
                  <div>
                    <a href="#news">
                      <span className="read-more">Punjab Files News</span>
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
                    <a className="label-5" href="#business">Economy</a>
                  </span>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#business">
                        <strong>Economic</strong> Outlook &amp; Market Growth
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#business" className="external-link">
                      How regional enterprise clusters are driving job creation and boosting industrial manufacturing.
                    </a>
                  </p>
                  <p>
                    <a href="#business" className="external-link">
                      Financial experts project strong GDP performance driven by domestic consumption and exports.
                    </a>
                  </p>
                  <div>
                    <a href="#business">
                      <span className="read-more">Watch Live</span>
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
                  <a className="label-6" href="#business">Business</a>
                </div>
                <div className="item-content">
                  <div className="title-left title-style04 underline04">
                    <h3>
                      <a href="#business">
                        <strong>Technology</strong> &amp; Digital Commerce
                      </a>
                    </h3>
                  </div>
                  <p>
                    <a href="#business" className="external-link">
                      Modern fintech innovations are empowering local merchants with contactless payment infrastructure.
                    </a>
                  </p>
                  <p>
                    <a href="#business" className="external-link">
                      Cloud computing and smart logistics optimize supply chain reliability across districts.
                    </a>
                  </p>
                  <div>
                    <a href="#business">
                      <span className="read-more">Business</span>
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
                  <strong>Punjab Files</strong> Feed
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
