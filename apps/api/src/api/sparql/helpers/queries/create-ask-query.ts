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

export const createExistsByEntityIdQuery = ({ graph, id }: ExistsQueryParams): string => {
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const patterns: Pattern[] = [
    {
      type: 'bgp',
      triples: [{ subject: iri(id), predicate: predicateVariable, object: objectVariable }],
    },
  ];

  return createAskQuery({ graph, patterns });
};

export const createExistsByExternalIdQuery = ({ graph, id }: ExistsQueryParams): string => {
  const subjectVariable: VariableTerm = variable('subject');

  const patterns: Pattern[] = [
    {
      type: 'bgp',
      triples: [{ subject: subjectVariable, predicate: SCHEMA_PREDICATE.sameAs.iri, object: iri(id) }],
    },
  ];

  return createAskQuery({ graph, patterns });
};
