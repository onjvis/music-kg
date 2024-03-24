import { IriTerm, Triple } from 'sparqljs';

export type SharedQueryParams = {
  graph: IriTerm;
};

export type DeleteQueryParams = SharedQueryParams & {
  subject: IriTerm;
};

export type GetAllQueryParams = SharedQueryParams & {
  object: IriTerm;
};

export type GetQueryParams = SharedQueryParams & {
  subject: IriTerm;
};

export type InsertQueryParams = SharedQueryParams & {
  triples: Triple[];
};

export type UpdateQueryParams = SharedQueryParams & {
  subject: IriTerm;
  triplesToInsert: Triple[];
  predicatesToUpdate: IriTerm[];
};
