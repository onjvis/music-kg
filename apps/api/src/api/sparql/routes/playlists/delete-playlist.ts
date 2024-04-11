import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iriWithPrefix, MUSIC_KG_PLAYLISTS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../helpers/queries/create-delete-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const deletePlaylist = async (id: string): Promise<void> => {
  const playlistsPrefix: string = replaceBaseUri(MUSIC_KG_PLAYLISTS_PREFIX);
  const playlistSubject: IriTerm = iriWithPrefix(playlistsPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(playlistsPrefix), subject: playlistSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
