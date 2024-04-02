import { Page, Playlist, PlaylistedTrack, SimplifiedPlaylist, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { Request, Response } from 'express';

import { ErrorResponse, SpotifyPlaylist } from '@music-kg/data';

import { LIMIT, MARKET } from '../spotify.constants';
import { PLAYLIST_FIELDS } from './playlists.constants';
import { getMetadata } from './playlists.helpers';

export const getUserPlaylists = async (_: Request, res: Response): Promise<void> => {
  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  try {
    const userPlaylists: Page<SimplifiedPlaylist> = await spotifyApi?.currentUser.playlists.playlists(LIMIT);
    res.status(200).send(userPlaylists);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const getPlaylist = async (
  req: Request,
  res: Response<Playlist | SpotifyPlaylist | ErrorResponse>
): Promise<void> => {
  const playlistId: string = req.params.id;
  const isOnlyMetadata = req.query.onlyMetadata === 'true';

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  try {
    const playlistResponse: Playlist = await spotifyApi?.playlists.getPlaylist(playlistId, MARKET, PLAYLIST_FIELDS);
    const tracksItems: PlaylistedTrack<Track>[] = [];

    let next: string;
    let requests = 0;

    do {
      const getPlaylistItemsResponse: Page<PlaylistedTrack<Track>> = await spotifyApi?.playlists.getPlaylistItems(
        playlistId,
        MARKET,
        PLAYLIST_FIELDS,
        LIMIT,
        requests * LIMIT
      );
      tracksItems.push(...getPlaylistItemsResponse.items.map((track: PlaylistedTrack<Track>) => track));

      next = getPlaylistItemsResponse.next;
      requests++;
    } while (requests === 0 || next);

    const playlist: Playlist = { ...playlistResponse, tracks: { ...playlistResponse.tracks, items: tracksItems } };
    res.status(200).send(isOnlyMetadata ? getMetadata(playlist) : playlist);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
