import { Request, Response } from 'express';

import { CreateRecordingRequest, ErrorResponse, UpdateRecordingRequest } from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { createRecording } from './create-recording';
import { deleteRecording } from './delete-recording';
import { getAllRecordings } from './get-all-recordings';
import { getRecording } from './get-recording';
import { updateRecording } from './update-recording';

export const handleCreateRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateRecordingRequest = req.body as CreateRecordingRequest;

  if (
    !body?.id ||
    !body?.byArtist ||
    !body?.datePublished ||
    !body?.duration ||
    !body?.inAlbum ||
    !body?.isrcCode ||
    !body?.name ||
    !body?.sameAs
  ) {
    res.status(400).send({
      message:
        'The request body is missing one or more of the following required properties: id, byArtist, datePublished, duration, inAlbum, isrcCode, name, sameAs.',
    });
    return;
  }

  try {
    const recording: MusicRecording = await getRecording(body.id);

    if (recording) {
      res.status(400).send({ message: `The recording with id ${body.id} already exists in the RDF database.` });
      return;
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
  const body: UpdateRecordingRequest = req.body as UpdateRecordingRequest;
  const id: string = req.params.id;

  try {
    const recording: MusicRecording = await getRecording(id);

    if (!recording) {
      if (
        !body?.byArtist ||
        !body?.datePublished ||
        !body?.duration ||
        !body?.inAlbum ||
        !body?.isrcCode ||
        !body?.name ||
        !body?.sameAs
      ) {
        res.status(400).send({
          message:
            'The recording does not exist in the RDF database yet, however the request body is missing one or more of the following required properties: album, artists, datePublished, duration, isrcCode, name, sameAs.',
        });
        return;
      }

      const createdIri: string = await createRecording({
        id,
        byArtist: body.byArtist,
        datePublished: body.datePublished,
        duration: body.duration,
        inAlbum: body.inAlbum,
        isrcCode: body.isrcCode,
        name: body.name,
        sameAs: body.sameAs,
      });
      res.set('Location', createdIri).sendStatus(201);
      return;
    }

    await updateRecording(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
