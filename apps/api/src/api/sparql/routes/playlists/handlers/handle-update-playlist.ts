import { Request, Response } from 'express';

import {
  DataOrigin,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdatePlaylistRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { createPlaylistLinks, getPlaylist, updatePlaylist } from '../features';

export const handleUpdatePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdatePlaylistRequest = req.body as UpdatePlaylistRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const playlist: MusicPlaylist = await getPlaylist(id, origin);

    if (!playlist) {
      res.status(400).send({ message: `The playlist with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const playlistCreators: EntityData[] = playlist.creator
        ? Array.isArray(playlist.creator)
          ? playlist.creator.map((creatorId: string): EntityData => ({ id: creatorId, type: 'user' }))
          : [{ id: playlist.creator, type: 'user' }]
        : [];
      const playlistTracks: EntityData[] = playlist.track
        ? Array.isArray(playlist.track)
          ? playlist.track.map((trackId: string): EntityData => ({ id: trackId, type: 'track' }))
          : [{ id: playlist.track, type: 'track' }]
        : [];
      const playlistExternalUrls: ExternalUrls = playlist.url
        ? Array.isArray(playlist.url)
          ? playlist.url
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(playlist.url)]: playlist.url }
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

    const updatedIri: string = await updatePlaylist(id, body, origin);

    // Will create a link in the links graph to link the created entity between all graphs based on the external url
    if (body.externalUrls?.spotify || body.externalUrls?.wikidata) {
      await createPlaylistLinks({ externalUrls: body.externalUrls, iri: updatedIri, type: 'track', origin });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
