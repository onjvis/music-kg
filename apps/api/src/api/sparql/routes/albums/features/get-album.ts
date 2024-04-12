import axios from 'axios';
import { IriTerm } from 'sparqljs';

import {
  GetSparqlResponse,
  iriWithPrefix,
  MUSIC_KG_ALBUMS_PREFIX,
  MusicAlbum,
  prefix2graph,
} from '@music-kg/sparql-data';

import { createGetQuery } from '../../../helpers/queries/create-get-query';
import { getPropertiesFromBindings } from '../../../helpers/get-properties-from-bindings';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const getAlbum = async (id: string): Promise<MusicAlbum> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const recordingSubject: IriTerm = iriWithPrefix(albumsPrefix, id);

  const query: string = createGetQuery({ graph: prefix2graph(albumsPrefix), subject: recordingSubject });

  return axios
    .get<GetSparqlResponse>(process.env.MUSIC_KG_SPARQL_ENDPOINT, { params: { query } })
    .then((response) => getPropertiesFromBindings<MusicAlbum>(response?.data?.results?.bindings));
};
