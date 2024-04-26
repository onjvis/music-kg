import { SelectQuery, VariableTerm } from 'sparqljs';

import { iri, SCHEMA_PREDICATE, variable } from '@music-kg/sparql-data';

import { GetLinksQueryParams } from '../../models/get-links-query-params.model';
import { sparqlGenerator } from '../sparql-generator';

export const createGetLinksQuery = ({ entityIri, graph }: GetLinksQueryParams): string => {
  const subjectVariable: VariableTerm = variable('subject');
  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [subjectVariable],
    from: { default: [graph], named: [] },
    where: [
      {
        type: 'union',
        patterns: [
          {
            type: 'bgp',
            triples: [{ subject: iri(entityIri), predicate: SCHEMA_PREDICATE.sameAs.iri, object: subjectVariable }],
          },
          {
            type: 'bgp',
            triples: [{ subject: subjectVariable, predicate: SCHEMA_PREDICATE.sameAs.iri, object: iri(entityIri) }],
          },
        ],
      },
    ],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};
