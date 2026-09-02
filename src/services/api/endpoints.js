import { APIMapping, getAPIMap } from '@/routes/ApiUrls';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: getAPIMap('login'),
    REGISTER: getAPIMap('register'),
    LOGOUT: getAPIMap('logout'),
    ME: getAPIMap('me'),
    PASSWORD_RESET_REQUEST: getAPIMap('forgotPassword'),
    PASSWORD_RESET_CONFIRM: getAPIMap('resetPassword'),
  },
  STATE: getAPIMap('state'),
  INTERVIEWS: {
    BASE: getAPIMap('interviews'),
    BY_ID: (id) => getAPIMap('interviewById').replace('{id}', id),
    RESCHEDULE: getAPIMap('rescheduleInterview') || '/v1/interviews/reschedule',
    RESCHEDULE_BY_ID: (id) =>
      getAPIMap('rescheduleInterviewById').replace('{id}', id),
    CALL_NOW: (id) => getAPIMap('callNow').replace('{id}', id),
    UPLOAD: getAPIMap('uploadCandidates'),
    EXPORT: getAPIMap('exportCsv'),
  },
  SCHEDULER_RUN: getAPIMap('schedulerRun'),
  SCHEDULERS: {
    BASE: getAPIMap('schedulers'),
    BY_ID: (id) => getAPIMap('schedulerById').replace('{id}', id),
    INVITE: (id) => getAPIMap('inviteScheduler').replace('{id}', id),
  },
  USERS: {
    BASE: '/v1/users',
    ME: getAPIMap('updateProfile'),
    SESSION: getAPIMap('switchSessionUser'),
  },
};

export { APIMapping, getAPIMap };
export default API_ENDPOINTS;
