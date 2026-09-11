import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";

export async function getJobsApi(params = {}) {
  const url = getAPIMap("jobsList");
  if (!url) return { data: [] };
  const response = await api.get(url, { params });
  return response.data;
}

export async function getCompaniesApi(params = {}) {
  const url = getAPIMap("companiesList");
  if (!url) return { data: [] };
  const response = await api.get(url, { params });
  return response.data;
}

export async function getNextJobIdApi() {
  const url = getAPIMap("nextJobId");
  if (!url) return { next_job_id: 1 };
  const response = await api.get(url);
  return response.data;
}

export async function createJobApi(data) {
  const url = getAPIMap("createJob");
  if (!url) throw new Error("API URL not configured for createJob");
  const response = await api.post(url, data);
  return response.data;
}

export async function getJobDetailApi(jobId) {
  const url = getAPIMap("jobDetail").replace(":jobId", jobId);
  if (!url) throw new Error("API URL not configured for jobDetail");
  const response = await api.get(url);
  return response.data;
}

export async function updateJobApi(jobId, data) {
  const url = getAPIMap("updateJob").replace(":jobId", jobId);
  if (!url) throw new Error("API URL not configured for updateJob");
  const response = await api.patch(url, data);
  return response.data;
}

export async function deleteJobApi(jobId) {
  const url = getAPIMap("deleteJob").replace(":jobId", jobId);
  if (!url) throw new Error("API URL not configured for deleteJob");
  const response = await api.delete(url);
  return response.data;
}
