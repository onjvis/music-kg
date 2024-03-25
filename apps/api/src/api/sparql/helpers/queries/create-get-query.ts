import { SelectQuery, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { GetQueryParams } from '../../models/get-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

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
