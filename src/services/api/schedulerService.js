import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Fetch accounts overview metrics for schedulers
 * @param {Object} params - { search, from, to }
 */
export const getAccountsOverviewApi = async (params = {}) => {
  const response = await api.get(getAPIMap('getAccountsOverview'), { params });
  return response.data;
};

/**
 * Update authenticated user / scheduler profile
 * @param {Object} payload - { name, phone, initials, status, password }
 */
export const updateProfileApi = async (payload) => {
  const response = await api.patch(getAPIMap('updateProfile'), payload);
  return response.data;
};

/**
 * Get list of schedulers (admin / master scheduler)
 * @param {Object} params - Query filters
 */
export const getSchedulersApi = async (params = {}) => {
  const response = await api.get(getAPIMap('getSchedulers'), { params });
  return response.data;
};

/**
 * Resend invite to a scheduler
 * @param {string|number} userId - ID of the scheduler user
 */
export const resendInviteApi = async (userId) => {
  const url = getAPIMap('resendInvite').replace(':userId', userId);
  const response = await api.post(url);
  return response.data;
};

/**
 * Activate a scheduler user account
 * @param {string|number} userId - ID of the scheduler user
 */
export const activateSchedulerApi = async (userId) => {
  const url = getAPIMap('activateScheduler').replace(':userId', userId);
  const response = await api.patch(url);
  return response.data;
};

/**
 * Deactivate / Delete a scheduler user account
 * @param {string|number} userId - ID of the scheduler user
 */
export const deleteSchedulerApi = async (userId) => {
  const url = getAPIMap('deleteScheduler').replace(':userId', userId);
  const response = await api.delete(url);
  return response.data;
};

export const createSchedulerApi = async (payload) => {
  const url = getAPIMap('createScheduler') || '/v1/scheduler/create-scheduler';
  const response = await api.post(url, payload);
  return response.data;
};

export default {
  getAccountsOverviewApi,
  updateProfileApi,
  getSchedulersApi,
  createSchedulerApi,
  resendInviteApi,
  activateSchedulerApi,
  deleteSchedulerApi,
};
