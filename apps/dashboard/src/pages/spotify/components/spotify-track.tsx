import { Track } from '@spotify/web-api-ts-sdk';

import { ms2timeStr } from '../../../utils/ms2timeStr';

type SpotifyTrackProps = {
  track: Track;
  handleSelect: (track: Track) => void;
  selected: boolean;
};

const SpotifyTrack = ({ track, handleSelect, selected }: SpotifyTrackProps) => {
  const onTrackClicked = () => {
    console.log(`SpotifyTrack.onTrackClicked: ${track?.name} (${track?.id})`);
    handleSelect(track);
  };

  return (
    <div
      className={`flex flex-auto flex-row items-center justify-between gap-4 rounded-lg border-2 p-4 hover:bg-teal-200 hover:cursor-pointer${
        selected ? ' bg-teal-200' : ''
      }`}
      onClick={onTrackClicked}
    >
      <div className="flex flex-row items-center gap-4">
        <img className="rounded-lg" src={track?.album?.images?.[2]?.url} alt="album cover" height="64px" width="64px" />
        <div className="flex flex-col gap-1">
          <strong className="text-lg">{track?.name}</strong>
          <span>{track?.artists?.[0]?.name}</span>
          <span className="text-sm">
            {track?.artists
              ?.slice(1)
              ?.map((artist) => artist?.name)
              ?.join(', ')}
          </span>
        </div>
      </div>
      <span className="text-2xl">{ms2timeStr(track?.duration_ms)}</span>
    </div>
  );
};

export default SpotifyTrack;
