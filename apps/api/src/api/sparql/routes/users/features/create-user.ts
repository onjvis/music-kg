import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateUserRequest, DataOrigin } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  literal,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';

export const createUser = async (
  request: CreateUserRequest,
  origin: DataOrigin = DataOrigin.LOCAL_USERS
): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const userSubject: IriTerm = iriWithPrefix(originPrefix, request.id);

  const triples: Triple[] = [
    { subject: userSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.Person.iri },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.name.iri, object: literal(request.name, XSD_DATATYPE.string) },
    ...(request.email ? [{
      subject: userSubject,
      predicate: SCHEMA_PREDICATE.email.iri,
      object: literal(request.email, XSD_DATATYPE.string),
    }]: []),
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: userSubject,
            predicate: SCHEMA_PREDICATE.url.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(originPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => userSubject.value);
};
