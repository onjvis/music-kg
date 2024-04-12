import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { getAllAlbums } from '../features';

export const handleGetAllAlbums = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const albums: string[] = await getAllAlbums();
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
