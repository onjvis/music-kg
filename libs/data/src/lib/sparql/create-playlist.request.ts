export type CreatePlaylistRequest = {
  id: string;
  creator: string;
  description?: string;
  image: string;
  name: string;
  numTracks: string;
  sameAs: string;
  track: string[];
};
