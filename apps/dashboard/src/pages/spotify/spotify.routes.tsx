import { AppRoute } from '../../models/enums/app-route.enum';
import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../../services/http-client';
import SpotifyLatest from './latest/spotify-latest';
import SpotifyPlaylistDetail from './playlists/components/spotify-playlist-detail';
import SpotifyPlaylists from './playlists/spotify-playlists';
import Spotify from './spotify';

export const SpotifyRoutes = {
  path: AppRoute.SPOTIFY,
  element: <Spotify />,
  children: [
    {
      path: AppRoute.SPOTIFY_LATEST,
      element: <SpotifyLatest />,
    },
    {
      path: AppRoute.SPOTIFY_PLAYLISTS,
      element: <SpotifyPlaylists />,
    },
    {
      path: `${AppRoute.SPOTIFY_PLAYLISTS}/:playlistId`,
      element: <SpotifyPlaylistDetail />,
      loader: async ({ params }: never) => {
        const { playlistId } = params;
        return httpClient.get(`${ApiUrl.SPOTIFY_USERS_PLAYLISTS}/${playlistId}`);
      },
    },
  ],
};

export default SpotifyRoutes;
