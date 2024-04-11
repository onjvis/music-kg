import { RDF_PREFIX } from '../sparql-prefix.model';
import { iriWithPrefix } from '../utils';

enum RdfPredicateName {
  TYPE = 'type',
}

export const RDF_PREDICATE = {
  type: { name: RdfPredicateName.TYPE, iri: iriWithPrefix(RDF_PREFIX, RdfPredicateName.TYPE) },
} as const;
