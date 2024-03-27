import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, iri, MUSIC_KG_PLAYLISTS_PREFIX, MusicPlaylist, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const getPlaylist = async (id: string): Promise<MusicPlaylist> => {
  const playlistPrefix: string = replaceBaseUri(MUSIC_KG_PLAYLISTS_PREFIX);
  const playlistSubject: IriTerm = iri(playlistPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(playlistPrefix), subject: playlistSubject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicPlaylist>(response?.data?.results?.bindings));
};
