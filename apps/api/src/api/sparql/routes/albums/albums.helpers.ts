import { CreateAlbumRequest, UpdateAlbumRequest } from '@music-kg/data';
import { MusicAlbumProductionType, MusicAlbumReleaseType } from '@music-kg/sparql-data';

import { albumExists } from './album-exists';

export const runAlbumCreationChecks = async (body: CreateAlbumRequest | UpdateAlbumRequest): Promise<string> => {
  // Will not create a new entity if there is already the entity with the same external ID
  if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
    if (await albumExists(body?.externalUrls)) {
      return 'The artist already exists in the RDF database.';
    }
  }

  if (!body?.name) {
    return 'The request body is missing required property name.';
  }

  if (body?.albumProductionType && !isValidAlbumProductionType(body?.albumProductionType)) {
    return `The albumProductionType property has unknown value: ${body?.albumProductionType}.`;
  }

  if (body?.albumReleaseType && !isValidAlbumReleaseType(body?.albumReleaseType)) {
    return `The albumReleaseType property has unknown value: ${body?.albumReleaseType}.`;
  }

  return undefined;
};

const isValidAlbumProductionType = (albumProductionType: string): boolean =>
  Object.values(MusicAlbumProductionType).includes(albumProductionType as MusicAlbumProductionType);

const isValidAlbumReleaseType = (albumReleaseType: string): boolean =>
  Object.values(MusicAlbumReleaseType).includes(albumReleaseType as MusicAlbumReleaseType);
