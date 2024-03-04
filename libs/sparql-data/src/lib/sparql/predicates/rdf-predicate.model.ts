import { RDF_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

export const RDF_PREDICATE = {
  type: iri(RDF_PREFIX, 'type'),
} as const;
