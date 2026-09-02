/**
 * Payload builder for Schedulers Management
 */

export const buildAddSchedulerPayload = (formData) => ({
  name: (formData?.name || '').trim(),
  email: (formData?.email || '').trim().toLowerCase(),
  phone: formData?.phone || '',
  role: formData?.role !== undefined ? formData.role : 2,
});
