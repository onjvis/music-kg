import { AppRoute } from '../../models/enums/app-route.enum';
import SpotifyLatest from './spotify-latest';
import Spotify from './spotify';

export const SpotifyRoutes = {
  path: AppRoute.SPOTIFY,
  element: <Spotify />,
  children: [
    {
      path: AppRoute.SPOTIFY_LATEST,
      element: <SpotifyLatest />,
    },
  ],
};

export default SpotifyRoutes;
