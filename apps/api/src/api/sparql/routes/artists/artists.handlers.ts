import { Request, Response } from 'express';

import { CreateArtistRequest, ErrorResponse, UpdateArtistRequest } from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { createArtist } from './create-artist';
import { deleteArtist } from './delete-artist';
import { getAllArtists } from './get-all-artists';
import { getArtist } from './get-artist';
import { updateArtist } from './update-artist';

export const createArtistHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateArtistRequest = req.body as CreateArtistRequest;

  if (!body?.id || !body?.album || !body?.genre || !body?.image || !body?.name || !body?.sameAs || !body?.track) {
    res.status(400).send({
      message:
        'The request body is missing one or more of the following required properties: id, album, genre, image, name, sameAs, track.',
    });
    return;
  }

  try {
    const artist: MusicGroup = await getArtist(body.id);

    if (artist) {
      res.status(400).send({ message: `The playlist with id ${body.id} already exists in the RDF database.` });
      return;
    }

    const createdIri: string = await createArtist(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const deleteArtistHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteArtist(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getAllArtistsHandler = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const artists: string[] = await getAllArtists();
    res.status(200).send(artists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getArtistHandler = async (req: Request, res: Response<MusicGroup | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    const artist: MusicGroup = await getArtist(id);

    !artist
      ? res.status(404).send({ message: `The artist with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...artist, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const updateArtistHandler = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: UpdateArtistRequest = req.body as UpdateArtistRequest;
  const id: string = req.params.id;

  try {
    const artist: MusicGroup = await getArtist(id);

    if (!artist) {
      if (!body?.album || !body?.genre || !body?.image || !body?.name || !body?.sameAs || !body?.track) {
        res.status(400).send({
          message:
            'The artist does not exist in the RDF database yet, however the request body is missing one or more of the following required properties: album, artists, datePublished, duration, isrcCode, name, sameAs.',
        });
        return;
      }

      const createdIri: string = await createArtist({
        id,
        album: body.album,
        genre: body.genre,
        image: body.image,
        name: body.name,
        sameAs: body.sameAs,
        track: body.track,
      });
      res.set('Location', createdIri).sendStatus(201);
      return;
    }

    await updateArtist(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
