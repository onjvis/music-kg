import { RDF_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

enum RdfPredicateName {
  TYPE = 'type',
}

export const RDF_PREDICATE = {
  type: { name: RdfPredicateName.TYPE, iri: iri(RDF_PREFIX, RdfPredicateName.TYPE) },
} as const;
