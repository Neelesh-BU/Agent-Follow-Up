import {
  getSummaryCardsApi,
  getPipelineFlowApi,
  createInterviewApi,
  updateInterviewApi,
  rescheduleInterviewApi,
  deleteInterviewApi,
  callNowApi,
  uploadCandidatesApi,
  runSchedulerApi,
  getExportUrl,
} from '@/lib/api/interviews/interviews.api';

export const interviewService = {
  getSummaryCards: getSummaryCardsApi,
  getPipelineFlow: getPipelineFlowApi,
  createInterview: createInterviewApi,
  updateInterview: (id, payload) => updateInterviewApi({ id, payload }),
  rescheduleInterview: (id, payload) =>
    rescheduleInterviewApi({ id, payload }),
  deleteInterview: deleteInterviewApi,
  callNow: callNowApi,
  uploadCandidates: (file, schedulerId) =>
    uploadCandidatesApi({ file, schedulerId }),
  runScheduler: runSchedulerApi,
  getExportUrl,
};

export default interviewService;
