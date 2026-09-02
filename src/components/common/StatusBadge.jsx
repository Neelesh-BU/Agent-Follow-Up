export const StatusBadge = ({ status, customLabel }) => {
  const rawStatus = String(status || '').trim();
  const normalized = rawStatus.toLowerCase();

  let badgeStyle = {
    bg: 'bg-slate-100/90 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
  };

  if (
    [
      'joining_confirmed',
      'recruiter_completed',
      'completed',
      'joining',
    ].includes(normalized)
  ) {
    badgeStyle = {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs shadow-emerald-500/10',
      dot: 'bg-emerald-500',
    };
  } else if (
    [
      'queued',
      'calling',
      'call_scheduled',
      'ringing',
      'in_progress',
      'initiated',
    ].includes(normalized)
  ) {
    badgeStyle = {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs shadow-amber-500/10',
      dot: 'bg-amber-500 animate-pulse',
    };
  } else if (
    [
      'not_joining',
      'not_interested',
      'reschedule_requested',
      'no_response',
      'no_answer',
      'unclear_response',
      'failed',
      'cancelled',
      'rejected',
      'busy',
      'timeout',
      'call_skipped',
    ].includes(normalized)
  ) {
    badgeStyle = {
      bg: 'bg-rose-50 text-rose-800 border-rose-200/80 shadow-2xs shadow-rose-500/10',
      dot: 'bg-rose-500',
    };
  } else if (
    [
      'pending',
      'scheduled',
      'uploaded',
      'whatsapp_sent',
      'whatsapp_queued',
    ].includes(normalized)
  ) {
    badgeStyle = {
      bg: 'bg-sky-50 text-sky-800 border-sky-200/80 shadow-2xs shadow-sky-500/10',
      dot: 'bg-sky-500',
    };
  }

  const label = customLabel || rawStatus || '-';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight border ${badgeStyle.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot} shrink-0`} />
      <span className='truncate'>{label}</span>
    </span>
  );
};

export default StatusBadge;
