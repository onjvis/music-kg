import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { getAllRecordings } from '../features';

export const handleGetAllRecordings = async (req: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const recordings: string[] = await getAllRecordings(origin);
    res.status(200).send(recordings);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
