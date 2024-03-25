import { IriTerm } from 'sparqljs';

import { SharedQueryParams } from './shared-query-params.model';

export type GetAllQueryParams = SharedQueryParams & {
  object: IriTerm;
};
