import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, iri, MUSIC_KG_ALBUMS_PREFIX, MusicAlbum, prefix2graph } from '@music-kg/sparql-data';

import { createGetByExternalUrlQuery } from '../../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const getAlbumByExternalUrl = async (externalUrl: string): Promise<MusicAlbum> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const albumObject: IriTerm = iri(externalUrl);

  const query: string = createGetByExternalUrlQuery({ graph: prefix2graph(albumsPrefix), object: albumObject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicAlbum>(response?.data?.results?.bindings));
};
