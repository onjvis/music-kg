import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iri, MUSIC_KG_USERS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../_helpers/queries/create-delete-query';
import { replaceBaseUri } from '../_helpers/replace-base-uri';

export const deleteUser = async (id: string): Promise<void> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iri(usersPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(usersPrefix), subject: userSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
