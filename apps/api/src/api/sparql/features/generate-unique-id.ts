import axios from 'axios';

import { DataOrigin } from '@music-kg/data';
import { prefix2graph } from '@music-kg/sparql-data';

import { createExistsByEntityIdQuery } from '../helpers/queries/create-ask-query';
import { getPrefixFromOrigin } from '../helpers/get-prefix-from-origin';

export const generateUniqueId = async (origin: DataOrigin): Promise<string> => {
  let id: string;
  let idAlreadyExists: boolean;

  const originPrefix: string = getPrefixFromOrigin(origin);

  do {
    id = crypto.randomUUID();

    const query = createExistsByEntityIdQuery({ graph: prefix2graph(originPrefix), id: `${originPrefix}${id}` });

    idAlreadyExists = await axios
      .get(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
      .then((response) => response?.data?.boolean);
  } while (idAlreadyExists);

  return id;
};
