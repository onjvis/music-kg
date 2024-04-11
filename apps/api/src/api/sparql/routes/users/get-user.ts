import axios from 'axios';
import { IriTerm } from 'sparqljs';

import {
  GetSparqlResponse,
  iri,
  iriWithPrefix,
  MUSIC_KG_USERS_PREFIX,
  Person,
  prefix2graph,
} from '@music-kg/sparql-data';

import { createGetByExternalUrlQuery, createGetQuery } from '../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const getUser = async (id: string): Promise<Person> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iriWithPrefix(usersPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(usersPrefix), subject: userSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<Person>(response?.data?.results?.bindings));
};

export const getUserByExternalUrl = async (externalUrl: string): Promise<Person> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userObject: IriTerm = iri(externalUrl);

  const query: string = createGetByExternalUrlQuery({ graph: prefix2graph(usersPrefix), object: userObject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<Person>(response?.data?.results?.bindings));
};
