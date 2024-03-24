import { SelectQuery, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { sparqlGenerator } from './sparql.helpers';
import { GetQueryParams } from './sparql.models';

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
