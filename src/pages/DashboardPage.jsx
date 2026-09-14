import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

// Hooks & Queries
import useAuth from '@/hooks/useAuth';
import useDebounce from '@/hooks/useDebounce';
import { isMasterScheduler } from '@/utils/roles';
import {
  useSummaryCardsQuery,
  usePipelineFlowQuery,
  usePipelineTableQuery,
} from '@/hooks/queries/useDashboardQuery';
import { useSchedulersQuery } from '@/hooks/queries/useSchedulerQueries';
import { useInterviewMutations } from '@/hooks/queries/useInterviewMutations';

// Dashboard Components
import OpsSummaryCards from '@/components/dashboard/OpsSummaryCards';
import PipelineFlowFunnel from '@/components/dashboard/PipelineFlowFunnel';
import SchedulerSummarySection from '@/components/dashboard/SchedulerSummarySection';
import FollowUpTable from '@/components/dashboard/FollowUpTable';
import FollowUpDetailModal from '@/components/dashboard/FollowUpDetailModal';
import DeleteFollowUpModal from '@/components/dashboard/DeleteFollowUpModal';
import UploadCandidateModal from '@/components/dashboard/UploadCandidateModal';
import UploadHistoryModal from '@/components/dashboard/UploadHistoryModal';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

// Common Components
import MuiDateRangePicker from '@/components/common/MuiDateRangePicker';
import PaginationBar from '@/components/common/PaginationBar';
import BlobButton from '@/components/common/BlobButton';

// ─── Tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { id: 1, key: 'all', label: 'All Records' },
  { id: 2, key: 'active_follow_ups', label: 'Active' },
  { id: 3, key: 'needs_attention', label: 'Needs Attention' },
  { id: 4, key: 'completed', label: 'Completed' },
];

// ─── Greeting helper ────────────────────────────────────────────────────────
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ─── Main Component ──────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const isMaster = isMasterScheduler(user?.role);
  const schedulerId = !isMaster ? user?.id || user?.userId : undefined;

  // ── Filter State ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  // ── Modal State ─────────────────────────────────────────────────────────
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadHistoryModal, setUploadHistoryModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });

  // ── Location state: tab switch from notification click ──────────────────
  useEffect(() => {
    if (location.state?.tab) {
      const found = TABS.find((tab) => tab.key === location.state.tab);
      if (found) setActiveTab(found.id);
    }
  }, [location.state]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch, fromDate, toDate, pageSize]);

  // ── API Params ──────────────────────────────────────────────────────────
  const commonParams = useMemo(
    () => ({
      scheduler_id: schedulerId,
      search: debouncedSearch.trim() || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
    }),
    [schedulerId, debouncedSearch, fromDate, toDate],
  );

  const tableParams = useMemo(
    () => ({
      ...commonParams,
      tab: activeTab,
      page,
      limit: pageSize,
    }),
    [commonParams, activeTab, page, pageSize],
  );

  // ── Queries ─────────────────────────────────────────────────────────────
  const { data: summaryData, isLoading: summaryLoading } = useSummaryCardsQuery(commonParams);
  const { data: pipelineFlowData, isLoading: flowLoading } = usePipelineFlowQuery(commonParams);
  const {
    data: tableData,
    isLoading: tableLoading,
    isFetching: tableFetching,
  } = usePipelineTableQuery(tableParams);
  const { data: schedulersData, isLoading: schedulersLoading } = useSchedulersQuery({ enabled: isMaster });

  const isPageLoading =
    summaryLoading ||
    flowLoading ||
    tableLoading ||
    Boolean(isMaster && schedulersLoading);

  // ── Mutations ────────────────────────────────────────────────────────────
  const {
    createInterviewMutation,
    updateInterviewMutation,
    rescheduleInterviewMutation,
    deleteInterviewMutation,
    callNowMutation,
    uploadCandidatesMutation,
    invalidateDashboard,
  } = useInterviewMutations();

  // ── Derived data ─────────────────────────────────────────────────────────
  const summaryCards = useMemo(
    () => ({
      totalCount: summaryData?.total ?? summaryData?.totalCount ?? 0,
      activeCount: summaryData?.active ?? summaryData?.activeCount ?? 0,
      needsAttentionCount:
        summaryData?.needs_attention ?? summaryData?.needsAttentionCount ?? 0,
      completedCount: summaryData?.completed ?? summaryData?.completedCount ?? 0,
    }),
    [summaryData],
  );

  const pipelineCounts = useMemo(
    () => ({
      uploaded: pipelineFlowData?.uploaded ?? pipelineFlowData?.total ?? 0,
      followup_initiated: pipelineFlowData?.followup_initiated ?? 0,
      followup_completed: pipelineFlowData?.followup_completed ?? 0,
      call_skipped: pipelineFlowData?.call_skipped ?? 0,
      joining_confirmed: pipelineFlowData?.joining_confirmed ?? 0,
    }),
    [pipelineFlowData],
  );

  const tableRows = useMemo(() => {
    if (!tableData) return [];
    return (
      tableData.pipeline_list ??
      tableData.rows ??
      tableData.records ??
      tableData.data ??
      []
    );
  }, [tableData]);

  const totalRows = useMemo(() => {
    if (!tableData) return 0;
    return (
      tableData.totalResults ??
      tableData.total ??
      tableData.totalRows ??
      tableData.totalCount ??
      tableRows.length
    );
  }, [tableData, tableRows.length]);

  const schedulersList = useMemo(() => {
    return schedulersData?.schedulers ?? [];
  }, [schedulersData]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    invalidateDashboard();
  }, [invalidateDashboard]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setPage(1);
  }, []);

  const handleCardClick = useCallback((cardId) => {
    const found = TABS.find((tab) => tab.key === cardId);
    if (found) {
      setActiveTab(found.id);
      setTimeout(() => {
        document
          .getElementById('followup-table-section')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleView = useCallback((row) => {
    setDetailModal({ open: true, data: row });
  }, []);

  const handleCallNow = useCallback(
    async (row) => {
      const id =
        typeof row === 'string'
          ? row
          : row?.id || row?.record_id || row?._id;
      if (!id) return;
      try {
        await callNowMutation.mutateAsync(id);
      } catch (err) {
        console.error('Call now error:', err);
        alert(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to initiate call.',
        );
      }
    },
    [callNowMutation],
  );

  const handleMarkCompleted = useCallback(
    async (row) => {
      const id =
        typeof row === 'string'
          ? row
          : row?.id || row?.record_id || row?._id;
      if (!id) return;
      try {
        await updateInterviewMutation.mutateAsync({
          id,
          payload: { status: 'completed' },
        });
      } catch (err) {
        console.error('Mark completed error:', err);
        alert(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to mark record as completed.',
        );
      }
    },
    [updateInterviewMutation],
  );

  const handleDeleteClick = useCallback((row) => {
    setDeleteModal({ open: true, record: row });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const id =
      deleteModal.record?.id ||
      deleteModal.record?.record_id ||
      deleteModal.record?._id;
    if (!id) return;
    try {
      await deleteInterviewMutation.mutateAsync(id);
      setDeleteModal({ open: false, record: null });
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [deleteModal.record, deleteInterviewMutation]);

  const handleSaveDetail = useCallback(
    async (payload, effectiveId, options = {}) => {
      try {
        const isNew =
          !detailModal.data?.id && !detailModal.data?.record_id;
        if (isNew) {
          await createInterviewMutation.mutateAsync(payload);
        } else if (options?.isReschedule) {
          const id =
            effectiveId || detailModal.data.id || detailModal.data.record_id;
          await rescheduleInterviewMutation.mutateAsync({ id, payload });
        } else {
          const id =
            effectiveId || detailModal.data.id || detailModal.data.record_id;
          await updateInterviewMutation.mutateAsync({ id, payload });
        }
        setDetailModal({ open: false, data: null });
      } catch (err) {
        console.error('Save error:', err);
        alert(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to save candidate details.',
        );
      }
    },
    [
      detailModal.data,
      createInterviewMutation,
      updateInterviewMutation,
      rescheduleInterviewMutation,
    ],
  );

  const handleUpload = useCallback(
    async ({ file, schedulerId: sid }) => {
      await uploadCandidatesMutation.mutateAsync({
        file,
        scheduler_id: sid,
      });
      setUploadModal(false);
    },
    [uploadCandidatesMutation],
  );

  const hasActiveFilters = debouncedSearch || fromDate || toDate;

  return (
    <div className='w-full min-h-full'>
      {isPageLoading ? (
        <DashboardSkeleton isMaster={isMaster} />
      ) : (
        <>
          {/* ── DASHBOARD HEADER ─────────────────────────────────────────────── */}
      <div className='mb-5 sm:mb-7'>
        {/* Greeting row */}
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4'>
          <div className='flex-1 min-w-0'>
            {/* Greeting */}
            <div className='flex items-center gap-2 mb-1'>
              <WavingHandRoundedIcon
                sx={{ fontSize: 20, color: '#f59e0b' }}
                className='shrink-0'
              />
              <span className='text-[13px] font-semibold text-slate-500'>
                {getGreeting()},&nbsp;
                <span className='font-extrabold text-slate-800'>
                  {user?.name?.split(' ')[0] || 'there'}!
                </span>
              </span>
            </div>

            {/* Page title */}
            <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight'>
              {t('nav.dashboard', { defaultValue: 'Follow-up' })}{' '}
              <span className='text-[#10b981]'>Dashboard</span>
            </h1>

            {/* Date line */}
            <div className='flex items-center gap-1.5 mt-1'>
              <CalendarTodayRoundedIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
              <span className='text-[11.5px] font-medium text-slate-400'>
                {formatDate()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
            {/* Refresh */}
            <BlobButton
              onClick={handleRefresh}
              disabled={summaryLoading || flowLoading || tableLoading}
              isLoading={summaryLoading || flowLoading}
              label='Refresh'
              loadingLabel='Refreshing...'
            />

            {/* Non-master actions */}
            {!isMaster && (
              <>
                <button
                  type='button'
                  onClick={() => setUploadModal(true)}
                  className='h-9 px-3.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#10b981]/25'
                >
                  <CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />
                  <span className='hidden sm:inline'>Upload Candidate</span>
                  <span className='sm:hidden'>Upload</span>
                </button>

                <button
                  type='button'
                  onClick={() => setUploadHistoryModal(true)}
                  className='h-9 px-3.5 bg-white border border-[#10b981] text-[#059669] hover:bg-emerald-50 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs'
                >
                  <HistoryIcon sx={{ fontSize: 16 }} />
                  <span>History</span>
                </button>

                <button
                  type='button'
                  onClick={() => setDetailModal({ open: true, data: null })}
                  className='h-9 px-3.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#10b981]/25'
                >
                  <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16 }} />
                  <span className='hidden sm:inline'>Add Manually</span>
                  <span className='sm:hidden'>Add</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Subtle gradient rule */}
        <div className='h-px bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent' />
      </div>

      {/* ── KPI SUMMARY CARDS ────────────────────────────────────────────── */}
      <OpsSummaryCards
        totalCount={summaryCards.totalCount}
        activeCount={summaryCards.activeCount}
        needsAttentionCount={summaryCards.needsAttentionCount}
        completedCount={summaryCards.completedCount}
        onCardClick={handleCardClick}
      />

      {/* ── PIPELINE FLOW FUNNEL ─────────────────────────────────────────── */}
      <PipelineFlowFunnel counts={pipelineCounts} />

      {/* ── SCHEDULER ACCOUNTS OVERVIEW (Master only) ────────────────────── */}
      {isMaster && (
        <SchedulerSummarySection
          onOpenUploadModal={() => setUploadModal(true)}
          onOpenUploadHistory={() => setUploadHistoryModal(true)}
          onAddManual={() => setDetailModal({ open: true, data: null })}
        />
      )}

      {/* ── FOLLOW-UP DATA TABLE ─────────────────────────────────────────── */}
      <section id='followup-table-section' className='mb-6'>
        {/* Section header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 px-0.5'>
          <div className='flex items-center gap-2'>
            <FormatListBulletedRoundedIcon
              sx={{ fontSize: 18, color: '#10b981' }}
            />
            <h2 className='text-sm font-extrabold text-slate-800 tracking-tight'>
              {t('dashboard.followUpRecords', {
                defaultValue: 'Follow-up Records',
              })}
            </h2>
            {totalRows > 0 && (
              <span className='px-2 py-0.5 bg-[#10b981]/10 text-[#059669] text-[10px] font-black rounded-full'>
                {totalRows.toLocaleString('en-IN')}
              </span>
            )}
            {(tableLoading || tableFetching) && (
              <span className='inline-block w-3.5 h-3.5 border-2 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin' />
            )}
          </div>

          {/* Filter toggle */}
          <button
            type='button'
            onClick={() => setIsFilterOpen((v) => !v)}
            className={`h-8 px-3 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all border ${
              hasActiveFilters
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#059669]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <TuneRoundedIcon sx={{ fontSize: 15 }} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className='w-4 h-4 bg-[#10b981] text-white text-[9px] font-black rounded-full flex items-center justify-center'>
                !
              </span>
            )}
          </button>
        </div>

        {/* Main table card */}
        <div className='bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs'>
          {/* ── Tab bar ── */}
          <div className='border-b border-slate-100 bg-slate-50/60 px-3 sm:px-4 overflow-x-auto no-scrollbar'>
            <div className='flex items-center gap-0.5 min-w-max py-2'>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const count =
                  tab.id === 1
                    ? summaryCards.totalCount
                    : tab.id === 2
                      ? summaryCards.activeCount
                      : tab.id === 3
                        ? summaryCards.needsAttentionCount
                        : summaryCards.completedCount;

                const accentColor =
                  tab.id === 2
                    ? '#0284c7'
                    : tab.id === 3
                      ? '#f59e0b'
                      : tab.id === 4
                        ? '#10b981'
                        : '#6366f1';

                return (
                  <button
                    key={tab.id}
                    type='button'
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-slate-900 bg-white'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }`}
                    style={
                      isActive
                        ? {
                            boxShadow:
                              '0 1px 6px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)',
                          }
                        : {}
                    }
                  >
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <span
                        className='text-[9px] font-black px-1.5 py-0.5 rounded-full transition-colors'
                        style={{
                          backgroundColor: isActive
                            ? `${accentColor}18`
                            : '#f1f5f9',
                          color: isActive ? accentColor : '#64748b',
                        }}
                      >
                        {count.toLocaleString('en-IN')}
                      </span>
                    )}
                    {isActive && (
                      <span
                        className='absolute bottom-0 left-3 right-3 h-0.5 rounded-full'
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Filter Panel (collapsible) ── */}
          {isFilterOpen && (
            <div className='px-4 py-3 border-b border-slate-100 bg-slate-50/40 flex flex-wrap items-center gap-2.5 animate-in slide-in-from-top-1 duration-200'>
              {/* Search input */}
              <div className='relative flex items-center min-w-52 max-w-72 flex-1'>
                <SearchIcon
                  sx={{ fontSize: 16, color: '#94a3b8' }}
                  className='absolute left-3 pointer-events-none'
                />
                <input
                  type='text'
                  placeholder='Search candidate, company...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full h-8.5 pl-8.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#10b981] transition-all'
                />
                {search && (
                  <button
                    type='button'
                    onClick={() => setSearch('')}
                    className='absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer'
                  >
                    <ClearIcon sx={{ fontSize: 13 }} />
                  </button>
                )}
              </div>

              {/* Date range */}
              <MuiDateRangePicker
                fromDate={fromDate}
                toDate={toDate}
                onChange={({ from, to }) => {
                  setFromDate(from);
                  setToDate(to);
                }}
              />

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  type='button'
                  onClick={() => {
                    setSearch('');
                    setFromDate('');
                    setToDate('');
                  }}
                  className='h-8.5 px-3 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1'
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                  Clear
                </button>
              )}
            </div>
          )}

          {/* ── Table body ── */}
          <div className='overflow-x-auto custom-scrollbar'>
            <FollowUpTable
              rows={tableRows}
              schedulers={schedulersList}
              isMaster={isMaster}
              onView={handleView}
              onCallNow={handleCallNow}
              onMarkCompleted={handleMarkCompleted}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* ── Pagination ── */}
          {totalRows > 0 && (
            <div className='border-t border-slate-100'>
              <PaginationBar
                page={page}
                pageSize={pageSize}
                totalRows={totalRows}
                onPageChange={setPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </section>
        </>
      )}

      {/* ── MODALS ───────────────────────────────────────────────────────── */}

      {/* Detail / Edit Modal */}
      <FollowUpDetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, data: null })}
        onSave={handleSaveDetail}
        onDelete={(record) => {
          setDetailModal({ open: false, data: null });
          setDeleteModal({ open: true, record });
        }}
        initialData={detailModal.data}
        schedulers={schedulersList}
        isMaster={isMaster}
        isLoading={
          createInterviewMutation.isPending ||
          updateInterviewMutation.isPending ||
          rescheduleInterviewMutation.isPending
        }
      />

      {/* Delete Confirm Modal */}
      <DeleteFollowUpModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, record: null })}
        onConfirm={handleDeleteConfirm}
        record={deleteModal.record}
        schedulers={schedulersList}
        isLoading={deleteInterviewMutation.isPending}
      />

      {/* Upload Candidate Modal */}
      <UploadCandidateModal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        onUpload={handleUpload}
        schedulers={schedulersList}
        isMaster={isMaster}
        defaultSchedulerId={schedulerId}
      />

      {/* Upload History Modal */}
      <UploadHistoryModal
        isOpen={uploadHistoryModal}
        onClose={() => setUploadHistoryModal(false)}
        schedulerId={schedulerId}
      />

    </div>
  );
};

export default DashboardPage;

