import { AskQuery, Pattern, VariableTerm } from 'sparqljs';

import { iri, SCHEMA_PREDICATE, variable } from '@music-kg/sparql-data';

import { AskQueryParams } from '../../models/ask-query-params.model';
import { ExistsQueryParams } from '../../models/exists-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createAskQuery = ({ graph, patterns }: AskQueryParams): string => {
  const queryObject: AskQuery = {
    queryType: 'ASK',
    where: [{ type: 'graph', patterns, name: graph }],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};

export const createExistsQuery = ({ graph, externalId }: ExistsQueryParams): string => {
  const subjectVariable: VariableTerm = variable('subject');

  const patterns: Pattern[] = [
    {
      type: 'bgp',
      triples: [{ subject: subjectVariable, predicate: SCHEMA_PREDICATE.sameAs.iri, object: iri(externalId) }],
    },
  ];

  return createAskQuery({ graph, patterns });
};
