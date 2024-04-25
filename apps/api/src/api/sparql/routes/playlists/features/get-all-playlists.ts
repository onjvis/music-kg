import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { GetSparqlResponse, prefix2graph, SCHEMA_TYPE } from '@music-kg/sparql-data';

import { createGetAllQuery } from '../../../helpers/queries/create-get-all-query';
import { getEntityIdsFromBindings } from '../../../helpers/get-entity-ids-from-bindings';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';

export const getAllPlaylists = async (origin: DataOrigin): Promise<string[]> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const musicPlaylistType: IriTerm = SCHEMA_TYPE.MusicPlaylist.iri;

  const query: string = createGetAllQuery({ graph: prefix2graph(originPrefix), object: musicPlaylistType });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getEntityIdsFromBindings(response?.data?.results?.bindings));
};
