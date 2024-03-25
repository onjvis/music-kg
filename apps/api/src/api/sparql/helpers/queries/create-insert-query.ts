import { Update } from 'sparqljs';

import { InsertQueryParams } from '../../models/insert-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createInsertQuery = ({ graph, triples }: InsertQueryParams): string => {
  const queryObject: Update = {
    type: 'update',
    updates: [{ updateType: 'insert', insert: [{ type: 'graph', triples, name: graph }] }],
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
