import { MusicAlbumProductionType, MusicAlbumReleaseType } from '@music-kg/sparql-data';
import { CreateAlbumRequest, UpdateAlbumRequest } from '@music-kg/data';

export const isValidAlbumProductionType = (albumProductionType: string): boolean =>
  Object.values(MusicAlbumProductionType).includes(albumProductionType as MusicAlbumProductionType);

export const isValidAlbumReleaseType = (albumReleaseType: string): boolean =>
  Object.values(MusicAlbumReleaseType).includes(albumReleaseType as MusicAlbumReleaseType);

export const runAlbumCreationChecks = (body: CreateAlbumRequest | UpdateAlbumRequest): string => {
  if (
    !body?.albumProductionType ||
    !body?.albumReleaseType ||
    !body?.byArtist ||
    !body?.datePublished ||
    !body?.image ||
    !body?.name ||
    !body?.numTracks ||
    !body?.sameAs ||
    !body?.track
  ) {
    return 'The album does not exist in the RDF database yet, however the request body is missing one or more of the following required properties: albumProductionType, albumReleaseType, byArtist, datePublished, image, name, numTracks, sameAs, track.';
  }

  if (!isValidAlbumProductionType(body?.albumProductionType)) {
    return `The albumProductionType property has unknown value: ${body?.albumProductionType}.`;
  }

  if (!isValidAlbumReleaseType(body?.albumReleaseType)) {
    return `The albumReleaseType property has unknown value: ${body?.albumReleaseType}.`;
  }

  return undefined;
};
