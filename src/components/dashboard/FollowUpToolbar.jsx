import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AddIcon from '@mui/icons-material/Add';

export const FollowUpToolbar = ({
  isMaster = false,
  onOpenUploadModal,
  onOpenUploadHistory,
  onAddManual,
  showActions = !isMaster,
}) => {
  const { t } = useTranslation();

  if (!showActions) {
    return null;
  }

  return (
    <div className='bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6 flex flex-col gap-3'>
      <div className='flex items-center justify-end gap-2 flex-wrap'>
        <button
          type='button'
          onClick={onOpenUploadModal}
          className='h-10 px-3.5 bg-[#007cc2] hover:bg-[#006ca9] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs'
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 17 }} />
          <span>{t('dashboard.uploadCandidate')}</span>
        </button>

        {/* View Upload History Button */}
        <button
          type='button'
          onClick={onOpenUploadHistory}
          className='h-10 px-3.5 bg-white border border-[#007cc2] text-[#007cc2] hover:bg-sky-50 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs'
        >
          <HistoryIcon sx={{ fontSize: 17 }} />
          <span>History</span>
        </button>

        {/* Add Manually */}
        <button
          type='button'
          onClick={onAddManual}
          className='h-10 px-4 bg-[#007cc2] hover:bg-[#006ca9] text-white text-xs font-extrabold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs'
        >
          <AddIcon sx={{ fontSize: 17 }} />
          <span>{t('dashboard.addManually')}</span>
        </button>
      </div>
    </div>
  );
};

export default FollowUpToolbar;
