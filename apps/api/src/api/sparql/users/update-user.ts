import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { UpdateUserRequest } from '@music-kg/data';
import {
  iri,
  literal,
  MUSIC_KG_USERS_PREFIX,
  prefix2graph,
  SCHEMA_PREDICATE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createUpdateQuery } from '../create-update-query';
import { replaceBaseUri } from '../sparql.helpers';

export const updateUser = async (id: string, request: UpdateUserRequest): Promise<void> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iri(usersPrefix, id);

  const triplesToInsert: Triple[] = Object.keys(request).map(
    (propertyName: string): Triple => ({
      subject: userSubject,
      predicate: SCHEMA_PREDICATE[propertyName].iri,
      object: literal(request[propertyName], XSD_DATATYPE.string),
    })
  );
  const predicatesToUpdate: IriTerm[] = Object.keys(request).map(
    (propertyName: string) => SCHEMA_PREDICATE[propertyName].iri
  );

  const query: string = createUpdateQuery({
    graph: prefix2graph(usersPrefix),
    triplesToInsert,
    subject: userSubject,
    predicatesToUpdate,
  });

  return axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
