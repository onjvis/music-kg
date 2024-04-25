import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { GetSparqlResponse, iriWithPrefix, MusicGroup, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../../../helpers/queries/create-get-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';

export const getArtist = async (id: string, origin: DataOrigin): Promise<MusicGroup> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const artistSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(originPrefix), subject: artistSubject });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicGroup>(response?.data?.results?.bindings));
};
