import axios from 'axios';

import { ExternalUrls } from '@music-kg/data';
import { MUSIC_KG_PLAYLISTS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createExistsByExternalIdQuery } from '../../../helpers/queries/create-ask-query';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const playlistExists = async (externalUrl?: ExternalUrls): Promise<boolean> => {
  const playlistsPrefix: string = replaceBaseUri(MUSIC_KG_PLAYLISTS_PREFIX);

  const query: string = createExistsByExternalIdQuery({
    graph: prefix2graph(playlistsPrefix),
    id: externalUrl?.spotify ?? externalUrl?.wikidata,
  });

  return axios
    .get(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => response?.data?.boolean);
};
