import { Request, Response } from 'express';

import {
  CreatePlaylistRequest,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdatePlaylistRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../utils/array-union';
import { createPlaylist } from './create-playlist';
import { deletePlaylist } from './delete-playlist';
import { getAllPlaylists } from './get-all-playlists';
import { getPlaylist, getPlaylistByExternalUrl } from './get-playlist';
import { playlistExists } from './playlist-exists';
import { updatePlaylist } from './update-playlist';

export const handleCreatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreatePlaylistRequest = req.body as CreatePlaylistRequest;

  if (!body?.name) {
    res.status(400).send({ message: 'The request body is missing required property name.' });
    return;
  }

  try {
    if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
      if (await playlistExists(body?.externalUrls)) {
        res.status(400).send({ message: 'The artist already exists in the RDF database.' });
        return;
      }
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

export const handleFindPlaylist = async (req: Request, res: Response<MusicPlaylist | ErrorResponse>): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);

  try {
    const playlist: MusicPlaylist = await getPlaylistByExternalUrl(spotifyUrl);

    !playlist
      ? res
          .status(404)
          .send({ message: `The playlist with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(playlist);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleUpdatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdatePlaylistRequest = req.body as UpdatePlaylistRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;

  if (!body) {
    res.status(400).send({ message: 'The request body is empty.' });
    return;
  }

  try {
    const playlist: MusicPlaylist = await getPlaylist(id);

    if (!playlist) {
      res.status(400).send({ message: `The playlist with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const playlistCreators: EntityData[] = playlist.creator
        ? Array.isArray(playlist.creator)
          ? playlist.creator.map((artistId: string): EntityData => ({ id: artistId }))
          : [{ id: playlist.creator }]
        : [];
      const playlistTracks: EntityData[] = playlist.track
        ? Array.isArray(playlist.track)
          ? playlist.track.map((artistId: string): EntityData => ({ id: artistId }))
          : [{ id: playlist.track }]
        : [];
      const playlistExternalUrls: ExternalUrls = playlist.sameAs
        ? Array.isArray(playlist.sameAs)
          ? playlist.sameAs
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(playlist.sameAs)]: playlist.sameAs }
        : {};

      body = {
        ...body,
        ...(body.creators
          ? Array.isArray(body.creators)
            ? { creators: arrayUnion<EntityData>(playlistCreators, body.creators) }
            : { creators: [...playlistCreators, body.creators] }
          : {}),
        ...(body.tracks
          ? Array.isArray(body.tracks)
            ? { tracks: arrayUnion<EntityData>(playlistTracks, body.tracks) }
            : { tracks: [...playlistTracks, body.tracks] }
          : {}),
        ...(body.externalUrls ? { externalUrls: { ...playlistExternalUrls, ...body.externalUrls } } : {}),
      };
    }

    await updatePlaylist(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
