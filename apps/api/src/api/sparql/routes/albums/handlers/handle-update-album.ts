import { Request, Response } from 'express';

import {
  DataOrigin,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateAlbumRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { createAlbumLinks, getAlbum, updateAlbum } from '../features';

export const handleUpdateAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateAlbumRequest = req.body as UpdateAlbumRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const album: MusicAlbum = await getAlbum(id, origin);

    if (!album) {
      res.status(400).send({ message: `The album with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const albumArtists: EntityData[] = album.byArtist
        ? Array.isArray(album.byArtist)
          ? album.byArtist.map((artistId: string): EntityData => ({ id: artistId, type: 'artist' }))
          : [{ id: album.byArtist, type: 'artist' }]
        : [];
      const albumTracks: EntityData[] = album.track
        ? Array.isArray(album.track)
          ? album.track.map((trackId: string): EntityData => ({ id: trackId, type: 'track' }))
          : [{ id: album.track, type: 'track' }]
        : [];
      const albumExternalUrls: ExternalUrls = album.url
        ? Array.isArray(album.url)
          ? album.url
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(album.url)]: album.url }
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

    const updatedIri: string = await updateAlbum(id, body, origin);

    // Will create a link in the links graph to link the created entity between all graphs based on the external url
    if (body.externalUrls?.spotify || body.externalUrls?.wikidata) {
      await createAlbumLinks({ externalUrls: body.externalUrls, iri: updatedIri, type: 'album', origin });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
