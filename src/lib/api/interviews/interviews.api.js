import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";
import {
  buildStateParams,
  buildCandidateUploadFormData,
} from "./interviews.payload";

/**
 * Fetch Summary Cards
 */
export async function getSummaryCardsApi(params = {}) {
  const base = getAPIMap("summaryCards");
  if (!base) return {};
  const query = buildStateParams(params);
  const url = `${base}${query}`;
  const response = await api.get(url);
  return response.data;
}

/**
 * Fetch Pipeline Flow
 */
export async function getPipelineFlowApi(params = {}) {
  const base = getAPIMap("pipelineFlow");
  if (!base) return {};
  const query = buildStateParams(params);
  const url = `${base}${query}`;
  const response = await api.get(url);
  return response.data;
}

/**
 * Create Interview Record
 */
export async function createInterviewApi(payload) {
  const url = getAPIMap("interviews");
  if (!url) return {};
  const response = await api.post(url, payload);
  return response.data;
}

/**
 * Update Interview Record
 */
export async function updateInterviewApi({ id, payload }) {
  const endpoint = getAPIMap("updateInterview") || (getAPIMap("interviewById") ? `${getAPIMap("interviewById")}/update` : "");
  if (!endpoint) return {};
  const url = endpoint.replace("{id}", id);
  const response = await api.patch(url, payload);
  return response.data;
}

const ALLOWED_RESCHEDULE_KEYS = new Set([
  'id',
  'record_id',
  'interviewId',
  'scheduled_date',
  'schedule_date',
  'interview_date',
  'reschedule_date',
  'scheduled_time',
  'schedule_time',
  'interview_time',
  'reschedule_time',
  'call_scheduled_at',
  'candidate_name',
  'candidate_email',
  'email',
  'phone',
  'phone_number',
  'company_name',
  'interview_company',
  'company',
  'job_id',
  'job_title',
  'role',
  'notes',
  'reason',
  'status',
  'scheduler_id',
  'is_reschedule',
  'response',
]);

/**
 * Reschedule Interview Record
 */
export async function rescheduleInterviewApi({ id, payload }) {
  const endpoint =
    getAPIMap("rescheduleInterview") || "/v1/interviews/reschedule";
  const recordId = id || payload?.id || payload?.record_id;

  const raw = {
    ...payload,
    id: recordId,
    record_id: recordId,
    is_reschedule: true,
  };

  const cleanPayload = {};
  for (const [key, val] of Object.entries(raw)) {
    if (ALLOWED_RESCHEDULE_KEYS.has(key) && val !== undefined) {
      cleanPayload[key] = val;
    }
  }

  const response = await api.post(endpoint, cleanPayload);
  return response.data;
}

/**
 * Delete Interview Record
 */
export async function deleteInterviewApi(id) {
  const endpoint = getAPIMap("deleteInterview") || (getAPIMap("interviewById") ? `${getAPIMap("interviewById")}/delete` : "");
  if (!endpoint) return {};
  const url = endpoint.replace("{id}", id);
  const response = await api.delete(url);
  return response.data;
}

/**
 * Trigger Immediate Call
 */
export async function callNowApi(id) {
  const endpoint = getAPIMap("callNow");
  if (!endpoint) return {};
  const url = endpoint.replace("{id}", id);
  const response = await api.post(url);
  return response.data;
}

/**
 * Upload candidate roster (CSV/Excel)
 */
export async function uploadCandidatesApi({ file, schedulerId }) {
  const url = getAPIMap("uploadCandidates");
  if (!url) return { success_count: 0 };
  const formData = buildCandidateUploadFormData(file, schedulerId);
  const response = await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Run scheduler batch
 */
export async function runSchedulerApi() {
  const url = getAPIMap("schedulerRun");
  if (!url) return {};
  const response = await api.post(url);
  return response.data;
}

/**
 * Helper to get export CSV URL
 */
export function getExportUrl(params = {}) {
  const endpoint = getAPIMap("exportCsv");
  if (!endpoint) return "#";
  const query = buildStateParams(params);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  return `${baseUrl}${endpoint}${query}`;
}

/**
 * Get Pipeline Table Data
 */
export async function pipelineListTable(params = {}) {
  const base = getAPIMap("pipelineListTable");
  if (!base) return { pipeline_list: [], totalResults: 0 };
  const queryParams = new URLSearchParams();
  if (params.tab !== undefined && params.tab !== null) {
    queryParams.append("tab", params.tab);
  }
  if (params.page !== undefined && params.page !== null) {
    queryParams.append("page", params.page);
  }
  if (params.limit !== undefined && params.limit !== null) {
    queryParams.append("limit", params.limit);
  }
  if (params.scheduler_id) {
    queryParams.append("scheduler_id", params.scheduler_id);
  }
  if (params.search) {
    queryParams.append("search", params.search);
  }
  if (params.from) {
    queryParams.append("from", params.from);
  }
  if (params.to) {
    queryParams.append("to", params.to);
  }
  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";
  const url = `${base}${queryString}`;
  const response = await api.get(url);
  return response.data;
}

/**
 * Get Single Record for View Details / Reschedule Modal
 */
export async function getViewRecordApi(id) {
  if (!id) return null;
  const base = getAPIMap("viewRecord");
  if (!base) return null;
  const url = `${base}?id=${encodeURIComponent(id)}`;
  const response = await api.get(url);
  return response.data;
}
