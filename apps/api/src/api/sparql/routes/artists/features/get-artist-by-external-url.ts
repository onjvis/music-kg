import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, iri, MUSIC_KG_ARTISTS_PREFIX, MusicGroup, prefix2graph } from '@music-kg/sparql-data';

import { createGetByExternalUrlQuery } from '../../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const getArtistByExternalUrl = async (externalUrl: string): Promise<MusicGroup> => {
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const artistObject: IriTerm = iri(externalUrl);

  const query: string = createGetByExternalUrlQuery({ graph: prefix2graph(artistsPrefix), object: artistObject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicGroup>(response?.data?.results?.bindings));
};
