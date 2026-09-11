import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

export const DeactivateSchedulerModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  scheduler = null,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !scheduler) return null;

  const schedulerName = scheduler.name || scheduler.full_name || 'Scheduler';
  const schedulerEmail = scheduler.email || scheduler.emailId || '—';
  const schedulerPhone =
    scheduler.phone || scheduler.phoneNumber || scheduler.phone_number || '—';
  const schedulerId = scheduler.id || scheduler._id;

  const handleDeactivate = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(schedulerId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150'>
      <div className='bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-amber-50/50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs'>
              <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className='text-sm font-black text-slate-900 tracking-tight'>
                {t('schedulers.deactivateModalTitle', {
                  defaultValue: 'Deactivate Scheduler Account',
                })}
              </h3>
              <p className='text-[11px] text-slate-500 font-semibold'>
                {t('schedulers.deactivateModalSubtitle', {
                  defaultValue: 'Confirm account deactivation',
                })}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='p-6 flex flex-col gap-4'>
          {/* Account Details Box */}
          <div className='p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2.5'>
            <div className='flex items-center gap-2 text-xs font-black text-slate-800'>
              <PersonOutlineIcon sx={{ fontSize: 16, color: '#059669' }} />
              <span>{schedulerName}</span>
            </div>
            <div className='flex items-center gap-2 text-xs font-semibold text-slate-600'>
              <MailOutlineIcon sx={{ fontSize: 16, color: '#64748b' }} />
              <span className='truncate'>{schedulerEmail}</span>
            </div>
            {schedulerPhone !== '—' && (
              <div className='flex items-center gap-2 text-xs font-semibold text-slate-600'>
                <PhoneOutlinedIcon sx={{ fontSize: 16, color: '#64748b' }} />
                <span>{schedulerPhone}</span>
              </div>
            )}
          </div>

          {/* Explanation Notice */}
          <div className='text-xs text-slate-600 font-medium leading-relaxed bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5'>
            <p className='font-bold text-amber-900 mb-1'>What will happen?</p>
            <ul className='list-disc list-inside space-y-1 text-slate-600 text-[11px]'>
              <li>This scheduler will no longer be able to log in.</li>
              <li>They will be removed from active upload & assignment lists.</li>
              <li>Historical follow-up records will remain preserved.</li>
            </ul>
          </div>

          {/* Footer Actions */}
          <div className='flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer'
            >
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type='button'
              onClick={handleDeactivate}
              disabled={isSubmitting}
              className='px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <span className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                  <span>{t('common.processing', { defaultValue: 'Deactivating...' })}</span>
                </>
              ) : (
                <span>
                  {t('schedulers.confirmDeactivate', {
                    defaultValue: 'Deactivate Account',
                  })}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateSchedulerModal;
