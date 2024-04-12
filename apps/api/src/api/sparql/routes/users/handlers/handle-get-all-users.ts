import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { getAllUsers } from '../features';

export const handleGetAllUsers = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const users: string[] = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
