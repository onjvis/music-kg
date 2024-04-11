import { IriTerm, Update, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { UpdateQueryParams } from '../../models/update-query-params.model';
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

  const queryObject: Update = {
    type: 'update',
    updates: [
      {
        updateType: 'insertdelete',
        graph: { ...graph, type: 'graph' },
        delete: [{ type: 'bgp', triples: [{ subject, predicate: predicateVariable, object: objectVariable }] }],
        insert: [{ type: 'bgp', triples: triplesToInsert }],
        where: [
          {
            type: 'optional',
            patterns: [
              { type: 'bgp', triples: [{ subject, predicate: predicateVariable, object: objectVariable }] },
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: '||',
                  args: [
                    {
                      type: 'operation',
                      operator: '!',
                      args: [{ type: 'operation', operator: 'bound', args: [predicateVariable] }],
                    },
                    {
                      type: 'operation',
                      operator: '!',
                      args: [{ type: 'operation', operator: 'bound', args: [objectVariable] }],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
    prefixes: {},
  };

  const query: string = sparqlGenerator.stringify(queryObject);
  // Create FILTER expression for filtering replaced triples
  const regex = /FILTER(.*)/;
  const filter = `FILTER(!BOUND(?predicate) || !BOUND(?object) || ${predicatesToUpdate
    .map((predicate: IriTerm): string => `(?predicate = <${predicate.value}>)`)
    .join(' || ')})`;

  // Replace generated FILTER clause with created FILTER clause
  return query.replace(regex, filter);
};
