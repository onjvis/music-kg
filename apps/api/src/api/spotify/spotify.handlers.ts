import { PlayHistory, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Request, Response } from 'express';

export const getRecentlyPlayed = async (_: Request, res: Response) => {
  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  if (spotifyApi) {
    const recentTracks: PlayHistory[] = (await spotifyApi.player.getRecentlyPlayedTracks()).items;

    res.status(200).contentType('application/json').send(JSON.stringify(recentTracks));
  } else {
    res.sendStatus(400);
  }
};
