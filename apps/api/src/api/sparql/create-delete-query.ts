import { Update, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { sparqlGenerator } from './sparql.helpers';
import { DeleteQueryParams } from './sparql.models';

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
