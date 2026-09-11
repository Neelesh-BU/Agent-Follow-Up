import { useTranslation } from 'react-i18next';
import SelectDropdown from '@/components/common/SelectDropdown';

export const PaginationBar = ({
  page = 1,
  pageSize = 10,
  totalRows = 0,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startRow = totalRows > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const getPageButtons = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const handleJump = (e) => {
    if (e.key === 'Enter') {
      const val = Number(e.target.value);
      if (val >= 1 && val <= totalPages) {
        onPageChange(val);
      }
    }
  };

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-white border-t border-slate-200 text-xs font-medium text-slate-600'>
      {/* Left: Showing range */}
      <div className='flex-1 min-w-[140px]'>
        <span>
          {t('pagination.showing', {
            from: startRow,
            to: endRow,
            total: totalRows,
          })}
        </span>
      </div>

      {/* Center: Pagination & Jump */}
      <div className='flex items-center gap-1.5 justify-center flex-wrap'>
        <button
          type='button'
          aria-label='Previous page'
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className='w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-bold cursor-pointer text-sm'
        >
          ‹
        </button>

        {getPageButtons().map((item, idx) =>
          item === '...' ? (
            <span key={`dots-${idx}`} className='px-1 text-slate-400 font-bold'>
              ...
            </span>
          ) : (
            <button
              key={`btn-${item}`}
              type='button'
              onClick={() => onPageChange(item)}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                item === currentPage
                  ? 'bg-linear-to-r from-[#10b981] to-[#059669] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type='button'
          aria-label='Next page'
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className='w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-bold cursor-pointer text-sm'
        >
          ›
        </button>

        <div className='flex items-center gap-1 ml-2 text-slate-500'>
          <span>{t('pagination.goTo')}</span>
          <input
            type='number'
            min={1}
            max={totalPages}
            placeholder='#'
            onKeyDown={handleJump}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= totalPages) onPageChange(val);
            }}
            className='w-12 h-7 px-1.5 border border-slate-300 rounded text-center text-xs font-bold text-slate-800 outline-none focus:border-[#10b981]'
          />
          <span>{t('pagination.page')}</span>
        </div>
      </div>

      {/* Right: Page Size Selector */}
      <div className='flex items-center gap-2 justify-end min-w-[140px]'>
        <div className='flex items-center gap-1.5 text-slate-500 font-semibold'>
          <span>{t('pagination.itemsPerPage')}</span>
          <SelectDropdown
            value={pageSize}
            onChange={(val) => onPageSizeChange(Number(val))}
            options={pageSizeOptions.map((opt) => ({
              value: opt,
              label: String(opt),
            }))}
            variant='compact'
            className='min-w-[64px]'
            buttonClassName='!h-7 !px-2 !rounded'
            align='right'
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationBar;
