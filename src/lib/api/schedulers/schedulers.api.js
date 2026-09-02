import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";
import { buildAddSchedulerPayload } from "./schedulers.payload";

export async function getSchedulersApi(params = {}) {
  const response = await api.get(getAPIMap("schedulers"), { params });
  return response.data;
}

export async function getSchedulerAccountsOverviewApi(params = {}) {
  const response = await api.get(getAPIMap("schedulerAccountsOverview"), { params });
  return response.data;
}

export async function addSchedulerApi(formData) {
  const payload = buildAddSchedulerPayload(formData);
  const response = await api.post(getAPIMap("schedulers"), payload);
  return response.data;
}

export async function resendSchedulerInviteApi(userId) {
  const url = getAPIMap("inviteScheduler").replace("{id}", userId);
  const response = await api.post(url);
  return response.data;
}

export async function deactivateSchedulerApi(userId) {
  const url = getAPIMap("schedulerById").replace("{id}", userId);
  try {
    const response = await api.delete(url, {
      data: { status: "2", role: "2", is_active: false },
    });
    return response.data;
  } catch (err) {
    try {
      const patchResponse = await api.patch(url, {
        status: "2",
        is_active: false,
      });
      return patchResponse.data;
    } catch (patchErr) {
      throw err;
    }
  }
}

export async function activateSchedulerApi(userId) {
  const activateUrl = getAPIMap("activateScheduler").replace("{id}", userId);
  try {
    const response = await api.post(activateUrl);
    return response.data;
  } catch (err) {
    try {
      const patchUrl = getAPIMap("schedulerById").replace("{id}", userId);
      const patchResponse = await api.patch(patchUrl, {
        status: "1",
      });
      return patchResponse.data;
    } catch (patchErr) {
      throw err;
    }
  }
}

export const deleteSchedulerApi = deactivateSchedulerApi;
