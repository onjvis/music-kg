import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { getRecordingByExternalUrl } from '../features';

export const handleFindRecording = async (
  req: Request,
  res: Response<MusicRecording | ErrorResponse>
): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const recording: MusicRecording = await getRecordingByExternalUrl(spotifyUrl, origin);

    !recording
      ? res
          .status(404)
          .send({ message: `The recording with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(recording);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
