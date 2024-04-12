import axios from 'axios';
import { IriTerm } from 'sparqljs';

import {
  GetSparqlResponse,
  iriWithPrefix,
  MUSIC_KG_RECORDINGS_PREFIX,
  MusicRecording,
  prefix2graph,
} from '@music-kg/sparql-data';

import { createGetQuery } from '../../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const getRecording = async (id: string): Promise<MusicRecording> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const recordingSubject: IriTerm = iriWithPrefix(recordingsPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(recordingsPrefix), subject: recordingSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicRecording>(response?.data?.results?.bindings));
};