import { Update, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { DeleteQueryParams } from '../../_models/delete-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createDeleteQuery = ({ graph, subject }: DeleteQueryParams): string => {
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const queryObject: Update = {
    type: 'update',
    updates: [
      {
        updateType: 'deletewhere',
        delete: [
          { type: 'graph', triples: [{ subject, predicate: predicateVariable, object: objectVariable }], name: graph },
        ],
      },
    ],
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
