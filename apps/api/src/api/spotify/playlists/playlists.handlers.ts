import { Page, Playlist, SimplifiedPlaylist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Request, Response } from 'express';

export const getUserPlaylists = async (_: Request, res: Response): Promise<void> => {
  const limit = 50;
  const spotifyApi: SpotifyApi = res.locals.spotifyApi;
  const userPlaylists: Page<SimplifiedPlaylist> = await spotifyApi?.currentUser.playlists.playlists(limit);
  res.status(200).contentType('application/json').send(JSON.stringify(userPlaylists));
};

export const getPlaylist = async (req: Request, res: Response): Promise<void> => {
  const playlistId = req.params.id;

  if (!playlistId) {
    res.status(400).send({ message: 'Playlist ID not specified.' });
    return;
  }

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;
  const playlist: Playlist = await spotifyApi?.playlists.getPlaylist(playlistId);
  res.status(200).contentType('application/json').send(JSON.stringify(playlist));
};
