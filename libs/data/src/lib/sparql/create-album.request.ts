export type CreateAlbumRequest = {
  id: string;
  albumProductionType: string;
  albumReleaseType: string;
  byArtist: string[];
  datePublished: string;
  image: string;
  name: string;
  numTracks: string;
  sameAs: string;
  track: string[];
};
