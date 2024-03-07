import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { RegisterRequest, RegisterResponse } from '@music-kg/data';

import { AlertData } from '../../../components/alert/models/alert-data.model';
import ErrorAlert from '../../../components/alert/error-alert';
import FormErrorAlert from '../../../components/alert/form-error-alert';
import SuccessAlert from '../../../components/alert/success-alert';
import { ApiUrl } from '../../../models/api-route.model';
import httpClient from '../../../services/http-client';

type RegisterFormProps = {
  handleAfterRegister: () => void;
};

export const RegisterForm = ({ handleAfterRegister }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterRequest>();
  const [alertData, setAlertData] = useState<AlertData>();

  const onSubmit: SubmitHandler<RegisterRequest> = async (requestData: RegisterRequest): Promise<void> => {
    try {
      const { data } = await httpClient.post<RegisterResponse>(ApiUrl.AUTH_REGISTER, requestData);
      setAlertData({ type: 'success', message: `User ${data?.email} successfully registered.` });
      handleAfterRegister();
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

        <button className="btn-primary w-1/2 capitalize" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
