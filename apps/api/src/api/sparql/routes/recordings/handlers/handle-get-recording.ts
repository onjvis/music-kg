import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { getRecording } from '../features';

export const handleGetRecording = async (
  req: Request,
  res: Response<MusicRecording | ErrorResponse>
): Promise<void> => {
  const id: string = req.params.id;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const recording: MusicRecording = await getRecording(id, origin);

    !recording
      ? res.status(404).send({ message: `The recording with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...recording, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
