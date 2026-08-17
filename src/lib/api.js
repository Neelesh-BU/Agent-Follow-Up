const backendOrigin = (import.meta.env.VITE_BACKEND_ORIGIN || "").trim().replace(/\/$/, "");

function backendUrl(path) {
  if (!backendOrigin) return path;
  return `${backendOrigin}${path}`;
}

async function readPayload(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function request(path, options = {}) {
  const response = await fetch(backendUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "content-type": "application/json" }),
      ...(options.headers || {})
    }
  });
  const payload = await readPayload(response).catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload === "object" && payload?.error
      ? payload.error
      : `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export function getBackendOrigin() {
  return backendOrigin || window.location.origin;
}

export function login(body) {
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function logout() {
  return request("/api/logout", { method: "POST" });
}

export function fetchState() {
  return request("/api/state");
}

export function requestPasswordReset(body) {
  return request("/api/password-reset/request", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function confirmPasswordReset(body) {
  return request("/api/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function createInterview(body) {
  return request("/api/interviews", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function uploadInterviews(formData) {
  return request("/api/interviews/upload", {
    method: "POST",
    body: formData
  });
}

export function updateInterview(id, body) {
  return request(`/api/interviews/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}

export function deleteInterview(id) {
  return request(`/api/interviews/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export function callInterviewNow(id) {
  return request(`/api/interviews/${encodeURIComponent(id)}/call-now`, {
    method: "POST"
  });
}

export function runScheduler() {
  return request("/api/scheduler/run", {
    method: "POST"
  });
}
