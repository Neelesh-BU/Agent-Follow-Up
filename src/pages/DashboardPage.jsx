import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RefreshIcon from "@mui/icons-material/Refresh";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import useAuth from "@/hooks/useAuth";
import useNotification from "@/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePipelineTableQuery,
  useSummaryCardsQuery,
  usePipelineFlowQuery,
} from "@/hooks/queries/useDashboardQuery";
import {
  useSchedulersQuery,
  SCHEDULERS_QUERY_KEY,
  SCHEDULER_ACCOUNTS_OVERVIEW_QUERY_KEY,
} from "@/hooks/queries/useSchedulerQueries";
import useInterviewMutations from "@/hooks/queries/useInterviewMutations";
import { getExportUrl } from "@/lib/api/interviews/interviews.api";
import OpsSummaryCards from "@/components/dashboard/OpsSummaryCards";
import PipelineFlowFunnel from "@/components/dashboard/PipelineFlowFunnel";
import FollowUpToolbar from "@/components/dashboard/FollowUpToolbar";
import SchedulerSummarySection from "@/components/dashboard/SchedulerSummarySection";
import FollowUpTable from "@/components/dashboard/FollowUpTable";
import FollowUpDetailModal from "@/components/dashboard/FollowUpDetailModal";
import DeleteFollowUpModal from "@/components/dashboard/DeleteFollowUpModal";
import UploadCandidateModal from "@/components/dashboard/UploadCandidateModal";
import UploadHistoryModal from "@/components/dashboard/UploadHistoryModal";
import PaginationBar from "@/components/common/PaginationBar";
import MuiDateRangePicker from "@/components/common/MuiDateRangePicker";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SelectDropdown from "@/components/common/SelectDropdown";
import BlobButton from "@/components/common/BlobButton";
import useDebounce from "@/hooks/useDebounce";

import { isMasterScheduler, isDeactivated } from "@/utils/roles";

const TAB_PARAM_MAP = {
  all: 1,
  scheduled_calls: 2,
  needs_attention: 3,
  completed: 4,
};

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isMaster = isMasterScheduler(user?.role);

  const [tableSchedulerFilter, setTableSchedulerFilter] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const debouncedCandidateSearch = useDebounce(candidateSearch, 400);
  const [tableFromDate, setTableFromDate] = useState("");
  const [tableToDate, setTableToDate] = useState("");

  const [uploadScheduler, setUploadScheduler] = useState("");
  const [activeTab, setActiveTab] = useState(
    () => location.state?.tab || "all",
  );
  const [activePipelineStage, setActivePipelineStage] = useState("all");

  // Sync tab with external navigation events (e.g. Notifications popover, summary cards)
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      setPage(1);
      const timer = setTimeout(() => {
        const tableElement = document.getElementById("pipeline-detail-table");
        if (tableElement) {
          tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Current tab number parameter for pipeline-table API (1=All, 2=Active, 3=Needs Attention, 4=Completed)
  const currentTabNumber = TAB_PARAM_MAP[activeTab] || 1;
  const effectiveSchedulerId = !isMaster
    ? user?.id || user?.userId
    : tableSchedulerFilter || undefined;
  const effectiveCandidateSearch = isMaster
    ? debouncedCandidateSearch.trim() || undefined
    : undefined;

  // TanStack Query for Pipeline Table with Server-Side Pagination
  const {
    data: pipelineTableResponse,
    isLoading: isPipelineTableLoading,
    isFetching: isPipelineTableFetching,
    refetch: refetchPipelineTable,
  } = usePipelineTableQuery({
    tab: currentTabNumber,
    page,
    limit: pageSize,
    scheduler_id: effectiveSchedulerId,
    search: effectiveCandidateSearch,
    from: tableFromDate || undefined,
    to: tableToDate || undefined,
  });

  const {
    data: summaryCardsData = {},
    isFetching: isSummaryCardsFetching,
    refetch: refetchSummaryCards,
    dataUpdatedAt: summaryCardsUpdatedAt,
  } = useSummaryCardsQuery({
    scheduler_id: effectiveSchedulerId,
    search: effectiveCandidateSearch,
    from: tableFromDate || undefined,
    to: tableToDate || undefined,
  });

  const {
    data: pipelineFlowData = {},
    isFetching: isPipelineFlowFetching,
    refetch: refetchPipelineFlow,
  } = usePipelineFlowQuery({
    scheduler_id: effectiveSchedulerId,
    search: effectiveCandidateSearch,
    from: tableFromDate || undefined,
    to: tableToDate || undefined,
  });

  const {
    data: schedulersQueryData,
    refetch: refetchSchedulers,
    isFetching: isSchedulersFetching,
  } = useSchedulersQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(isMaster) },
  );

  const isRefreshing =
    isPipelineTableFetching ||
    isSummaryCardsFetching ||
    isPipelineFlowFetching ||
    Boolean(isMaster && isSchedulersFetching);

  const handleRefreshAll = async () => {
    const refreshPromises = [
      refetchSummaryCards(),
      refetchPipelineFlow(),
      refetchPipelineTable(),
    ];

    if (isMaster) {
      refreshPromises.push(
        refetchSchedulers(),
        queryClient.refetchQueries({
          queryKey: [SCHEDULER_ACCOUNTS_OVERVIEW_QUERY_KEY],
        }),
        queryClient.refetchQueries({ queryKey: [SCHEDULERS_QUERY_KEY] }),
      );
    }

    await Promise.allSettled(refreshPromises);
  };

  const pipelineList = useMemo(() => {
    if (
      pipelineTableResponse &&
      Array.isArray(pipelineTableResponse.pipeline_list)
    ) {
      return pipelineTableResponse.pipeline_list;
    }
    if (Array.isArray(pipelineTableResponse)) {
      return pipelineTableResponse;
    }
    return [];
  }, [pipelineTableResponse]);

  const totalTableRecords =
    typeof pipelineTableResponse?.totalResults === "number"
      ? pipelineTableResponse.totalResults
      : pipelineList.length;

  // TanStack Mutations
  const {
    createInterviewMutation,
    updateInterviewMutation,
    rescheduleInterviewMutation,
    deleteInterviewMutation,
    callNowMutation,
    uploadCandidatesMutation,
  } = useInterviewMutations();

  const lastSyncTime = summaryCardsUpdatedAt
    ? new Date(summaryCardsUpdatedAt)
    : new Date();


  // Upload handler with scheduler assignment
  const handleFileUpload = async ({ file, schedulerId }) => {
    try {
      const result = await uploadCandidatesMutation.mutateAsync({
        file,
        schedulerId: schedulerId || uploadScheduler,
      });
      showSuccess(
        `Uploaded ${result.success_count || 0} candidate follow up records.`,
      );
    } catch (err) {
      showError(err.message || "Upload failed");
      throw err;
    }
  };

  // Manual Add
  const handleAddManual = () => {
    setSelectedInterview(null);
    setIsDetailModalOpen(true);
  };

  // Save Interview (Add / Edit / Reschedule)
  const handleSaveInterview = async (payload, id, options = {}) => {
    try {
      if (options?.isReschedule || payload?.is_reschedule) {
        await rescheduleInterviewMutation.mutateAsync({ id, payload });
        showSuccess("Follow up rescheduled successfully. Automated reminders reset.");
      } else if (id) {
        await updateInterviewMutation.mutateAsync({ id, payload });
        showSuccess("Follow up updated successfully.");
      } else {
        await createInterviewMutation.mutateAsync(payload);
        showSuccess("Follow up created successfully.");
      }
      setIsDetailModalOpen(false);
    } catch (err) {
      showError(err.message || "Failed to save follow up.");
      throw err;
    }
  };

  // Delete Interview Handlers
  const handleOpenDeleteModal = (target) => {
    if (!target) return;
    if (typeof target === "object") {
      setRecordToDelete(target);
    } else {
      const found = pipelineList.find(
        (r) => (r.id || r.record_id || r._id) === target,
      );
      setRecordToDelete(found || { id: target });
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteInterviewMutation.mutateAsync(id);
      showSuccess(
        t("modals.deleteFollowUpSuccess", {
          defaultValue: "Follow up deleted.",
        }),
      );
      setRecordToDelete(null);
      setIsDetailModalOpen(false);
    } catch (err) {
      showError(
        err.message ||
          t("modals.deleteFollowUpFailed", {
            defaultValue: "Delete failed.",
          }),
      );
    }
  };

  // Call Now
  const handleCallNow = async (id) => {
    try {
      const res = await callNowMutation.mutateAsync(id);
      showSuccess(`Call initiated for ${res.candidate_name || "candidate"}.`);
    } catch (err) {
      showError(err.message || "Call initiation failed.");
    }
  };

  // Mark Completed
  const handleMarkCompleted = async (id) => {
    try {
      await updateInterviewMutation.mutateAsync({
        id,
        payload: { status: "recruiter_completed" },
      });
      showSuccess("Marked completed by recruiter.");
    } catch (err) {
      showError(err.message || "Could not mark completed.");
    }
  };

  const filteredRows = useMemo(() => {
    return pipelineList.filter((item) => {
      // Pipeline stage filter
      if (
        activePipelineStage !== "all" &&
        String(item.call_pipeline || item.status || "").toLowerCase() !==
          activePipelineStage
      ) {
        return false;
      }
      return true;
    });
  }, [pipelineList, activePipelineStage]);

  const {
    activeCount = 0,
    totalCount = 0,
    needsAttentionCount = 0,
    completedCount = 0,
  } = summaryCardsData;

  const totalTabCount = totalCount;

  const exportUrl = getExportUrl({
    scheduler_id: effectiveSchedulerId,
    from: tableFromDate || undefined,
    to: tableToDate || undefined,
  });

  const schedulersList = useMemo(() => {
    if (!isMaster) return [];
    return (schedulersQueryData?.schedulers || []).filter(
      (u) => !isDeactivated(u),
    );
  }, [isMaster, schedulersQueryData?.schedulers]);


  return (
    <div className="flex flex-col gap-1 max-w-7xl mx-auto pb-16">
      {/* Floating Animated Blob Refresh Button */}
      <BlobButton
        fixed
        onClick={handleRefreshAll}
        isLoading={isRefreshing}
      />

      {/* Premium Dashboard Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Sync Active</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Updated{" "}
              {lastSyncTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isMaster
              ? t("dashboard.pageTitleMaster")
              : t("dashboard.pageTitleScheduler")}
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5 hidden sm:block">
            {isMaster
              ? t("dashboard.pageSubtitleMaster")
              : t("dashboard.pageSubtitleScheduler")}
          </p>
        </div>
      </div>

      {/* Top Ops Summary Cards */}
      <OpsSummaryCards
        activeCount={activeCount}
        totalCount={totalCount}
        needsAttentionCount={needsAttentionCount}
        completedCount={completedCount}
        onCardClick={(cardId) => {
          const tabMap = {
            'total': 'all',
            'active_follow_ups': 'scheduled_calls',
            'needs_attention': 'needs_attention',
            'completed': 'completed'
          };
          const tabId = tabMap[cardId];
          if (tabId) {
            setActiveTab(tabId);
            setPage(1);
            document.getElementById('pipeline-detail-table')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Pipeline Flow Funnel */}
      <PipelineFlowFunnel counts={pipelineFlowData} />

      {/* Filter & Action Toolbar */}
      <FollowUpToolbar
        isMaster={isMaster}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenUploadHistory={() => setIsHistoryModalOpen(true)}
        onAddManual={handleAddManual}
      />

      {/* Schedulers Summary Section (Master Scheduler only) */}
      {isMaster && (
        <SchedulerSummarySection
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenUploadHistory={() => setIsHistoryModalOpen(true)}
          onAddManual={handleAddManual}
        />
      )}

      {/* Table Section */}
      <section id="pipeline-detail-table" className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {t("dashboard.pipelineDetailTable")}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              {totalTableRecords
                ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalTableRecords)}`
                : "0"}{" "}
              of {totalTableRecords} records
            </p>
          </div>

          {/* Segmented Tabs with Badges */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto">
            {[
              {
                id: "all",
                label: t("tabs.all"),
                count: totalTabCount,
              },
              {
                id: "scheduled_calls",
                label: t("tabs.scheduled_calls"),
                count: activeCount,
              },
              {
                id: "needs_attention",
                label: t("tabs.needs_attention"),
                count: needsAttentionCount,
              },
              {
                id: "completed",
                label: t("tabs.completed"),
                count: completedCount,
              },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? "bg-white text-[#007cc2] shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-[#007cc2]/10 text-[#007cc2]"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Filters: Candidate Search (for Master), Date Range (Interview Scheduled Date) & Scheduler Dropdown (for Master) & Export */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2 pt-3 border-t border-slate-100 w-full justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
              {/* Search Candidate (Master Scheduler only) */}
              {isMaster && (
                <div className="relative flex items-center min-w-[200px] max-w-[260px]">
                  <SearchIcon
                    sx={{ fontSize: 17, color: "#94a3b8" }}
                    className="absolute left-3 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search candidate or phone..."
                    value={candidateSearch}
                    onChange={(e) => {
                      setCandidateSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-8.5 pl-8.5 pr-7 bg-slate-50/70 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#007cc2] transition-all"
                  />
                  {candidateSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setCandidateSearch("");
                        setPage(1);
                      }}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <ClearIcon sx={{ fontSize: 13 }} />
                    </button>
                  )}
                </div>
              )}

              {/* Date Range Picker (Interview Scheduled Date) */}
              <MuiDateRangePicker
                fromDate={tableFromDate}
                toDate={tableToDate}
                onChange={({ from, to }) => {
                  setTableFromDate(from);
                  setTableToDate(to);
                  setPage(1);
                }}
              />

              {/* Scheduler Filter Dropdown (Master Scheduler only) */}
              {isMaster && (
                <SelectDropdown
                  value={tableSchedulerFilter}
                  onChange={(v) => {
                    setTableSchedulerFilter(v);
                    setPage(1);
                  }}
                  options={[
                    {
                      value: "",
                      label: t("nav.allSchedulers", {
                        defaultValue: "All Schedulers",
                      }),
                    },
                    ...schedulersList.map((sch) => ({
                      value: sch.id,
                      label: sch.name,
                    })),
                  ]}
                  icon={
                    <PersonOutlineIcon
                      sx={{ fontSize: 17, color: "#007cc2" }}
                    />
                  }
                  className="min-w-[180px]"
                />
              )}
            </div>

            {/* Export Button on Right */}
            <a
              href={exportUrl}
              target="_blank"
              rel="noreferrer"
              className="h-8.5 px-3.5 bg-[#007cc2] hover:bg-[#006ca9] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ml-auto"
            >
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
              <span>
                {t("dashboard.exportCsv", { defaultValue: "Export" })}
              </span>
            </a>
          </div>
        </div>

        {/* Follow Up Table */}
        <div
          className={`transition-opacity duration-200 ${
            isPipelineTableFetching && !isRefreshing
              ? "opacity-60 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <FollowUpTable
            rows={pipelineList}
            schedulers={schedulersList}
            isMaster={isMaster}
            onView={(item) => {
              setSelectedInterview(item);
              setIsDetailModalOpen(true);
            }}
            onCallNow={handleCallNow}
            onMarkCompleted={handleMarkCompleted}
            onDelete={handleOpenDeleteModal}
            viewOnly={activeTab === "completed"}
          />
        </div>

        {/* Pagination Bar */}
        {totalTableRecords > 0 && (
          <div className="mt-4">
            <PaginationBar
              page={page}
              pageSize={pageSize}
              totalRows={totalTableRecords}
              onPageChange={setPage}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setPage(1);
              }}
            />
          </div>
        )}
      </section>

      {/* Modals */}
      <UploadCandidateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        schedulers={schedulersList}
        isMaster={isMaster}
        defaultSchedulerId={tableSchedulerFilter || ""}
      />

      <UploadHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        schedulerId={!isMaster ? user?.id : tableSchedulerFilter || undefined}
      />

      <FollowUpDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleSaveInterview}
        onDelete={handleOpenDeleteModal}
        initialData={selectedInterview}
        schedulers={schedulersList}
        isMaster={isMaster}
        isLoading={
          createInterviewMutation.isPending ||
          updateInterviewMutation.isPending ||
          rescheduleInterviewMutation.isPending
        }
      />

      <DeleteFollowUpModal
        isOpen={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        record={recordToDelete}
        schedulers={schedulersList}
        isLoading={deleteInterviewMutation.isPending}
      />
    </div>
  );
};

export default DashboardPage;
