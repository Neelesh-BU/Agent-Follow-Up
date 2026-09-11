import api from './axios';
import { getAPIMap } from '@/routes/ApiUrls';

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Response data containing { user, token }
 */
export const loginApi = async (credentials) => {
  const payload = {
    email: (credentials?.email || '').trim().toLowerCase(),
    password: credentials?.password || '',
  };
  const response = await api.post(getAPIMap('login'), payload);
  return response.data;
};

/**
 * Logout user
 * @param {Object} [payload={}] - Optional logout metadata/tokens
 * @returns {Promise<Object|null>}
 */
export const logoutApi = async (payload = {}) => {
  try {
    const response = await api.post(getAPIMap('logout'), payload);
    return response.data;
  } catch (error) {
    console.warn('Logout API error:', error);
    return null;
  }
};

/**
 * Request password reset email
 * @param {Object} payload - { email }
 */
export const passwordResetRequestApi = async (payload) => {
  const response = await api.post(getAPIMap('passwordResetRequest'), payload);
  return response.data;
};

/**
 * Confirm password reset
 * @param {Object} payload - { token, password }
 */
export const passwordResetConfirmApi = async (payload) => {
  const response = await api.post(getAPIMap('passwordResetConfirm'), payload);
  return response.data;
};

export default {
  loginApi,
  logoutApi,
  passwordResetRequestApi,
  passwordResetConfirmApi,
};
