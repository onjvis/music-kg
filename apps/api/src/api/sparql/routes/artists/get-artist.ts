import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, iri, MUSIC_KG_ARTISTS_PREFIX, MusicGroup, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const getArtist = async (id: string): Promise<MusicGroup> => {
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const artistSubject: IriTerm = iri(artistsPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(artistsPrefix), subject: artistSubject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicGroup>(response?.data?.results?.bindings));
};
