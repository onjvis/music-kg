import { Playlist } from '@spotify/web-api-ts-sdk';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../../models/enums/app-route.enum';

type SpotifyPlaylistItemProps = {
  playlist: Playlist;
};

export const SpotifyPlaylistItem = ({ playlist }: SpotifyPlaylistItemProps) => {
  const navigate = useNavigate();

  const handlePlaylistClicked = () => navigate(`${AppRoute.SPOTIFY_PLAYLISTS}/${playlist?.id}`);

  return (
    <div
      className="flex flex-auto flex-row items-center justify-between gap-4 rounded-lg border-2 p-4 hover:cursor-pointer hover:bg-teal-200"
      onClick={handlePlaylistClicked}
    >
      <div className="flex flex-row items-center gap-4">
        <img className="rounded-lg" src={playlist?.images?.[0]?.url} alt="album cover" height="64px" width="64px" />
        <div className="flex flex-col gap-1">
          <strong className="text-lg">{playlist?.name}</strong>
        </div>
      </div>
      <span className="text-2xl">{playlist?.tracks?.total} tracks</span>
    </div>
  );
};
