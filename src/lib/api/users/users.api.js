import api from '@/services/api/axios';
import getAPIMap from '@/routes/ApiUrls';
import {
  buildProfileUpdatePayload,
  buildSessionSwitchPayload,
} from './users.payload';

export async function updateProfileApi(data) {
  const payload = buildProfileUpdatePayload(data);
  const response = await api.patch(getAPIMap('updateProfile'), payload);
  return response.data;
}

export async function switchSessionUserApi(userId) {
  const payload = buildSessionSwitchPayload(userId);
  const response = await api.post(getAPIMap('switchSessionUser'), payload);
  return response.data;
}
