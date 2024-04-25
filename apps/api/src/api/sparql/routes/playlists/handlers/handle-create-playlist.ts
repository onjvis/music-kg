import { Request, Response } from 'express';

import { CreatePlaylistRequest, DataOrigin, ErrorResponse } from '@music-kg/data';

import { createPlaylist, playlistExists } from '../features';

export const handleCreatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreatePlaylistRequest = req.body as CreatePlaylistRequest;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
      if (await playlistExists(body.externalUrls, origin)) {
        res.status(400).send({ message: 'The artist already exists in the RDF database.' });
        return;
      }
    }

    const createdIri: string = await createPlaylist(body, origin);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
