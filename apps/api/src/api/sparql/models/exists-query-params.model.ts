import { SharedQueryParams } from './shared-query-params.model';

export type ExistsQueryParams = SharedQueryParams & {
  externalId: string;
};
