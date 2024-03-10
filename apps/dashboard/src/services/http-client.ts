import axios, { AxiosInstance } from 'axios';

import { HttpHeader } from '@music-kg/data';

import { ACCESS_TOKEN_KEY, SPOTIFY_ACCESS_TOKEN_KEY } from '../models/local-storage.constants';

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const spotifyToken = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config?.url?.startsWith('/spotify') && spotifyToken) {
      config.headers[HttpHeader.MUSIC_KG_SPOTIFY_AUTHORIZATION] = spotifyToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;
