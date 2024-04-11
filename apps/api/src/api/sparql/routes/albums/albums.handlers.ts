import { Request, Response } from 'express';

import {
  CreateAlbumRequest,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateAlbumRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../utils/array-union';
import { runAlbumCreationChecks } from './albums.helpers';
import { createAlbum } from './create-album';
import { deleteAlbum } from './delete-album';
import { getAlbum } from './get-album';
import { getAllAlbums } from './get-all-albums';
import { updateAlbum } from './update-album';

export const handleCreateAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateAlbumRequest = req.body as CreateAlbumRequest;

  try {
    const creationChecksErrorMessage: string = await runAlbumCreationChecks(body);

    if (creationChecksErrorMessage) {
      res.status(400).send({ message: creationChecksErrorMessage });
      return;
    }

    const createdIri: string = await createAlbum(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleDeleteAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteAlbum(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetAlbum = async (req: Request, res: Response<MusicAlbum | ErrorResponse>): Promise<void> => {
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

export const handleGetAllAlbums = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const albums: string[] = await getAllAlbums();
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleUpdateAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateAlbumRequest = req.body as UpdateAlbumRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;

  try {
    const album: MusicAlbum = await getAlbum(id);

    if (!album) {
      res.status(400).send({ message: `The album with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const albumArtists: EntityData[] = album.byArtist
        ? Array.isArray(album.byArtist)
          ? album.byArtist.map((artistId: string): EntityData => ({ id: artistId }))
          : [{ id: album.byArtist }]
        : [];
      const albumTracks: EntityData[] = album.track
        ? Array.isArray(album.track)
          ? album.track.map((artistId: string): EntityData => ({ id: artistId }))
          : [{ id: album.track }]
        : [];
      const albumExternalUrls: ExternalUrls = album.sameAs
        ? Array.isArray(album.sameAs)
          ? album.sameAs
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(album.sameAs)]: album.sameAs }
        : {};

      body = {
        ...body,
        ...(body.artists
          ? Array.isArray(body.artists)
            ? { artists: arrayUnion<EntityData>(albumArtists, body.artists) }
            : { artists: [...albumArtists, body.artists] }
          : {}),
        ...(body.tracks
          ? Array.isArray(body.tracks)
            ? { tracks: arrayUnion<EntityData>(albumTracks, body.tracks) }
            : { tracks: [...albumTracks, body.tracks] }
          : {}),
        ...(body.externalUrls ? { externalUrls: { ...albumExternalUrls, ...body.externalUrls } } : {}),
      };
    }

    await updateAlbum(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
