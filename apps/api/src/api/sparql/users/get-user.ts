import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, iri, MUSIC_KG_USERS_PREFIX, Person, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../create-get-query';
import { getPropertiesFromBindings } from '../get-properties-from-bindings';
import { replaceBaseUri } from '../sparql.helpers';

export const getUser = async (id: string): Promise<Person> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iri(usersPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(usersPrefix), subject: userSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<Person>(response?.data?.results?.bindings));
};
