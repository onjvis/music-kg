import { XSD_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

enum XsdDatatypeName {
  DATE = 'date',
  DATE_TIME = 'dateTime',
  DURATION = 'duration',
  INTEGER = 'integer',
  STRING = 'string',
}

export const XSD_DATATYPE = {
  date: { name: XsdDatatypeName.DATE, iri: iri(XSD_PREFIX, XsdDatatypeName.DATE) },
  dateTime: { name: XsdDatatypeName.DATE_TIME, iri: iri(XSD_PREFIX, XsdDatatypeName.DATE_TIME) },
  duration: { name: XsdDatatypeName.DURATION, iri: iri(XSD_PREFIX, XsdDatatypeName.DURATION) },
  integer: { name: XsdDatatypeName.INTEGER, iri: iri(XSD_PREFIX, XsdDatatypeName.INTEGER) },
  string: { name: XsdDatatypeName.STRING, iri: iri(XSD_PREFIX, XsdDatatypeName.STRING) },
} as const;
