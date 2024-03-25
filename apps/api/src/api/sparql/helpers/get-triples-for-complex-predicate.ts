import { IriTerm, Triple } from 'sparqljs';

import {
  iri,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  SCHEMA_PREDICATE,
  SparqlIri,
} from '@music-kg/sparql-data';

import { replaceBaseUri } from './replace-base-uri';

export const getTriplesForComplexPredicate = (
  subject: IriTerm,
  predicate: SparqlIri,
  value: string | string[]
): Triple[] => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  switch (predicate) {
    case SCHEMA_PREDICATE.byArtist:
      if (Array.isArray(value)) {
        return value.map(
          (entry: string): Triple => ({
            subject,
            predicate: SCHEMA_PREDICATE.byArtist.iri,
            object: iri(artistsPrefix, entry),
          })
        );
      } else {
        return [{ subject, predicate: SCHEMA_PREDICATE.byArtist.iri, object: iri(artistsPrefix, value) }];
      }
    case SCHEMA_PREDICATE.inAlbum:
      return [{ subject, predicate: SCHEMA_PREDICATE.inAlbum.iri, object: iri(albumsPrefix, value as string) }];
    case SCHEMA_PREDICATE.track:
      if (Array.isArray(value)) {
        return value.map(
          (entry: string): Triple => ({
            subject,
            predicate: SCHEMA_PREDICATE.track.iri,
            object: iri(recordingsPrefix, entry),
          })
        );
      } else {
        return [{ subject, predicate: SCHEMA_PREDICATE.track.iri, object: iri(recordingsPrefix, value) }];
      }
  }
};
