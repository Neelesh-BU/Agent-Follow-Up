import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";
import { buildAddSchedulerPayload } from "./schedulers.payload";

export async function getSchedulersApi(params = {}) {
  const url = getAPIMap("schedulers");
  if (!url) return { schedulers: [], totalResults: 0 };
  const response = await api.get(url, { params });
  return response.data;
}

export async function getSchedulerAccountsOverviewApi(params = {}) {
  const url = getAPIMap("schedulerAccountsOverview");
  if (!url) return { schedulers: [] };
  const response = await api.get(url, { params });
  return response.data;
}

export async function addSchedulerApi(formData) {
  const url = getAPIMap("schedulers");
  if (!url) return {};
  const payload = buildAddSchedulerPayload(formData);
  const response = await api.post(url, payload);
  return response.data;
}

export async function resendSchedulerInviteApi(userId) {
  const endpoint = getAPIMap("inviteScheduler");
  if (!endpoint) return {};
  const url = endpoint.replace("{id}", userId);
  const response = await api.post(url);
  return response.data;
}

export async function deactivateSchedulerApi(userId) {
  const endpoint = getAPIMap("deleteScheduler") || (getAPIMap("schedulerById") ? `${getAPIMap("schedulerById")}/delete` : "");
  if (!endpoint) return {};
  const url = endpoint.replace("{id}", userId);
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
  const activateEndpoint = getAPIMap("activateScheduler");
  if (!activateEndpoint) return {};
  const activateUrl = activateEndpoint.replace("{id}", userId);
  try {
    const response = await api.post(activateUrl);
    return response.data;
  } catch (err) {
    const fallbackEndpoint = getAPIMap("schedulerById");
    if (!fallbackEndpoint) return {};
    try {
      const patchUrl = fallbackEndpoint.replace("{id}", userId);
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
