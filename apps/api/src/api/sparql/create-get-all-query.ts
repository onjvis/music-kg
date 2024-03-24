import { SelectQuery, VariableTerm } from 'sparqljs';

import { RDF_PREDICATE, variable } from '@music-kg/sparql-data';

import { sparqlGenerator } from './sparql.helpers';
import { GetAllQueryParams } from './sparql.models';

export const createGetAllQuery = ({ graph, object }: GetAllQueryParams): string => {
  const subjectVariable: VariableTerm = variable('subject');

  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [subjectVariable],
    from: { default: [graph], named: [] },
    where: [{ type: 'bgp', triples: [{ subject: subjectVariable, predicate: RDF_PREDICATE.type.iri, object }] }],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
