import { useQuery } from "@tanstack/react-query";
import { getJobsApi, getCompaniesApi } from "@/lib/api/jobs/jobs.api";

export const jobKeys = {
  all: ["jobs"],
  list: (params) => [...jobKeys.all, "list", params],
  companies: (params) => ["companies", "list", params],
};

export function useJobsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => getJobsApi(params),
    staleTime: 5 * 60 * 1000,
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
