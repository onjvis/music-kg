import { FaSpotify } from 'react-icons/fa6';
import { IconContext } from 'react-icons';

type SpotifyIconProps = {
  size?: string;
};

export const SpotifyIcon = ({ size = '1.5em' }: SpotifyIconProps) => {
  return (
    <IconContext.Provider value={{ color: '1DB954', size }}>
      <FaSpotify />
    </IconContext.Provider>
  );
};
