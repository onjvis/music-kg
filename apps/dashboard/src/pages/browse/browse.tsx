import { Outlet } from 'react-router-dom';

import { NavigationMenuOption } from '../../components/layout/navigation-menu/models/navigation-menu-option.model';
import { VerticalNavigationMenu } from '../../components/layout/navigation-menu/vertical-navigation-menu';
import { AppRoute } from '../../models/enums/app-route.enum';

export const Browse = () => {
  const menuOptions: NavigationMenuOption[] = [
    {
      to: AppRoute.BROWSE_ALBUMS,
      title: 'Albums',
    },
    {
      to: AppRoute.BROWSE_ARTISTS,
      title: 'Artists',
    },
    {
      to: AppRoute.BROWSE_PLAYLISTS,
      title: 'Playlists',
    },
    {
      to: AppRoute.BROWSE_TRACKS,
      title: 'Tracks',
    },
  ];

  return (
    <div className="flex w-2/3 flex-1 flex-grow flex-col gap-4 self-center rounded-lg border-2 bg-white p-8">
      <h1>Browse synchronized library</h1>
      <div className="flex flex-row gap-4">
        <div>
          <VerticalNavigationMenu menuOptions={menuOptions} />
        </div>
        <div className="w-full rounded-lg border-2 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
