import axios from 'axios';

import { GetSparqlResponse, MUSIC_KG_LINKS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createGetLinksQuery } from '../helpers/queries/create-get-links-query';
import { getLinksFromBindings } from '../helpers/get-links-from-bindings';
import { replaceBaseUri } from '../helpers/replace-base-uri';

export const getEntityLinks = async (entityIri: string) => {
  const linksPrefix: string = replaceBaseUri(MUSIC_KG_LINKS_PREFIX);

  const query: string = createGetLinksQuery({ graph: prefix2graph(linksPrefix), entityIri });

  return await axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getLinksFromBindings(response?.data?.results?.bindings));
};
