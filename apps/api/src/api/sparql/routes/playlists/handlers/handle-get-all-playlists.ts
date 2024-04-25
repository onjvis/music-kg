import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { getAllPlaylists } from '../features';

export const handleGetAllPlaylists = async (req: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const playlists: string[] = await getAllPlaylists(origin);
    res.status(200).send(playlists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
