import { SimplifiedArtist, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { Request, Response } from 'express';

import { SpotifyTrack } from '@music-kg/data';

export const getTrack = async (req: Request, res: Response): Promise<void> => {
  const trackId: string = req.params.id;

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  try {
    const getTrackResponse: Track = await spotifyApi.tracks.get(trackId);

    const track: SpotifyTrack = {
      album: getTrackResponse?.album?.id,
      artists: getTrackResponse?.artists?.map((artist: SimplifiedArtist) => artist?.id),
      duration: getTrackResponse?.duration_ms,
      id: getTrackResponse?.id,
      isrc: getTrackResponse?.external_ids?.isrc,
      name: getTrackResponse?.name,
      spotifyUrl: getTrackResponse?.external_urls?.spotify,
    };

    res.status(200).send(track);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
