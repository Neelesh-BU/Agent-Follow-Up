export const APIMapping = {
  // Auth Route
  login: '/v1/auth/login',
  logout: '/v1/auth/logout',
  passwordResetRequest: '/v1/auth/password-reset/request',
  passwordResetConfirm: '/v1/auth/password-reset/confirm',

  // Export Route
  interviewExcel: '/v1/export/interviews.xlsx',

  // Interview Route
  createInterview: '/v1/interview/create-interview',
  rescheduleInterview: '/v1/interview/reschedule',
  updateInterview: '/v1/interview/:interviewId/update',
  deleteInterview: '/v1/interview/:interviewId/delete',
  callNow: '/v1/interview/:interviewId/call-now',

  // Pipeline Route
  listTableRecords: '/v1/pipeline/list-table-records',
  viewTableRecord: '/v1/pipeline/view-table-records',
  getPipelineFlow: '/v1/pipeline/pipeline-flow',
  getSummaryCards: '/v1/pipeline/summary-cards',

  // Scheduler Route
  getAccountsOverview: '/v1/scheduler/accounts-overview',
  updateProfile: '/v1/scheduler/update-profile',
  getSchedulers: '/v1/scheduler/get-schedulers',
  resendInvite: '/v1/scheduler/:userId/invite',
  activateScheduler: '/v1/scheduler/:userId/activate',
  deleteScheduler: '/v1/scheduler/:userId/delete',

  // Job Route
  jobsList: '/v1/jobs/job-list',
  createJob: '/v1/jobs/job-create',
  nextJobId: '/v1/jobs/next-id',
  companiesList: '/v1/jobs/companies',
  jobDetail: '/v1/jobs/:jobId/detail',
  updateJob: '/v1/jobs/:jobId/update',
  deleteJob: '/v1/jobs/:jobId/delete',

  // Upload Route
  uploadCandidates: '/v1/upload/upload-candidates',
  getUploadHistory: '/v1/upload/history',
  getUploadFailures: '/v1/upload/history/:uploadId/failures',
};

/**
 * Helper to get the full API path by name
 * @param {string} name - Key in APIMapping
 * @returns {string}
 */
export function getAPIMap(name) {
  return APIMapping[name] || '';
}

export default getAPIMap;
