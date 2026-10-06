import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function PodcastAudioCard({ podcast }) {
  if (!podcast) return null;

  const audioRef = useRef(null);

  const youtubeId = extractYouTubeId(podcast.mediaUrl);
  const isVideoPodcast = podcast.mediaType === 'youtube' || Boolean(youtubeId);

  // Audio state for non-youtube podcasts
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(() => parseDurationToSeconds(podcast.duration));
  const [isMuted, setIsMuted] = useState(false);

  // Audio element events for direct MP3 files
  const handleAudioTimeUpdate = () => {
    if (!isVideoPodcast && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (!isVideoPodcast && audioRef.current && audioRef.current.duration) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Play / Pause Toggle for Audio
  const togglePlay = () => {
    if (audioRef.current) {
      const nextState = !isPlaying;
      setIsPlaying(nextState);
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
    if (audioRef.current) {
      audioRef.current.currentTime = seekSecs;
    }
  };

  // 10s Rewind
  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 10s Forward
  const handleForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Mute / Unmute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Strip: Badge ("ਪੋਡਕਾਸਟ") & Duration */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              backgroundColor: '#fef2f2',
              color: '#b71c1c',
              border: '1px solid #fecaca',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <i className="fa fa-podcast"></i>
            <span>ਪੋਡਕਾਸਟ</span>
          </span>
        </div>

        {podcast.duration && (
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
            <i className="fa fa-clock-o" style={{ marginRight: '4px' }}></i>
            {podcast.duration}
          </span>
        )}
      </div>

      {/* -------------------------------------------------------------
          1. VIDEO PODCAST (YOUTUBE EMBED PLAYER SHOWN DIRECTLY)
      ------------------------------------------------------------- */}
      {isVideoPodcast && youtubeId ? (
        <div style={{ marginBottom: '10px' }}>
          {/* 16:9 Responsive Video Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '6px',
              backgroundColor: '#000000',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`}
              title={podcast.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------
            2. PURE AUDIO PODCAST (CUSTOM MP3 PLAYER)
        ------------------------------------------------------------- */
        <div>
          <audio
            ref={audioRef}
            src={podcast.mediaUrl}
            onTimeUpdate={handleAudioTimeUpdate}
            onLoadedMetadata={handleAudioLoadedMetadata}
            onEnded={handleAudioEnded}
            style={{ display: 'none' }}
          />

          {/* Cover + Host info */}
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
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                ਮੇਜ਼ਬਾਨ: <span style={{ fontWeight: '700', color: '#334155' }}>{podcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</span>
              </p>
            </div>
          </div>

          {/* Scrubber */}
          <div style={{ marginBottom: '8px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '3px', fontWeight: '700' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Audio Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginBottom: '8px' }}>
            <button
              onClick={handleRewind}
              style={{ background: 'none', border: 'none', color: '#475569', fontSize: '13px', cursor: 'pointer', padding: '4px' }}
            >
              <i className="fa fa-undo"></i>
            </button>
            <button
              onClick={togglePlay}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#b71c1c',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              <i className={isPlaying ? 'fa fa-pause' : 'fa fa-play'}></i>
            </button>
            <button
              onClick={handleForward}
              style={{ background: 'none', border: 'none', color: '#475569', fontSize: '13px', cursor: 'pointer', padding: '4px' }}
            >
              <i className="fa fa-repeat"></i>
            </button>
          </div>
        </div>
      )}

      {/* Title & Details */}
      <div>
        <h4
          style={{
            margin: '0 0 4px',
            fontSize: '13px',
            fontWeight: '800',
            color: '#0f172a',
            lineHeight: '1.35',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {podcast.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          <span>
            ਮੇਜ਼ਬਾਨ: <strong style={{ color: '#334155' }}>{podcast.host || 'ਪੰਜਾਬ ਫਾਈਲਜ਼'}</strong>
          </span>

          {/* Direct Link to View All Podcasts Page */}
          <Link
            to="/podcasts"
            style={{
              color: '#b71c1c',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px'
            }}
          >
            <span>ਸਾਰੇ ਪੋਡਕਾਸਟ</span>
            <i className="fa fa-angle-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
