import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iriWithPrefix, MUSIC_KG_ARTISTS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../helpers/queries/create-delete-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const deleteArtist = async (id: string): Promise<void> => {
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const artistSubject: IriTerm = iriWithPrefix(artistsPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(artistsPrefix), subject: artistSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
