export const getAlbumReleaseType = (spotifyAlbumType: string): string => {
  switch (spotifyAlbumType) {
    case 'album':
      return 'AlbumRelease';
    case 'single':
      return 'SingleRelease';
    default:
      return undefined;
  }
};
