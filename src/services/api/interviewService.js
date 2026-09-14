import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Create a new interview record
 * @param {Object} payload - Interview data
 */
export const createInterviewApi = async (payload) => {
  const url =
    getAPIMap('createInterview') ||
    getAPIMap('interviews') ||
    '/v1/interviews/create-interview';
  const response = await api.post(url, payload);
  return response.data;
};

/**
 * Reschedule an existing interview
 * @param {Object} payload - Reschedule data
 */
export const rescheduleInterviewApi = async (payload) => {
  const url = getAPIMap('rescheduleInterview') || '/v1/interviews/reschedule';
  const response = await api.post(url, payload);
  return response.data;
};

/**
 * Update interview details
 * @param {string|number} interviewId - ID of interview
 * @param {Object} payload - Fields to update
 */
export const updateInterviewApi = async (interviewId, payload) => {
  const id = typeof interviewId === 'object' ? interviewId?.id || interviewId?.interviewId : interviewId;
  const endpoint = getAPIMap('updateInterview') || '/v1/interviews/:interviewId/update';
  const url = endpoint.replace(':interviewId', id).replace('{id}', id);
  const response = await api.patch(url, payload);
  return response.data;
};

/**
 * Delete an interview record
 * @param {string|number} interviewId - ID of interview
 */
export const deleteInterviewApi = async (interviewId) => {
  const id = typeof interviewId === 'object' ? interviewId?.id || interviewId?.interviewId : interviewId;
  const endpoint = getAPIMap('deleteInterview') || '/v1/interviews/:interviewId/delete';
  const url = endpoint.replace(':interviewId', id).replace('{id}', id);
  const response = await api.delete(url);
  return response.data;
};

/**
 * Trigger immediate AI follow-up call
 * @param {string|number} interviewId - ID of interview
 */
export const callNowApi = async (interviewId) => {
  const id = typeof interviewId === 'object' ? interviewId?.id || interviewId?.interviewId : interviewId;
  const endpoint = getAPIMap('callNow') || '/v1/interviews/:interviewId/call-now';
  const url = endpoint.replace(':interviewId', id).replace('{id}', id);
  const response = await api.post(url);
  return response.data;
};

export default {
  createInterviewApi,
  rescheduleInterviewApi,
  updateInterviewApi,
  deleteInterviewApi,
  callNowApi,
};
