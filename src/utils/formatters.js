/**
 * Format a date string into a localized readable date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format a date string into a localized time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const plainDate = (value, is12hrFormat = false) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return String(value);
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: is12hrFormat });
};

export const plainDateOnly = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return String(value);
  return date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const shortId = (value) => {
  const text = String(value || '');
  return text.length > 12 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
};

export const splitPhone = (value = '') => {
  const text = String(value || '').trim();
  const match = text.match(/^(\+\d{1,3})\s*(.*)$/);
  if (match) return { countryCode: match[1], number: match[2] };
  return { countryCode: '+91', number: text };
};

export const userInitials = (name = '') => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return 'SR';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
};

export const normalizeDateInputValue = (value) => {
  if (!value) return '';
  const text = String(value)
    .trim()
    .replace(/[.\u2010-\u2015]/g, '-')
    .replace(/\s+/g, ' ');
  let match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) {
    const first = Number(match[2]);
    const second = Number(match[3]);
    const month = first > 12 ? second : first;
    const day = first > 12 ? first : second;
    return `${match[1]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  const parsed = new Date(text);
  if (Number.isFinite(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return '';
};

export const normalizeTimeInputValue = (value) => {
  if (!value) return '';
  const text = String(value).trim().replace('.', ':').toLowerCase();
  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return '';
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  if (match[3] === 'pm' && hour < 12) hour += 12;
  if (match[3] === 'am' && hour === 12) hour = 0;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const displayTime = (value) => {
  if (!value) return '';
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = match[2];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
};

export const displayDate = (value) => {
  const normalized = normalizeDateInputValue(value);
  if (!normalized) return value || '';
  const [y, m, d] = normalized.split('-');
  return `${d}-${m}-${y}`;
};

export const getPresetDateRange = (preset) => {
  const now = new Date();
  const fromDate = new Date(now);
  const toDate = new Date(now);

  if (preset === 'today') {
    return {
      from: now.toISOString().slice(0, 10),
      to: now.toISOString().slice(0, 10),
    };
  }

  if (preset === 'last7') {
    fromDate.setDate(now.getDate() - 7);
    toDate.setDate(now.getDate() + 7);
    return {
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10),
    };
  }

  // Default 'last30': covers past 30 days and upcoming scheduled followups (+30 days)
  fromDate.setDate(now.getDate() - 30);
  toDate.setDate(now.getDate() + 30);
  return {
    from: fromDate.toISOString().slice(0, 10),
    to: toDate.toISOString().slice(0, 10),
  };
};

export const isActiveFollowUp = (item) => {
  const status = String(item?.status || '').toLowerCase();
  const completedOrAttn = [
    'joining_confirmed',
    'recruiter_completed',
    'completed',
    'not_joining',
    'reschedule_requested',
    'not_interested',
    'no_response',
    'unclear_response',
    'failed',
    'cancelled',
  ];
  if (completedOrAttn.includes(status)) return false;
  return (
    ['pending', 'scheduled', 'queued', 'calling'].includes(status) ||
    item?.call_scheduled_at
  );
};

export const isAwaitingResponse = (item) => {
  const status = String(item?.status || '').toLowerCase();
  if (
    [
      'joining_confirmed',
      'recruiter_completed',
      'completed',
      'not_joining',
      'reschedule_requested',
      'not_interested',
      'no_response',
      'unclear_response',
      'failed',
    ].includes(status)
  ) {
    return false;
  }
  const whatsappSent =
    String(item?.whatsapp_status || '').toLowerCase() === 'sent';
  const hasReply = Boolean(
    item?.whatsapp_response_status || item?.whatsapp_response,
  );
  return whatsappSent && !hasReply;
};
