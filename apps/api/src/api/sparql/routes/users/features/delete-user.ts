import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iriWithPrefix, MUSIC_KG_USERS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../../helpers/queries/create-delete-query';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const deleteUser = async (id: string): Promise<void> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  const userSubject: IriTerm = iriWithPrefix(usersPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(usersPrefix), subject: userSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
