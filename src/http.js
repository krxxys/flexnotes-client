import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Refresh token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(
          'http://localhost:3001/auth/refresh',
          {
            refresh_token: refreshToken,
          },
        );
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login
      }
    }
    return Promise.reject(error);
  },
);

const isAuth = () => {
  if (
    !localStorage.getItem('access_token') ||
    !localStorage.getItem('refresh_token')
  ) {
    return false;
  }
  //check the check request
  api.get('/auth/check').then((res) => {
    if (res.status === 202) return true;
    else return false;
  });

  return true;
};

import { useRouter } from 'vue-router';
const logout = () => {
  const router = useRouter();

  localStorage['access_token'] = "";
  localStorage['refresh_token'] = ""; 
  localStorage['username'] = "";
  window.location.href = "/login";
};

export { isAuth, logout, api };
