import axios from 'axios';

import { MUSIC_KG_USERS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createExistsByEntityIdQuery, createExistsByExternalIdQuery } from '../../helpers/queries/create-ask-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';
import { UserExistsParams } from './users.models';

export const userExists = async (params: UserExistsParams): Promise<boolean> => {
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);
  let query: string;

  if (params?.externalUrls) {
    query = createExistsByExternalIdQuery({ graph: prefix2graph(usersPrefix), id: params?.externalUrls?.spotify ?? params?.externalUrls?.wikidata });
  } else if (params?.id) {
    query = createExistsByEntityIdQuery({ graph: prefix2graph(usersPrefix), id: params?.id });
  } else {
    return false;
  }

  return axios
    .get(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => response?.data?.boolean);
};
