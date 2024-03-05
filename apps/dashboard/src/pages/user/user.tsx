import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GetUserResponse } from '@music-kg/data';

import { AlertData } from '../../components/alert/models/alert-data.model';
import ErrorAlert from '../../components/alert/error-alert';
import { useCurrentUser } from '../../contexts/current-user.context';
import { useToken } from '../../hooks/use-token';
import { AppRoute } from '../../models/enums/app-route.enum';
import { ApiUrl } from '../../models/api-route.model';
import httpClient from '../../services/http-client';
import CreateProfile from './components/create-profile';
import UserProfile from './components/user-profile';

export const User = () => {
  const [userProfile, setUserProfile] = useState<GetUserResponse>({ email: '', id: '', name: '' });
  const [alertData, setAlertData] = useState<AlertData>();
  const { currentUser, removeCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { removeToken } = useToken();

  useEffect(() => {
    const url = `${ApiUrl.SPARQL_USERS}/${currentUser?.id}`;

    httpClient
      .get<GetUserResponse>(url)
      .then((response) => {
        setUserProfile(response?.data);
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error?.response?.status !== 404) {
          setAlertData({ type: 'error', message: 'Profile data loading failed.' });
        }
      });
  }, [currentUser]);

  const logOutHandler = () => {
    removeCurrentUser();
    removeToken();
    navigate(AppRoute.HOME);
  };

  return (
    <div className="flex w-1/2 flex-grow flex-col gap-4 self-center rounded-lg border-2 bg-white p-8">
      <div className="flex flex-row items-center justify-between">
        <h1>Your profile</h1>
        <button className="btn-primary" onClick={logOutHandler}>
          Log out
        </button>
      </div>

      {alertData?.type === 'error' ? (
        <ErrorAlert message={alertData?.message} />
      ) : userProfile?.email && userProfile?.id ? (
        <UserProfile userProfile={userProfile} />
      ) : (
        <CreateProfile id={currentUser?.id} email={currentUser?.email} />
      )}
    </div>
  );
};

export default User;
