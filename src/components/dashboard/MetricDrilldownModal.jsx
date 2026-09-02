import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FollowUpTable from './FollowUpTable';
import PaginationBar from '@/components/common/PaginationBar';

export const MetricDrilldownModal = ({
  isOpen = false,
  onClose,
  title = '',
  rows = [],
  onViewItem,
  onCallNow,
  onMarkCompleted,
  onDelete,
  isMaster = false,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!isOpen) return null;

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageRows = rows.slice(startIdx, startIdx + pageSize);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto'>
      <div className='bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0'>
          <strong className='text-base font-extrabold text-slate-900'>
            {title || t('modals.drilldownTitle')}
          </strong>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition-colors font-bold text-sm cursor-pointer'
          >
            ✕
          </button>
        </div>

        {/* Scrollable Table Content */}
        <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
          <FollowUpTable
            rows={pageRows}
            isMaster={isMaster}
            onView={onViewItem}
            onCallNow={onCallNow}
            onMarkCompleted={onMarkCompleted}
            onDelete={onDelete}
          />
        </div>

        {/* Footer with Pagination */}
        {rows.length > 0 && (
          <div className='shrink-0 border-t border-slate-200'>
            <PaginationBar
              page={currentPage}
              pageSize={pageSize}
              totalRows={rows.length}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricDrilldownModal;
