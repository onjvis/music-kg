import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { getAllArtists } from '../features';

export const handleGetAllArtists = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const artists: string[] = await getAllArtists();
    res.status(200).send(artists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
