import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { GetSparqlResponse, iriWithPrefix, MusicRecording, prefix2graph } from '@music-kg/sparql-data';

import { createGetQuery } from '../../../helpers/queries/create-get-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';

export const getRecording = async (id: string, origin: DataOrigin): Promise<MusicRecording> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const recordingSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(originPrefix), subject: recordingSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicRecording>(response?.data?.results?.bindings));
};
