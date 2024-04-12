import { Request, Response } from 'express';

import {
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateAlbumRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { getAlbum, updateAlbum } from '../features';

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
