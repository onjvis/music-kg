import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Request, Response, NextFunction } from 'express';

import { HttpHeader } from '@music-kg/data';

/**
 * Custom middleware for providing Spotify API object for any incoming requests
 */
export const provideSpotifyApi = (req: Request, res: Response, next: NextFunction): void => {
  const spotifyAuthorizationHeader = req.headers[HttpHeader.MUSIC_KG_SPOTIFY_AUTHORIZATION];

  if (spotifyAuthorizationHeader && !Array.isArray(spotifyAuthorizationHeader)) {
    const accessToken: AccessToken = JSON.parse(spotifyAuthorizationHeader);

    // Store SpotifyAPI object into res.locals, so NextFunction handler can use it
    res.locals.spotifyApi = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID, accessToken);

    next();
  } else {
    res.sendStatus(401);
  }
};
