/**
 * Payload builders for User Profile & Session APIs
 */

export const buildProfileUpdatePayload = (data = {}) => {
  const payload = {};
  if (data.name !== undefined) payload.name = (data.name || '').trim();
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.password) payload.password = data.password;
  return payload;
};

export const buildSessionSwitchPayload = (userId) => ({
  user_id: userId,
});
