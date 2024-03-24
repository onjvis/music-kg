import { Update } from 'sparqljs';

import { sparqlGenerator } from './sparql.helpers';
import { InsertQueryParams } from './sparql.models';

export const createInsertQuery = ({ graph, triples }: InsertQueryParams): string => {
  const queryObject: Update = {
    type: 'update',
    updates: [{ updateType: 'insert', insert: [{ type: 'graph', triples, name: graph }] }],
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
