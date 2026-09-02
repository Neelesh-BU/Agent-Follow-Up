import api from "@/services/api/axios";
import getAPIMap from "@/routes/ApiUrls";

export async function getJobsApi(params = {}) {
  const response = await api.get(getAPIMap("jobsList"), { params });
  return response.data;
}

export async function getCompaniesApi(params = {}) {
  const response = await api.get(getAPIMap("companiesList"), { params });
  return response.data;
}
