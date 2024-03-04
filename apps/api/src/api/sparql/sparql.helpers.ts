import { Generator, SparqlGenerator } from 'sparqljs';

import { MUSIC_KG_BASE_URI } from '@music-kg/sparql-data';

export const replaceBaseUri = (uri: string) => {
  return uri.replace(MUSIC_KG_BASE_URI, process.env.MUSIC_KG_BASE_URI);
};

export const sparqlGenerator: SparqlGenerator = new Generator();
