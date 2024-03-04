import { XSD_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

export const XSD_DATATYPE = {
  anyURI: iri(XSD_PREFIX, 'anyURI'),
  date: iri(XSD_PREFIX, 'date'),
  duration: iri(XSD_PREFIX, 'duration'),
  integer: iri(XSD_PREFIX, 'integer'),
  string: iri(XSD_PREFIX, 'string'),
} as const;
