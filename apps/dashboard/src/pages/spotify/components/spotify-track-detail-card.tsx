import { SimplifiedArtist, Track } from '@spotify/web-api-ts-sdk';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { CreateRecordingRequest, EntityData } from '@music-kg/data';

import { AlertData } from '../../../components/alert/models/alert-data.model';
import { ErrorAlert } from '../../../components/alert/error-alert';
import { SuccessAlert } from '../../../components/alert/success-alert';
import { SynchronizationStatus } from '../../../components/synchronization-status';
import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';
import { SpotifyTrackDetail } from './spotify-track-detail';

type SpotifyTrackDetailCardProps = {
  handleDetailClose: () => void;
  track: Track;
};

export const SpotifyTrackDetailCard = ({ handleDetailClose, track }: SpotifyTrackDetailCardProps) => {
  const [alertData, setAlertData] = useState<AlertData>();
  const [isSynchronized, setSynchronized] = useState<boolean>(false);

  useEffect(() => {
    httpClient
      .get(`${ApiUrl.SPARQL_RECORDINGS}/find?spotifyUrl=${encodeURIComponent(track?.external_urls.spotify)}`)
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
  }, [track?.external_urls.spotify]);

  const handleSynchronize = async (): Promise<void> => {
    const data: CreateRecordingRequest = {
      artists: track.artists?.map(
        (artist: SimplifiedArtist): EntityData => ({
          name: artist?.name,
          externalUrls: { spotify: artist?.external_urls?.spotify },
        })
      ),
      album: { name: track.album?.name, externalUrls: { spotify: track?.album?.external_urls?.spotify } },
      name: track.name,
      datePublished: track.album?.release_date,
      duration: track.duration_ms,
      externalUrls: { spotify: track?.external_urls?.spotify },
      isrc: track.external_ids?.isrc,
    };

    try {
      await httpClient.post(ApiUrl.SPARQL_RECORDINGS, data);
      setSynchronized(true);
      setAlertData({ type: 'success', message: 'Track successfully synchronized.' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }

    setTimeout(() => setAlertData(undefined), 3000);
  };

  return (
    <div className="flex flex-1 flex-col rounded border-2 bg-white">
      {alertData && (
        <div className="px-4 pt-4">
          {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}
          {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}
        </div>
      )}

      <SpotifyTrackDetail track={track} />
      <div className="flex flex-row justify-end gap-4 border-t-2 p-4">
        <SynchronizationStatus
          entityName="Track"
          handleSynchronize={handleSynchronize}
          isSynchronized={isSynchronized}
        />
        <button className="btn-secondary" onClick={handleDetailClose}>
          Close
        </button>
      </div>
    </div>
  );
};
