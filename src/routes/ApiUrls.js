export const APIMapping = {
  // Auth APIs
  login: '/v1/auth/login',
  register: '/v1/auth/register',
  logout: '/v1/auth/logout',
  me: '/v1/auth/me',
  forgotPassword: '/v1/auth/password-reset/request',
  resetPassword: '/v1/auth/password-reset/confirm',

  // Interviews APIs
  interviews: '/v1/interviews',
  interviewById: '/v1/interviews/{id}',
  rescheduleInterview: '/v1/interviews/reschedule',
  rescheduleInterviewById: '/v1/interviews/{id}/reschedule',
  callNow: '/v1/interviews/{id}/call-now',
  uploadCandidates: '/v1/interviews/upload',
  exportCsv: '/v1/export/interviews.csv',
  schedulerRun: '/v1/scheduler/run',

  // Scheduler Management APIs
  schedulers: '/v1/users/schedulers',
  schedulerById: '/v1/users/schedulers/{id}',
  inviteScheduler: '/v1/users/schedulers/{id}/invite',
  activateScheduler: '/v1/users/schedulers/{id}/activate',

  // User Profile & Session APIs
  updateProfile: '/v1/users/me',
  switchSessionUser: '/v1/users/session',

  // Jobs APIs
  jobsList: '/v1/jobs/listJob',
  companiesList: '/v1/jobs/listcompanies',

  // Pipeline Details Table
  pipelineListTable: '/v1/state/pipeline-table',
  viewRecord: '/v1/state/view-record',
  
  // Dashboard Analytics APIs
  summaryCards: '/v1/interviews/summary-cards',
  pipelineFlow: '/v1/interviews/pipeline-flow',

  // Scheduler Accounts Overview
  schedulerAccountsOverview: '/v1/scheduler/accounts-overview',
};

/**
 * Helper to get the full API path by name
 * @param {string} name - Key in APIMapping
 * @returns {string}
 */
export function getAPIMap(name) {
  const endpoint = APIMapping[name] || '';
  return endpoint;
}

export default getAPIMap;
