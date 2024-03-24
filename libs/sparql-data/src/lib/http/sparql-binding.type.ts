import { SparqlObject } from './sparql-object.type';
import { SparqlPredicate } from './sparql-predicate.type';
import { SparqlSubject } from './sparql-subject.type';

export type SparqlBinding = {
  subject?: SparqlSubject;
  predicate?: SparqlPredicate;
  object?: SparqlObject;
};
