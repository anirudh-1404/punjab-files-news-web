import React, { useState, useEffect, useMemo } from 'react';
import { webTVAPI } from '../../services/api';

const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=6OW56yMNB1g';
const DEFAULT_TITLE = '24x7 HD ਪ੍ਰਸਾਰਣ';
const DEFAULT_BADGE = 'ON AIR • WEB TV';
const DEFAULT_QUALITY = '1080p HD';

export const LANGUAGE_OPTIONS = [
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', short: 'ਪੰਜਾਬੀ', color: '#b71c1c', bg: '#fee2e2', border: '#fecaca' },
  { code: 'hi', label: 'हिंदी (Hindi)', short: 'हिंदी', color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  { code: 'en', label: 'English', short: 'English', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' }
];

// Helper to calculate date string formatted YYYY-MM-DD
function getDateStringWithOffset(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
}

// Convert any YouTube URL to an embed URL for preview
function getEmbedUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://www.youtube-nocookie.com/embed/6OW56yMNB1g?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0';
  }

  let clean = url.trim();

  // Handle iframe src extraction
  const iframeMatch = clean.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    clean = iframeMatch[1].trim();
  }

  const ytRegex = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = clean.match(ytRegex);

  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0`;
  }

  if (clean.includes('youtube.com/embed/') || clean.includes('youtube-nocookie.com/embed/')) {
    if (!clean.includes('autoplay=1')) {
      const sep = clean.includes('?') ? '&' : '?';
      return `${clean}${sep}autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0`;
    }
    return clean;
  }

  return clean;
}

// Format date for readable presentation (e.g. "Wed, 07 Oct 2026")
function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  } catch (e) {}
  return dateStr;
}

export default function WebTVManagerView({ currentUser }) {
  // Navigation Sub-tab: 'schedules' (Date Scheduling) or 'default' (Default 24x7 Stream)
  const [activeTab, setActiveTab] = useState('schedules');

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Today date from server (YYYY-MM-DD)
  const [todayDate, setTodayDate] = useState(() => getDateStringWithOffset(0));

  // Current Live Info (what homepage currently displays)
  const [currentLive, setCurrentLive] = useState(null);

  // Default 24x7 Stream State by Language
  const [defaultLangTab, setDefaultLangTab] = useState('pa');
  const [defaultConfigs, setDefaultConfigs] = useState({
    pa: {
      videoUrl: DEFAULT_VIDEO_URL,
      title: DEFAULT_TITLE,
      badge: DEFAULT_BADGE,
      quality: DEFAULT_QUALITY,
      isActive: true
    },
    hi: {
      videoUrl: DEFAULT_VIDEO_URL,
      title: '24x7 HD प्रसारण',
      badge: DEFAULT_BADGE,
      quality: DEFAULT_QUALITY,
      isActive: true
    },
    en: {
      videoUrl: DEFAULT_VIDEO_URL,
      title: '24x7 HD Broadcast',
      badge: DEFAULT_BADGE,
      quality: DEFAULT_QUALITY,
      isActive: true
    }
  });

  // Scheduled Broadcasts List
  const [schedules, setSchedules] = useState([]);
  const [scheduleFilter, setScheduleFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [scheduleLangFilter, setScheduleLangFilter] = useState('all'); // 'all', 'pa', 'hi', 'en'

  // Schedule Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [formDate, setFormDate] = useState(() => getDateStringWithOffset(1));
  const [formLanguage, setFormLanguage] = useState('pa');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formTitle, setFormTitle] = useState('ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸਾਰਣ (Special Broadcast)');
  const [formBadge, setFormBadge] = useState('SPECIAL • LIVE');
  const [formQuality, setFormQuality] = useState('1080p HD');
  const [formNotes, setFormNotes] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Selected schedule to preview in player
  const [previewTarget, setPreviewTarget] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch live info for Punjabi default
      const liveRes = await webTVAPI.getLive('pa');
      if (liveRes?.data) {
        setCurrentLive(liveRes.data);
        if (liveRes.todayDate) setTodayDate(liveRes.todayDate);
      }

      // Fetch all language default configs
      try {
        const defaultsRes = await webTVAPI.getDefaults();
        if (defaultsRes?.data) {
          setDefaultConfigs((prev) => ({
            pa: defaultsRes.data.pa || prev.pa,
            hi: defaultsRes.data.hi || prev.hi,
            en: defaultsRes.data.en || prev.en
          }));
        }
      } catch (e) {}

      // Fetch all schedules
      const schedRes = await webTVAPI.getSchedules();
      if (schedRes?.data) {
        setSchedules(schedRes.data);
        if (schedRes.todayDate) setTodayDate(schedRes.todayDate);

        if (!schedRes.data || schedRes.data.length === 0) {
          setIsFormOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to load Web TV data:', err);
      setFeedback({
        type: 'error',
        message: 'ਡੇਟਾ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆਈ: ' + (err.message || 'ਕਨੈਕਸ਼ਨ ਤਰੁੱਟੀ')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick dispatch helper to update homepage player immediately
  const triggerHomepageUpdate = (data) => {
    try {
      if (data) {
        localStorage.setItem('punjab_webtv_cache_pa', JSON.stringify(data));
      }
      window.dispatchEvent(new Event('punjab_webtv_updated'));
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // SCHEDULE ACTIONS
  // -------------------------------------------------------------
  const handleSaveSchedule = async (e, addAnother = false) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formDate.trim()) {
      setFeedback({ type: 'error', message: 'ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਡਿਊਲ ਦੀ ਤਾਰੀਖ਼ ਚੁਣੋ (Please select a date).' });
      return;
    }
    if (!formVideoUrl.trim()) {
      setFeedback({ type: 'error', message: 'ਕਿਰਪਾ ਕਰਕੇ ਯੂਟਿਊਬ ਵੀਡੀਓ ਲਿੰਕ ਦਰਜ ਕਰੋ (Please enter a video URL).' });
      return;
    }

    try {
      setSavingSchedule(true);
      setFeedback({ type: '', message: '' });

      const payload = {
        scheduledDate: formDate.trim(),
        language: formLanguage,
        videoUrl: formVideoUrl.trim(),
        title: formTitle.trim() || 'ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸਾਰਣ',
        badge: formBadge.trim() || 'ON AIR • WEB TV',
        quality: formQuality.trim() || '1080p HD',
        notes: formNotes.trim(),
        isActive: formIsActive
      };

      let res;
      if (editingScheduleId) {
        res = await webTVAPI.updateSchedule(editingScheduleId, payload);
      } else {
        res = await webTVAPI.createSchedule(payload);
      }

      const langObj = LANGUAGE_OPTIONS.find((l) => l.code === formLanguage);
      setFeedback({
        type: 'success',
        message: res.message || `ਤਾਰੀਖ਼ ${formDate} (${langObj?.short}) ਲਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਿਆ ਹੈ!`
      });

      await fetchData();
      triggerHomepageUpdate();

      if (addAnother) {
        // Prepare next date automatically (+1 day) and keep form open for fast multi-day entry
        try {
          const [y, m, d] = formDate.split('-').map(Number);
          const nextDateObj = new Date(y, m - 1, d + 1);
          const nextDateStr = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(nextDateObj);
          setFormDate(nextDateStr);
        } catch (e) {
          setFormDate(getDateStringWithOffset(1));
        }
        setEditingScheduleId(null);
        setFormVideoUrl('');
        setFormNotes('');
        setIsFormOpen(true);
      } else {
        // Reset and close form
        handleCancelEdit();
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error('Save schedule error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਸੇਵ ਨਹੀਂ ਹੋ ਸਕਿਆ।'
      });
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleEditSchedule = (item) => {
    setEditingScheduleId(item._id);
    setFormDate(item.scheduledDate);
    setFormLanguage(item.language || 'pa');
    setFormVideoUrl(item.videoUrl);
    setFormTitle(item.title || '');
    setFormBadge(item.badge || '');
    setFormQuality(item.quality || '1080p HD');
    setFormNotes(item.notes || '');
    setFormIsActive(item.isActive !== false);
    setIsFormOpen(true);
    setPreviewTarget(null);

    // Scroll smoothly to form
    const formElement = document.getElementById('schedule-entry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenNewSchedule = () => {
    setEditingScheduleId(null);
    setFormLanguage('pa');
    setFormVideoUrl('');
    setFormTitle('ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸਾਰਣ (Special Broadcast)');
    setFormBadge('SPECIAL • LIVE');
    setFormQuality('1080p HD');
    setFormNotes('');
    setFormIsActive(true);
    setIsFormOpen(true);
    setPreviewTarget(null);

    // Pick tomorrow or day after last scheduled date
    if (schedules && schedules.length > 0) {
      const lastDate = schedules[schedules.length - 1].scheduledDate;
      try {
        const [y, m, d] = lastDate.split('-').map(Number);
        const nextD = new Date(y, m - 1, d + 1);
        const nextDateStr = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(nextD);
        setFormDate(nextDateStr);
      } catch (e) {
        setFormDate(getDateStringWithOffset(1));
      }
    } else {
      setFormDate(getDateStringWithOffset(0));
    }

    setTimeout(() => {
      const formElement = document.getElementById('schedule-entry-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingScheduleId(null);
    setFormVideoUrl('');
    setFormNotes('');
    setPreviewTarget(null);
  };

  const handleDeleteSchedule = async (id, dateStr, lang) => {
    const langObj = LANGUAGE_OPTIONS.find((l) => l.code === lang);
    const langName = langObj ? ` (${langObj.short})` : '';
    if (!window.confirm(`ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਤਾਰੀਖ਼ ${dateStr}${langName} ਦਾ ਸ਼ਡਿਊਲ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?`)) {
      return;
    }

    try {
      setFeedback({ type: '', message: '' });
      const res = await webTVAPI.deleteSchedule(id);
      setFeedback({
        type: 'success',
        message: res.message || `ਤਾਰੀਖ਼ ${dateStr} ਦਾ ਸ਼ਡਿਊਲ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ!`
      });
      if (editingScheduleId === id) {
        handleCancelEdit();
      }
      await fetchData();
      triggerHomepageUpdate();
    } catch (err) {
      console.error('Delete schedule error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'ਤਰੁੱਟੀ: ਸ਼ਡਿਊਲ ਹਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।'
      });
    }
  };

  const handleToggleSchedule = async (id) => {
    try {
      const res = await webTVAPI.toggleSchedule(id);
      setFeedback({
        type: 'success',
        message: res.message || 'ਸਟੇਟਸ ਬਦਲ ਦਿੱਤਾ ਗਿਆ ਹੈ।'
      });
      await fetchData();
      triggerHomepageUpdate();
    } catch (err) {
      console.error('Toggle schedule error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'ਤਰੁੱਟੀ: ਸਟੇਟਸ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ।'
      });
    }
  };

  // -------------------------------------------------------------
  // DEFAULT 24x7 STREAM ACTIONS (PER LANGUAGE)
  // -------------------------------------------------------------
  const currentDefaultConfig = defaultConfigs[defaultLangTab] || defaultConfigs.pa;

  const updateCurrentDefaultField = (field, value) => {
    setDefaultConfigs((prev) => ({
      ...prev,
      [defaultLangTab]: {
        ...prev[defaultLangTab],
        [field]: value
      }
    }));
  };

  const handleSaveDefault = async (e) => {
    e.preventDefault();
    if (!currentDefaultConfig?.videoUrl?.trim()) {
      setFeedback({ type: 'error', message: 'ਮੂਲ ਵੀਡੀਓ ਲਿੰਕ ਦਰਜ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।' });
      return;
    }

    try {
      setSavingDefault(true);
      setFeedback({ type: '', message: '' });

      const res = await webTVAPI.update({
        videoUrl: currentDefaultConfig.videoUrl.trim(),
        title: currentDefaultConfig.title?.trim() || (defaultLangTab === 'hi' ? '24x7 HD प्रसारण' : defaultLangTab === 'en' ? '24x7 HD Broadcast' : DEFAULT_TITLE),
        badge: currentDefaultConfig.badge?.trim() || DEFAULT_BADGE,
        quality: currentDefaultConfig.quality?.trim() || DEFAULT_QUALITY,
        isActive: currentDefaultConfig.isActive,
        language: defaultLangTab
      });

      const langObj = LANGUAGE_OPTIONS.find((l) => l.code === defaultLangTab);
      setFeedback({
        type: 'success',
        message: res.message || `${langObj?.short} ਲਈ ਮੂਲ 24x7 ਵੈੱਬ ਟੀਵੀ ਸਟ੍ਰੀਮ ਸਫ਼ਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਈ ਹੈ!`
      });

      await fetchData();
      triggerHomepageUpdate();
    } catch (err) {
      console.error('Save default error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'ਤਰੁੱਟੀ: ਮੂਲ ਸਟ੍ਰੀਮ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕੀ।'
      });
    } finally {
      setSavingDefault(false);
    }
  };

  const handleResetDefaultFallback = () => {
    updateCurrentDefaultField('videoUrl', DEFAULT_VIDEO_URL);
    setFeedback({
      type: 'info',
      message: 'ਡਿਫਾਲਟ ਯੂਟਿਊਬ ਲਿੰਕ (6OW56yMNB1g) ਸੈੱਟ ਕੀਤਾ ਗਿਆ। ਸੇਵ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤਾ ਬਟਨ ਦਬਾਓ।'
    });
  };

  // Filtered schedules (by date and language)
  const filteredSchedules = useMemo(() => {
    if (!schedules || schedules.length === 0) return [];
    let list = schedules;

    if (scheduleFilter === 'upcoming') {
      list = list.filter((s) => s.scheduledDate >= todayDate);
    } else if (scheduleFilter === 'past') {
      list = list.filter((s) => s.scheduledDate < todayDate);
    }

    if (scheduleLangFilter !== 'all') {
      list = list.filter((s) => (s.language || 'pa') === scheduleLangFilter);
    }

    return list;
  }, [schedules, scheduleFilter, scheduleLangFilter, todayDate]);

  // Determine what video to preview in right player
  const currentPreviewData = useMemo(() => {
    if (activeTab === 'default') {
      const cfg = defaultConfigs[defaultLangTab] || defaultConfigs.pa;
      const langObj = LANGUAGE_OPTIONS.find((l) => l.code === defaultLangTab);
      return {
        url: cfg?.videoUrl || DEFAULT_VIDEO_URL,
        title: cfg?.title || DEFAULT_TITLE,
        badge: cfg?.badge || DEFAULT_BADGE,
        quality: cfg?.quality || DEFAULT_QUALITY,
        isActive: cfg?.isActive !== false,
        label: `ਮੂਲ 24x7 ਸਟ੍ਰੀਮ (${langObj?.short || 'ਪੰਜਾਬੀ'})`
      };
    }

    if (previewTarget) {
      const langObj = LANGUAGE_OPTIONS.find((l) => l.code === (previewTarget.language || 'pa'));
      return {
        url: previewTarget.videoUrl,
        title: previewTarget.title || 'ਸ਼ਡਿਊਲ ਵੀਡੀਓ',
        badge: previewTarget.badge || 'SCHEDULED',
        quality: previewTarget.quality || '1080p HD',
        isActive: previewTarget.isActive !== false,
        label: `ਤਾਰੀਖ਼ ਝਲਕ: ${previewTarget.scheduledDate} (${langObj?.short})`
      };
    }

    if (formVideoUrl.trim()) {
      const langObj = LANGUAGE_OPTIONS.find((l) => l.code === formLanguage);
      return {
        url: formVideoUrl,
        title: formTitle || 'ਨਵਾਂ ਸ਼ਡਿਊਲ',
        badge: formBadge || 'NEW',
        quality: formQuality || '1080p HD',
        isActive: formIsActive,
        label: `ਲਾਈਵ ਫਾਰਮ ਝਲਕ: ${formDate} (${langObj?.short})`
      };
    }

    return {
      url: currentLive?.videoUrl || DEFAULT_VIDEO_URL,
      title: currentLive?.title || DEFAULT_TITLE,
      badge: currentLive?.badge || DEFAULT_BADGE,
      quality: currentLive?.quality || DEFAULT_QUALITY,
      isActive: currentLive?.isActive !== false,
      label: currentLive?.isScheduled ? `ਅੱਜ ਦਾ ਸ਼ਡਿਊਲ (${currentLive?.language || 'ਪੰਜਾਬੀ'})` : 'ਮੂਲ 24x7 ਸਟ੍ਰੀਮ'
    };
  }, [activeTab, defaultLangTab, defaultConfigs, previewTarget, formVideoUrl, formTitle, formBadge, formQuality, formIsActive, formDate, formLanguage, currentLive]);

  const previewEmbedUrl = useMemo(() => {
    return getEmbedUrl(currentPreviewData.url);
  }, [currentPreviewData.url]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px' }}>
      {/* 1. Header Navigation & Mode Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('schedules')}
            style={{
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: '800',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'schedules' ? '#b71c1c' : '#f1f5f9',
              color: activeTab === 'schedules' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'schedules' ? '0 2px 8px rgba(183, 28, 28, 0.25)' : 'none'
            }}
          >
            <i className="fa fa-calendar-check-o"></i>
            <span>📅 ਤਾਰੀਖ਼ ਅਨੁਸਾਰ ਸ਼ਡਿਊਲ (Date-wise Schedules)</span>
            <span
              style={{
                backgroundColor: activeTab === 'schedules' ? 'rgba(255,255,255,0.25)' : '#cbd5e1',
                color: activeTab === 'schedules' ? '#ffffff' : '#1e293b',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '900'
              }}
            >
              {schedules.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('default')}
            style={{
              padding: '9px 18px',
              fontSize: '13.5px',
              fontWeight: '800',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'default' ? '#1c2d5a' : '#f1f5f9',
              color: activeTab === 'default' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'default' ? '0 2px 8px rgba(28, 45, 90, 0.25)' : 'none'
            }}
          >
            <i className="fa fa-television"></i>
            <span>⚙️ ਮੂਲ 24x7 ਲਾਈਵ ਸਟ੍ਰੀਮ (Default by Language)</span>
          </button>
        </div>

        {/* Current Active Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              backgroundColor: currentLive?.isScheduled ? '#f0fdf4' : '#fef9c3',
              color: currentLive?.isScheduled ? '#166534' : '#854d0e',
              border: `1px solid ${currentLive?.isScheduled ? '#bbf7d0' : '#fef08a'}`,
              padding: '5px 12px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                backgroundColor: currentLive?.isScheduled ? '#16a34a' : '#ca8a04',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            ></span>
            ਅੱਜ ({todayDate}): {currentLive?.isScheduled ? `ਸ਼ਡਿਊਲ ਚੱਲ ਰਿਹਾ ਹੈ` : 'ਮੂਲ 24x7 ਸਟ੍ਰੀਮ'}
          </span>
        </div>
      </div>

      {/* 2. Feedback Notification Banner */}
      {feedback.message && (
        <div
          style={{
            padding: '11px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor:
              feedback.type === 'success' ? '#f0fdf4' : feedback.type === 'error' ? '#fef2f2' : '#f0f9ff',
            color:
              feedback.type === 'success' ? '#166534' : feedback.type === 'error' ? '#991b1b' : '#0369a1',
            border: `1px solid ${
              feedback.type === 'success' ? '#bbf7d0' : feedback.type === 'error' ? '#fecaca' : '#bae6fd'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i
              className={`fa ${
                feedback.type === 'success'
                  ? 'fa-check-circle'
                  : feedback.type === 'error'
                  ? 'fa-exclamation-circle'
                  : 'fa-info-circle'
              }`}
              style={{ fontSize: '15px' }}
            ></i>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      )}

      {/* 3. Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 0.95fr)', gap: '22px', alignItems: 'start' }}>
        {/* ========================================================= */}
        {/* LEFT COLUMN: ACTIVE TAB CONTENT                          */}
        {/* ========================================================= */}
        <div>
          {/* TAB 1: DATE-WISE SCHEDULING */}
          {activeTab === 'schedules' && (
            <div>
              {/* SCHEDULES TABLE CONTAINER */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  padding: '18px 20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  marginBottom: '18px'
                }}
              >
                {/* 1. Header Row: Title & Action Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>
                      ਸ਼ਡਿਊਲ ਕੀਤੀਆਂ ਤਾਰੀਖ਼ਾਂ (Scheduled Broadcasts)
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                      ਹਰ ਤਾਰੀਖ਼ ਅਤੇ ਭਾਸ਼ਾ (ਪੰਜਾਬੀ, हिंदी, English) ਲਈ ਵੱਖਰਾ ਯੂਟਿਊਬ ਲਿੰਕ ਚੱਲੇਗਾ।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenNewSchedule}
                    style={{
                      backgroundColor: '#b71c1c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 2px 8px rgba(183, 28, 28, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <i className="fa fa-plus"></i>
                    <span>ਨਵਾਂ ਸ਼ਡਿਊਲ ਜੋੜੋ</span>
                  </button>
                </div>

                {/* 2. Dedicated Filter Toolbar Bar */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  {/* Left: Date Filters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      ਸਮਾਂ:
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setScheduleFilter('all')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          border: '1px solid',
                          borderColor: scheduleFilter === 'all' ? '#1c2d5a' : '#cbd5e1',
                          backgroundColor: scheduleFilter === 'all' ? '#1c2d5a' : '#ffffff',
                          color: scheduleFilter === 'all' ? '#ffffff' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        ਸਾਰੇ ({schedules.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleFilter('upcoming')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          border: '1px solid',
                          borderColor: scheduleFilter === 'upcoming' ? '#1c2d5a' : '#cbd5e1',
                          backgroundColor: scheduleFilter === 'upcoming' ? '#1c2d5a' : '#ffffff',
                          color: scheduleFilter === 'upcoming' ? '#ffffff' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        ਆਗਾਮੀ
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleFilter('past')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          border: '1px solid',
                          borderColor: scheduleFilter === 'past' ? '#1c2d5a' : '#cbd5e1',
                          backgroundColor: scheduleFilter === 'past' ? '#1c2d5a' : '#ffffff',
                          color: scheduleFilter === 'past' ? '#ffffff' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        ਪੁਰਾਣੇ
                      </button>
                    </div>
                  </div>

                  {/* Right: Language Filters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      ਭਾਸ਼ਾ:
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setScheduleLangFilter('all')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          border: '1px solid',
                          borderColor: scheduleLangFilter === 'all' ? '#0f172a' : '#cbd5e1',
                          backgroundColor: scheduleLangFilter === 'all' ? '#0f172a' : '#ffffff',
                          color: scheduleLangFilter === 'all' ? '#ffffff' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        ਸਾਰੀਆਂ
                      </button>
                      {LANGUAGE_OPTIONS.map((l) => {
                        const isSelected = scheduleLangFilter === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => setScheduleLangFilter(l.code)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '5px',
                              border: '1px solid',
                              borderColor: isSelected ? l.color : '#cbd5e1',
                              backgroundColor: isSelected ? l.bg : '#ffffff',
                              color: isSelected ? l.color : '#475569',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            {l.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* THE CLEAN STRUCTURED TABLE */}
                {filteredSchedules.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '44px 20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}
                    >
                      <i className="fa fa-calendar" style={{ fontSize: '22px', color: '#64748b' }}></i>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
                      ਕੋਈ ਸ਼ਡਿਊਲ ਦਰਜ ਨਹੀਂ ਹੈ
                    </p>
                    <span style={{ fontSize: '12.5px', color: '#64748b', maxWidth: '380px', lineHeight: '1.5', marginBottom: '14px' }}>
                      ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਤਾਰੀਖ਼ ਅਤੇ ਭਾਸ਼ਾ (ਪੰਜਾਬੀ, हिंदी, English) ਲਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ ਕਰ ਸਕਦੇ ਹੋ।
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenNewSchedule}
                      style={{
                        backgroundColor: '#b71c1c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(183, 28, 28, 0.2)'
                      }}
                    >
                      <i className="fa fa-plus"></i>
                      <span>ਪਹਿਲਾ ਸ਼ਡਿਊਲ ਜੋੜੋ</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          <th style={{ padding: '10px 12px', width: '125px' }}>ਤਾਰੀਖ਼ (Date)</th>
                          <th style={{ padding: '10px 10px', width: '95px' }}>ਭਾਸ਼ਾ (Lang)</th>
                          <th style={{ padding: '10px 12px' }}>ਸਿਰਲੇਖ & ਲਿੰਕ (Title & Video)</th>
                          <th style={{ padding: '10px 12px', width: '85px', textAlign: 'center' }}>ਸਟੇਟਸ</th>
                          <th style={{ padding: '10px 12px', width: '145px', textAlign: 'right' }}>ਕਾਰਵਾਈਆਂ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules.map((item) => {
                          const isToday = item.scheduledDate === todayDate;
                          const isPast = item.scheduledDate < todayDate;
                          const isEditingThis = editingScheduleId === item._id;
                          const itemLangObj = LANGUAGE_OPTIONS.find((l) => l.code === (item.language || 'pa')) || LANGUAGE_OPTIONS[0];

                          return (
                            <tr
                              key={item._id}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                backgroundColor: isToday
                                  ? '#fff5f5'
                                  : isEditingThis
                                  ? '#eff6ff'
                                  : '#ffffff',
                                transition: 'background-color 0.15s ease'
                              }}
                            >
                              {/* 1. Date Column */}
                              <td style={{ padding: '12px 12px', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  {isToday ? (
                                    <span
                                      style={{
                                        backgroundColor: '#b71c1c',
                                        color: '#ffffff',
                                        fontSize: '9.5px',
                                        fontWeight: '900',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        width: 'fit-content'
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: '6px',
                                          height: '6px',
                                          backgroundColor: '#ffffff',
                                          borderRadius: '50%',
                                          animation: 'livePulse 1.2s infinite'
                                        }}
                                      ></span>
                                      ਅੱਜ ਲਾਈਵ
                                    </span>
                                  ) : isPast ? (
                                    <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                                      ਬੀਤ ਚੁੱਕਿਆ
                                    </span>
                                  ) : (
                                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                                      ਆਗਾਮੀ
                                    </span>
                                  )}
                                  <span style={{ fontSize: '13px', fontWeight: '900', color: isToday ? '#b71c1c' : '#0f172a' }}>
                                    {item.scheduledDate}
                                  </span>
                                  <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>
                                    {formatReadableDate(item.scheduledDate).split(',')[0]}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Language Column */}
                              <td style={{ padding: '12px 10px', verticalAlign: 'top' }}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    backgroundColor: itemLangObj.bg,
                                    color: itemLangObj.color,
                                    border: `1px solid ${itemLangObj.border}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {itemLangObj.short}
                                </span>
                              </td>

                              {/* 3. Video Title & URL Column */}
                              <td style={{ padding: '12px 12px', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e2e8f0', color: '#1c2d5a', padding: '1px 6px', borderRadius: '4px' }}>
                                      {item.badge || 'SPECIAL • LIVE'}
                                    </span>
                                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#b45309', backgroundColor: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>
                                      {item.quality || '1080p HD'}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', lineHeight: '1.3' }}>
                                    {item.title || '24x7 HD ਪ੍ਰਸਾਰਣ'}
                                  </div>

                                  {/* Clean URL Link */}
                                  <div style={{ marginTop: '2px' }}>
                                    <a
                                      href={item.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '11px',
                                        color: '#0284c7',
                                        textDecoration: 'none',
                                        backgroundColor: '#f0f9ff',
                                        border: '1px solid #bae6fd',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        maxWidth: '240px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={item.videoUrl}
                                    >
                                      <i className="fa fa-youtube-play" style={{ color: '#ef4444' }}></i>
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.videoUrl}
                                      </span>
                                      <i className="fa fa-external-link" style={{ fontSize: '9px', color: '#0284c7' }}></i>
                                    </a>
                                  </div>

                                  {item.notes && (
                                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '1px' }}>
                                      ਨੋਟ: {item.notes}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 4. Status Column */}
                              <td style={{ padding: '12px 12px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSchedule(item._id)}
                                  style={{
                                    border: `1px solid ${item.isActive ? '#86efac' : '#cbd5e1'}`,
                                    borderRadius: '16px',
                                    padding: '3px 8px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    backgroundColor: item.isActive ? '#dcfce7' : '#f8fafc',
                                    color: item.isActive ? '#15803d' : '#64748b',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    margin: '0 auto'
                                  }}
                                  title={item.isActive ? 'ਬੰਦ ਕਰੋ (Turn Off)' : 'ਚਾਲੂ ਕਰੋ (Turn On)'}
                                >
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.isActive ? '#16a34a' : '#94a3b8' }}></span>
                                  <span>{item.isActive ? 'ਚਾਲੂ' : 'ਬੰਦ'}</span>
                                </button>
                              </td>

                              {/* 5. Actions Column */}
                              <td style={{ padding: '12px 12px', verticalAlign: 'middle', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                  {/* Preview Button */}
                                  <button
                                    type="button"
                                    onClick={() => setPreviewTarget(item)}
                                    title="ਸੱਜੇ ਪਾਸੇ ਚਲਾ ਕੇ ਦੇਖੋ (Play in Preview)"
                                    style={{
                                      backgroundColor: '#f1f5f9',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '5px',
                                      padding: '5px 8px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      color: '#1e293b',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <i className="fa fa-play" style={{ color: '#b71c1c' }}></i>
                                    <span>ਝਲਕ</span>
                                  </button>

                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleEditSchedule(item)}
                                    title="ਸ਼ਡਿਊਲ ਸੋਧੋ (Edit Schedule)"
                                    style={{
                                      backgroundColor: isEditingThis ? '#3b82f6' : '#eff6ff',
                                      border: `1px solid ${isEditingThis ? '#2563eb' : '#bfdbfe'}`,
                                      borderRadius: '5px',
                                      padding: '5px 8px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      color: isEditingThis ? '#ffffff' : '#1d4ed8',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <i className="fa fa-pencil"></i>
                                    <span>ਸੋਧੋ</span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSchedule(item._id, item.scheduledDate, item.language)}
                                    title="ਸ਼ਡਿਊਲ ਹਟਾਓ (Delete)"
                                    style={{
                                      backgroundColor: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      borderRadius: '5px',
                                      padding: '5px 8px',
                                      fontSize: '11px',
                                      color: '#dc2626',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* THE BOTTOM "+" BUTTON TO ADD ANOTHER DATE */}
                <button
                  type="button"
                  onClick={handleOpenNewSchedule}
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '11px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#1c2d5a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '14px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#1c2d5a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <i className="fa fa-plus-circle" style={{ color: '#b71c1c', fontSize: '15px' }}></i>
                  <span>ਨਵੀਂ ਤਾਰੀਖ਼ ਸ਼ਾਮਲ ਕਰੋ (+ Add Schedule for Another Date & Language)</span>
                </button>
              </div>

              {/* DYNAMIC SCHEDULE ENTRY / EDIT FORM */}
              {isFormOpen && (
                <div
                  id="schedule-entry-form"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    padding: '20px 22px',
                    border: editingScheduleId ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    marginBottom: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: editingScheduleId ? '#3b82f6' : '#b71c1c',
                          color: '#ffffff',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: '800'
                        }}
                      >
                        {editingScheduleId ? 'EDIT' : 'NEW'}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                        {editingScheduleId ? `ਤਾਰੀਖ਼ ${formDate} ਦਾ ਸ਼ਡਿਊਲ ਸੋਧੋ (Edit Schedule)` : 'ਨਵੀਂ ਤਾਰੀਖ਼ ਲਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ ਕਰੋ (Schedule Video for a Date)'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleCancelEdit();
                        if (!editingScheduleId && schedules.length > 0) setIsFormOpen(false);
                      }}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '5px',
                        padding: '4px 9px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa fa-times" style={{ marginRight: '4px' }}></i> ਬੰਦ ਕਰੋ (Close)
                    </button>
                  </div>

                  <form onSubmit={(e) => handleSaveSchedule(e, false)}>
                    {/* Row 1: Date & Active Status Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                          ਪ੍ਰਸਾਰਣ ਤਾਰੀਖ਼ (Select Date) <span style={{ color: '#b71c1c' }}>*</span>
                        </label>
                        <input
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: '#0f172a',
                            outline: 'none',
                            backgroundColor: '#f8fafc',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                          ਸਥਿਤੀ (Status)
                        </label>
                        <div
                          style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8fafc',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '6px'
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={formIsActive}
                              onChange={(e) => setFormIsActive(e.target.checked)}
                              style={{ width: '16px', height: '16px', accentColor: '#b71c1c', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '12.5px', fontWeight: '800', color: formIsActive ? '#15803d' : '#94a3b8' }}>
                              {formIsActive ? 'ਚਾਲੂ' : 'ਬੰਦ'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Language Selection Cards */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
                        ਭਾਸ਼ਾ ਚੁਣੋ (Choose Language Category) <span style={{ color: '#b71c1c' }}>*</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                        {LANGUAGE_OPTIONS.map((l) => {
                          const isSelected = formLanguage === l.code;
                          return (
                            <button
                              key={l.code}
                              type="button"
                              onClick={() => setFormLanguage(l.code)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '7px',
                                border: '2px solid',
                                borderColor: isSelected ? l.color : '#e2e8f0',
                                backgroundColor: isSelected ? l.bg : '#ffffff',
                                color: isSelected ? l.color : '#334155',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? `0 2px 6px ${l.color}25` : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: l.color
                                  }}
                                ></span>
                                <span style={{ fontSize: '12.5px', fontWeight: '800' }}>{l.label}</span>
                              </div>
                              {isSelected && (
                                <i className="fa fa-check-circle" style={{ fontSize: '14px', color: l.color }}></i>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 2: YouTube Video Link */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                        ਯੂਟਿਊਬ ਵੀਡੀਓ ਲਿੰਕ (YouTube Video / Live Stream URL) <span style={{ color: '#b71c1c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="e.g. https://www.youtube.com/watch?v=6OW56yMNB1g ਜਾਂ shorts/live"
                        required
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          color: '#0f172a',
                          outline: 'none',
                          backgroundColor: '#f8fafc',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                        💡 ਆਮ YouTube ਲਿੰਕ, ਸ਼ਾਰਟਸ ਜਾਂ ਲਾਈਵ ਲਿੰਕ ਕਾਪੀ-ਪੇਸਟ ਕਰੋ। ਪਲੇਅਰ ਆਟੋਮੈਟਿਕ ਬਣ ਜਾਵੇਗਾ।
                      </span>
                    </div>

                    {/* Row 3: Title, Badge, Quality */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                          ਵੀਡੀਓ ਸਿਰਲੇਖ (Title)
                        </label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸਾਰਣ"
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '6px 10px',
                            borderRadius: '5px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12.5px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                          ਬੈਜ (Badge)
                        </label>
                        <input
                          type="text"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="ON AIR • WEB TV"
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '6px 10px',
                            borderRadius: '5px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12.5px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                          ਕੁਆਲਿਟੀ (Quality)
                        </label>
                        <input
                          type="text"
                          value={formQuality}
                          onChange={(e) => setFormQuality(e.target.value)}
                          placeholder="1080p HD"
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '6px 10px',
                            borderRadius: '5px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12.5px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 4: Optional Notes */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                        ਅੰਦਰੂਨੀ ਨੋਟਸ (Admin Notes - Optional)
                      </label>
                      <input
                        type="text"
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        placeholder="e.g. ਚੋਣ ਨਤੀਜੇ ਸਪੈਸ਼ਲ, ਪ੍ਰੈਸ ਕਾਨਫਰੰਸ, ਆਦਿ"
                        style={{
                          width: '100%',
                          height: '34px',
                          padding: '6px 10px',
                          borderRadius: '5px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Row 5: Submit Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="submit"
                        disabled={savingSchedule}
                        style={{
                          backgroundColor: '#b71c1c',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: savingSchedule ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(183, 28, 28, 0.25)'
                        }}
                      >
                        {savingSchedule ? (
                          <>
                            <i className="fa fa-spinner fa-spin"></i>
                            <span>ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...</span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-check"></i>
                            <span>{editingScheduleId ? 'ਸ਼ਡਿਊਲ ਅੱਪਡੇਟ ਕਰੋ (Update)' : 'ਸ਼ਡਿਊਲ ਸੇਵ ਕਰੋ (Save Schedule)'}</span>
                          </>
                        )}
                      </button>

                      {!editingScheduleId && (
                        <button
                          type="button"
                          onClick={(e) => handleSaveSchedule(e, true)}
                          disabled={savingSchedule}
                          style={{
                            backgroundColor: '#1c2d5a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '9px 16px',
                            fontSize: '13px',
                            fontWeight: '800',
                            cursor: savingSchedule ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="fa fa-plus"></i>
                          <span>ਸੇਵ ਕਰੋ ਅਤੇ ਅਗਲੀ ਤਾਰੀਖ਼ ਸ਼ਾਮਲ ਕਰੋ (+ Next Date)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          handleCancelEdit();
                          setIsFormOpen(false);
                        }}
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: '6px',
                          padding: '9px 14px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        ਰੱਦ ਕਰੋ (Cancel)
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEFAULT 24x7 STREAM (CONFIGURED BY LANGUAGE) */}
          {activeTab === 'default' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                padding: '20px 22px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              {/* Language Switcher Tabs for Default Stream */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginRight: '6px' }}>
                  ਭਾਸ਼ਾ ਚੁਣੋ (Select Language Stream):
                </span>
                {LANGUAGE_OPTIONS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setDefaultLangTab(l.code)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid',
                      borderColor: defaultLangTab === l.code ? l.color : '#cbd5e1',
                      backgroundColor: defaultLangTab === l.code ? l.color : '#ffffff',
                      color: defaultLangTab === l.code ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>

              {/* Explanatory Note */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: '#166534',
                  marginBottom: '18px',
                  lineHeight: '1.5'
                }}
              >
                <strong><i className="fa fa-info-circle"></i> ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?</strong>
                <br />
                ਜਦੋਂ ਕੋਈ ਯੂਜ਼ਰ ਵੈੱਬਸਾਈਟ 'ਤੇ <strong>{LANGUAGE_OPTIONS.find((l) => l.code === defaultLangTab)?.label}</strong> ਭਾਸ਼ਾ ਚੁਣਦਾ ਹੈ ਅਤੇ ਉਸ ਤਾਰੀਖ਼ ਲਈ ਕੋਈ ਵੀਡੀਓ ਸ਼ਡਿਊਲ <em>ਨਹੀਂ</em> ਹੁੰਦੀ, ਤਾਂ ਇਹ ਮੂਲ 24x7 ਲਾਈਵ ਸਟ੍ਰੀਮ ਚੱਲੇਗੀ।
              </div>

              <form onSubmit={handleSaveDefault}>
                {/* Video URL */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                    {LANGUAGE_OPTIONS.find((l) => l.code === defaultLangTab)?.short} ਲਈ ਮੂਲ ਯੂਟਿਊਬ ਲਿੰਕ (Default YouTube URL) <span style={{ color: '#b71c1c' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={currentDefaultConfig?.videoUrl || ''}
                    onChange={(e) => updateCurrentDefaultField('videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=6OW56yMNB1g"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#f8fafc',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Title */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                    ਸਿਰਲੇਖ (Title)
                  </label>
                  <input
                    type="text"
                    value={currentDefaultConfig?.title || ''}
                    onChange={(e) => updateCurrentDefaultField('title', e.target.value)}
                    placeholder="24x7 HD ਪ੍ਰਸਾਰਣ"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Badge & Quality */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                      ਸਟੇਟਸ ਬੈਜ (Badge)
                    </label>
                    <input
                      type="text"
                      value={currentDefaultConfig?.badge || ''}
                      onChange={(e) => updateCurrentDefaultField('badge', e.target.value)}
                      placeholder="ON AIR • WEB TV"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                      ਕੁਆਲਿਟੀ ਟੈਗ (Quality Tag)
                    </label>
                    <input
                      type="text"
                      value={currentDefaultConfig?.quality || ''}
                      onChange={(e) => updateCurrentDefaultField('quality', e.target.value)}
                      placeholder="1080p HD"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '7px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#1e293b', display: 'block' }}>
                      ਮੂਲ ਪ੍ਰਸਾਰਣ ਸਥਿਤੀ (Default Stream Active)
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      ਚਾਲੂ ਰੱਖਣ 'ਤੇ ਹੋਮਪੇਜ ਉੱਤੇ ਵੀਡੀਓ ਪਲੇਅਰ ਐਕਟਿਵ ਰਹੇਗਾ।
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={currentDefaultConfig?.isActive !== false}
                      onChange={(e) => updateCurrentDefaultField('isActive', e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#1c2d5a', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: currentDefaultConfig?.isActive !== false ? '#15803d' : '#94a3b8' }}>
                      {currentDefaultConfig?.isActive !== false ? 'ਚਾਲੂ (Active)' : 'ਬੰਦ (Off)'}
                    </span>
                  </label>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={savingDefault}
                  style={{
                    width: '100%',
                    backgroundColor: savingDefault ? '#94a3b8' : '#1c2d5a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '11px 18px',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    cursor: savingDefault ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(28, 45, 90, 0.2)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {savingDefault ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i>
                      <span>ਅੱਪਡੇਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check-circle"></i>
                      <span>{LANGUAGE_OPTIONS.find((l) => l.code === defaultLangTab)?.short} ਲਈ ਮੂਲ ਸਟ੍ਰੀਮ ਸੇਵ ਕਰੋ (Save Default)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: REAL-TIME HOMEPAGE WEB TV PREVIEW          */}
        {/* ========================================================= */}
        <div>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              position: 'sticky',
              top: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '14.5px',
                  fontWeight: '800',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-television" style={{ color: '#b71c1c' }}></i>
                ਲਾਈਵ ਝਲਕ (Player Preview)
              </h3>
              <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fee2e2', color: '#b71c1c', padding: '2px 7px', borderRadius: '4px' }}>
                Real-time
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#0369a1', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '5px 8px', borderRadius: '5px', marginBottom: '10px', fontWeight: '700' }}>
              <i className="fa fa-info-circle" style={{ marginRight: '5px' }}></i>
              {currentPreviewData.label}
            </div>

            {/* TV Frame Container */}
            <div
              style={{
                backgroundColor: '#111317',
                borderRadius: '8px',
                padding: '8px 8px 10px',
                border: '1.5px solid #1c2d5a',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                marginBottom: '12px'
              }}
            >
              {/* TV Header Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 4px 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      backgroundColor: currentPreviewData.isActive ? '#ef4444' : '#94a3b8',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: currentPreviewData.isActive ? 'livePulse 1.2s infinite' : 'none'
                    }}
                  ></span>
                  <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.4px' }}>
                    {currentPreviewData.badge}
                  </span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#ebb10d' }}>
                  {currentPreviewData.quality}
                </span>
              </div>

              {/* 16:9 Video Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '5px',
                  backgroundColor: '#000000'
                }}
              >
                {currentPreviewData.isActive ? (
                  <iframe
                    key={previewEmbedUrl}
                    src={previewEmbedUrl}
                    title="Web TV Preview"
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
                  ></iframe>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      fontSize: '11.5px'
                    }}
                  >
                    <i className="fa fa-television" style={{ fontSize: '26px', marginBottom: '4px' }}></i>
                    <span>ਪ੍ਰਸਾਰਣ ਬੰਦ ਹੈ (Offline)</span>
                  </div>
                )}
              </div>

              {/* Sub-bar */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '5px 7px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: '#cbd5e1'
                }}
              >
                <span style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                  {currentPreviewData.title}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '10px' }}>ਪੰਜਾਬ ਫਾਈਲਜ਼ HD</span>
              </div>
            </div>

            {/* Helper Info */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                fontSize: '11.5px',
                color: '#475569',
                lineHeight: '1.5'
              }}
            >
              <div style={{ fontWeight: '800', color: '#1e293b', marginBottom: '3px' }}>
                <i className="fa fa-lightbulb-o" style={{ color: '#ebb10d', marginRight: '5px' }}></i>
                ਮਲਟੀ-ਭਾਸ਼ਾਈ ਵੈੱਬ ਟੀਵੀ (Multilingual Web TV):
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>ਹਰ ਤਾਰੀਖ਼ ਅਤੇ ਭਾਸ਼ਾ (ਪੰਜਾਬੀ, हिंदी, English) ਲਈ ਵੱਖਰਾ ਵੀਡੀਓ ਲਿੰਕ ਪਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।</li>
                <li>ਜਦੋਂ ਯੂਜ਼ਰ ਹੋਮਪੇਜ 'ਤੇ ਭਾਸ਼ਾ ਬਦਲੇਗਾ, ਵੀਡੀਓ ਆਪਣੇ ਆਪ ਉਸ ਭਾਸ਼ਾ ਅਨੁਸਾਰ ਬਦਲ ਜਾਵੇਗੀ।</li>
                <li>ਜੇਕਰ ਕਿਸੇ ਭਾਸ਼ਾ ਲਈ ਅੱਜ ਕੋਈ ਸ਼ਡਿਊਲ ਨਾ ਹੋਵੇ, ਤਾਂ ਉਸ ਭਾਸ਼ਾ ਦੀ ਮੂਲ 24x7 ਸਟ੍ਰੀਮ ਚੱਲੇਗੀ।</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
