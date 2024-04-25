import { IriTerm, Triple } from 'sparqljs';

import { DataOrigin, EntityData, ExternalUrls } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  MUSIC_KG_USERS_PREFIX,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  SparqlIri,
} from '@music-kg/sparql-data';

import { getPrefixFromOrigin } from './get-prefix-from-origin';
import { getSecondaryEntityTriples } from './get-secondary-entity-triples';
import { replaceBaseUri } from './replace-base-uri';

export const getTriplesForComplexPredicate = async (
  subject: IriTerm,
  predicate: SparqlIri,
  value: string | string[] | EntityData | EntityData[] | ExternalUrls,
  origin?: DataOrigin
): Promise<Triple[]> => {
  const objectPrefix: string =
    predicate === SCHEMA_PREDICATE.creator ? replaceBaseUri(MUSIC_KG_USERS_PREFIX) : getPrefixFromOrigin(origin);

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
        Array.isArray(value) ? (value as EntityData[]) : [value as EntityData],
        origin ?? DataOrigin.LOCAL
      );
    case SCHEMA_PREDICATE.creator:
      return [{ subject, predicate: predicate.iri, object: iriWithPrefix(objectPrefix, value as string) }];
    case SCHEMA_PREDICATE.image:
      return [{ subject, predicate: predicate.iri, object: iri(value as string) }];
    case SCHEMA_PREDICATE.sameAs:
    case SCHEMA_PREDICATE.url:
      return Object.values(value).map(
        (externalUrl: string): Triple => ({ subject, predicate: predicate.iri, object: iri(externalUrl) })
      );
  }
};
