import React, { useState, useRef, useEffect } from 'react';

// Format seconds into MM:SS
const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
};

// Parse string duration like "25:40" or "30" into seconds
const parseDurationToSeconds = (durStr) => {
  if (!durStr) return 1200; // default 20 mins
  if (typeof durStr === 'number') return durStr;
  const parts = durStr.split(':').map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const parsed = parseInt(durStr, 10);
  return !isNaN(parsed) ? parsed * 60 : 1200;
};

// Extract YouTube ID if link is YouTube
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function PodcastAudioCard({ podcast }) {
  if (!podcast) return null;

  const audioRef = useRef(null);
  const ytIframeRef = useRef(null);

  const youtubeId = extractYouTubeId(podcast.mediaUrl);
  const isYouTube = podcast.mediaType === 'youtube' || Boolean(youtubeId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(() => parseDurationToSeconds(podcast.duration));
  const [isMuted, setIsMuted] = useState(false);

  // If YouTube, set up hidden iframe postMessage controls & ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Audio element events for direct MP3 files
  const handleAudioTimeUpdate = () => {
    if (!isYouTube && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (!isYouTube && audioRef.current && audioRef.current.duration) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (isYouTube) {
      if (ytIframeRef.current?.contentWindow) {
        const cmd = nextState ? 'playVideo' : 'pauseVideo';
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: cmd, args: [] }),
          '*'
        );
      }
    } else if (audioRef.current) {
      if (nextState) {
        audioRef.current.play().catch((e) => console.warn('Audio play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Seek bar handler
  const handleSeek = (e) => {
    const seekSecs = parseFloat(e.target.value);
    setCurrentTime(seekSecs);

    if (isYouTube) {
      if (ytIframeRef.current?.contentWindow) {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [seekSecs, true] }),
          '*'
        );
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = seekSecs;
    }
  };

  // 10s Rewind
  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (isYouTube) {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
        '*'
      );
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 10s Forward
  const handleForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 10);
    setCurrentTime(newTime);
    if (isYouTube) {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
        '*'
      );
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Mute / Unmute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (isYouTube) {
      const cmd = nextMute ? 'mute' : 'unMute';
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: cmd, args: [] }),
        '*'
      );
    } else if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px 14px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Hidden Audio Engines - No Video Shown */}
      {isYouTube && youtubeId ? (
        <iframe
          ref={ytIframeRef}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&playsinline=1&controls=0&origin=${window.location.origin}`}
          title={podcast.title}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
            border: 'none',
            top: '-9999px',
            left: '-9999px'
          }}
          allow="autoplay"
        />
      ) : (
        <audio
          ref={audioRef}
          src={podcast.mediaUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onEnded={handleAudioEnded}
          style={{ display: 'none' }}
        />
      )}

      {/* Top Strip: Badge, Mute & Live Equalizer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              backgroundColor: '#fef2f2',
              color: '#b71c1c',
              border: '1px solid #fecaca',
              padding: '2px 7px',
              borderRadius: '3px',
              fontSize: '10.5px',
              fontWeight: '800',
              letterSpacing: '0.4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <i className="fa fa-headphones"></i> ਆਡੀਓ ਪੋਡਕਾਸਟ
          </span>
        </div>

        {/* Right side: Mute Toggle + Animated Wave Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMute}
            title={isMuted ? 'ਅਨਮਿਊਟ ਕਰੋ' : 'ਮਿਊਟ ਕਰੋ'}
            style={{
              background: 'none',
              border: 'none',
              color: isMuted ? '#ef4444' : '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className={isMuted ? 'fa fa-volume-off' : 'fa fa-volume-up'}></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '14px' }}>
            {[0.5, 0.9, 0.4, 0.8, 0.6].map((scale, i) => (
              <span
                key={i}
                style={{
                  width: '3px',
                  height: isPlaying ? '100%' : '3px',
                  backgroundColor: isPlaying ? '#b71c1c' : '#cbd5e1',
                  borderRadius: '2px',
                  transformOrigin: 'bottom',
                  animation: isPlaying ? `equalizerWave 0.9s ease-in-out infinite alternate ${i * 0.15}s` : 'none'
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Info Row: Cover + Title + Host */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <div
          style={{
            position: 'relative',
            width: '52px',
            height: '52px',
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <img
            src={podcast.thumbnail || '/img/index_800x400-image01.jpg'}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = '/img/index_800x400-image01.jpg'; }}
          />
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(183, 28, 28, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <i className="fa fa-volume-up"></i>
            </div>
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4
            style={{
              margin: '0 0 3px',
              fontSize: '12.5px',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: '1.3',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {podcast.title}
          </h4>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            ਮੇਜ਼ਬਾਨ: <span style={{ fontWeight: '700', color: '#334155' }}>{podcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</span>
          </p>
        </div>
      </div>

      {/* Progress Bar / Scrubber */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            min="0"
            max={totalDuration || 100}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: '5px',
              WebkitAppearance: 'none',
              appearance: 'none',
              borderRadius: '3px',
              background: `linear-gradient(to right, #b71c1c ${progressPercent}%, #e2e8f0 ${progressPercent}%)`,
              outline: 'none',
              cursor: 'pointer',
              margin: 0
            }}
          />
        </div>

        {/* Timers: Current Time / Total Duration */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '3px', fontWeight: '700' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Control Buttons Row - Perfectly Symmetrical 3-item layout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', paddingTop: '6px' }}>
        {/* Rewind 10s */}
        <button
          onClick={handleRewind}
          title="10 ਸਕਿੰਟ ਪਿੱਛੇ"
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '6px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontWeight: '700',
            width: '46px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b71c1c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          <i className="fa fa-undo"></i>
          <span style={{ fontSize: '10.5px' }}>10s</span>
        </button>

        {/* Big Circular Play / Pause Toggle Button - Exactly In Center */}
        <button
          onClick={togglePlay}
          title={isPlaying ? 'ਪੌਜ਼ ਕਰੋ' : 'ਸੁਣੋ (Play)'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#b71c1c',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(183, 28, 28, 0.35)',
            transition: 'transform 0.15s ease, background-color 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#991b1b')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b71c1c')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <i
            className={isPlaying ? 'fa fa-pause' : 'fa fa-play'}
            style={{ transform: isPlaying ? 'none' : 'translateX(1.5px)' }}
          ></i>
        </button>

        {/* Forward 10s */}
        <button
          onClick={handleForward}
          title="10 ਸਕਿੰਟ ਅੱਗੇ"
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '6px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontWeight: '700',
            width: '46px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b71c1c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          <span style={{ fontSize: '10.5px' }}>10s</span>
          <i className="fa fa-repeat"></i>
        </button>
      </div>
    </div>
  );
}
