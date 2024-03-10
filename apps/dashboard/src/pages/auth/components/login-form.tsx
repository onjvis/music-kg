import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { CurrentUserResponse, LoginRequest, LoginResponse } from '@music-kg/data';

import { AlertData } from '../../../components/alert/models/alert-data.model';
import ErrorAlert from '../../../components/alert/error-alert';
import FormErrorAlert from '../../../components/alert/form-error-alert';
import { useCurrentUser } from '../../../contexts/current-user.context';
import { useToken } from '../../../hooks/use-token';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginRequest>();
  const [alertData, setAlertData] = useState<AlertData>();
  const { changeCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { saveToken } = useToken();

  const onSubmit: SubmitHandler<LoginRequest> = async (requestData: LoginRequest): Promise<void> => {
    try {
      const loginResponse = await httpClient.post<LoginResponse>(ApiUrl.AUTH_LOGIN, requestData);
      saveToken(loginResponse?.data?.token);

      const currentUserResponse = await httpClient.get<CurrentUserResponse>(ApiUrl.CURRENT_USER);
      changeCurrentUser({ id: currentUserResponse?.data?.id, email: currentUserResponse?.data?.email });

      navigate(AppRoute.USER);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }

    reset();
    setTimeout(() => setAlertData(undefined), 3000);
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}

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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
