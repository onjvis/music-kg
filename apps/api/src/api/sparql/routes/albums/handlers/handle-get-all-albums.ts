import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { getAllAlbums } from '../features';

export const handleGetAllAlbums = async (req: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const albums: string[] = await getAllAlbums(origin);
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
