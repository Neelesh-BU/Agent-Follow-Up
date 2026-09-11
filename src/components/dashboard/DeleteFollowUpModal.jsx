import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StatusBadge from '@/components/common/StatusBadge';
import { displayDate, userInitials } from '@/utils/formatters';

// Avatar gradient generator
const getAvatarGradient = (name = '') => {
  const gradients = [
    'from-rose-600 to-pink-500',
    'from-blue-600 to-cyan-500',
    'from-indigo-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-amber-600 to-orange-500',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export const DeleteFollowUpModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  record = null,
  schedulers = [],
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !record) return null;

  const recordId = record.id || record.record_id || record._id;
  const candidateName =
    record.candidate_name ||
    record.candidateName ||
    record.name ||
    'Candidate';
  const candidatePhone =
    record.candidate_phone ||
    record.candidatePhone ||
    record.phone ||
    record.phone_number ||
    '';
  const companyName =
    record.interview_company ||
    record.company ||
    record.company_name ||
    '';
  const jobTitle = record.job_title || record.role || '';
  const jobId = record.job_id || '';
  const interviewDate =
    record.interview_date ||
    record.interviewDate ||
    (record.scheduled_at ? displayDate(record.scheduled_at) : '');
  const interviewTime =
    record.interview_time ||
    record.interviewTime ||
    '';
  const status = record.call_pipeline || record.status || '';

  // Resolve scheduler display name
  const schedulerId =
    record.scheduler_id ||
    record.schedulerId ||
    record.user_id ||
    record.userId ||
    '';
  let schedulerName =
    record.scheduler_name ||
    record.schedulerName ||
    record.scheduler?.name ||
    '';
  if (!schedulerName && schedulerId && Array.isArray(schedulers)) {
    const matched = schedulers.find(
      (s) => String(s.id || s._id || s.user_id) === String(schedulerId),
    );
    if (matched) {
      schedulerName = matched.name || matched.full_name || matched.username || '';
    }
  }

  const avatarGrad = getAvatarGradient(candidateName);
  const isBusy = isLoading || isSubmitting;

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(recordId, record);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='delete-modal-title'
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150'
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) onClose();
      }}
    >
      <div className='bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4.5 border-b border-rose-100 bg-rose-50/60'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs'>
              <DeleteOutlineIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h3
                id='delete-modal-title'
                className='text-sm font-black text-slate-900 tracking-tight'
              >
                {t('modals.deleteFollowUpTitle', {
                  defaultValue: 'Delete Follow Up',
                })}
              </h3>
              <p className='text-[11px] text-slate-500 font-semibold'>
                {t('modals.deleteFollowUpSubtitle', {
                  defaultValue: 'Confirm candidate follow-up deletion',
                })}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isBusy}
            aria-label={t('common.close', { defaultValue: 'Close' })}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer disabled:opacity-40'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='p-6 flex flex-col gap-4.5'>
          {/* Candidate & Record Details Card */}
          <div className='p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-col gap-3'>
            {/* Candidate Header */}
            <div className='flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60'>
              <div className='flex items-center gap-3 min-w-0'>
                <div
                  className={`w-9 h-9 rounded-xl bg-linear-to-tr ${avatarGrad} text-white font-black text-xs grid place-items-center shrink-0 shadow-2xs`}
                >
                  {userInitials(candidateName)}
                </div>
                <div className='min-w-0'>
                  <div className='font-bold text-slate-900 text-sm truncate'>
                    {candidateName}
                  </div>
                  {candidatePhone && (
                    <div className='flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 font-semibold'>
                      <PhoneOutlinedIcon sx={{ fontSize: 12, color: '#64748b' }} />
                      <span>{candidatePhone}</span>
                    </div>
                  )}
                </div>
              </div>
              {status && (
                <div className='shrink-0'>
                  <StatusBadge status={status} />
                </div>
              )}
            </div>

            {/* Record Metadata Grid */}
            <div className='grid grid-cols-2 gap-2.5 text-xs'>
              {/* Company / Job */}
              {(companyName || jobTitle || jobId) && (
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1'>
                    <BusinessIcon sx={{ fontSize: 12 }} />
                    {companyName ? 'Company & Role' : 'Job Role'}
                  </span>
                  <span className='font-bold text-slate-800 text-xs truncate'>
                    {companyName || jobTitle || '-'}
                  </span>
                  {jobTitle && companyName && (
                    <span className='text-[11px] text-slate-500 font-medium truncate flex items-center gap-1'>
                      <WorkOutlineOutlinedIcon sx={{ fontSize: 11 }} />
                      {jobTitle} {jobId ? `(#${jobId})` : ''}
                    </span>
                  )}
                </div>
              )}

              {/* Interview Schedule */}
              {(interviewDate || interviewTime) && (
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1'>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 11 }} />
                    Schedule
                  </span>
                  <span className='font-bold text-slate-800 text-xs truncate'>
                    {interviewDate || '-'}
                  </span>
                  {interviewTime && (
                    <span className='text-[11px] text-slate-500 font-medium truncate flex items-center gap-1'>
                      <AccessTimeOutlinedIcon sx={{ fontSize: 11 }} />
                      {interviewTime}
                    </span>
                  )}
                </div>
              )}

              {/* Assigned Scheduler */}
              {schedulerName && (
                <div className='col-span-2 flex items-center gap-1.5 pt-1 text-slate-600 text-[11px] font-semibold'>
                  <PersonOutlineIcon sx={{ fontSize: 14, color: '#059669' }} />
                  <span>
                    Scheduler: <strong className='text-slate-800'>{schedulerName}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning Banner */}
          <div className='text-xs text-rose-950 font-medium leading-relaxed bg-rose-50 border border-rose-200/80 rounded-xl p-3.5'>
            <div className='flex items-center gap-1.5 font-bold text-rose-800 text-xs mb-1'>
              <WarningAmberRoundedIcon sx={{ fontSize: 16, color: '#e11d48' }} />
              <span>
                {t('modals.deleteFollowUpWarningTitle', {
                  defaultValue: 'Are you sure you want to delete this follow up?',
                })}
              </span>
            </div>
            <p className='text-[11px] text-rose-700/90 leading-normal'>
              {t('modals.deleteFollowUpWarningText', {
                defaultValue:
                  'This action cannot be undone. This record and all pending automated call schedules or reminders will be permanently removed from the pipeline.',
              })}
            </p>
          </div>

          {/* Footer Actions */}
          <div className='flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100'>
            <button
              type='button'
              onClick={onClose}
              disabled={isBusy}
              className='px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50'
            >
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={isBusy}
              className='px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-w-[120px]'
            >
              {isBusy ? (
                <>
                  <span className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                  <span>
                    {t('modals.deletingRecord', { defaultValue: 'Deleting...' })}
                  </span>
                </>
              ) : (
                <>
                  <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                  <span>
                    {t('modals.deleteRecord', { defaultValue: 'Delete Record' })}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFollowUpModal;
