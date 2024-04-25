import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iriWithPrefix, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../../helpers/queries/create-delete-query';
import { DataOrigin } from '@music-kg/data';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';

export const deleteAlbum = async (id: string, origin: DataOrigin): Promise<void> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const albumSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(originPrefix), subject: albumSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
