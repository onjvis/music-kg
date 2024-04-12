import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { UpdateAlbumRequest } from '@music-kg/data';
import {
  COMPLEX_PREDICATES,
  iriWithPrefix,
  literal,
  MUSIC_KG_ALBUMS_PREFIX,
  prefix2graph,
  SCHEMA_PREDICATE,
  SPARQL_DATATYPE_MAPPER,
  SparqlIri,
} from '@music-kg/sparql-data';

import { createUpdateQuery } from '../../../helpers/queries/create-update-query';
import { getTriplesForComplexPredicate } from '../../../helpers/get-triples-for-complex-predicate';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const updateAlbum = async (id: string, request: UpdateAlbumRequest): Promise<void> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const albumSubject: IriTerm = iriWithPrefix(albumsPrefix, id);

  const properties = {
    ...(request?.artists ? { byArtist: request?.artists } : {}),
    ...(request?.albumProductionType ? { albumProductionType: request?.albumProductionType } : {}),
    ...(request?.albumReleaseType ? { albumReleaseType: request?.albumReleaseType } : {}),
    ...(request?.datePublished ? { datePublished: request?.datePublished } : {}),
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
      triplesToInsert.push(...(await getTriplesForComplexPredicate(albumSubject, predicate, properties[propertyName])));
    } else {
      const objectDatatype: SparqlIri = SPARQL_DATATYPE_MAPPER.get(SCHEMA_PREDICATE[propertyName]);

      const newTriples: Triple[] = Array.isArray(properties[propertyName])
        ? properties[propertyName].map(
            (value: string | number): Triple => ({
              subject: albumSubject,
              predicate: predicate.iri,
              object: literal(value.toString(), objectDatatype),
            })
          )
        : [
            {
              subject: albumSubject,
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
    graph: prefix2graph(albumsPrefix),
    triplesToInsert,
    subject: albumSubject,
    predicatesToUpdate,
  });

  return axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};