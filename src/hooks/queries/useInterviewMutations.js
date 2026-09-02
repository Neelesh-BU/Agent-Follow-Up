import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInterviewApi,
  updateInterviewApi,
  rescheduleInterviewApi,
  deleteInterviewApi,
  callNowApi,
  uploadCandidatesApi,
  runSchedulerApi,
} from '@/lib/api/interviews/interviews.api';
import {
  PIPELINE_TABLE_QUERY_KEY,
  VIEW_RECORD_QUERY_KEY,
} from './useDashboardQuery';

export function useInterviewMutations() {
  const queryClient = useQueryClient();

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['summary_cards'] });
    queryClient.invalidateQueries({ queryKey: ['pipeline_flow'] });
    queryClient.invalidateQueries({ queryKey: [PIPELINE_TABLE_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [VIEW_RECORD_QUERY_KEY] });
  };

  const createInterviewMutation = useMutation({
    mutationFn: createInterviewApi,
    onSuccess: invalidateDashboard,
  });

  const updateInterviewMutation = useMutation({
    mutationFn: updateInterviewApi,
    onSuccess: invalidateDashboard,
  });

  const rescheduleInterviewMutation = useMutation({
    mutationFn: rescheduleInterviewApi,
    onSuccess: invalidateDashboard,
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: deleteInterviewApi,
    onSuccess: invalidateDashboard,
  });

  const callNowMutation = useMutation({
    mutationFn: callNowApi,
    onSuccess: invalidateDashboard,
  });

  const uploadCandidatesMutation = useMutation({
    mutationFn: uploadCandidatesApi,
    onSuccess: invalidateDashboard,
  });

  const runSchedulerMutation = useMutation({
    mutationFn: runSchedulerApi,
    onSuccess: invalidateDashboard,
  });

  return {
    createInterviewMutation,
    updateInterviewMutation,
    rescheduleInterviewMutation,
    deleteInterviewMutation,
    callNowMutation,
    uploadCandidatesMutation,
    runSchedulerMutation,
    invalidateDashboard,
  };
}

export default useInterviewMutations;
