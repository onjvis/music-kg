import axios from 'axios';

import { GetSparqlResponse, SparqlEntity } from '@music-kg/sparql-data';

import { createGetFromWikidataQuery } from '../../../helpers/queries/create-get-from-wikidata-query';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';

export const getArtistFromWikidataDump = async (externalUrl: string): Promise<SparqlEntity> => {
  const externalUrlParts: string[] = externalUrl.split('/');
  const entityId: string = externalUrlParts[externalUrlParts.length - 1];
  const query: string = createGetFromWikidataQuery({ entityType: 'artist', entityId });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<SparqlEntity>(response?.data?.results?.bindings, {}));
};
