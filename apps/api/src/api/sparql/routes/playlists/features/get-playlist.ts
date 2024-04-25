import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { GetSparqlResponse, iriWithPrefix, MusicPlaylist, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../../../helpers/queries/create-get-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';

export const getPlaylist = async (id: string, origin: DataOrigin): Promise<MusicPlaylist> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const playlistSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(originPrefix), subject: playlistSubject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicPlaylist>(response?.data?.results?.bindings));
};
