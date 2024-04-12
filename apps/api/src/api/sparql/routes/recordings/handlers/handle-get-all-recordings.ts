import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { getAllRecordings } from '../features';

export const handleGetAllRecordings = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const recordings: string[] = await getAllRecordings();
    res.status(200).send(recordings);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
