import axios, { AxiosInstance } from 'axios';

import { ACCESS_TOKEN_KEY } from '../models/local-storage.constants';

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;
