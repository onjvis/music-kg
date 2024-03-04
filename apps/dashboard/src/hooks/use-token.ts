import { ACCESS_TOKEN_KEY } from '../models/local-storage.constants';
import { useState } from 'react';

export type UseTokenType = {
  removeToken: () => void;
  saveToken: (accessToken: string) => void;
  token: string;
};

export const useToken = (): UseTokenType => {
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN_KEY) ?? '');

  const removeToken = (): void => localStorage.removeItem(ACCESS_TOKEN_KEY);

  const saveToken = (accessToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    setToken(accessToken);
  };

  return { removeToken, saveToken, token };
};
