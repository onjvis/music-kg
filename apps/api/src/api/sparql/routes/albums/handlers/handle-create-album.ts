import { Request, Response } from 'express';

import { CreateAlbumRequest, DataOrigin, ErrorResponse } from '@music-kg/data';

import { runAlbumCreationChecks } from '../albums.helpers';
import { createAlbum } from '../features';

export const handleCreateAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateAlbumRequest = req.body as CreateAlbumRequest;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const creationChecksErrorMessage: string = await runAlbumCreationChecks(body, origin);

    if (creationChecksErrorMessage) {
      res.status(400).send({ message: creationChecksErrorMessage });
      return;
    }

    const createdIri: string = await createAlbum(body, origin);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
