import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobsApi,
  getCompaniesApi,
  getNextJobIdApi,
  createJobApi,
  getJobDetailApi,
  updateJobApi,
  deleteJobApi,
} from "@/lib/api/jobs/jobs.api";

export const jobKeys = {
  all: ["jobs"],
  list: (params) => [...jobKeys.all, "list", params],
  companies: (params) => [...jobKeys.all, "companies", params],
  nextId: () => [...jobKeys.all, "next-id"],
  detail: (jobId) => [...jobKeys.all, "detail", jobId],
};

export function useJobsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => getJobsApi(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useCompaniesQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: jobKeys.companies(params),
    queryFn: () => getCompaniesApi(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useNextJobIdQuery(options = {}) {
  return useQuery({
    queryKey: jobKeys.nextId(),
    queryFn: () => getNextJobIdApi(),
    staleTime: 0,
    ...options,
  });
}

export function useJobDetailQuery(jobId, options = {}) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJobDetailApi(jobId),
    enabled: !!jobId,
    ...options,
  });
}

export function useCreateJobMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newJob) => createJobApi(newJob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
    ...options,
  });
}

export function useUpdateJobMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }) => updateJobApi(jobId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.jobId) });
    },
    ...options,
  });
}

export function useDeleteJobMutation(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => deleteJobApi(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
    ...options,
  });
}
