import {
  updateProfileApi,
  switchSessionUserApi,
} from '@/lib/api/users/users.api';

export const userService = {
  updateProfile: updateProfileApi,
  switchSessionUser: switchSessionUserApi,
};

export default userService;
