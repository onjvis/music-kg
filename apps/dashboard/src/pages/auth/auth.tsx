import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CurrentUserResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@music-kg/data';

import { AlertData } from '../../components/alert/models/alert-data.model';
import ErrorAlert from '../../components/alert/error-alert';
import FormErrorAlert from '../../components/alert/form-error-alert';
import SuccessAlert from '../../components/alert/success-alert';
import { useCurrentUser } from '../../contexts/current-user.context';
import { ApiUrl } from '../../models/api-route.model';
import AuthModeToggle from './components/auth-mode-toggle';
import AuthModeToggleOption from './components/auth-mode-toggle-option';
import { AuthMode } from './models/auth-mode.type';
import { useToken } from '../../hooks/use-token';
import httpClient from '../../services/http-client';

export const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterRequest | LoginRequest>();
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [alertData, setAlertData] = useState<AlertData>();
  const { changeCurrentUser } = useCurrentUser();
  const { saveToken } = useToken();

  const onSubmit: SubmitHandler<RegisterRequest | LoginRequest> = async (
    requestData: RegisterRequest | LoginRequest
  ): Promise<void> => {
    const url: string = authMode === 'register' ? ApiUrl.AUTH_REGISTER : ApiUrl.AUTH_LOGIN;
    console.log(url);

    try {
      if (authMode === 'register') {
        const { data } = await httpClient.post<RegisterResponse>(url, requestData);
        setAlertData({ type: 'success', message: `User ${data?.email} successfully registered.` });
        setAuthMode('login');
      } else {
        const loginResponse = await httpClient.post<LoginResponse>(url, requestData);
        saveToken(loginResponse?.data?.token);
        setAlertData({ type: 'success', message: 'Login successful.' });

        const currentUserResponse = await httpClient.get<CurrentUserResponse>(ApiUrl.CURRENT_USER);
        changeCurrentUser({ id: currentUserResponse?.data?.id, email: currentUserResponse?.data?.email });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }

    reset();
    setTimeout(() => setAlertData(undefined), 1500);
  };

  return (
    <div className="flex w-1/3 flex-col self-center rounded-lg border-2 bg-white">
      <AuthModeToggle>
        <AuthModeToggleOption
          authMode="register"
          className="rounded-tl-lg"
          handleClick={() => setAuthMode('register')}
          isSelected={authMode === 'register'}
        />
        <AuthModeToggleOption
          authMode="login"
          className="rounded-tr-lg"
          handleClick={() => setAuthMode('login')}
          isSelected={authMode === 'login'}
        />
      </AuthModeToggle>

      <div className="flex flex-col gap-4 p-8">
        {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}
        {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}

        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" {...register('email', { required: true })} />
            {errors.email && <FormErrorAlert message="E-mail is required." />}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register('password', { required: true })} />
            {errors.password && <FormErrorAlert message="Password is required." />}
          </div>

          <button className="btn-primary w-1/2 capitalize" type="submit">
            {authMode}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
