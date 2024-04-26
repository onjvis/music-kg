import { SharedQueryParams } from './shared-query-params.model';

export type GetLinksQueryParams = SharedQueryParams & {
  entityIri: string;
};
