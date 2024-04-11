import { Pattern } from 'sparqljs';

import { SharedQueryParams } from './shared-query-params.model';

export type AskQueryParams = SharedQueryParams & {
  patterns: Pattern[];
};
