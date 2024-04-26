import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { DataOrigin, UpdatePlaylistRequest } from '@music-kg/data';
import {
  COMPLEX_PREDICATES,
  iriWithPrefix,
  literal,
  prefix2graph,
  SCHEMA_PREDICATE,
  SPARQL_DATATYPE_MAPPER,
  SparqlIri,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createUpdateQuery } from '../../../helpers/queries/create-update-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getTriplesForComplexPredicate } from '../../../helpers/get-triples-for-complex-predicate';

export const updatePlaylist = async (
  id: string,
  request: UpdatePlaylistRequest,
  origin: DataOrigin
): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const playlistSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const properties = {
    ...(request?.creators ? { creator: request?.creators } : {}),
    ...(request?.description ? { description: request?.description } : {}),
    ...(request?.externalUrls ? { sameAs: request?.externalUrls } : {}),
    ...(request?.imageUrl ? { image: request?.imageUrl } : {}),
    ...(request?.name ? { name: request?.name } : {}),
    ...(request?.numTracks ? { numTracks: request?.numTracks } : {}),
    ...(request?.tracks ? { track: request?.tracks } : {}),
  };

  const triplesToInsert: Triple[] = [];
  for (const propertyName of Object.keys(properties)) {
    const predicate: SparqlIri = SCHEMA_PREDICATE[propertyName];

    if (COMPLEX_PREDICATES.includes(predicate)) {
      triplesToInsert.push(
        ...(await getTriplesForComplexPredicate(playlistSubject, predicate, properties[propertyName], origin))
      );
    } else {
      const objectDatatype: SparqlIri = SPARQL_DATATYPE_MAPPER.get(SCHEMA_PREDICATE[propertyName]);

      const newTriples: Triple[] = Array.isArray(properties[propertyName])
        ? properties[propertyName].map(
            (value: string | number): Triple => ({
              subject: playlistSubject,
              predicate: predicate.iri,
              object: literal(value.toString(), objectDatatype),
            })
          )
        : [
            {
              subject: playlistSubject,
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

  // Change the modified date
  const dateISO: string = new Date().toISOString();
  triplesToInsert.push({
    subject: playlistSubject,
    predicate: SCHEMA_PREDICATE.dateModified.iri,
    object: literal(dateISO, XSD_DATATYPE.dateTime),
  });
  predicatesToUpdate.push(SCHEMA_PREDICATE.dateModified.iri);

  const query: string = createUpdateQuery({
    graph: prefix2graph(originPrefix),
    triplesToInsert,
    subject: playlistSubject,
    predicatesToUpdate,
  });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
      headers: { 'Content-Type': 'application/sparql-update' },
    })
    .then(() => playlistSubject?.value);
};
