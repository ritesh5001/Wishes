import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const firstMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong. Please try again.';

    error.message = firstMessage;
    return Promise.reject(error);
  },
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common.Authorization;
};

export default api;
