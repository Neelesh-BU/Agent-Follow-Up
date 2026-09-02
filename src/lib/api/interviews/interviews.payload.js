import {
  normalizeDateInputValue,
  normalizeTimeInputValue,
} from '@/utils/formatters';

/**
 * Format query params for State / Interviews API
 */
export const buildStateParams = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.from) queryParams.set('from', params.from);
  if (params.to) queryParams.set('to', params.to);
  if (params.scheduler_id) queryParams.set('scheduler_id', params.scheduler_id);
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Convert Date & Time strings to ISO String
 */
const toIsoDateTime = (dateStr, timeStr) => {
  const normDate = normalizeDateInputValue(dateStr);
  const normTime = normalizeTimeInputValue(timeStr);
  if (normDate && normTime) {
    return new Date(`${normDate}T${normTime}:00`).toISOString();
  }
  if (normDate) {
    return new Date(`${normDate}T00:00:00`).toISOString();
  }
  return '';
};

/**
 * Build payload for Add / Update Interview Candidate
 */
export const buildInterviewPayload = (formData, { isMaster = false } = {}) => {
  const normInterviewDate = normalizeDateInputValue(formData.interview_date);
  const normCallDate = normalizeDateInputValue(formData.call_date);
  const normRescheduleDate = normalizeDateInputValue(formData.reschedule_date);

  const interviewIso = toIsoDateTime(
    formData.interview_date,
    formData.interview_time,
  );
  const callIso = toIsoDateTime(formData.call_date, formData.call_time);
  const rescheduleIso = toIsoDateTime(
    formData.reschedule_date,
    formData.reschedule_time,
  );

  const scheduledDate =
    (formData.response === 'reschedule' ? normRescheduleDate : '') ||
    normInterviewDate ||
    normCallDate ||
    '';

  const scheduledTime =
    (formData.response === 'reschedule' ? formData.reschedule_time : '') ||
    formData.interview_time ||
    formData.call_time ||
    '';

  const payload = {
    candidate_name: formData.candidate_name || '',
    phone: formData.phone || formData.phone_number || '',
    phone_number: formData.phone || formData.phone_number || '',
    candidate_email: formData.email || '',
    email: formData.email || '',
    interview_company: formData.company_name || formData.interview_company || '',
    company_name: formData.company_name || formData.interview_company || '',
    scheduled_date: scheduledDate,
    scheduled_time: scheduledTime,
    schedule_date: scheduledDate,
    schedule_time: scheduledTime,
    interview_time:
      rescheduleIso && formData.response === 'reschedule'
        ? rescheduleIso
        : interviewIso,
    call_scheduled_at:
      rescheduleIso && formData.response === 'reschedule' ? '' : callIso,
    role: formData.job_title || formData.role || '',
    job_id: formData.job_id || '',
    job_title: formData.job_title || formData.role || '',
    status: formData.status || 'pending',
    reason: formData.reason || '',
    audio_url: formData.audio_url || '',
    notes: formData.notes || '',
  };

  if (isMaster && formData.scheduler_id) {
    payload.scheduler_id = formData.scheduler_id;
  }

  return payload;
};

/**
 * Build clean payload strictly for Reschedule API matching backend validation
 */
export const buildReschedulePayload = (formData, { isMaster = false } = {}) => {
  const normDate = normalizeDateInputValue(
    formData.reschedule_date || formData.interview_date || formData.scheduled_date,
  );
  const normTime = normalizeTimeInputValue(
    formData.reschedule_time || formData.interview_time || formData.scheduled_time,
  );

  const rescheduleIso = toIsoDateTime(normDate, normTime);

  const payload = {
    candidate_name: formData.candidate_name || '',
    phone: formData.phone || formData.phone_number || '',
    phone_number: formData.phone || formData.phone_number || '',
    candidate_email: formData.email || formData.candidate_email || '',
    email: formData.email || formData.candidate_email || '',
    interview_company:
      formData.company_name || formData.interview_company || formData.company || '',
    company_name:
      formData.company_name || formData.interview_company || formData.company || '',
    company:
      formData.company_name || formData.interview_company || formData.company || '',
    scheduled_date: normDate || '',
    schedule_date: normDate || '',
    interview_date: normDate || '',
    reschedule_date: normDate || '',
    scheduled_time: normTime || '',
    schedule_time: normTime || '',
    interview_time: normTime || rescheduleIso || '',
    reschedule_time: normTime || '',
    job_id: formData.job_id || '',
    job_title: formData.job_title || formData.role || '',
    role: formData.job_title || formData.role || '',
    status: formData.status || 'pending',
    notes: formData.notes || '',
    reason: formData.reason || '',
    is_reschedule: true,
  };

  if (formData.id || formData.record_id) {
    payload.id = formData.id || formData.record_id;
    payload.record_id = formData.record_id || formData.id;
  }

  if (isMaster && formData.scheduler_id) {
    payload.scheduler_id = formData.scheduler_id;
  }

  return payload;
};

/**
 * Build Multipart FormData for candidate file upload
 */
export const buildCandidateUploadFormData = (file, schedulerId = '') => {
  const formData = new FormData();
  formData.append('file', file);
  if (schedulerId) {
    formData.append('scheduler_id', schedulerId);
  }
  return formData;
};
