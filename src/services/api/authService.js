import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@/lib/api/auth/auth.api';

export const authService = {
  login: loginApi,
  register: registerApi,
  logout: logoutApi,
  getCurrentUser: getCurrentUserApi,
  requestPasswordReset: forgotPasswordApi,
  confirmPasswordReset: (token, password) =>
    resetPasswordApi({ token, password }),
};

export default authService;
