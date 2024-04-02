import { Track } from '@spotify/web-api-ts-sdk';

import { FlexTextRow } from '../../../components/flex-text-row';
import { ms2timeStr } from '../../../utils/ms2timeStr';

type SpotifyTrackDetailProps = {
  track: Track;
};

export const SpotifyTrackDetail = ({ track }: SpotifyTrackDetailProps) => {
  return (
    <div className="flex flex-row gap-2 p-4">
      <div className="flex w-1/4 flex-col gap-4">
        <img className="rounded-lg" src={track?.album?.images?.[0]?.url} alt="album cover" />
        {track?.preview_url && <audio className="w-full rounded-lg" controls src={track?.preview_url}></audio>}
      </div>
      <div className="flex flex-1 flex-col justify-between border-l-2 pl-4">
        <div className="flex flex-1 flex-col gap-2 pb-4">
          <strong className="text-4xl">{track?.name}</strong>
          <strong className="text-2xl">{track?.artists?.[0]?.name}</strong>
          {track?.artists?.length > 1 && (
            <span>
              {track?.artists
                ?.slice(1)
                ?.map((artist) => artist?.name)
                ?.join(', ')}
            </span>
          )}
          <FlexTextRow label="Duration" value={ms2timeStr(track?.duration_ms)} />
          <FlexTextRow label="Track number" value={`${track?.track_number} of ${track?.album?.total_tracks}`} />
          <FlexTextRow label="ISRC" value={track?.external_ids?.isrc} />
          <FlexTextRow label="URI" value={track?.uri} />
        </div>
        <div className="flex flex-1 flex-col gap-2 border-t-2 pt-4">
          <h2>Album information</h2>
          <FlexTextRow label="Name" value={track?.album?.name} />
          <FlexTextRow label="Artists" value={track?.album?.artists?.map((artist) => artist?.name)?.join(', ')} />
          <FlexTextRow label="Album type" value={track?.album?.album_type} />
          <FlexTextRow label="Number of tracks" value={track?.album?.total_tracks.toString()} />
          <FlexTextRow label="Release date" value={new Date(track?.album?.release_date).toLocaleDateString('en-GB')} />
          <FlexTextRow label="URI" value={track?.album?.uri} />
        </div>
      </div>
    </div>
  );
};
