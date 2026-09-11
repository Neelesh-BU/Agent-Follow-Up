import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";
import { buildAddSchedulerPayload } from "./schedulers.payload";

export async function getSchedulersApi(params = {}) {
  const url =
    getAPIMap("getSchedulers") ||
    getAPIMap("schedulers") ||
    "/v1/scheduler/get-schedulers";
  const response = await api.get(url, { params });
  return response.data;
}

export async function getSchedulerAccountsOverviewApi(params = {}) {
  const url =
    getAPIMap("getAccountsOverview") ||
    getAPIMap("schedulerAccountsOverview") ||
    "/v1/scheduler/accounts-overview";
  const response = await api.get(url, { params });
  return response.data;
}

export async function addSchedulerApi(formData) {
  const url =
    getAPIMap("createScheduler") ||
    getAPIMap("addScheduler") ||
    "/v1/scheduler/create-scheduler";
  const payload = buildAddSchedulerPayload(formData);
  const response = await api.post(url, payload);
  return response.data;
}

export async function resendSchedulerInviteApi(userId) {
  const endpoint =
    getAPIMap("resendInvite") ||
    getAPIMap("inviteScheduler") ||
    "/v1/scheduler/:userId/invite";
  const url = endpoint.replace("{id}", userId).replace(":userId", userId);
  const response = await api.post(url);
  return response.data;
}

export async function deactivateSchedulerApi(userId) {
  const endpoint =
    getAPIMap("deleteScheduler") || "/v1/scheduler/:userId/delete";
  const url = endpoint.replace("{id}", userId).replace(":userId", userId);
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
    } catch {
      throw err;
    }
  }
}

export async function activateSchedulerApi(userId) {
  const activateEndpoint =
    getAPIMap("activateScheduler") || "/v1/scheduler/:userId/activate";
  const activateUrl = activateEndpoint.replace("{id}", userId).replace(":userId", userId);
  try {
    const response = await api.patch(activateUrl);
    return response.data;
  } catch {
    const fallbackResponse = await api.post(activateUrl);
    return fallbackResponse.data;
  }
}

export const deleteSchedulerApi = deactivateSchedulerApi;
