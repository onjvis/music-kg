import { Artist, ItemTypes, PlayHistory, SimplifiedAlbum, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { Request, Response } from 'express';

import { ErrorResponse, SpotifySearchResult } from '@music-kg/data';

import { MARKET, SEARCH_LIMIT } from './spotify.constants';

export const getRecentlyPlayed = async (_: Request, res: Response): Promise<void> => {
  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  if (spotifyApi) {
    const recentTracks: PlayHistory[] = (await spotifyApi.player.getRecentlyPlayedTracks()).items;

    res.status(200).send(recentTracks);
  } else {
    res.sendStatus(400);
  }
};

export const handleSpotifySearch = async (
  req: Request,
  res: Response<SpotifySearchResult[] | ErrorResponse>
): Promise<void> => {
  const q: string = req.query.q as string;
  const type: ItemTypes = req.query.type as ItemTypes;

  if (!['album', 'artist', 'track'].includes(type)) {
    res.status(400).send({ message: `Invalid search type: ${type}.` });
  }

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  if (spotifyApi) {
    try {
      const searchResults = await spotifyApi.search(q, [type], MARKET, SEARCH_LIMIT);

      switch (type) {
        case 'album':
          res
            .status(200)
            .send(searchResults.albums.items.map((item: SimplifiedAlbum) => ({ id: item.id, name: item.name })));
          break;
        case 'artist':
          res.status(200).send(searchResults.artists.items.map((item: Artist) => ({ id: item.id, name: item.name })));
          break;
        case 'track':
          res.status(200).send(searchResults.tracks.items.map((item: Track) => ({ id: item.id, name: item.name })));
          break;
      }
    } catch (error) {
      res.status(500).send({ message: error?.message });
    }
  } else {
    res.sendStatus(400);
  }
};
