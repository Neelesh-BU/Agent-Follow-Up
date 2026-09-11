import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Create a new interview record
 * @param {Object} payload - Interview data
 */
export const createInterviewApi = async (payload) => {
  const response = await api.post(getAPIMap('createInterview'), payload);
  return response.data;
};

/**
 * Reschedule an existing interview
 * @param {Object} payload - Reschedule data
 */
export const rescheduleInterviewApi = async (payload) => {
  const response = await api.post(getAPIMap('rescheduleInterview'), payload);
  return response.data;
};

/**
 * Update interview details
 * @param {string|number} interviewId - ID of interview
 * @param {Object} payload - Fields to update
 */
export const updateInterviewApi = async (interviewId, payload) => {
  const url = getAPIMap('updateInterview').replace(':interviewId', interviewId);
  const response = await api.patch(url, payload);
  return response.data;
};

/**
 * Delete an interview record
 * @param {string|number} interviewId - ID of interview
 */
export const deleteInterviewApi = async (interviewId) => {
  const url = getAPIMap('deleteInterview').replace(':interviewId', interviewId);
  const response = await api.delete(url);
  return response.data;
};

/**
 * Trigger immediate AI follow-up call
 * @param {string|number} interviewId - ID of interview
 */
export const callNowApi = async (interviewId) => {
  const url = getAPIMap('callNow').replace(':interviewId', interviewId);
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
