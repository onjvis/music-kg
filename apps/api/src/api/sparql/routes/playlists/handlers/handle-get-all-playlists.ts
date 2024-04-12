import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { getAllPlaylists } from '../features';

export const handleGetAllPlaylists = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const playlists: string[] = await getAllPlaylists();
    res.status(200).send(playlists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
