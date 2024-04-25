import { SelectQuery, VariableTerm } from 'sparqljs';

import { SCHEMA_PREDICATE, variable } from '@music-kg/sparql-data';

import { GetByExternalUrlParams } from '../../models/get-by-external-url-params.model';
import { GetQueryParams } from '../../models/get-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createGetByExternalUrlQuery = ({ graph, object }: GetByExternalUrlParams): string => {
  const subjectVariable: VariableTerm = variable('subject');
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [subjectVariable, predicateVariable, objectVariable],
    from: { default: [graph], named: [] },
    where: [
      {
        type: 'bgp',
        triples: [
          { subject: subjectVariable, predicate: SCHEMA_PREDICATE.url.iri, object },
          { subject: subjectVariable, predicate: predicateVariable, object: objectVariable },
        ],
      },
    ],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};

export const createGetQuery = ({ graph, subject }: GetQueryParams): string => {
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [predicateVariable, objectVariable],
    from: { default: [graph], named: [] },
    where: [{ type: 'bgp', triples: [{ subject, predicate: predicateVariable, object: objectVariable }] }],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
