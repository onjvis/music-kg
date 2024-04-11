import { XSD_PREFIX } from '../sparql-prefix.model';
import { iriWithPrefix } from '../utils';

enum XsdDatatypeName {
  DATE = 'date',
  DATE_TIME = 'dateTime',
  DURATION = 'duration',
  INTEGER = 'integer',
  STRING = 'string',
}

export const XSD_DATATYPE = {
  date: { name: XsdDatatypeName.DATE, iri: iriWithPrefix(XSD_PREFIX, XsdDatatypeName.DATE) },
  dateTime: { name: XsdDatatypeName.DATE_TIME, iri: iriWithPrefix(XSD_PREFIX, XsdDatatypeName.DATE_TIME) },
  duration: { name: XsdDatatypeName.DURATION, iri: iriWithPrefix(XSD_PREFIX, XsdDatatypeName.DURATION) },
  integer: { name: XsdDatatypeName.INTEGER, iri: iriWithPrefix(XSD_PREFIX, XsdDatatypeName.INTEGER) },
  string: { name: XsdDatatypeName.STRING, iri: iriWithPrefix(XSD_PREFIX, XsdDatatypeName.STRING) },
} as const;
