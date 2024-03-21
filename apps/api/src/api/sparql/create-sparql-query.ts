import { IriTerm, SelectQuery, Triple, Update, VariableTerm } from 'sparqljs';

import { variable } from '@music-kg/sparql-data';

import { sparqlGenerator } from './sparql.helpers';

type Prefixes = { [prefix: string]: string };

type SparqlGetQueryParameters = {
  graph: IriTerm;
  subject: IriTerm;
};

type SparqlUpdateQueryParameters = {
  graph: IriTerm;
  prefixes: Prefixes;
  triples: Triple[];
};

export const createSparqlGetQuery = ({ graph, subject }: SparqlGetQueryParameters): string => {
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

export const createSparqlUpdateQuery = ({ graph, prefixes, triples }: SparqlUpdateQueryParameters): string => {
  const queryObject: Update = {
    type: 'update',
    updates: [{ updateType: 'insert', insert: [{ type: 'graph', triples, name: graph }] }],
    prefixes,
  };

  return sparqlGenerator.stringify(queryObject);
};
