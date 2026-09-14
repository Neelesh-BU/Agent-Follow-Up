import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { plainDate, cleanAndFormatHtml } from '@/utils/formatters';

export const ViewJobModal = ({
  isOpen = false,
  onClose,
  job = null,
  onToggleStatus,
}) => {
  const { t } = useTranslation();

  const formattedDescription = useMemo(() => {
    return cleanAndFormatHtml(job?.job_description);
  }, [job?.job_description]);

  if (!isOpen || !job) return null;

  const isActive = job.status?.toLowerCase() === 'active';
  const isClosed = job.status?.toLowerCase() === 'closed';

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Modal Header */}
        <div className='flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50/80 via-white to-slate-50/40'>
          <div className='flex items-center gap-4 min-w-0'>
            <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#10b981]/20'>
              <WorkOutlineOutlinedIcon sx={{ fontSize: 26 }} />
            </div>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 mb-1 flex-wrap'>
                <span className='px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-xs tracking-tight'>
                  #{job.job_id}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold capitalize ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isClosed
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-500 animate-pulse'
                        : isClosed
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  {job.status || 'Active'}
                </span>
              </div>
              <h2 className='text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug truncate'>
                {job.job_title}
              </h2>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5'>
                <BusinessOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400 shrink-0' />
                <span className='font-bold text-slate-700'>{job.company_name}</span>
                {job.department && (
                  <>
                    <span className='text-slate-300'>•</span>
                    <span className='text-slate-500'>{job.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            aria-label='Close dialog'
            className='w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2'
          >
            <CloseOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className='p-6 overflow-y-auto space-y-6 flex-1'>
          {/* Quick Metrics / Info Cards */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {/* Location */}
            <div className='bg-slate-50/80 border border-slate-200/70 p-3 rounded-2xl flex flex-col'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                <LocationOnOutlinedIcon sx={{ fontSize: 13 }} className='text-emerald-500' />
                Location
              </span>
              <span className='text-xs font-bold text-slate-800 mt-1 truncate'>
                {job.location || 'Remote'}
              </span>
            </div>

            {/* Employment Type */}
            <div className='bg-slate-50/80 border border-slate-200/70 p-3 rounded-2xl flex flex-col'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                <WorkOutlineOutlinedIcon sx={{ fontSize: 13 }} className='text-blue-500' />
                Type
              </span>
              <span className='text-xs font-bold text-slate-800 mt-1 uppercase tracking-wide truncate'>
                {job.job_type || 'Full-time'}
              </span>
            </div>

            {/* Created At */}
            <div className='bg-slate-50/80 border border-slate-200/70 p-3 rounded-2xl flex flex-col'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 13 }} className='text-amber-500' />
                Date Created
              </span>
              <span className='text-xs font-bold text-slate-800 mt-1 truncate'>
                {job.createdAt ? plainDate(job.createdAt) : '-'}
              </span>
            </div>

            {/* Department */}
            <div className='bg-slate-50/80 border border-slate-200/70 p-3 rounded-2xl flex flex-col'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1'>
                <BusinessOutlinedIcon sx={{ fontSize: 13 }} className='text-violet-500' />
                Department
              </span>
              <span className='text-xs font-bold text-slate-800 mt-1 truncate'>
                {job.department || 'General'}
              </span>
            </div>
          </div>

          {/* Job Description & Requirements Section */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2'>
                <DescriptionOutlinedIcon sx={{ fontSize: 16 }} className='text-emerald-600' />
                {t('jobs.descriptionRequirements', {
                  defaultValue: 'Job Description & Requirements',
                })}
              </h3>
            </div>

            {formattedDescription ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formattedDescription,
                }}
                className='p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal shadow-2xs space-y-3 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-extrabold [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1.5 [&_li]:my-1 [&_li]:text-slate-700 [&_em]:italic [&_u]:underline'
              />
            ) : (
              <div className='p-8 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center text-slate-400'>
                <DescriptionOutlinedIcon sx={{ fontSize: 28 }} className='text-slate-300 mb-2' />
                <p className='text-xs font-medium italic'>
                  {t('jobs.noDescription', {
                    defaultValue: 'No description provided for this job opening.',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className='px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3'>
          <div>
            {onToggleStatus && (
              <button
                type='button'
                onClick={() => onToggleStatus(job)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {isActive ? (
                  <>
                    <PauseCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{t('jobs.deactivateJob', { defaultValue: 'Deactivate Job' })}</span>
                  </>
                ) : (
                  <>
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{t('jobs.activateJob', { defaultValue: 'Activate Job' })}</span>
                  </>
                )}
              </button>
            )}
          </div>

          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer'
          >
            {t('common.close', { defaultValue: 'Close' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;
