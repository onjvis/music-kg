import { Expression, IriTerm, OperationExpression, Update, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { UpdateQueryParams } from '../../_models/update-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createUpdateQuery = ({
  graph,
  subject,
  triplesToInsert,
  predicatesToUpdate,
}: UpdateQueryParams): string => {
  if (!triplesToInsert?.length || !predicatesToUpdate?.length) {
    return;
  }

  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const filterExpression: Expression =
    predicatesToUpdate.length === 1
      ? { type: 'operation', operator: '=', args: [predicateVariable, predicatesToUpdate[0]] }
      : {
          type: 'operation',
          operator: '||',
          args: predicatesToUpdate.map(
            (predicate: IriTerm): OperationExpression => ({
              type: 'operation',
              operator: '=',
              args: [predicateVariable, predicate],
            })
          ),
        };

  const queryObject: Update = {
    type: 'update',
    updates: [
      {
        updateType: 'insertdelete',
        graph: { ...graph, type: 'graph' },
        delete: [{ type: 'bgp', triples: [{ subject, predicate: predicateVariable, object: objectVariable }] }],
        insert: [{ type: 'bgp', triples: triplesToInsert }],
        where: [
          { type: 'bgp', triples: [{ subject, predicate: predicateVariable, object: objectVariable }] },
          { type: 'filter', expression: filterExpression },
        ],
      },
    ],
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
