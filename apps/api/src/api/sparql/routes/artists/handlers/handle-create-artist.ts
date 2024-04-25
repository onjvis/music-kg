import { Request, Response } from 'express';

import { CreateArtistRequest, DataOrigin, ErrorResponse } from '@music-kg/data';

import { artistExists, createArtist } from '../features';

export const handleCreateArtist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateArtistRequest = req.body as CreateArtistRequest;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    // Will not create a new entity if there is already the entity with the same external ID
    if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
      if (await artistExists(body.externalUrls, origin)) {
        res.status(400).send({ message: 'The artist already exists in the RDF database.' });
        return;
      }
    }

    const createdIri: string = await createArtist(body, origin);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
