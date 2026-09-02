import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginApi,
  registerApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@/lib/api/auth/auth.api';
import {
  updateProfileApi,
  switchSessionUserApi,
} from '@/lib/api/users/users.api';
import { SCHEDULERS_QUERY_KEY } from './useSchedulerQueries';

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginApi,
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordApi,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordApi,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['summary_cards'] });
    },
  });

  const switchSessionUserMutation = useMutation({
    mutationFn: switchSessionUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['summary_cards'] });
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    updateProfileMutation,
    switchSessionUserMutation,
  };
}

export default useAuthMutations;
