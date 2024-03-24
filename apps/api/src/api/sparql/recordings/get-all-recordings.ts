import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { GetSparqlResponse, MUSIC_KG_RECORDINGS_PREFIX, prefix2graph, SCHEMA_TYPE } from '@music-kg/sparql-data';

import { createGetAllQuery } from '../create-get-all-query';
import { getEntityIdsFromBindings } from '../get-entity-ids-from-bindings';
import { replaceBaseUri } from '../sparql.helpers';

export const getAllRecordings = async (): Promise<string[]> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const musicRecordingType: IriTerm = SCHEMA_TYPE.MusicRecording.iri;

  const query: string = createGetAllQuery({ graph: prefix2graph(recordingsPrefix), object: musicRecordingType });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getEntityIdsFromBindings(response?.data?.results?.bindings));
};
