import { Triple } from 'sparqljs';

import { SharedQueryParams } from './shared-query-params.model';

export type InsertQueryParams = SharedQueryParams & {
  triples: Triple[];
};
