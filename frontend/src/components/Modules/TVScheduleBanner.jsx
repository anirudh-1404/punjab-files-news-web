import React from 'react';

export default function TVScheduleBanner() {
  return (
    <section className="module dark">
      <div className="container">
        <div className="show-info">
          <h4 className="schedule-logo bg-1">
            <a href="#tv-schedule">TV Schedule</a>
          </h4>
          <div className="show-title">
            <h2>Punjab Insight</h2>
            <h3>Hosted by Senior Editors</h3>
          </div>
          <h4>
            <a className="show-info-button bg-1" href="#watch">
              Watch the prime time policy debate and exclusive interviews, Tonight at 9 PM
            </a>
          </h4>
          <div className="figure">
            <img src="/img/schedule_figure.png" alt="Show Host" />
          </div>
        </div>
        <div className="schedule-squares">
          <span className="square2"></span>
          <span className="square3"></span>
          <span className="square4"></span>
          <span className="square5"></span>
          <span className="square6"></span>
          <span className="square7"></span>
          <span className="square8"></span>
          <span className="square9"></span>
          <span className="square10"></span>
          <span className="square11"></span>
        </div>
      </div>
    </section>
  );
}
