import { SparqlEntity } from '../sparql-entity.model';

/**
 * Reflects https://schema.org/Thing
 */
export type Thing = SparqlEntity & {
  image?: string; // as IRI
  name: string;
  sameAs?: string; // as IRI
};
