import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { UpdateRecordingRequest } from '@music-kg/data';
import {
  COMPLEX_PREDICATES,
  iriWithPrefix,
  literal,
  MUSIC_KG_RECORDINGS_PREFIX,
  prefix2graph,
  SCHEMA_PREDICATE,
  SPARQL_DATATYPE_MAPPER,
  SparqlIri,
} from '@music-kg/sparql-data';

import { createUpdateQuery } from '../../helpers/queries/create-update-query';
import { getTriplesForComplexPredicate } from '../../helpers/get-triples-for-complex-predicate';
import { replaceBaseUri } from '../../helpers/replace-base-uri';
import { ms2Duration } from './recordings.helpers';

export const updateRecording = async (id: string, request: UpdateRecordingRequest): Promise<void> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const recordingSubject: IriTerm = iriWithPrefix(recordingsPrefix, id);

  const properties = {
    ...(request?.album ? { inAlbum: request?.album } : {}),
    ...(request?.artists ? { byArtist: request?.artists } : {}),
    ...(request?.externalUrls ? { sameAs: request?.externalUrls } : {}),
    ...(request?.datePublished ? { datePublished: request?.datePublished } : {}),
    ...(request?.duration ? { duration: ms2Duration(request?.duration) } : {}),
    ...(request?.isrc ? { isrcCode: request?.isrc } : {}),
    ...(request?.name ? { name: request?.name } : {}),
  };

  const triplesToInsert: Triple[] = [];
  for (const propertyName of Object.keys(properties)) {
    const predicate: SparqlIri = SCHEMA_PREDICATE[propertyName];

    if (COMPLEX_PREDICATES.includes(predicate)) {
      triplesToInsert.push(
        ...(await getTriplesForComplexPredicate(recordingSubject, predicate, properties[propertyName]))
      );
    } else {
      const objectDatatype: SparqlIri = SPARQL_DATATYPE_MAPPER.get(SCHEMA_PREDICATE[propertyName]);

      const newTriples: Triple[] = Array.isArray(properties[propertyName])
        ? properties[propertyName].map(
            (value: string | number): Triple => ({
              subject: recordingSubject,
              predicate: predicate.iri,
              object: literal(value.toString(), objectDatatype),
            })
          )
        : [
            {
              subject: recordingSubject,
              predicate: SCHEMA_PREDICATE[propertyName].iri as IriTerm,
              object: literal(properties[propertyName].toString(), objectDatatype),
            },
          ];

      triplesToInsert.push(...newTriples);
    }
  }

  const predicatesToUpdate: IriTerm[] = Object.keys(properties).map(
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
