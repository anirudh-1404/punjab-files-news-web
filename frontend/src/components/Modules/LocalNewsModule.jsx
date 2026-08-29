import React from 'react';

const categoryLinks = [
  { name: 'Home', link: '/' },
  { name: 'Watch Live 24/7', link: '#watch-live' },
  { name: '24 TV & Radio', link: '#tv-radio' },
  { name: 'Web Shows', link: '#web-shows' },
  { name: 'Punjab Files Store', link: '#store' },
  { name: 'TV Schedule', link: '#tv-schedule' },
  { name: 'News', link: '#news' },
  { name: 'Politics | Business', link: '#politics' },
  { name: 'Tech-Science', link: '#tech' },
  { name: 'Lifestyle', link: '#lifestyle' },
  { name: 'Sport', link: '#sport' },
  { name: 'Cricket', link: '#cricket' },
  { name: 'Soccer', link: '#soccer' },
  { name: 'Basketball', link: '#basketball' },
  { name: 'Formula 1', link: '#f1' },
  { name: 'Tennis', link: '#tennis' },
  { name: 'Health', link: '#health' },
  { name: "Men's Health", link: '#health' },
  { name: "Women's Health", link: '#health' },
  { name: "Children's Health", link: '#health' },
  { name: 'World', link: '#world' },
  { name: 'Asia | Australia', link: '#world' },
  { name: 'Europe | Middle East', link: '#world' },
  { name: 'North America', link: '#world' },
  { name: 'Travel & Destinations', link: '#travel' },
  { name: 'Environment & Climate', link: '#environment' },
  { name: 'Art & Entertainment', link: '#art' }
];

const localNewsItems = [
  {
    title: 'Emergency Response Drill in Central Hub',
    tag: 'Breaking News',
    tagClass: 'label-1',
    img: '/img/index_800x400-image09.jpg',
    desc: 'Emergency personnel and civil defence teams participate in comprehensive safety drills...',
    btnText: 'Watch Live',
    btnLink: '#watch-live'
  },
  {
    title: "Championship Tournament Season Kickoff",
    tag: 'Sport',
    tagClass: 'label-4',
    img: '/img/index_800x400-image10.jpg',
    desc: 'Athletes and coaches gear up for the upcoming inter-state championship games with high optimism.',
    btnText: 'Sport',
    btnLink: '#sport'
  },
  {
    title: 'Cultural Heritage & Modern Lifestyle',
    tag: 'Lifestyle',
    tagClass: 'label-9',
    img: '/img/index_800x400-image11.jpg',
    desc: 'Annual literature and heritage festival begins with inspiring addresses from leading scholars.',
    btnText: 'Lifestyle',
    btnLink: '#lifestyle'
  },
  {
    title: 'Scenic Travel Corridors & Tourism',
    tag: 'Travel',
    tagClass: 'label-3',
    img: '/img/index_800x400-image12.jpg',
    desc: 'New eco-tourism routes highlight historical landmarks and lush agricultural valleys.',
    btnText: 'Travel',
    btnLink: '#travel'
  },
  {
    title: 'Digital Shows & Ground Reports',
    tag: 'Web Shows',
    tagClass: 'label-6',
    img: '/img/index_800x400-image13.jpg',
    desc: 'Our investigative journalism series explores grassroots stories making a positive difference.',
    btnText: 'Web Shows',
    btnLink: '#web-shows'
  }
];

const recentPosts = [
  {
    time: '1 min ago',
    text: 'Met Department forecasts seasonal showers across northern plains.',
    img: '/img/index_800x400-image40.jpg'
  },
  {
    time: '2 min ago',
    text: 'Advisory issued for small business entrepreneurship and digital loan schemes.'
  },
  {
    time: '3 min ago',
    text: 'State sports academy announces new training scholarships for young talent.'
  },
  {
    time: '4 min ago',
    text: 'Health clinics offer free seasonal health checks in suburban districts.',
    img: '/img/index_800x400-image41.jpg'
  },
  {
    time: '5 min ago',
    text: 'Scientists discuss solar weather cycles and renewable energy grid integration.',
    img: '/img/index_800x400-image42.jpg'
  },
  {
    time: '6 min ago',
    text: 'Transportation authority rolls out electric transit buses on major urban routes.'
  },
  {
    time: '8 min ago',
    text: 'Water management board implements smart canal monitoring technology.'
  }
];

export default function LocalNewsModule() {
  return (
    <section className="module highlight">
      <div className="container">
        <div className="row no-gutter">
          {/* Main 8-col Content */}
          <div className="col-md-8">
            <div className="module-title">
              <h3 className="title">
                <span className="bg-1">Local News</span>
              </h3>
              <h3 className="subtitle">Latest News in details</h3>
            </div>

            <div className="row no-gutter">
              {/* Category Links Col-3 */}
              <div className="col-xs-12 col-sm-3 col-md-3">
                <ul className="list list-mark-1">
                  {categoryLinks.map((cat, idx) => (
                    <li key={idx}>
                      <a href={cat.link}>{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* News Items Col-9 */}
              <div className="col-xs-12 col-sm-9 col-md-9">
                <div className="news">
                  {localNewsItems.map((item, idx) => (
                    <div className="item" key={idx}>
                      <div className="item-image-3">
                        <a className="img-link" href={item.btnLink}>
                          <img className="img-responsive img-full" src={item.img} alt={item.title} />
                        </a>
                        <span>
                          <a className={item.tagClass} href={item.btnLink}>{item.tag}</a>
                        </span>
                      </div>
                      <div className="item-content">
                        <div className="title-left title-style04 underline04">
                          <h3>
                            <a href={item.btnLink}>
                              <strong>{item.title.split(' ')[0]}</strong> {item.title.split(' ').slice(1).join(' ')}
                            </a>
                          </h3>
                        </div>
                        <p>
                          <a href={item.btnLink} className="external-link">
                            {item.desc}
                          </a>
                        </p>
                        <div>
                          <a href={item.btnLink}>
                            <span className="read-more">{item.btnText}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 4-col Sidebar */}
          <div className="col-md-4">
            <div className="title-style02">
              <h3>
                <a href="#recent">Recent Posts</a>
              </h3>
            </div>

            <div className="sidebar-scroll" style={{ maxHeight: '720px', overflowY: 'auto' }}>
              <div className="item">
                <div className="item-image-full">
                  <a className="img-link" href="#recent">
                    <img className="img-responsive img-full" src="/img/index_800x400-image02.jpg" alt="Featured Story" />
                  </a>
                </div>
              </div>
              <div className="item">
                <div className="item-content-1">
                  <h3>Thousands of citizens gather at the community technology conclave.</h3>
                </div>
              </div>

              {recentPosts.map((post, idx) => (
                <div className="scroll-item" key={idx}>
                  <div className="item">
                    {post.img && (
                      <div className="item-image">
                        <a className="img-link" href="#recent">
                          <img className="img-responsive img-full" src={post.img} alt="" />
                        </a>
                      </div>
                    )}
                    <div className={post.img ? 'item-content' : 'item-content-1'}>
                      <p>
                        <i className="fa fa-clock-o"></i> <span className="day"> {post.time}</span> <br />
                        {post.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
