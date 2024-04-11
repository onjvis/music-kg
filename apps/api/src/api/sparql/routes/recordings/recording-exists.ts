import axios from 'axios';

import { ExternalUrls } from '@music-kg/data';
import { MUSIC_KG_RECORDINGS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createExistsByExternalIdQuery } from '../../helpers/queries/create-ask-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const recordingExists = async (externalUrls?: ExternalUrls): Promise<boolean> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const query: string = createExistsByExternalIdQuery({
    graph: prefix2graph(recordingsPrefix),
    id: externalUrls?.spotify ?? externalUrls?.wikidata,
  });

  return axios
    .get(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => response?.data?.boolean);
};
