import { Request, Response } from 'express';

import {
  DataOrigin,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateArtistRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { getArtist, updateArtist } from '../features';

export const handleUpdateArtist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateArtistRequest = req.body as UpdateArtistRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const artist: MusicGroup = await getArtist(id, origin);

    if (!artist) {
      res.status(400).send({ message: `The artist with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const artistAlbums: EntityData[] = artist.album
        ? Array.isArray(artist.album)
          ? artist.album.map((albumId: string): EntityData => ({ id: albumId, type: 'album' }))
          : [{ id: artist.album, type: 'album' }]
        : [];
      const artistTracks: EntityData[] = artist.track
        ? Array.isArray(artist.track)
          ? artist.track.map((trackId: string): EntityData => ({ id: trackId, type: 'track' }))
          : [{ id: artist.track, type: 'track' }]
        : [];
      const artistGenres: string[] = artist.genre ? (Array.isArray(artist.genre) ? artist.genre : [artist.genre]) : [];
      const artistExternalUrls: ExternalUrls = artist.sameAs
        ? Array.isArray(artist.sameAs)
          ? artist.sameAs
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(artist.sameAs)]: artist.sameAs }
        : {};

      body = {
        ...body,
        ...(body.albums
          ? Array.isArray(body.albums)
            ? { albums: arrayUnion<EntityData>(artistAlbums, body.albums) }
            : { albums: [...artistAlbums, body.albums] }
          : {}),
        ...(body.tracks
          ? Array.isArray(body.tracks)
            ? { tracks: arrayUnion<EntityData>(artistTracks, body.tracks) }
            : { tracks: [...artistTracks, body.tracks] }
          : {}),
        ...(body.genres
          ? Array.isArray(body.genres)
            ? { genres: arrayUnion<string>(artistGenres, body.genres) }
            : { genres: [...artistGenres, body.genres] }
          : {}),
        ...(body.externalUrls ? { externalUrls: { ...artistExternalUrls, ...body.externalUrls } } : {}),
      };
    }

    await updateArtist(id, body, origin);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
