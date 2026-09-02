import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  pipelineListTable,
  getViewRecordApi,
  getSummaryCardsApi,
  getPipelineFlowApi,
} from "@/lib/api/interviews/interviews.api";

export const PIPELINE_TABLE_QUERY_KEY = "pipeline_table_state";
export const VIEW_RECORD_QUERY_KEY = "view_record";

/**
 * Hook to fetch Single Record Details for Pop-up Modal with TanStack Query
 * @param {string} id - Record ID
 * @param {Object} queryOptions - Additional TanStack query options
 */
export function useViewRecordQuery(id, queryOptions = {}) {
  return useQuery({
    queryKey: [VIEW_RECORD_QUERY_KEY, id || ""],
    queryFn: () => getViewRecordApi(id),
    ...queryOptions,
  });
}

/**
 * Hook to fetch Pipeline Table State (1=All, 2=Active, 3=Needs Attention, 4=Completed)
 * @param {Object} params - Filter options ({ tab: number })
 * @param {Object} queryOptions - Additional TanStack query options
 */
export function usePipelineTableQuery(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: [
      PIPELINE_TABLE_QUERY_KEY,
      params.tab ?? 1,
      params.page ?? 1,
      params.limit ?? 10,
      params.scheduler_id || "",
      params.search || "",
      params.from || "",
      params.to || "",
    ],
    queryFn: () => pipelineListTable(params),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}

export function useSummaryCardsQuery(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: [
      "summary_cards",
      params.scheduler_id || "",
      params.search || "",
      params.from || "",
      params.to || "",
    ],
    queryFn: () => getSummaryCardsApi(params),
    ...queryOptions,
  });
}

export function usePipelineFlowQuery(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: [
      "pipeline_flow",
      params.scheduler_id || "",
      params.search || "",
      params.from || "",
      params.to || "",
    ],
    queryFn: () => getPipelineFlowApi(params),
    ...queryOptions,
  });
}

