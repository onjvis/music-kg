import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateUserRequest } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  literal,
  MUSIC_KG_USERS_PREFIX,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createInsertQuery } from '../../helpers/queries/create-insert-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const createUser = async (request: CreateUserRequest): Promise<string> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iriWithPrefix(usersPrefix, request.id);

  const triples: Triple[] = [
    { subject: userSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.Person.iri },
    { subject: userSubject, predicate: SCHEMA_PREDICATE.name.iri, object: literal(request.name, XSD_DATATYPE.string) },
    {
      subject: userSubject,
      predicate: SCHEMA_PREDICATE.email.iri,
      object: literal(request.email, XSD_DATATYPE.string),
    },
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: userSubject,
            predicate: SCHEMA_PREDICATE.sameAs.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(usersPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => userSubject.value);
};
