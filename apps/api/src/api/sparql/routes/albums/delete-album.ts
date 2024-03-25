import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iri, MUSIC_KG_ALBUMS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../helpers/queries/create-delete-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const deleteAlbum = async (id: string): Promise<void> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const albumSubject: IriTerm = iri(albumsPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(albumsPrefix), subject: albumSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
