import api from '@/services/api/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getUploadHistoryApi = async (schedulerId = '') => {
  const query = schedulerId ? `?scheduler_id=${schedulerId}` : '';
  const url = `${BASE_URL}/v1/interviews/upload/history${query}`;
  const response = await api.get(url);
  return response.data.data;
};

export const getUploadFailuresApi = async (uploadId) => {
  const url = `${BASE_URL}/v1/interviews/upload/history/${uploadId}/failures`;
  const response = await api.get(url);
  return response.data.data;
};
