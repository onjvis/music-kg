import { SCHEMA_PREDICATE } from './predicates/schema-predicate.model';
import { XSD_DATATYPE } from './types/xsd-datatype.model';
import { SparqlIri } from './sparql-iri.type';

export const SPARQL_DATATYPE_MAPPER: Map<SparqlIri, SparqlIri> = new Map<SparqlIri, SparqlIri>([
  [SCHEMA_PREDICATE.datePublished, XSD_DATATYPE.date],
  [SCHEMA_PREDICATE.email, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.duration, XSD_DATATYPE.duration],
  [SCHEMA_PREDICATE.isrcCode, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.name, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.sameAs, XSD_DATATYPE.anyURI],
]);

export const COMPLEX_PREDICATES: SparqlIri[] = [SCHEMA_PREDICATE.byArtist, SCHEMA_PREDICATE.inAlbum];
