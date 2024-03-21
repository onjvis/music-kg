import { SparqlObject } from './sparql-object.type';
import { SparqlPredicate } from './sparql-predicate.type';

export type SparqlBinding = {
  predicate: SparqlPredicate;
  object: SparqlObject;
};
