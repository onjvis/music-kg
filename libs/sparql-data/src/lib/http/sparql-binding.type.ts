import { IriTerm, LiteralTerm } from 'sparqljs';

export type SparqlBinding = {
  subject?: IriTerm;
  predicate?: IriTerm;
  object?: IriTerm | LiteralTerm;
};
