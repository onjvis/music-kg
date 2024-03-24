import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { UpdateRecordingRequest } from '@music-kg/data';
import {
  COMPLEX_PREDICATES,
  iri,
  literal,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  prefix2graph,
  SCHEMA_PREDICATE,
  SPARQL_DATATYPE_MAPPER,
  SparqlIri,
} from '@music-kg/sparql-data';

import { createUpdateQuery } from '../create-update-query';
import { replaceBaseUri } from '../sparql.helpers';

export const updateRecording = async (id: string, request: UpdateRecordingRequest): Promise<void> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const recordingSubject: IriTerm = iri(recordingsPrefix, id);

  const triplesToInsert: Triple[] = [];
  Object.keys(request).forEach((propertyName: string): void => {
    const predicate: SparqlIri = SCHEMA_PREDICATE[propertyName];

    if (COMPLEX_PREDICATES.includes(predicate)) {
      triplesToInsert.push(...getTriplesForComplexPredicate(recordingSubject, predicate, request[propertyName]));
    } else {
      const objectDatatype: SparqlIri = SPARQL_DATATYPE_MAPPER.get(SCHEMA_PREDICATE[propertyName]);
      triplesToInsert.push({
        subject: recordingSubject,
        predicate: SCHEMA_PREDICATE[propertyName].iri as IriTerm,
        object: literal(request[propertyName], objectDatatype),
      });
    }
  });

  const predicatesToUpdate: IriTerm[] = Object.keys(request).map(
    (propertyName: string) => SCHEMA_PREDICATE[propertyName].iri
  );

  const query: string = createUpdateQuery({
    graph: prefix2graph(recordingsPrefix),
    triplesToInsert,
    subject: recordingSubject,
    predicatesToUpdate,
  });

  return axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};

const getTriplesForComplexPredicate = (subject: IriTerm, predicate: SparqlIri, value: string | string[]): Triple[] => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);

  switch (predicate) {
    case SCHEMA_PREDICATE.byArtist:
      if (Array.isArray(value)) {
        return value.map(
          (entry: string): Triple => ({ subject, predicate: predicate.iri, object: iri(artistsPrefix, entry) })
        );
      } else {
        return [{ subject, predicate: predicate.iri, object: iri(artistsPrefix, value) }];
      }
    case SCHEMA_PREDICATE.inAlbum:
      return [{ subject, predicate: SCHEMA_PREDICATE.inAlbum.iri, object: iri(albumsPrefix, value as string) }];
  }
};
