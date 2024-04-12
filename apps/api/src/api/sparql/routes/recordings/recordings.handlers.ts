import { Request, Response } from 'express';

import {
  CreateRecordingRequest,
  EntityData,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateRecordingRequest,
  UpdateType,
} from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { arrayUnion } from '../../../../utils/array-union';
import { createRecording } from './create-recording';
import { deleteRecording } from './delete-recording';
import { getAllRecordings } from './get-all-recordings';
import { getRecording, getRecordingByExternalUrl } from './get-recording';
import { recordingExists } from './recording-exists';
import { updateRecording } from './update-recording';

export const handleCreateRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateRecordingRequest = req.body as CreateRecordingRequest;

  if (!body?.name) {
    res
      .status(400)
      .send({ message: 'The request body is missing one or more of the following required property name.' });
    return;
  }

  try {
    // Will not create a new entity if there is already the entity with the same external ID
    if (body.externalUrls?.spotify || body.externalUrls?.wikidata) {
      if (await recordingExists(body.externalUrls)) {
        res.status(400).send({ message: 'The recording already exists in the RDF database.' });
        return;
      }
    }

    const createdIri: string = await createRecording(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleDeleteRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteRecording(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleFindRecording = async (
  req: Request,
  res: Response<MusicRecording | ErrorResponse>
): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);

  try {
    const recording: MusicRecording = await getRecordingByExternalUrl(spotifyUrl);

    !recording
      ? res
          .status(404)
          .send({ message: `The recording with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(recording);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetAllRecordings = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const recordings: string[] = await getAllRecordings();
    res.status(200).send(recordings);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetRecording = async (
  req: Request,
  res: Response<MusicRecording | ErrorResponse>
): Promise<void> => {
  const id: string = req.params.id;

  try {
    const recording: MusicRecording = await getRecording(id);

    !recording
      ? res.status(404).send({ message: `The recording with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...recording, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleUpdateRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateRecordingRequest = req.body as UpdateRecordingRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;
  if (!body) {
    res.status(400).send({ message: 'The request body is empty.' });
    return;
  }

  try {
    const recording: MusicRecording = await getRecording(id);

    if (!recording) {
      res.status(400).send({ message: `The recording with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const recordingArtists: EntityData[] = recording.byArtist
        ? Array.isArray(recording.byArtist)
          ? recording.byArtist.map((artistId) => ({ id: artistId }))
          : [{ id: recording.byArtist }]
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

    await updateRecording(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
