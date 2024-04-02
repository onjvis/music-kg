import { PlayHistory, Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';

import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';
import { SpotifyTrackDetail } from '../components/spotify-track-detail';
import { SpotifyTrackItem } from '../components/spotify-track-item';

export const SpotifyLatest = () => {
  const [latestTracks, setLatestTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleGetRecentlyPlayed = async (): Promise<void> => {
    const { data } = await httpClient.get(ApiUrl.SPOTIFY_RECENTLY_PLAYED);
    setLatestTracks(data);
  };

  const handleSelect = (track: Track): void => {
    setSelectedTrack(track);
    window.scrollTo(0, 0);
  };

  const handleDetailClose = (): void => setSelectedTrack(null);

  return (
    <div className="flex flex-grow flex-col gap-8">
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
      <div className="flex flex-row items-center justify-between gap-4">
        <h1>Your latest played tracks</h1>
        <button className="btn-primary" onClick={handleGetRecentlyPlayed}>
          {latestTracks?.length ? 'Refresh' : 'Get latest played songs'}
        </button>
      </div>
      {!!latestTracks?.length && (
        <div className="flex flex-col gap-4">
          {latestTracks.map((item: PlayHistory) => (
            <SpotifyTrackItem
              key={`${item?.track?.id}${item?.played_at}`}
              track={item?.track}
              handleSelect={handleSelect}
              selected={selectedTrack === item?.track}
            />
          ))}
        </div>
      )}
    </div>
  );
};
