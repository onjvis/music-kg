import { Request, Response } from 'express';

import {
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdatePlaylistRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { getPlaylist, updatePlaylist } from '../features';

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
