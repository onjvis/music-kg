import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, MUSIC_KG_USERS_PREFIX, prefix2graph, SCHEMA_TYPE } from '@music-kg/sparql-data';

import { createGetAllQuery } from '../_helpers/queries/create-get-all-query';
import { getEntityIdsFromBindings } from '../_helpers/get-entity-ids-from-bindings';
import { replaceBaseUri } from '../_helpers/replace-base-uri';

export const getAllUsers = async (): Promise<string[]> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userType: IriTerm = SCHEMA_TYPE.Person.iri;

  const query: string = createGetAllQuery({ graph: prefix2graph(usersPrefix), object: userType });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getEntityIdsFromBindings(response?.data?.results?.bindings));
};
