import api from '@/services/api/axios';
import getAPIMap from '@/routes/ApiUrls';
import {
  buildLoginPayload,
  buildRegisterPayload,
  buildForgotPasswordPayload,
  buildResetPasswordPayload,
} from './auth.payload';

export async function loginApi(credentials) {
  const payload = buildLoginPayload(credentials);
  const response = await api.post(getAPIMap('login'), payload);
  return response.data;
}

export async function registerApi(userData) {
  const payload = buildRegisterPayload(userData);
  const response = await api.post(getAPIMap('register'), payload);
  return response.data;
}

export async function logoutApi() {
  try {
    const response = await api.post(getAPIMap('logout'));
    return response.data;
  } catch {
    // Graceful degradation on logout
    return null;
  }
}

export async function getCurrentUserApi() {
  const response = await api.get(getAPIMap('me'));
  return response.data;
}

export async function forgotPasswordApi(email) {
  const payload = buildForgotPasswordPayload(email);
  const response = await api.post(getAPIMap('forgotPassword'), payload);
  return response.data;
}

export async function resetPasswordApi({ token, password }) {
  const payload = buildResetPasswordPayload(token, password);
  const response = await api.post(getAPIMap('resetPassword'), payload);
  return response.data;
}
