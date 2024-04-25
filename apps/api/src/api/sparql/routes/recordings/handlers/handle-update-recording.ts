import { Request, Response } from 'express';

import {
  DataOrigin,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateRecordingRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../../utils/array-union';
import { getRecording, updateRecording } from '../features';

export const handleUpdateRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateRecordingRequest = req.body as UpdateRecordingRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const recording: MusicRecording = await getRecording(id, origin);

    if (!recording) {
      res.status(400).send({ message: `The recording with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const recordingArtists: EntityData[] = recording.byArtist
        ? Array.isArray(recording.byArtist)
          ? recording.byArtist.map((artistId) => ({ id: artistId, type: 'artist' }))
          : [{ id: recording.byArtist, type: 'artist' }]
        : [];
      const recordingExternalUrls: ExternalUrls = recording.sameAs
        ? Array.isArray(recording.sameAs)
          ? recording.sameAs
              .map((externalUrl) => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(recording.sameAs)]: recording.sameAs }
        : {};

      body = {
        ...body,
        ...(body.artists
          ? Array.isArray(body.artists)
            ? { artists: arrayUnion<EntityData>(recordingArtists, body.artists) }
            : { artists: [...recordingArtists, body.artists] }
          : {}),
        ...(body.externalUrls ? { externalUrls: { ...recordingExternalUrls, ...body.externalUrls } } : {}),
      };
    }

    await updateRecording(id, body, origin);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
