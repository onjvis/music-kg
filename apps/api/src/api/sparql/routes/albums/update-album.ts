import { UpdateAlbumRequest } from '@music-kg/data';
import { IriTerm, Triple } from 'sparqljs';
import {
  COMPLEX_PREDICATES,
  iri,
  literal,
  MUSIC_KG_ALBUMS_PREFIX,
  prefix2graph,
  SCHEMA_PREDICATE,
  SPARQL_DATATYPE_MAPPER,
  SparqlIri,
} from '@music-kg/sparql-data';
import { createUpdateQuery } from '../../helpers/queries/create-update-query';
import { getTriplesForComplexPredicate } from '../../helpers/get-triples-for-complex-predicate';
import axios from 'axios';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const updateAlbum = async (id: string, request: UpdateAlbumRequest): Promise<void> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const albumSubject: IriTerm = iri(albumsPrefix, id);

  const triplesToInsert: Triple[] = [];
  Object.keys(request).forEach((propertyName: string): void => {
    const predicate: SparqlIri = SCHEMA_PREDICATE[propertyName];

    if (COMPLEX_PREDICATES.includes(predicate)) {
      triplesToInsert.push(...getTriplesForComplexPredicate(albumSubject, predicate, request[propertyName]));
    } else {
      const objectDatatype: SparqlIri = SPARQL_DATATYPE_MAPPER.get(SCHEMA_PREDICATE[propertyName]);
      triplesToInsert.push({
        subject: albumSubject,
        predicate: SCHEMA_PREDICATE[propertyName].iri as IriTerm,
        object: literal(request[propertyName], objectDatatype),
      });
    }
  });

  const predicatesToUpdate: IriTerm[] = Object.keys(request).map(
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
