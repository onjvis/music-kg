import { IriTerm, Triple } from 'sparqljs';

import { EntityData, ExternalUrls } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  MUSIC_KG_USERS_PREFIX,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  SparqlIri,
} from '@music-kg/sparql-data';

import { getSecondaryEntityTriples } from './get-secondary-entity-triples';
import { replaceBaseUri } from './replace-base-uri';

export const getTriplesForComplexPredicate = async (
  subject: IriTerm,
  predicate: SparqlIri,
  value: string | string[] | EntityData | EntityData[] | ExternalUrls
): Promise<Triple[]> => {
  const objectPrefix: string = getPrefixForObject(predicate);

  switch (predicate) {
    case SCHEMA_PREDICATE.albumProductionType:
    case SCHEMA_PREDICATE.albumReleaseType:
      return [{ subject, predicate: predicate.iri, object: SCHEMA_TYPE[value as string].iri }];
    case SCHEMA_PREDICATE.album:
    case SCHEMA_PREDICATE.byArtist:
    case SCHEMA_PREDICATE.inAlbum:
    case SCHEMA_PREDICATE.track:
      return await getSecondaryEntityTriples(
        subject,
        predicate.iri,
        objectPrefix,
        Array.isArray(value) ? (value as EntityData[]) : [value as EntityData]
      );
    case SCHEMA_PREDICATE.creator:
      return [{ subject, predicate: predicate.iri, object: iriWithPrefix(objectPrefix, value as string) }];
    case SCHEMA_PREDICATE.image:
      return [{ subject, predicate: predicate.iri, object: iri(value as string) }];
    case SCHEMA_PREDICATE.sameAs:
      return Object.values(value).map(
        (externalUrl: string): Triple => ({ subject, predicate: predicate.iri, object: iri(externalUrl) })
      );
  }
};

const getPrefixForObject = (predicate: SparqlIri): string => {
  switch (predicate) {
    case SCHEMA_PREDICATE.byArtist:
      return replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
    case SCHEMA_PREDICATE.creator:
      return replaceBaseUri(MUSIC_KG_USERS_PREFIX);
    case SCHEMA_PREDICATE.album:
    case SCHEMA_PREDICATE.inAlbum:
      return replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
    case SCHEMA_PREDICATE.track:
      return replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
    default:
      return undefined;
  }
};
