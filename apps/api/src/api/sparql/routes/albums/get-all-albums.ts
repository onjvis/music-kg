import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, MUSIC_KG_ALBUMS_PREFIX, prefix2graph, SCHEMA_TYPE } from '@music-kg/sparql-data';

import { createGetAllQuery } from '../../helpers/queries/create-get-all-query';
import { getEntityIdsFromBindings } from '../../helpers/get-entity-ids-from-bindings';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const getAllAlbums = async (): Promise<string[]> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const musicAlbumType: IriTerm = SCHEMA_TYPE.MusicAlbum.iri;

  const query: string = createGetAllQuery({ graph: prefix2graph(albumsPrefix), object: musicAlbumType });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getEntityIdsFromBindings(response?.data?.results?.bindings));
};
