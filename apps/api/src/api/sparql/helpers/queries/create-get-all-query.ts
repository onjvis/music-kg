import { SelectQuery, VariableTerm } from 'sparqljs';

import { RDF_PREDICATE, variable } from '@music-kg/sparql-data';

import { GetAllQueryParams } from '../../models/get-all-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

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
