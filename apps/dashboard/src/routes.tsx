import { RouteObject } from 'react-router-dom';

import { AppRoute } from './models/enums/app-route.enum';
import { AuthRoutes } from './pages/auth/auth.routes';
import { SpotifyRoutes } from './pages/spotify/spotify.routes';
import { UserRoutes } from './pages/user/user.routes';
import { Home } from './pages/home';

export const Routes: RouteObject = {
  path: AppRoute.HOME,
  element: <Home />,
  children: [AuthRoutes, SpotifyRoutes, UserRoutes],
};
