import axios from 'axios';

import { DataOrigin, ExternalUrls } from '@music-kg/data';
import { prefix2graph } from '@music-kg/sparql-data';

import { createExistsByExternalIdQuery } from '../../../helpers/queries/create-ask-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';

export const playlistExists = async (externalUrls: ExternalUrls, origin: DataOrigin): Promise<boolean> => {
  const originPrefix: string = getPrefixFromOrigin(origin);

  const query: string = createExistsByExternalIdQuery({
    graph: prefix2graph(originPrefix),
    id: externalUrls?.spotify ?? externalUrls?.wikidata,
  });

  return axios
    .get(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => response?.data?.boolean);
};
