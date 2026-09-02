/**
 * Centralized payload builders for Auth APIs
 */

export const buildLoginPayload = (values) => ({
  email: (values?.email || '').trim().toLowerCase(),
  password: values?.password || '',
});

export const buildRegisterPayload = (values) => ({
  name: (values?.name || '').trim(),
  email: (values?.email || '').trim().toLowerCase(),
  password: values?.password || '',
  role: values?.role || 'scheduler',
});

export const buildForgotPasswordPayload = (email) => ({
  email: (email || '').trim().toLowerCase(),
});

export const buildResetPasswordPayload = (token, password) => ({
  token,
  password,
});
