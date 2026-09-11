import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Upload candidate roster (CSV / Excel)
 * @param {FormData|Object} data - FormData instance or object { file, scheduler_id }
 */
export const uploadCandidatesApi = async (data) => {
  let formData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    if (data?.file) {
      formData.append('file', data.file);
    }
    const schedulerId = data?.scheduler_id || data?.schedulerId;
    if (schedulerId) {
      formData.append('scheduler_id', schedulerId);
    }
  }

  const response = await api.post(getAPIMap('uploadCandidates'), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get candidate roster upload history
 * @param {Object} params - { scheduler_id }
 */
export const getUploadHistoryApi = async (params = {}) => {
  const response = await api.get(getAPIMap('getUploadHistory'), { params });
  return response.data;
};

/**
 * Get upload failure items by upload ID
 * @param {string|number} uploadId - ID of upload batch
 * @param {Object} params - Optional query filters
 */
export const getUploadFailuresApi = async (uploadId, params = {}) => {
  const url = getAPIMap('getUploadFailures').replace(':uploadId', uploadId);
  const response = await api.get(url, { params });
  return response.data;
};

export default {
  uploadCandidatesApi,
  getUploadHistoryApi,
  getUploadFailuresApi,
};
