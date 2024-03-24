import axios from 'axios';
import { IriTerm } from 'sparqljs';

import {
  GetSparqlResponse,
  iri,
  MUSIC_KG_RECORDINGS_PREFIX,
  MusicRecording,
  prefix2graph,
} from '@music-kg/sparql-data';

import { createGetQuery } from '../create-get-query';
import { getPropertiesFromBindings } from '../get-properties-from-bindings';
import { replaceBaseUri } from '../sparql.helpers';

export const getRecording = async (id: string): Promise<MusicRecording> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const recordingSubject: IriTerm = iri(recordingsPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(recordingsPrefix), subject: recordingSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicRecording>(response?.data?.results?.bindings));
};