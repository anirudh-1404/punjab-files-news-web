import React, { useState, useEffect } from 'react';

export default function SecondMenu() {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const weekdayNames = [
        'ਐਤਵਾਰ',
        'ਸੋਮਵਾਰ',
        'ਮੰਗਲਵਾਰ',
        'ਬੁੱਧਵਾਰ',
        'ਵੀਰਵਾਰ',
        'ਸ਼ੁੱਕਰਵਾਰ',
        'ਸ਼ਨਿੱਚਰਵਾਰ'
      ];
      const monthNames = [
        'ਜਨਵਰੀ',
        'ਫ਼ਰਵਰੀ',
        'ਮਾਰਚ',
        'ਅਪ੍ਰੈਲ',
        'ਮਈ',
        'ਜੂਨ',
        'ਜੁਲਾਈ',
        'ਅਗਸਤ',
        'ਸਤੰਬਰ',
        'ਅਕਤੂਬਰ',
        'ਨਵੰਬਰ',
        'ਦਸੰਬਰ'
      ];

      const weekday = weekdayNames[now.getDay()];
      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();

      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'ਸ਼ਾਮ' : 'ਸਵੇਰੇ';

      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = hours < 10 ? '0' + hours : hours;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

      setDateStr(`${weekday}, ${day} ${month} ${year}`);
      setTimeStr(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="second-menu navbar" id="nav-below-main">
      <div className="container">
        <div className="collapse navbar-collapse nav-below-main in">
          <ul className="nav navbar-nav">
            <li>
              <a href="#watch-live">ਲਾਈਵ 24/7 ਦੇਖੋ</a>
            </li>
            <li>
              <a href="#tv-radio">24 ਟੀਵੀ ਅਤੇ ਰੇਡੀਓ</a>
            </li>
            <li>
              <a href="#web-shows">ਵੈੱਬ ਸ਼ੋਅ</a>
            </li>
            <li>
              <a href="#store">ਪੰਜਾਬ ਫਾਈਲਜ਼ ਸਟੋਰ</a>
            </li>
          </ul>
        </div>

        {/* Live Punjabi Digital Clock */}
        <div className="clock">
          <div id="time">{timeStr}</div>
          <div id="date">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
