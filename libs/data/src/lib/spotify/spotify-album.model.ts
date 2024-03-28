export type SpotifyAlbum = {
  albumReleaseType: string;
  id: string;
  image: string;
  label: string;
  name: string;
  releaseDate: string;
  spotifyUrl: string;
  totalTracks: number;
  artists?: string[];
  tracks?: string[];
};
