import { BlankTerm, IriTerm, LiteralTerm, VariableTerm } from 'sparqljs';

import { SparqlIri } from './sparql-iri.type';

export const iri = (prefix: string, resourceId?: string): IriTerm => {
  return {
    termType: 'NamedNode',
    value: `${prefix}${resourceId ?? ''}`,
  } as IriTerm;
};

export const literal = (value: string, datatype: SparqlIri): LiteralTerm => {
  return {
    termType: 'Literal',
    value,
    datatype: datatype.iri,
  } as LiteralTerm;
};

export const blankNode = (value: string): BlankTerm => {
  return {
    termType: 'BlankNode',
    value,
  } as BlankTerm;
};

export const variable = (value: string): VariableTerm => {
  return {
    termType: 'Variable',
    value,
  } as VariableTerm;
};

export const prefix2graph = (prefix: string): IriTerm => {
  return iri(prefix.slice(0, -1));
};
