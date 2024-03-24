import { IriTerm, Triple } from 'sparqljs';

import { SharedQueryParams } from './shared-query-params.model';

export type UpdateQueryParams = SharedQueryParams & {
  subject: IriTerm;
  triplesToInsert: Triple[];
  predicatesToUpdate: IriTerm[];
};
