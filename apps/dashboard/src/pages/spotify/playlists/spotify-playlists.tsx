import { Playlist } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';

import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';
import SpotifyPlaylistItem from './components/spotify-playlist-item';

export const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);

  const handleGetPlaylists = async (): Promise<void> => {
    const { data } = await httpClient.get(ApiUrl.SPOTIFY_USERS_PLAYLISTS);
    setPlaylists(data?.items);
  };

  return (
    <div className="flex flex-grow flex-col gap-8">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1>Your playlists</h1>
        <button className="btn-primary" onClick={handleGetPlaylists}>
          Get playlists
        </button>
      </div>
      {!!playlists?.length && (
        <div className="flex flex-col gap-4">
          {playlists?.map((item: Playlist) => (
            <SpotifyPlaylistItem key={item?.id} playlist={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotifyPlaylists;
