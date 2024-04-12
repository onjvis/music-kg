import { AccessToken, Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { Outlet, useNavigate } from 'react-router-dom';

import { NavigationMenuOption } from '../../components/layout/navigation-menu/models/navigation-menu-option.model';
import { HorizontalNavigationMenu } from '../../components/layout/navigation-menu/horizontal-navigation-menu';
import { AppRoute } from '../../models/enums/app-route.enum';
import { SPOTIFY_VERIFIER_KEY } from '../../models/local-storage.constants';

export const Spotify = () => {
  const [buttonText, setButtonText] = useState('Authorize');
  const [isAuthenticationFinished, setAuthenticationFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const sdkVerifier = localStorage.getItem(SPOTIFY_VERIFIER_KEY);

    if (sdkVerifier) {
      setButtonText('Finish Authorization');
    }
  }, []);

  const handleAuthorization = async (): Promise<void> => {
    await SpotifyApi.performUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_REDIRECT_TARGET,
      Scopes.all,
      async (token: AccessToken): Promise<void> => {
        if (token) {
          setAuthenticationFinished(true);
          navigate(AppRoute.SPOTIFY_LATEST);
        }
      }
    );
  };

  const menuOptions: NavigationMenuOption[] = [
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
    <div className="flex w-full flex-grow flex-col gap-4 self-center rounded-lg border-2 bg-white p-8">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <IconContext.Provider value={{ size: '3em' }}>
            <FaSpotify />
          </IconContext.Provider>
          <h1 className="text-3xl">Spotify integration</h1>
        </div>
        {!isAuthenticationFinished && (
          <button className="btn-primary" onClick={handleAuthorization}>
            {buttonText}
          </button>
        )}
      </div>
      {isAuthenticationFinished && (
        <div className="flex flex-col gap-4">
          <HorizontalNavigationMenu defaultOption={AppRoute.SPOTIFY_LATEST} menuOptions={menuOptions} />
          <Outlet />
        </div>
      )}
    </div>
  );
};
