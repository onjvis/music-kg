import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { CurrentUserResponse } from '@music-kg/data';

import { useToken } from '../hooks/use-token';
import { ApiUrl } from '../models/api-route.model';
import httpClient from '../services/http-client';

type CurrentUser = {
  id: string;
  email: string;
};

type CurrentUserContextType = {
  currentUser: CurrentUser;
  changeCurrentUser: (newUser: CurrentUser) => void;
  removeCurrentUser: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const useCurrentUser = (): CurrentUserContextType => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser has to be used within CurrentUserProvider!');
  }
  return context;
};

type CurrentUserProviderProps = {
  children: ReactNode;
};

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ id: '', email: '' });
  const { token } = useToken();

  const getCurrentUser = useCallback(() => {
    if (token) {
      httpClient
        .get<CurrentUserResponse>(ApiUrl.CURRENT_USER)
        .then((response) => setCurrentUser({ id: response?.data?.id, email: response?.data?.email }))
        .catch();
    }
  }, [token]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const changeCurrentUser = (newUser: CurrentUser): void => setCurrentUser(newUser);

  const removeCurrentUser = (): void => changeCurrentUser({ id: '', email: '' });

  return (
    <CurrentUserContext.Provider value={{ currentUser, changeCurrentUser, removeCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
