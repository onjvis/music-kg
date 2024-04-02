import { IriTerm, Triple } from 'sparqljs';

import {
  externalIri,
  iri,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  MUSIC_KG_USERS_PREFIX,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  SparqlIri,
} from '@music-kg/sparql-data';

import { replaceBaseUri } from './replace-base-uri';

export const getTriplesForComplexPredicate = (
  subject: IriTerm,
  predicate: SparqlIri,
  value: string | string[]
): Triple[] => {
  const objectPrefix: string = getPrefixForObject(predicate);

  switch (predicate) {
    case SCHEMA_PREDICATE.albumProductionType:
    case SCHEMA_PREDICATE.albumReleaseType:
      return [{ subject, predicate: predicate.iri, object: SCHEMA_TYPE[value as string].iri }];
    case SCHEMA_PREDICATE.byArtist:
    case SCHEMA_PREDICATE.track:
      if (Array.isArray(value)) {
        return value.map(
          (entry: string): Triple => ({
            subject,
            predicate: predicate.iri,
            object: iri(objectPrefix, entry),
          })
        );
      } else {
        return [{ subject, predicate: predicate.iri, object: iri(objectPrefix, value) }];
      }
    case SCHEMA_PREDICATE.creator:
    case SCHEMA_PREDICATE.inAlbum:
      return [{ subject, predicate: predicate.iri, object: iri(objectPrefix, value as string) }];
    case SCHEMA_PREDICATE.image:
    case SCHEMA_PREDICATE.sameAs:
      return [{ subject, predicate: predicate.iri, object: externalIri(value as string) }];
  }
};

const getPrefixForObject = (predicate: SparqlIri): string => {
  switch (predicate) {
    case SCHEMA_PREDICATE.byArtist:
      return replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
    case SCHEMA_PREDICATE.creator:
      return replaceBaseUri(MUSIC_KG_USERS_PREFIX);
    case SCHEMA_PREDICATE.inAlbum:
      return replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
    case SCHEMA_PREDICATE.track:
      return replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
    default:
      return undefined;
  }
};
