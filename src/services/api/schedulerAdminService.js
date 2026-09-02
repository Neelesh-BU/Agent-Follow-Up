import {
  getSchedulersApi,
  addSchedulerApi,
  resendSchedulerInviteApi,
  deleteSchedulerApi,
} from '@/lib/api/schedulers/schedulers.api';

export const schedulerAdminService = {
  getSchedulers: getSchedulersApi,
  addScheduler: addSchedulerApi,
  resendInvite: resendSchedulerInviteApi,
  deleteScheduler: deleteSchedulerApi,
};

export default schedulerAdminService;
