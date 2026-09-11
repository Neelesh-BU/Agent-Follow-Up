import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MuiDateRangePicker from '@/components/common/MuiDateRangePicker';
import { useSchedulerAccountsOverviewQuery } from '@/hooks/queries/useSchedulerQueries';
import useDebounce from '@/hooks/useDebounce';
import { userInitials } from '@/utils/formatters';

const PAGE_SIZE = 6;

const getAvatarGradient = (name = '') => {
  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-indigo-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-rose-600 to-pink-500',
    'from-amber-600 to-orange-500',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export const SchedulerSummarySection = ({
  onOpenUploadModal,
  onOpenUploadHistory,
  onAddManual,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Reset pagination when search or date filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate]);

  // Fetch scheduler accounts overview from dedicated API
  const {
    data: overviewData,
    isLoading,
  } = useSchedulerAccountsOverviewQuery({
    search: debouncedSearch.trim() || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const schedulersList = useMemo(() => {
    if (overviewData?.schedulers && Array.isArray(overviewData.schedulers)) {
      return overviewData.schedulers;
    }
    return [];
  }, [overviewData]);

  const totalSchedulers = schedulersList.length;
  const totalPages = Math.max(1, Math.ceil(totalSchedulers / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const displayedSchedulers = useMemo(() => {
    if (!isExpanded) {
      return schedulersList.slice(0, 3);
    }
    const startIdx = (safePage - 1) * PAGE_SIZE;
    return schedulersList.slice(startIdx, startIdx + PAGE_SIZE);
  }, [isExpanded, schedulersList, safePage]);

  return (
    <section className='mb-6'>
      {/* Top Header Controls Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 mb-3 px-1'>
        <div className='flex items-center gap-2'>
          <h2 className='text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2'>
            <span>
              {t('dashboard.schedulerSummaryTitle', {
                defaultValue: 'Scheduler Accounts Overview',
              })}
            </span>
            <span className='px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-full'>
              {totalSchedulers}
            </span>
          </h2>
        </div>

        {/* Action Group */}
        <div className='flex flex-wrap items-center gap-2.5'>
          {/* Upload Candidate Button */}
          <button
            type='button'
            onClick={onOpenUploadModal}
            className='h-9 px-3.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#10b981]/20'
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {t('dashboard.uploadCandidate', {
                defaultValue: 'Upload Candidate',
              })}
            </span>
          </button>

          {/* View Upload History Button */}
          <button
            type='button'
            onClick={onOpenUploadHistory}
            className='h-9 px-3.5 bg-white border border-[#10b981] text-[#059669] hover:bg-emerald-50 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs'
          >
            <HistoryIcon sx={{ fontSize: 16 }} />
            <span>History</span>
          </button>

          {/* Add Manually Button */}
          <button
            type='button'
            onClick={onAddManual}
            className='h-9 px-3.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#10b981]/20'
          >
            <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {t('dashboard.addManually', { defaultValue: 'Add Manually' })}
            </span>
          </button>
        </div>
      </div>

      {/* Main Panel Box */}
      <div className='bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs'>
        {/* Inline Section Filters (Search by Scheduler & Date Range) */}
        <div className='p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-wrap items-center gap-2.5 flex-1 min-w-65'>
            {/* Search Scheduler */}
            <div className='relative flex items-center min-w-50 max-w-70'>
              <SearchIcon
                sx={{ fontSize: 17, color: '#94a3b8' }}
                className='absolute left-3 pointer-events-none'
              />
              <input
                type='text'
                placeholder='Search scheduler...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full h-8.5 pl-8.5 pr-7 bg-white hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#10b981] transition-all'
              />
              {search && (
                <button
                  type='button'
                  onClick={() => setSearch('')}
                  className='absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer'
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              )}
            </div>

            {/* Date Range Picker */}
            <MuiDateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onChange={({ from, to }) => {
                setFromDate(from);
                setToDate(to);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-slate-400 text-xs font-medium'>
            Loading scheduler overview...
          </div>
        ) : totalSchedulers === 0 ? (
          <div className='py-8 text-center text-slate-400 text-xs font-medium'>
            {t('dashboard.noSchedulersFound', {
              defaultValue: 'No scheduler performance data available.',
            })}
          </div>
        ) : (
          <div className='divide-y divide-slate-100'>
            {/* Grid Container: Collapsed shows 3 cards, Expanded shows 6 cards per page */}
            <div className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {displayedSchedulers.map((scheduler, idx) => {
                  const gradient = getAvatarGradient(
                    scheduler.scheduler_name || `User ${idx}`,
                  );
                  return (
                    <div
                      key={scheduler.scheduler_id || idx}
                      className='bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-4 transition-all hover:shadow-xs flex flex-col justify-between gap-3 group'
                    >
                      {/* Top info */}
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-3 min-w-0'>
                          <div
                            className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0`}
                          >
                            {userInitials(
                              scheduler.scheduler_name ||
                                scheduler.email ||
                                'SC',
                            )}
                          </div>
                          <div className='min-w-0'>
                            <h4 className='text-xs font-black text-slate-800 truncate group-hover:text-[#059669] transition-colors'>
                              {scheduler.scheduler_name ||
                                t('dashboard.unnamedScheduler')}
                            </h4>
                            <p className='text-[11px] font-medium text-slate-400 truncate'>
                              {scheduler.email || '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 4 Mini Metric Counters */}
                      <div className='grid grid-cols-4 gap-1 pt-2 border-t border-slate-200/60 text-center'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-black text-slate-800'>
                            {scheduler.total_candidates ?? 0}
                          </span>
                          <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>
                            Total
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-xs font-black text-blue-600'>
                            {scheduler.active ?? 0}
                          </span>
                          <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>
                            Active
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-xs font-black text-amber-600'>
                            {scheduler.needs_attention ?? 0}
                          </span>
                          <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>
                            Attention
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-xs font-black text-emerald-600'>
                            {scheduler.completed ?? 0}
                          </span>
                          <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls when Expanded and total records > 6 */}
            {isExpanded && totalSchedulers > PAGE_SIZE && (
              <div className='flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/70 border-t border-slate-100 text-xs font-semibold text-slate-600'>
                {/* Left: Showing range */}
                <div>
                  <span>
                    Showing {(safePage - 1) * PAGE_SIZE + 1} -{' '}
                    {Math.min(safePage * PAGE_SIZE, totalSchedulers)} of{' '}
                    {totalSchedulers} schedulers
                  </span>
                </div>

                {/* Right: Page Navigation Buttons */}
                <div className='flex items-center gap-1'>
                  <button
                    type='button'
                    disabled={safePage === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    aria-label='Previous Page'
                    className='w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-bold'
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={`page-${pageNum}`}
                        type='button'
                        onClick={() => setPage(pageNum)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${
                          pageNum === safePage
                            ? 'bg-linear-to-r from-[#10b981] to-[#059669] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200/70 border border-transparent'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    type='button'
                    disabled={safePage === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    aria-label='Next Page'
                    className='w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-bold'
                  >
                    ›
                  </button>
                </div>
              </div>
            )}

            {/* Expand / Collapse Footer */}
            {totalSchedulers > 3 && (
              <div className='p-2 bg-slate-50/50 text-center border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => {
                    setIsExpanded((prev) => !prev);
                    setPage(1);
                  }}
                  className='inline-flex items-center gap-1 text-xs font-extrabold text-[#059669] hover:text-[#047857] hover:underline cursor-pointer py-1 px-3'
                >
                  <span>
                    {isExpanded
                      ? t('common.showLess', { defaultValue: 'Show Less' })
                      : t('dashboard.showAllSchedulers', {
                          count: totalSchedulers,
                          defaultValue: `Show all ${totalSchedulers} schedulers`,
                        })}
                  </span>
                  {isExpanded ? (
                    <ExpandLessIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SchedulerSummarySection;
