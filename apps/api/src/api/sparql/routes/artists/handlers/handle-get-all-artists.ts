import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { getAllArtists } from '../features';

export const handleGetAllArtists = async (req: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const artists: string[] = await getAllArtists(origin);
    res.status(200).send(artists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
