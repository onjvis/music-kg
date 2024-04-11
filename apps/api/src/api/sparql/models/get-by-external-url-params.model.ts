import { IriTerm } from 'sparqljs';

import { SharedQueryParams } from './shared-query-params.model';

export type GetByExternalUrlParams = SharedQueryParams & {
  object: IriTerm;
};
