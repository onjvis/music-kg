import axios from 'axios';
import { IriTerm } from 'sparqljs';

import { iriWithPrefix, MUSIC_KG_RECORDINGS_PREFIX, prefix2graph } from '@music-kg/sparql-data';

import { createDeleteQuery } from '../../../helpers/queries/create-delete-query';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const deleteRecording = async (id: string): Promise<void> => {
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const recordingSubject: IriTerm = iriWithPrefix(recordingsPrefix, id);

  const query: string = createDeleteQuery({ graph: prefix2graph(recordingsPrefix), subject: recordingSubject });

  return await axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};
