import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { CreatePlaylistRequest } from '@music-kg/data';

import { AlertData } from '../../../../components/alert/models/alert-data.model';
import { ErrorAlert } from '../../../../components/alert/error-alert';
import { SuccessAlert } from '../../../../components/alert/success-alert';
import { FlexTextRow } from '../../../../components/flex-text-row';
import { SynchronizationStatus } from '../../../../components/synchronization-status';
import { useCurrentUser } from '../../../../contexts/current-user.context';
import { ApiUrl } from '../../../../models/api-url.model';
import httpClient from '../../../../services/http-client';
import { ms2timeStr } from '../../../../utils/ms2timeStr';
import { SpotifyTrackDetailCard } from '../../components/spotify-track-detail-card';
import { SpotifyTrackItem } from '../../components/spotify-track-item';

export const SpotifyPlaylistDetail = () => {
  const [alertData, setAlertData] = useState<AlertData>();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isSynchronized, setSynchronized] = useState<boolean>(false);
  const playlist: Playlist = (useLoaderData() as AxiosResponse)?.data;
  const { currentUser } = useCurrentUser();

  const navigate = useNavigate();

  useEffect(() => {
    httpClient
      .get(`${ApiUrl.SPARQL_PLAYLISTS}/${playlist?.id}`)
      .then(() => setSynchronized(true))
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          // Stringify and parse received error to be able to read its status code; https://stackoverflow.com/a/77541379
          error = JSON.parse(JSON.stringify(error));

          if (error.status === 404) {
            setSynchronized(false);
          } else {
            setAlertData({ type: 'error', message: error?.response?.data.message });
          }
        }
      });
  }, [playlist?.id]);

  const handleBack = (): void => navigate(-1);

  const handleSelect = (track: Track): void => {
    setSelectedTrack(track);
    window.scrollTo(0, 16 * 24);
  };

  const handleDetailClose = (): void => setSelectedTrack(null);

  const handleSynchronize = async (): Promise<void> => {
    const data: CreatePlaylistRequest = {
      id: playlist?.id,
      creator: currentUser.id,
      description: playlist?.description,
      image: playlist?.images?.[0]?.url,
      name: playlist?.name,
      numTracks: playlist?.tracks?.total.toString(),
      sameAs: playlist?.href,
      track: playlist?.tracks?.items?.map((item) => item?.track?.id),
    };

    try {
      await httpClient.post(ApiUrl.SPARQL_PLAYLISTS, data);
      setSynchronized(true);
      setAlertData({ type: 'success', message: 'Playlist successfully synchronized.' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }

    setTimeout(() => setAlertData(undefined), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}
      {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}

      <div className="flex flex-row items-center justify-between">
        <IconContext.Provider value={{ size: '2em' }}>
          <FaAngleLeft className="cursor-pointer" onClick={handleBack} />
        </IconContext.Provider>
        <SynchronizationStatus
          entityName="Playlist"
          handleSynchronize={handleSynchronize}
          isSynchronized={isSynchronized}
        />
      </div>
      <div className="flex flex-col gap-4 border-t-2 pt-4">
        <div className="flex flex-row gap-4">
          <img className="w-1/4 self-start rounded-lg" src={playlist?.images?.[0]?.url} alt="playlist cover" />
          <div className="flex flex-1 flex-col gap-2 border-l-2 p-4 pt-0">
            <strong className="text-4xl">{playlist?.name}</strong>
            <strong className="text-2xl">{playlist?.description}</strong>
            <FlexTextRow label="Owner" value={playlist?.owner?.display_name} />
            <FlexTextRow label="Number of tracks" value={playlist?.tracks?.total.toString()} />
            {!!playlist?.tracks?.items?.length && (
              <FlexTextRow
                label="Duration"
                value={ms2timeStr(
                  playlist?.tracks?.items
                    ?.map((track) => track?.track?.duration_ms)
                    ?.reduce((acc, currentValue) => acc + currentValue)
                )}
              />
            )}
            <FlexTextRow label="URI" value={playlist?.uri} />
            {selectedTrack && <SpotifyTrackDetailCard handleDetailClose={handleDetailClose} track={selectedTrack} />}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 border-t-2 pt-4">
          <h2>{playlist?.tracks?.items?.length ? 'Tracks' : 'No tracks'}</h2>
          {!!playlist?.tracks?.items?.length &&
            playlist?.tracks?.items?.map((track) => (
              <SpotifyTrackItem
                key={track?.track?.id}
                track={track?.track as Track}
                handleSelect={handleSelect}
                selected={selectedTrack === track?.track}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
