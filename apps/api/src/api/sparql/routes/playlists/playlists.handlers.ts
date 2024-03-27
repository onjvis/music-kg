import { Request, Response } from 'express';

import { CreatePlaylistRequest, ErrorResponse, UpdatePlaylistRequest } from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { createPlaylist } from './create-playlist';
import { deletePlaylist } from './delete-playlist';
import { getAllPlaylists } from './get-all-playlists';
import { getPlaylist } from './get-playlist';
import { updatePlaylist } from './update-playlist';

export const handleCreatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreatePlaylistRequest = req.body as CreatePlaylistRequest;

  if (!body?.id || !body?.creator || !body?.image || !body?.name || !body?.numTracks || !body?.sameAs || !body?.track) {
    res.status(400).send({
      message:
        'The request body is missing one or more of the following required properties: id, creator, image, name, numTracks, sameAs, track.',
    });
    return;
  }

  try {
    const playlist: MusicPlaylist = await getPlaylist(body.id);

    if (playlist) {
      res.status(400).send({ message: `The playlist with id ${body.id} already exists in the RDF database.` });
      return;
    }

    const createdIri: string = await createPlaylist(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleDeletePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deletePlaylist(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetAllPlaylists = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const playlists: string[] = await getAllPlaylists();
    res.status(200).send(playlists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetPlaylist = async (req: Request, res: Response<MusicPlaylist | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    const playlist: MusicPlaylist = await getPlaylist(id);

    !playlist
      ? res.status(404).send({ message: `The playlist with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...playlist, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleUpdatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: UpdatePlaylistRequest = req.body as UpdatePlaylistRequest;
  const id: string = req.params.id;

  try {
    const playlist: MusicPlaylist = await getPlaylist(id);

    if (!playlist) {
      if (!body?.creator || !body?.image || !body?.name || !body?.numTracks || !body?.sameAs || !body?.track) {
        res.status(400).send({
          message:
            'The playlist does not exist in the RDF database yet, however the request body is missing one or more of the following required properties: album, artists, datePublished, duration, isrcCode, name, sameAs.',
        });
        return;
      }

      const createdIri: string = await createPlaylist({
        id,
        creator: body.creator,
        description: body.description,
        image: body.image,
        name: body.name,
        numTracks: body.numTracks,
        sameAs: body.sameAs,
        track: body.track,
      });
      res.set('Location', createdIri).sendStatus(201);
      return;
    }

    await updatePlaylist(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
