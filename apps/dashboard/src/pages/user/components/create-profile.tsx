import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { AlertData } from '../../../components/alert/models/alert-data.model';
import { ErrorAlert } from '../../../components/alert/error-alert';
import { FormErrorAlert } from '../../../components/alert/form-error-alert';
import { SuccessAlert } from '../../../components/alert/success-alert';
import { useCurrentUser } from '../../../contexts/current-user.context';
import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';

type CreateProfileProps = {
  id: string;
  email: string;
};

type CreateProfileFormType = {
  name: string;
};

export const CreateProfile = ({ id, email }: CreateProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProfileFormType>();
  const [alertData, setAlertData] = useState<AlertData>();
  const { changeCurrentUser } = useCurrentUser();

  const onSubmit: SubmitHandler<CreateProfileFormType> = async (requestData: CreateProfileFormType) => {
    try {
      await httpClient.post(ApiUrl.SPARQL_USERS, { id, email, name: requestData?.name });
      reset();
      setAlertData({ type: 'success', message: 'Profile successfully created.' });
      setTimeout(() => changeCurrentUser({ id, email, hasProfile: true }), 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}
      {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}

      <form className="flex flex-row items-center justify-between gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" {...register('name', { required: true })} />
          {errors.name && <FormErrorAlert message="Name is required." />}
        </div>

        <button className="btn-primary" type="submit">
          Create profile
        </button>
      </form>
    </div>
  );
};
