import { Request, Response } from 'express';

import { CreateArtistRequest, ErrorResponse } from '@music-kg/data';

import { artistExists, createArtist } from '../features';

export const handleCreateArtist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateArtistRequest = req.body as CreateArtistRequest;

  if (!body?.name) {
    res.status(400).send({ message: 'The request body is missing required property name.' });
    return;
  }

  try {
    // Will not create a new entity if there is already the entity with the same external ID
    if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
      if (await artistExists(body?.externalUrls)) {
        res.status(400).send({ message: 'The artist already exists in the RDF database.' });
        return;
      }
    }

    const createdIri: string = await createArtist(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
