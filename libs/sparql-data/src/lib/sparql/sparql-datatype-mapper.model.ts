import { SCHEMA_PREDICATE } from './predicates/schema-predicate.model';
import { XSD_DATATYPE } from './types/xsd-datatype.model';
import { SparqlIri } from './sparql-iri.type';

export const SPARQL_DATATYPE_MAPPER: Map<SparqlIri, SparqlIri> = new Map<SparqlIri, SparqlIri>([
  [SCHEMA_PREDICATE.dateCreated, XSD_DATATYPE.dateTime],
  [SCHEMA_PREDICATE.dateModified, XSD_DATATYPE.dateTime],
  [SCHEMA_PREDICATE.datePublished, XSD_DATATYPE.date],
  [SCHEMA_PREDICATE.description, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.duration, XSD_DATATYPE.duration],
  [SCHEMA_PREDICATE.email, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.genre, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.isrcCode, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.name, XSD_DATATYPE.string],
  [SCHEMA_PREDICATE.numTracks, XSD_DATATYPE.integer],
]);

export const COMPLEX_PREDICATES: SparqlIri[] = [
  SCHEMA_PREDICATE.album,
  SCHEMA_PREDICATE.albumProductionType,
  SCHEMA_PREDICATE.albumReleaseType,
  SCHEMA_PREDICATE.byArtist,
  SCHEMA_PREDICATE.creator,
  SCHEMA_PREDICATE.inAlbum,
  SCHEMA_PREDICATE.image,
  SCHEMA_PREDICATE.sameAs,
  SCHEMA_PREDICATE.track,
  SCHEMA_PREDICATE.url,
];
