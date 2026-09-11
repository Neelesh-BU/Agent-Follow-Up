import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Export interviews as Excel (blob)
 * @param {Object} params - Query filters (from, to, scheduler_id, etc.)
 */
export const exportInterviewsExcelApi = async (params = {}) => {
  const response = await api.get(getAPIMap('interviewExcel'), {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get direct download URL for interviews Excel export
 * @param {Object} params - Query filters
 * @returns {string} Full URL string
 */
export const getExportInterviewsExcelUrl = (params = {}) => {
  const baseUrl = api.defaults.baseURL || '';
  const endpoint = getAPIMap('interviewExcel');
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, val);
    }
  });

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return `${baseUrl}${endpoint}${query}`;
};

export default {
  exportInterviewsExcelApi,
  getExportInterviewsExcelUrl,
};
