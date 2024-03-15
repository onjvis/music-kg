import { AppRoute } from '../../../../models/enums/app-route.enum';
import { useState } from 'react';
import SpotifyMenuItem from './spotify-menu-item';

export const SpotifyMenu = () => {
  const [selectedTab, setSelectedTab] = useState<AppRoute>(AppRoute.SPOTIFY_LATEST);

  const menuOptions = [
    {
      to: AppRoute.SPOTIFY_LATEST,
      title: 'Latest tracks',
    },
    {
      to: AppRoute.SPOTIFY_PLAYLISTS,
      title: 'Playlists',
    },
  ];

  return (
    <div className="flex flex-row divide-x-2 rounded border-2">
      {menuOptions.map((option) => (
        <SpotifyMenuItem
          key={option.to}
          className="first:rounded-l last:rounded-r"
          handleSelect={() => setSelectedTab(option.to)}
          isSelected={selectedTab === option.to}
          title={option.title}
          to={option.to}
        />
      ))}
    </div>
  );
};

export default SpotifyMenu;
