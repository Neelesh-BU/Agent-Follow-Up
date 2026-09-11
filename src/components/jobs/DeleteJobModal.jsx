import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export const DeleteJobModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  job = null,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const isBusy = isLoading || isSubmitting;

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(job.job_id, job.job_title);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
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
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h3 className='text-sm font-black text-slate-900 tracking-tight'>
                {t('jobs.deleteModalTitle', { defaultValue: 'Delete Job Opening' })}
              </h3>
              <p className='text-[11px] text-slate-500 font-semibold'>
                {t('jobs.deleteModalSubtitle', {
                  defaultValue: 'Confirm permanent job removal',
                })}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isBusy}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer disabled:opacity-40'
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className='p-6 flex flex-col gap-4'>
          {/* Job Card Details */}
          <div className='p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-col gap-2.5'>
            <div className='flex items-center justify-between gap-2'>
              <span className='px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-mono font-bold text-xs'>
                #{job.job_id}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  job.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {job.status}
              </span>
            </div>

            <div>
              <h4 className='font-bold text-slate-900 text-sm'>
                {job.job_title}
              </h4>
              <div className='flex items-center gap-1 text-xs text-slate-600 font-semibold mt-0.5'>
                <BusinessOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400' />
                <span>{job.company_name}</span>
                {job.department && (
                  <span className='text-slate-400 font-normal'>• {job.department}</span>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/60'>
              <span className='flex items-center gap-0.5'>
                <LocationOnOutlinedIcon sx={{ fontSize: 13 }} className='text-slate-400' />
                {job.location || 'Remote'}
              </span>
              <span>•</span>
              <span className='uppercase'>{job.job_type || 'Full-time'}</span>
            </div>
          </div>

          {/* Warning Banner */}
          <div className='text-xs text-rose-950 font-medium leading-relaxed bg-rose-50 border border-rose-200/80 rounded-xl p-3.5'>
            <div className='flex items-center gap-1.5 font-bold text-rose-800 text-xs mb-1'>
              <WarningAmberRoundedIcon sx={{ fontSize: 16 }} className='text-rose-600' />
              <span>Are you sure you want to delete this job?</span>
            </div>
            <p className='text-[11px] text-rose-700/90 leading-normal'>
              This action cannot be undone. Job <strong>#{job.job_id}</strong> will be permanently removed from all follow-up pipelines and candidate filters.
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
              Cancel
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={isBusy}
              className='px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/25 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 min-w-[120px]'
            >
              {isBusy ? (
                <>
                  <span className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                  <span>Delete Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;
