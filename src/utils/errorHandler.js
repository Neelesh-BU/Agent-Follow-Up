/**
 * Normalizes API error responses into human-readable messages
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  if (typeof error === 'string') return error;

  if (error.response) {
    const data = error.response.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (typeof data === 'string') return data;

    switch (error.response.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Requested resource not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Server returned status code ${error.response.status}`;
    }
  }

  if (error.request) {
    return 'Unable to reach the server. Please check your internet connection.';
  }

  return error.message || 'An unexpected error occurred.';
};
