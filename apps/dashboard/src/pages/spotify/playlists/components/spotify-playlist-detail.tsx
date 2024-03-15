import { Playlist, Track } from '@spotify/web-api-ts-sdk';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate } from 'react-router-dom';

import FlexTextRow from '../../../../components/flex-text-row';
import { ms2timeStr } from '../../../../utils/ms2timeStr';
import SpotifyTrackDetail from '../../components/spotify-track-detail';
import SpotifyTrackItem from '../../components/spotify-track-item';

export const SpotifyPlaylistDetail = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const playlist: Playlist = (useLoaderData() as AxiosResponse)?.data;

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  const handleSelect = (track: Track): void => {
    setSelectedTrack(track);
    window.scrollTo(0, 0);
  };

  const handleDetailClose = (): void => setSelectedTrack(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row">
        <IconContext.Provider value={{ size: '2em' }}>
          <div className="cursor-pointer" onClick={handleBack}>
            <FaAngleLeft />
          </div>
        </IconContext.Provider>
      </div>
      <div className="flex flex-col gap-4 border-t-2 pt-4">
        <div className="flex flex-row gap-4">
          <img className="w-1/4 self-start rounded-lg" src={playlist?.images?.[0]?.url} alt="playlist cover" />
          <div className="flex flex-1 flex-col gap-2 border-l-2 p-4 pt-0">
            <strong className="text-4xl">{playlist?.name}</strong>
            <strong className="text-2xl">{playlist?.description}</strong>
            <FlexTextRow label="Owner" value={playlist?.owner?.display_name} />
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
            {selectedTrack && (
              <div className="flex flex-1 flex-col rounded border-2 bg-white">
                <SpotifyTrackDetail track={selectedTrack} />
                <div className="flex flex-row justify-end gap-4 border-t-2 p-4">
                  <button className="btn-primary" onClick={handleDetailClose}>
                    Close
                  </button>
                </div>
              </div>
            )}
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

export default SpotifyPlaylistDetail;
