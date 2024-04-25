import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { GetSparqlResponse, iri, MusicPlaylist, prefix2graph } from '@music-kg/sparql-data';

import { createGetByExternalUrlQuery } from '../../../helpers/queries/create-get-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';

export const getPlaylistByExternalUrl = async (externalUrl: string, origin: DataOrigin): Promise<MusicPlaylist> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const playlistObject: IriTerm = iri(externalUrl);

  const query: string = createGetByExternalUrlQuery({ graph: prefix2graph(originPrefix), object: playlistObject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicPlaylist>(response?.data?.results?.bindings));
};
