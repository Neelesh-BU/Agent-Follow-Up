import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSchedulersApi,
  getSchedulerAccountsOverviewApi,
  addSchedulerApi,
  resendSchedulerInviteApi,
  deactivateSchedulerApi,
  activateSchedulerApi,
  deleteSchedulerApi,
} from '@/lib/api/schedulers/schedulers.api';
import { normalizeUser } from '@/utils/roles';
export const SCHEDULERS_QUERY_KEY = 'schedulers_list';
export const SCHEDULER_ACCOUNTS_OVERVIEW_QUERY_KEY = 'scheduler_accounts_overview';

export function useSchedulerAccountsOverviewQuery(params = {}, options = {}) {
  const { search, from, to, enabled: paramsEnabled, ...restParams } = params;
  const isEnabled =
    options.enabled !== undefined
      ? options.enabled
      : paramsEnabled !== undefined
        ? paramsEnabled
        : true;

  return useQuery({
    queryKey: [
      SCHEDULER_ACCOUNTS_OVERVIEW_QUERY_KEY,
      search || '',
      from || '',
      to || '',
    ],
    queryFn: () => getSchedulerAccountsOverviewApi({ search, from, to, ...restParams }),
    ...options,
    enabled: isEnabled,
  });
}

const extractArray = (res, keys = []) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  for (const k of keys) {
    if (Array.isArray(res[k])) return res[k];
    if (Array.isArray(res.data?.[k])) return res.data[k];
  }
  return [];
};

export function useSchedulersQuery(params = {}, options = {}) {
  const { page = 1, limit = 10, enabled: paramsEnabled, ...restParams } = params;
  const isEnabled =
    options.enabled !== undefined
      ? options.enabled
      : paramsEnabled !== undefined
        ? paramsEnabled
        : true;

  return useQuery({
    queryKey: [SCHEDULERS_QUERY_KEY, page, limit],
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
    ...options,
    enabled: isEnabled,
    queryFn: async () => {
      let schedulersList = [];
      let totalResults = 0;
      let totalPages = 1;

      // Fetch from dedicated Schedulers API (/v1/users/schedulers?page=...&limit=...)
      try {
        const schedulersRes = await getSchedulersApi({ page, limit });
        const extracted = extractArray(schedulersRes, ['users', 'schedulers']);
        if (extracted.length > 0) {
          schedulersList = extracted;
          totalResults =
            schedulersRes.totalResults ??
            schedulersRes.total ??
            schedulersRes.count ??
            extracted.length;
          totalPages =
            schedulersRes.totalPages ?? Math.ceil(totalResults / limit) ?? 1;
        }
      } catch (err) {
        console.warn('Could not fetch from /v1/users/schedulers', err);
      }

      // Normalize all scheduler records
      const normalizedSchedulers = schedulersList.map(normalizeUser);

      return {
        schedulers: normalizedSchedulers,
        totalResults: totalResults || normalizedSchedulers.length,
        totalPages: totalPages || 1,
        page,
        limit,
      };
    },
    ...options,
  });
}

export function useSchedulerMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: [SCHEDULERS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [SCHEDULER_ACCOUNTS_OVERVIEW_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: ['summary_cards'] });
    queryClient.invalidateQueries({ queryKey: ['pipeline_flow'] });
  };

  const addSchedulerMutation = useMutation({
    mutationFn: addSchedulerApi,
    onSuccess: invalidateAll,
  });

  const resendInviteMutation = useMutation({
    mutationFn: resendSchedulerInviteApi,
    onSuccess: invalidateAll,
  });

  const deactivateSchedulerMutation = useMutation({
    mutationFn: deactivateSchedulerApi,
    onSuccess: invalidateAll,
  });

  const activateSchedulerMutation = useMutation({
    mutationFn: activateSchedulerApi,
    onSuccess: invalidateAll,
  });

  return {
    addSchedulerMutation,
    resendInviteMutation,
    deactivateSchedulerMutation,
    activateSchedulerMutation,
    deleteSchedulerMutation: deactivateSchedulerMutation,
    invalidateSchedulers: invalidateAll,
  };
}
