import { RouteObject } from 'react-router-dom';

import { AppRoute } from '../../models/enums/app-route.enum';
import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../../services/http-client';
import { AlbumDetail } from './components/album-detail';
import { ArtistDetail } from './components/artist-detail';
import { BrowseList } from './components/browse-list';
import { PlaylistDetail } from './components/playlist-detail';
import { TrackDetail } from './components/track-detail';
import { Browse } from './browse';

export const BrowseRoutes: RouteObject = {
  path: AppRoute.BROWSE,
  element: <Browse />,
  children: [
    {
      path: AppRoute.BROWSE_ALBUMS,
      element: (
        <BrowseList entityRoutePrefix={AppRoute.BROWSE_ALBUMS} sparqlEndpoint={ApiUrl.SPARQL_ALBUMS} title="Albums" />
      ),
    },
    {
      path: `${AppRoute.BROWSE_ALBUMS}/:origin/:albumId`,
      element: <AlbumDetail />,
      loader: async ({ params }) => {
        const { albumId, origin } = params;
        return httpClient.get(`${ApiUrl.SPARQL_ALBUMS}/${albumId}?origin=${origin}`);
      },
    },
    {
      path: AppRoute.BROWSE_ARTISTS,
      element: (
        <BrowseList
          entityRoutePrefix={AppRoute.BROWSE_ARTISTS}
          sparqlEndpoint={ApiUrl.SPARQL_ARTISTS}
          title="Artists"
        />
      ),
    },
    {
      path: `${AppRoute.BROWSE_ARTISTS}/:origin/:artistId`,
      element: <ArtistDetail />,
      loader: async ({ params }) => {
        const { artistId, origin } = params;
        return httpClient.get(`${ApiUrl.SPARQL_ARTISTS}/${artistId}?origin=${origin}`);
      },
    },
    {
      path: AppRoute.BROWSE_PLAYLISTS,
      element: (
        <BrowseList
          entityRoutePrefix={AppRoute.BROWSE_PLAYLISTS}
          sparqlEndpoint={ApiUrl.SPARQL_PLAYLISTS}
          title="Playlists"
        />
      ),
    },
    {
      path: `${AppRoute.BROWSE_PLAYLISTS}/:origin/:playlistId`,
      element: <PlaylistDetail />,
      loader: async ({ params }) => {
        const { origin, playlistId } = params;
        return httpClient.get(`${ApiUrl.SPARQL_PLAYLISTS}/${playlistId}?origin=${origin}`);
      },
    },
    {
      path: AppRoute.BROWSE_TRACKS,
      element: (
        <BrowseList
          entityRoutePrefix={AppRoute.BROWSE_TRACKS}
          sparqlEndpoint={ApiUrl.SPARQL_RECORDINGS}
          title="Tracks"
        />
      ),
    },
    {
      path: `${AppRoute.BROWSE_TRACKS}/:origin/:trackId`,
      element: <TrackDetail />,
      loader: async ({ params }) => {
        const { origin, trackId } = params;
        return httpClient.get(`${ApiUrl.SPARQL_RECORDINGS}/${trackId}?origin=${origin}`);
      },
    },
  ],
};
