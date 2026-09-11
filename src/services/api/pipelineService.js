import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Fetch paginated and filtered pipeline list table records
 * @param {Object} params - { tab, page, limit, scheduler_id, search, from, to }
 */
export const listTableRecordsApi = async (params = {}) => {
  const response = await api.get(getAPIMap('listTableRecords'), { params });
  return response.data;
};

/**
 * View single pipeline record details
 * @param {string|Object} params - ID string or object { id, record_id }
 */
export const viewTableRecordApi = async (params = {}) => {
  const queryParams = typeof params === 'string' ? { id: params } : params;
  const response = await api.get(getAPIMap('viewTableRecord'), { params: queryParams });
  return response.data;
};

/**
 * Fetch pipeline flow funnel counts
 * @param {Object} params - { scheduler_id, search, from, to }
 */
export const getPipelineFlowApi = async (params = {}) => {
  const response = await api.get(getAPIMap('getPipelineFlow'), { params });
  return response.data;
};

/**
 * Fetch dashboard summary cards data
 * @param {Object} params - { scheduler_id, search, from, to }
 */
export const getSummaryCardsApi = async (params = {}) => {
  const response = await api.get(getAPIMap('getSummaryCards'), { params });
  return response.data;
};

export default {
  listTableRecordsApi,
  viewTableRecordApi,
  getPipelineFlowApi,
  getSummaryCardsApi,
};
