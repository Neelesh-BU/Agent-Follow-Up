import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Fetch paginated and filtered pipeline list table records
 * @param {Object} params - { tab, page, limit, scheduler_id, search, from, to }
 */
export const listTableRecordsApi = async (params = {}) => {
  const url =
    getAPIMap('listTableRecords') ||
    getAPIMap('pipelineListTable') ||
    '/v1/pipeline/list-table-records';
  const response = await api.get(url, { params });
  return response.data;
};

/**
 * View single pipeline record details
 * @param {string|Object} params - ID string or object { id, record_id }
 */
export const viewTableRecordApi = async (params = {}) => {
  const queryParams = typeof params === 'string' ? { id: params } : params;
  const url =
    getAPIMap('viewTableRecord') ||
    getAPIMap('viewRecord') ||
    '/v1/pipeline/view-table-records';
  const response = await api.get(url, { params: queryParams });
  return response.data;
};

/**
 * Fetch pipeline flow funnel counts
 * @param {Object} params - { scheduler_id, search, from, to }
 */
export const getPipelineFlowApi = async (params = {}) => {
  const url =
    getAPIMap('getPipelineFlow') ||
    getAPIMap('pipelineFlow') ||
    '/v1/pipeline/pipeline-flow';
  const response = await api.get(url, { params });
  return response.data;
};

/**
 * Fetch dashboard summary cards data
 * @param {Object} params - { scheduler_id, search, from, to }
 */
export const getSummaryCardsApi = async (params = {}) => {
  const url =
    getAPIMap('getSummaryCards') ||
    getAPIMap('summaryCards') ||
    '/v1/pipeline/summary-cards';
  const response = await api.get(url, { params });
  return response.data;
};

export default {
  listTableRecordsApi,
  viewTableRecordApi,
  getPipelineFlowApi,
  getSummaryCardsApi,
};
