import { Request, Response } from 'express';

import { CreateRecordingRequest, DataOrigin, ErrorResponse } from '@music-kg/data';

import { createRecording, createRecordingLinks, recordingExists } from '../features';

export const handleCreateRecording = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateRecordingRequest = req.body as CreateRecordingRequest;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    // Will not create a new entity if there is already the entity with the same external ID
    if (body.externalUrls?.spotify || body.externalUrls?.wikidata) {
      if (await recordingExists(body.externalUrls, origin)) {
        res.status(400).send({ message: 'The recording already exists in the RDF database.' });
        return;
      }
    }

    const createdIri: string = await createRecording(body, origin);

    // Will create a link in the links graph to link the created entity between all graphs based on the external url
    if (body.externalUrls?.spotify || body.externalUrls?.wikidata) {
      await createRecordingLinks({ externalUrls: body.externalUrls, iri: createdIri, type: 'track', origin });
    }

    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
