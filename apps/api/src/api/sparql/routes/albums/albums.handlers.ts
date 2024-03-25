import { Request, Response } from 'express';

import { CreateAlbumRequest, ErrorResponse, UpdateAlbumRequest } from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { runAlbumCreationChecks } from './albums.helpers';
import { createAlbum } from './create-album';
import { deleteAlbum } from './delete-album';
import { getAlbum } from './get-album';
import { getAllAlbums } from './get-all-albums';
import { updateAlbum } from './update-album';

export const createAlbumHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateAlbumRequest = req.body as CreateAlbumRequest;

  if (!body?.id) {
    res.status(400).send({ message: 'The request body is missing id.' });
    return;
  }

  const creationChecksErrorMessage: string = runAlbumCreationChecks(body);

  if (creationChecksErrorMessage) {
    res.status(400).send({ message: creationChecksErrorMessage });
    return;
  }

  try {
    const createdIri: string = await createAlbum(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const deleteAlbumHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteAlbum(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getAlbumHandler = async (req: Request, res: Response<MusicAlbum | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    const album: MusicAlbum = await getAlbum(id);

    !album
      ? res.status(404).send({ message: `The album with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...album, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getAllAlbumsHandler = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const albums: string[] = await getAllAlbums();
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const updateAlbumHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: UpdateAlbumRequest = req.body as UpdateAlbumRequest;
  const id: string = req.params.id;

  try {
    const album: MusicAlbum = await getAlbum(id);

    if (!album) {
      const creationChecksErrorMessage: string = runAlbumCreationChecks(body);

      if (creationChecksErrorMessage) {
        res.status(400).send({ message: creationChecksErrorMessage });
        return;
      }

      const createdIri: string = await createAlbum({
        id,
        albumProductionType: body.albumProductionType,
        albumReleaseType: body.albumReleaseType,
        byArtist: body.byArtist,
        datePublished: body.datePublished,
        image: body.image,
        name: body.name,
        numTracks: body.numTracks,
        sameAs: body.sameAs,
        track: body.track,
      });
      res.set('Location', createdIri).sendStatus(201);
      return;
    }

    await updateAlbum(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
